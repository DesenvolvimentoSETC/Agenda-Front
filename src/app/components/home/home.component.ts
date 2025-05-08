import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Y } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCalendar
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dataSelecionada = new Date(2025, 4, 5);  // Corrigido para maio de 2025 (0-indexado)
  dataInterna: Date | null = null;
  descricao = 'Teste';
  hora = '10h00';
  Local = 'Teatro Atheneu';
  mostrarAviso = false;

  constructor(private router: Router) {}
  irParaCadastro() {
    this.router.navigate(['/admin']);
  }

  // Adicionando eventos para datas específicas
  eventos: Date[] = [
    new Date(2025, 4, 10),  // 10 de maio de 2025
    new Date(2025, 4, 15),  // 15 de maio de 2025
    new Date(2025, 4, 20)   // 20 de maio de 2025
  ];

  verificarEvento(data: Date) {
    this.dataSelecionada = data;

    // Verifica se a data selecionada está na lista de eventos
    const temEvento = this.eventos.some(evento =>
      evento.toDateString() === data.toDateString()
    );

    // Exibe ou não a mensagem de aviso
    this.mostrarAviso = !temEvento;
    
    setTimeout(() => {
      this.dataInterna = null; // permite novo clique no calendário
    });
  }
}
