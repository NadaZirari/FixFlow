export interface Comment {
  id: number;
  contenu: string;
  date: string;
  auteurNom: string;
}

export interface CommentRequest {
  contenu: string;
}
