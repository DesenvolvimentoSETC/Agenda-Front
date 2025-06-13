import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule, MatCalendar } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

import { EventService, Evento } from '../../services/event.service'; 

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
  eventos: Evento[] = [];

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.listarEventos().subscribe({
      next: (res) => {
        this.eventos = res;
      },
      error: (err) => {
        console.error('Erro ao buscar eventos:', err);
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/admin']);
  }

  verificarEvento(data: Date) {
    this.dataSelecionada = data;

    const evento = this.eventos.find(ev => {
      const evData = new Date(ev.data);
      return evData.toDateString() === data.toDateString();
    });

    if (evento) {
      this.descricao = evento.descricao;
      this.hora = evento.hora;
      this.Local = evento.local;
      this.mostrarAviso = false;
    } else {
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
