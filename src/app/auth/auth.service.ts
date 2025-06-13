import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient para fazer requisições HTTP
import { Observable, BehaviorSubject, of } from 'rxjs'; // Para reatividade e gerenciamento de estado
import { tap, catchError, map } from 'rxjs/operators'; // Operadores RxJS
import { Router } from '@angular/router'; // Para redirecionamento (assumindo que você usa o Angular Router)

/**
 * Serviço de Autenticação Angular.
 * Lida com o login, logout e verificação do status de autenticação do usuário,
 * interagindo com a API de autenticação Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base da sua API de autenticação Spring Boot
  // Certifique-se de que esta URL corresponde à sua configuração no application.properties do backend
  private readonly API_AUTH_URL = 'http://localhost:9090/auth'; // Ex: http://localhost:9090/auth

  // Chave para armazenar o token JWT no localStorage
  private readonly TOKEN_KEY = 'jwt_token';

  // Um BehaviorSubject para emitir o status de autenticação (logado/deslogado)
  // Útil para componentes que precisam reagir a mudanças de autenticação
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Observable público para que outros componentes possam se inscrever no status de login
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Inicializa o status de login baseado na presença do token no localStorage
    this._isLoggedIn.next(this.hasToken());
  }
  hasToken(): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * Método de login que envia as credenciais para a API Spring Boot.
   *
   * @param usuario O nome de usuário.
   * @param senha A senha.
   * @returns Um Observable<boolean> indicando sucesso (true) ou falha (false) no login.
   */
  login(usuario: string, senha: string): Observable<boolean> {
    const authRequest = { username: usuario, password: senha }; // Cria o objeto AuthRequest DTO para enviar ao backend

    return this.http.post<any>(`${this.API_AUTH_URL}/login`, authRequest)
      .pipe(
        tap(response => {
          // Se a requisição for bem-sucedida, a API deve retornar um objeto com o token (ex: {token: "..."})
          const token = response.token;
          if (token) {
            try {
              localStorage.setItem(this.TOKEN_KEY, token); // Tenta armazenar o token no localStorage
              this._isLoggedIn.next(true); // Atualiza o status de autenticação para true
              console.log('Login bem-sucedido! Token:', token);
              // Opcional: Redirecionar após o login bem-sucedido
              // this.router.navigate(['/home']); // Redireciona para a home page, por exemplo
            } catch (e) {
              console.error('Erro ao acessar localStorage para salvar token:', e);
              // Caso o localStorage não possa ser acessado, consideramos que o login falhou ou não persistiu.
              this._isLoggedIn.next(false);
            }
          } else {
            console.error('Login falhou: Token não recebido na resposta da API.');
            this._isLoggedIn.next(false);
          }
        }),
        map(() => true), // Mapeia para true em caso de sucesso
        catchError(error => {
          // Lida com erros na requisição (ex: 401 Unauthorized, 400 Bad Request)
          console.error('Erro no login:', error);
          this._isLoggedIn.next(false); // Atualiza o status de autenticação para false
          // Aqui você pode adicionar lógica para exibir mensagens de erro para o usuário
          // Por exemplo, retornar um Observable de false para indicar a falha
          return of(false); // Retorna um observable com valor false
        })
      );
  }

  /**
   * Verifica se o usuário está autenticado.
   * Isso é feito verificando a presença de um token JWT no localStorage.
   * Para uma verificação mais robusta, você pode adicionar a validação do token (expiração, etc.).
   * O nome do método foi mantido como "estaAutenticado" para corresponder ao seu código original.
   *
   * @returns boolean true se o token existir, false caso contrário.
   */
  estaAutenticado(): boolean {
    try {
      // Implementação mais robusta: validação do token (ex: JWT Helper library para decodificar e checar expiração)
      // Por enquanto, apenas verifica a existência do token no localStorage.
      return !!localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao acessar localStorage para verificar token:', e);
      return false; // Se houver um erro ao acessar localStorage, assume que não está autenticado.
    }
  }

  /**
   * Realiza o logout do usuário, removendo o token do localStorage
   * e redirecionando para a página de login.
   */
  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY); // Remove o token
    } catch (e) {
      console.error('Erro ao acessar localStorage para remover token:', e);
    } finally {
      this._isLoggedIn.next(false); // Atualiza o status de autenticação para false
      this.router.navigate(['/login']); // Redireciona para a página de login (ajuste o caminho se necessário)
      console.log('Logout realizado.');
    }
  }

  /**
   * Retorna o token JWT armazenado.
   * @returns string | null
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao acessar localStorage para obter token:', e);
      return null;
    }
  }
}