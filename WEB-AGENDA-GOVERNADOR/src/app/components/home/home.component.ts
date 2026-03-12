import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule, MatCalendar } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

import { AgendaService } from '../../services/agenda.service';
import { AgendaDTO } from '../../agendas/DTO/AgendaDTO';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatNativeDateModule,
    MatCalendar
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSelecionada: Date = new Date();
  dataInterna: Date | null = null;
  mostrarAviso = false;
  descricao = '';
  hora = '';
  Local = '';
  
  agendas: AgendaDTO[] = [];

  /** Ordena lista de eventos por horário */
  get eventosDaData(): AgendaDTO[] {
    const selectedDateString = this.dataSelecionada.toISOString().split('T')[0];
    const filtrados = this.agendas.filter(agenda => agenda.data === selectedDateString);
    return [...filtrados].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
  } 

  constructor(private router: Router, private agendaService: AgendaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllAgendas();
  }

  getAllAgendas(): void {
    console.log('Buscando todos os eventos da agenda...');
    this.agendaService.getAllAgendas().subscribe({
      next: (data) => {
        this.agendas = data.map(agenda => {
          const [year, month, day] = agenda.data.split('-').map(Number);
          const localDate = new Date(year, month - 1, day); 

          return { ...agenda, data: localDate.toISOString().split('T')[0] }; 
        });
        console.log('Eventos da agenda recebidos e ajustados:', this.agendas);

        this.verificarEvento(this.dataSelecionada);
      },
      error: (err) => {
        console.error('Erro ao buscar eventos da agenda:', err);
      }
    });
  }

  irParaCadastro() {
    console.log('Tentando acessar Área do Administrador');
    this.authService.logout(); 
  }

   navigateToHomeInfo(): void {
    window.open('https://transparencia.se.gov.br/comum/informacoes.html', '_blank');
  }

  navigateToOrganizationalStructure(): void {
    window.open('https://transparencia.se.gov.br/EstruturaOrganizacional/EstruturaOrganizacional.xhtml', '_blank');
  }

  redirectToExternalAgenda(): void {
    window.open('https://transparencia.se.gov.br/EstruturaOrganizacional/AgendaGovernador.xhtml?faces-redirect=true', '_blank');
  }

  verificarEvento(data: Date) {
    this.dataSelecionada = data;
    const selectedDateString = data.toISOString().split('T')[0];
    const eventos = this.agendas.filter(agenda => agenda.data === selectedDateString);
    this.mostrarAviso = eventos.length === 0;

    if (eventos.length > 0) {
      this.descricao = eventos[0].descricao;
      this.hora = eventos[0].hora;
      this.Local = eventos[0].local;
    } else {
      this.descricao = '';
      this.hora = '';
      this.Local = '';
    }
    setTimeout(() => {
      this.dataInterna = null;
    });
  }

  marcarFinaisDeSemana = (date: Date): string => {
    const dia = date.getDay();
    return dia === 0 || dia === 6 ? 'fim-de-semana' : '';
  };
}