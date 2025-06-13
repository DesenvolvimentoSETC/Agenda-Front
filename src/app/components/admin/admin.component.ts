import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Evento } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  data = '';
  descricao = '';
  hora = '';
  local = '';
  mensagem = '';

  constructor(private eventService: EventService) {}

  salvarEvento() {
    if (!this.data || !this.descricao || !this.hora || !this.local) {
      this.mensagem = '⚠️ Preencha todos os campos.';
      return;
    }

    const novoEvento: Evento = {
      data: this.data,
      descricao: this.descricao,
      hora: this.hora,
      local: this.local
    };

    this.eventService.criarEvento(novoEvento).subscribe({
      next: () => {
        this.mensagem = '✅ Evento salvo com sucesso!';
        this.data = '';
        this.descricao = '';
        this.hora = '';
        this.local = '';
      },
      error: (err) => {
        console.error(err);
        this.mensagem = '❌ Erro ao salvar o evento.';
      }
    });
  }
}