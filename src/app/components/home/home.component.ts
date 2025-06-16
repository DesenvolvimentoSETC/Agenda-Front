import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule, MatCalendar } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

import { AgendaService } from '../../services/agenda.service';
import { AgendaDTO } from '../../agendas/DTO/AgendaDTO';

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

  constructor(private router: Router, private agendaService: AgendaService) {}

  ngOnInit(): void {
    this.getAllAgendas();
  }

  getAllAgendas(): void {
    console.log('Buscando todos os eventos da agenda...');
    this.agendaService.getAllAgendas().subscribe({
      next: (data) => {
        // CORREÇÃO AQUI: Ajustar a data para garantir que seja exibida corretamente
        this.agendas = data.map(agenda => {
          // Cria um objeto Date no fuso horário local a partir da string "YYYY-MM-DD"
          // Isso evita o problema de fuso horário que causa o "dia a menos".
          const [year, month, day] = agenda.data.split('-').map(Number);
          // O mês em JavaScript é baseado em 0 (janeiro é 0, fevereiro é 1, etc.)
          const localDate = new Date(year, month - 1, day); 

          return { ...agenda, data: localDate.toISOString().split('T')[0] }; // Mantém a string no formato YYYY-MM-DD para AgendaDTO, mas garante a consistência para exibição
        });
        console.log('Eventos da agenda recebidos e ajustados:', this.agendas);

        // Chame verificarEvento para a data atual assim que os eventos forem carregados
        this.verificarEvento(this.dataSelecionada);
      },
      error: (err) => {
        console.error('Erro ao buscar eventos da agenda:', err);
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/admin']);
  }

  /**
   * Verifica se há um evento na data selecionada no calendário
   * e atualiza as informações de descrição, hora e local na UI.
   * @param data A data selecionada pelo usuário (um objeto Date).
   */
  verificarEvento(data: Date) {
    this.dataSelecionada = data; // Atualiza a data selecionada na propriedade do componente

    // Converte a data selecionada para uma string YYYY-MM-DD para comparação
    // (Ajuste para garantir que a data no objeto 'agenda' seja também uma string YYYY-MM-DD)
    const selectedDateString = data.toISOString().split('T')[0];

    // Encontra o evento correspondente na lista de agendas
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