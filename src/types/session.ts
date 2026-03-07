export interface Session {
  id: number;
  libelle: string;
  created_at: Date | null;
  total_montants: number | null;
  statut: boolean ;
  date_cloture: Date | null

}



interface PaginationData {
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface SessionState {
  sessions: Session[];
  pagination: PaginationData;
  loading: boolean;
  error: string | null;
}