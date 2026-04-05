export type StatutTicket = 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'ARCHIVE';
export type PrioriteTicket = 'FAIBLE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export type CategorieTicket = 'TECHNIQUE' | 'FACTURATION' | 'COMMERCIAL' | 'AUTRE';

export interface Ticket {
  id: number;
  titre: string;
  description: string;
  statut: StatutTicket;
  priorite: PrioriteTicket;
  categorieNom?: string;
  categorieId?: number;
  cheminFichier?: string;
  dateCreation: string;
  userNom: string;
  agentNom?: string;
}

export interface TicketRequest {
  titre: string;
  description: string;
  priorite: PrioriteTicket;
  categorieId?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
