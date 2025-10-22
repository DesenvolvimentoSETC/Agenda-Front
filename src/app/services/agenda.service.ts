import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaDTO } from '../agendas/DTO/AgendaDTO'; 


@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  // URL base do endpoint de agendas na sua API Spring Boot
  private readonly API_AGENDA_URL = 'http://172.22.21.17:9090/agendas';

  constructor(private http: HttpClient) { }

  getAllAgendas(): Observable<AgendaDTO[]> {
    return this.http.get<AgendaDTO[]>(this.API_AGENDA_URL);
  }

  getAgendaById(id: number): Observable<AgendaDTO> {
    return this.http.get<AgendaDTO>(`${this.API_AGENDA_URL}/${id}`);
  }

  createAgenda(agenda: AgendaDTO): Observable<AgendaDTO> {
    return this.http.post<AgendaDTO>(this.API_AGENDA_URL, agenda);
  }

  updateAgenda(id: number, agenda: AgendaDTO): Observable<AgendaDTO> {
    return this.http.put<AgendaDTO>(`${this.API_AGENDA_URL}/${id}`, agenda);
  }

  deleteAgenda(id: number): Observable<any> {
    return this.http.delete(`${this.API_AGENDA_URL}/${id}`);
  }
}