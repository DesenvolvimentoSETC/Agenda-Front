import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaDTO } from '../agendas/DTO/AgendaDTO'; // IMPORTANTE: Ajuste o caminho para a sua interface AgendaDTO


@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  // URL base do endpoint de agendas na sua API Spring Boot
  private readonly API_AGENDA_URL = 'http://localhost:9090/agendas';

  constructor(private http: HttpClient) { }

  getAllAgendas(): Observable<AgendaDTO[]> {
    return this.http.get<AgendaDTO[]>(this.API_AGENDA_URL);
  }

  getAgendaById(id: number): Observable<AgendaDTO> {
    return this.http.get<AgendaDTO>(`${this.API_AGENDA_URL}/${id}`);
  }

  /**
   * Cria um novo evento da agenda.
   * Requer autenticação (token JWT) no backend para operações POST.
   * @param agenda O AgendaDTO contendo os dados do novo evento.
   * @returns Um Observable de AgendaDTO (o evento criado, com o ID gerado pelo backend).
   */
  createAgenda(agenda: AgendaDTO): Observable<AgendaDTO> {
    return this.http.post<AgendaDTO>(this.API_AGENDA_URL, agenda);
  }

  /**
   * Atualiza um evento da agenda existente.
   * Requer autenticação (token JWT) no backend para operações PUT.
   * @param id O ID do evento a ser atualizado.
   * @param agenda O AgendaDTO com os dados atualizados do evento.
   * @returns Um Observable de AgendaDTO (o evento atualizado).
   */
  updateAgenda(id: number, agenda: AgendaDTO): Observable<AgendaDTO> {
    return this.http.put<AgendaDTO>(`${this.API_AGENDA_URL}/${id}`, agenda);
  }

  /**
   * Deleta um evento da agenda.
   * Requer autenticação (token JWT) no backend para operações DELETE.
   * @param id O ID do evento a ser deletado.
   * @returns Um Observable (sem corpo de resposta específico, apenas status de sucesso).
   */
  deleteAgenda(id: number): Observable<any> {
    return this.http.delete(`${this.API_AGENDA_URL}/${id}`);
  }
}