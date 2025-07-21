import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../services/agenda.service'; 
import { AgendaDTO } from '../../agendas/DTO/AgendaDTO'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], 
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
  }

}
