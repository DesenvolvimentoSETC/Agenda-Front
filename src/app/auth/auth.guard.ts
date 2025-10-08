import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; 
import { inject } from '@angular/core'; 
import { AuthService } from './auth.service'; 
import { Observable } from 'rxjs'; 
import { map, take } from 'rxjs/operators'; 

/**
 * Guarda de rota de autenticação.
 * Protege rotas, permitindo o acesso apenas se o usuário estiver autenticado.
 * @param route A rota ativada.
 * @param state O estado do roteador.
 * @returns Um Observable<boolean> que emite true se o acesso for permitido, false caso contrário.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  return authService.isLoggedIn$.pipe(
    take(1), // Pega apenas o valor atual e completa o Observable
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // permite o acesso
      } else {
        router.navigate(['/login']);
        return false; 
      }
    })
  );
};
