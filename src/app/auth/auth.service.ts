import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient para fazer requisições HTTP
import { Observable, BehaviorSubject, of } from 'rxjs'; // Para reatividade e gerenciamento de estado
import { tap, catchError, map } from 'rxjs/operators'; // Operadores RxJS
import { Router } from '@angular/router'; // Para redirecionamento (assumindo que você usa o Angular Router)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_AUTH_URL = 'http://localhost:9090/auth';

  // Chave para armazenar o token JWT no localStorage
  private readonly TOKEN_KEY = 'jwt_token';

  // Um BehaviorSubject para emitir o status de autenticação (logado/deslogado)
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken()); // <- Esta linha chama hasToken() na inicialização

  // Observable público para que outros componentes possam se inscrever no status de login
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // A linha abaixo também chama hasToken() após a construção do objeto, garantindo que o _isLoggedIn esteja atualizado.
    this._isLoggedIn.next(this.hasToken());
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
          const token = response.token;
          if (token) {
            try {
              localStorage.setItem(this.TOKEN_KEY, token); // Tenta armazenar o token no localStorage
              this._isLoggedIn.next(true); // Atualiza o status de autenticação para true
              console.log('Login bem-sucedido! Token:', token);
              // Opcional: Redirecionar após o login bem-sucedido
            } catch (e) {
              console.error('Erro ao acessar localStorage para salvar token:', e);
              this._isLoggedIn.next(false);
            }
          } else {
            console.error('Login falhou: Token não recebido na resposta da API.');
            this._isLoggedIn.next(false);
          }
        }),
        map(() => true), // Mapeia para true em caso de sucesso
        catchError(error => {
          // Lida com erros na requisição 
          console.error('Erro no login:', error);
          this._isLoggedIn.next(false); // Atualiza o status de autenticação para false
          return of(false); // Retorna um observable com valor false
        })
      );
  }

  estaAutenticado(): boolean {
    return this.hasToken();
  }

  /**
   * Método PRIVADO auxiliar para verificar a presença do token JWT no localStorage de forma segura.
   * Esta é a implementação REAL do método que o erro indicava não estar implementada.
   *
   * @returns boolean true se o token existir, false caso contrário.
   */
  private hasToken(): boolean { 
    try {
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
      this._isLoggedIn.next(false); 
      this.router.navigate(['/login']);
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