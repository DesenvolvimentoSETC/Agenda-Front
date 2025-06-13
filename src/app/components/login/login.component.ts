import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import necessário

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // <-- Aqui também
})
export class LoginComponent {
  usuario = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  fazerLogin() {
    const sucesso = this.authService.login(this.usuario, this.senha);
    if (sucesso) {
      this.router.navigate(['/admin']);
    } else {
      this.erro = 'Usuário ou senha inválidos';
    }
  }
}
