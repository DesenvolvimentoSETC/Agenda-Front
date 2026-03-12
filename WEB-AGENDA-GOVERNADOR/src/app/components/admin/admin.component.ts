import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AgendaService } from '../../services/agenda.service'; 
import { AgendaDTO } from '../../agendas/DTO/AgendaDTO'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit { 
  // Campos do formulário para o novo evento
  data: string = ''; 
  descricao: string = '';
  hora: string = '';
  local: string = ''; 

  mensagem: string = ''; 

  // Lista para armazenar todos os eventos (AgendaDTOs)
  agendas: AgendaDTO[] = [];
  // ID do evento em edição (se preenchido, o submit faz update em vez de create)
  editandoId: number | null = null;

  constructor(private agendaService: AgendaService, private router: Router) { }

  ngOnInit(): void {
   
    this.getAllAgendas();
  }

  getAllAgendas(): void {
    this.agendaService.getAllAgendas().subscribe({
      next: (data) => {
        this.agendas = data;
        console.log('Eventos carregados para o Admin:', this.agendas);
      }
    });
  }

  irParaHome(): void { 
    this.router.navigate(['/home']); 
  }

  
  onSubmit(): void {
    const novoEvento: AgendaDTO = {
      data: this.data,
      descricao: this.descricao,
      hora: this.hora,
      local: this.local
    };

    this.agendaService.createAgenda(novoEvento).subscribe({
      next: (response) => {
        this.mensagem = 'Evento cadastrado com sucesso!';
        console.log('Evento cadastrado:', response);
        this.clearForm(); 
        this.getAllAgendas(); 
      },
      error: (err) => {
        console.error('Erro ao cadastrar evento:', err);
        this.mensagem = 'Erro ao cadastrar evento.';
        if (err.status === 401 || err.status === 403) { 
            this.router.navigate(['/login']); 
        }
      }
    });
  }

  clearForm(): void {
    this.data = '';
    this.descricao = '';
    this.hora = '';
    this.local = '';
    this.editandoId = null;
  }

  verAgenda(agenda: AgendaDTO): void {
    if (agenda.id == null) return;
    this.agendaService.getAgendaById(agenda.id).subscribe({
      next: (item) => {
        this.mensagem = `Ver: ${item.descricao} - ${item.data} ${item.hora} - ${item.local}`;
      },
      error: () => (this.mensagem = 'Erro ao buscar evento.')
    });
  }

  editarAgenda(agenda: AgendaDTO): void {
    this.data = agenda.data;
    this.descricao = agenda.descricao;
    this.hora = agenda.hora;
    this.local = agenda.local ?? '';
    this.editandoId = agenda.id ?? null;
    this.mensagem = 'Edite os campos e clique em Atualizar evento.';
  }

  atualizarOuCadastrar(): void {
    if (this.editandoId != null) {
      const atualizado: AgendaDTO = {
        data: this.data,
        descricao: this.descricao,
        hora: this.hora,
        local: this.local
      };
      this.agendaService.updateAgenda(this.editandoId, atualizado).subscribe({
        next: () => {
          this.mensagem = 'Evento atualizado com sucesso!';
          this.clearForm();
          this.getAllAgendas();
        },
        error: (err) => {
          this.mensagem = 'Erro ao atualizar evento.';
          if (err.status === 401 || err.status === 403) this.router.navigate(['/login']);
        }
      });
    } else {
      this.onSubmit();
    }
  }

  excluirAgenda(agenda: AgendaDTO): void {
    if (agenda.id == null) return;
    if (!confirm(`Excluir o evento "${agenda.descricao}"?`)) return;
    this.agendaService.deleteAgenda(agenda.id).subscribe({
      next: () => {
        this.mensagem = 'Evento excluído com sucesso!';
        this.getAllAgendas();
        if (this.editandoId === agenda.id) this.clearForm();
      },
      error: (err) => {
        this.mensagem = 'Erro ao excluir evento.';
        if (err.status === 401 || err.status === 403) this.router.navigate(['/login']);
      }
    });
  }

}
