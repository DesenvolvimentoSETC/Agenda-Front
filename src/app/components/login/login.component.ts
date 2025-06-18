import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service'; 
import { Router } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login', 
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.css'], 
  standalone: true, 
  imports: [FormsModule, CommonModule, MatIconModule,] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null; 

  constructor(private authService: AuthService, private router: Router) { } 

   navigateToHomeInfo(): void {
    window.open('https://transparencia.se.gov.br/comum/informacoes.html', '_blank');
  }

  navigateToOrganizationalStructure(): void {
    window.open('https://transparencia.se.gov.br/EstruturaOrganizacional/EstruturaOrganizacional.xhtml', '_blank');
  }

  redirectToExternalAgenda(): void {
    window.open('https://transparencia.se.gov.br/EstruturaOrganizacional/AgendaGovernador.xhtml?faces-redirect=true', '_blank');
  }
  navigateToAgenda(): void {
    window.open('http://localhost:4200');
  }

  onLogin(): void {
    this.loginError = null; 

    // Chame o método login do AuthService
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          console.log('Login bem-sucedido no componente!');
          this.router.navigate(['/admin']);
        } else {
          this.loginError = 'Falha no login. Verifique suas credenciais ou a rede.';
        }
      },
      error: (err) => {
        // Erro na requisição HTTP ou CORS
        console.error('Erro na requisição de login:', err);
        if (err.status === 401) {
          this.loginError = 'Usuário ou senha inválidos.';
        } else if (err.status === 403) {
          this.loginError = 'Acesso proibido. Verifique suas permissões.';
        } else {
          this.loginError = 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.';
        }
      }
    });
  }
}