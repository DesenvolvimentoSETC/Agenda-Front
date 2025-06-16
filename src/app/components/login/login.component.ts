import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login', 
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.css'], 
  standalone: true, 
  imports: [FormsModule, CommonModule] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null; 

  constructor(private authService: AuthService, private router: Router) { } 

  onLogin(): void {
    this.loginError = null; 

    // Chame o método login do AuthService
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          console.log('Login bem-sucedido no componente!');
          this.router.navigate(['/admin']);
        } else {
          this.loginError = 'Falha no login. Verifique o console para mais detalhes.';
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