import { Injectable } from '@angular/core';
import {
  HttpRequest, // Representa a requisição HTTP de saída
  HttpHandler, // Permite continuar a requisição para o próximo interceptor ou para o backend
  HttpEvent, // Representa o evento HTTP (requisição, resposta, progresso, etc.)
  HttpInterceptor // A interface que o nosso interceptor irá implementar
} from '@angular/common/http';
import { Observable } from 'rxjs'; // Para trabalhar com fluxos assíncronos
import { AuthService } from './auth.service'; // Importa o seu AuthService para obter o token

@Injectable() // Mark as injectable
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {} // Injeta o AuthService para acessar o token

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtém o token JWT do AuthService
    const token = this.authService.getToken();

    // Clona a requisição e adiciona o cabeçalho Authorization se um token existir
    // E se a requisição NÃO for para o endpoint de login (para evitar loop infinito ou adicionar token desnecessário)
    if (token && !request.url.includes('/auth/login')) {
      // Clona a requisição para adicionar o novo cabeçalho
      // Requisições são imutáveis em Angular, então precisamos cloná-las para modificá-las
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Define o cabeçalho Authorization com o token JWT
        }
      });
      // Envia a requisição modificada para o próximo manipulador na cadeia
      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}