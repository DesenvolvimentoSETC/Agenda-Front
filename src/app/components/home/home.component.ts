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

    const eventoEncontrado = this.agendas.find(agenda => {
      // Compara a string de data do evento com a string de data selecionada
      return agenda.data === selectedDateString;
    });

    if (eventoEncontrado) {
      this.descricao = eventoEncontrado.descricao;
      this.hora = eventoEncontrado.hora;
      this.Local = eventoEncontrado.local;
      this.mostrarAviso = false;
    } else {
      this.descricao = '';
      this.hora = '';
      this.Local = '';
      this.mostrarAviso = true;
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