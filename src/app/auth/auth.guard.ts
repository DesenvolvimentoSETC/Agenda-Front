import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; // Importações necessárias para guardas de rota
import { inject } from '@angular/core'; // Para injetar serviços em funções CanActivateFn
import { AuthService } from './auth.service'; // Importa seu AuthService
import { Observable } from 'rxjs'; // Para Observables
import { map, take } from 'rxjs/operators'; // Operadores RxJS

/**
 * Guarda de rota de autenticação.
 * Protege rotas, permitindo o acesso apenas se o usuário estiver autenticado.
 *
 * @param route A rota ativada.
 * @param state O estado do roteador.
 * @returns Um Observable<boolean> que emite true se o acesso for permitido, false caso contrário.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService); // Injeta o AuthService
  const router = inject(Router); // Injeta o Router para redirecionamento

  // Usa o Observable isLoggedIn$ do AuthService
  return authService.isLoggedIn$.pipe(
    take(1), // Pega apenas o valor atual e completa o Observable
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Usuário está logado, permite o acesso
      } else {
        // Usuário não está logado, redireciona para a página de login
        router.navigate(['/login']); // Ajuste o caminho para sua rota de login, se necessário
        return false; // Bloqueia o acesso
      }
    })
  );
};
