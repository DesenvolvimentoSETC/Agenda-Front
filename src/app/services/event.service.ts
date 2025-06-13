import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  data: string;
  descricao: string;
  hora: string;
  local: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:9090/agendas';

  constructor(private http: HttpClient) {}

  criarEvento(evento: Evento): Observable<any> {
  return this.http.post(this.apiUrl, evento);
  }

  salvarEvento(evento: Evento): Observable<any> {
    return this.http.post(this.apiUrl, evento);
  }

  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }
}
