import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators'; 
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'; 

/**
 * Função de interceptor HTTP para anexar o token JWT às requisições de saída
 * e lidar com token.
 */
export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const authService = inject(AuthService);
  const router = inject(Router); // Injete o Router aqui
  const token = authService.getToken();
  const isProtectedUrl = !request.url.includes('/auth/login');
  const isGetAgendasPublic = request.method === 'GET' && request.url.includes('/agendas');

  let authRequest = request;

  if (token && isProtectedUrl && !isGetAgendasPublic) {
    authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Envia a requisição (original ou modificada) e lida com erros de resposta
  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se o erro for 401 Unauthorized e NÃO for a requisição de login falhando
      if (error.status === 401 && isProtectedUrl) { // Se for 401 em uma URL protegida
        console.warn('Token JWT expirado ou inválido. Redirecionando para o login.');
        authService.logout(); // Limpa o token e força o logout
        router.navigate(['/login']); // Redireciona para a tela de login
      }
      return throwError(() => error);
    })
  );
};
