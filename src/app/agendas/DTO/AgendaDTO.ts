export interface AgendaDTO {
  id?: number; // Opcional, pois pode não estar presente ao criar um novo evento (ID é gerado pelo DB)
  data: string; // Representa a data (ex: "YYYY-MM-DD")
  descricao: string; // Representa a descrição do evento
  hora: string; // Representa a hora (ex: "HH:mm:ss")
  local: string; // Representa o local do evento
  // Adicione aqui outros campos que sua API retorna para a entidade Agenda,
  // como 'titulo', 'responsavel', etc., se eles existirem na sua entidade Spring Boot.
}
