import { Component, OnInit } from '@angular/core'; // Importe OnInit
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { AgendaService } from '../../services/agenda.service'; // Ajuste o caminho para o seu AgendaService
import { AgendaDTO } from '../../agendas/DTO/AgendaDTO'; // IMPORTANTE: Importe a interface AgendaDTO
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicione FormsModule aqui
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit { // Implemente OnInit
  // Campos do formulário para o novo evento
  data: string = ''; // Correspondendo a data "YYYY-MM-DD"
  descricao: string = '';
  hora: string = '';
  local: string = ''; 

  mensagem: string = ''; // Mensagens de feedback para o usuário

  // Lista para armazenar todos os eventos (AgendaDTOs)
  agendas: AgendaDTO[] = []; // O tipo da lista agora é AgendaDTO[]

  constructor(private agendaService: AgendaService, private router: Router) { }

  ngOnInit(): void {
    // Carrega todos os eventos ao inicializar o componente
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

  irParaHome(): void { // Novo método para navegação
    this.router.navigate(['/home']); // Redireciona para a rota '/home'
  }

  /**
   * Lida com a submissão do formulário para criar ou atualizar um evento.
   */
  onSubmit(): void {
    // Cria um objeto AgendaDTO com os dados do formulário
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
