export interface AgendaDTO {
  id?: number; 
  data: string; // Representa a data (ex: "YYYY-MM-DD")
  descricao: string; // Representa a descrição do evento
  hora: string; // Representa a hora (ex: "HH:mm:ss")
  local: string; // Representa o local do evento
}
