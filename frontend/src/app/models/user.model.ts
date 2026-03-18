export interface User {
  id: number;
  nom: string;
  email: string;
  role: { id?: number; nom: string };
  estActif: boolean;
  dateCreation?: string;
}

export interface AuthRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}
