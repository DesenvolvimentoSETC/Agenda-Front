import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  data!: string;
  descricao = '';
  hora = '';
  local = '';
  mensagem = '';

  salvarEvento() {
    // Lógica simples: exibe no console e mostra mensagem
    console.log('Evento salvo:', {
      data: this.data,
      descricao: this.descricao,
      hora: this.hora,
      local: this.local
    });

    this.mensagem = '✅ Evento salvo com sucesso!';
    
    // Limpa os campos
    this.data = '';
    this.descricao = '';
    this.hora = '';
    this.local = '';
  }
}
