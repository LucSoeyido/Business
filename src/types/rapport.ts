export interface Rapport {
  id: number;
  libelle: string;
  montant: number | null;
  created_at: Date | null;
  session_id: number

}



interface PaginationData {
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface RapportState {
  rapports: Rapport[];
  pagination: PaginationData;
  loading: boolean;
  error: string | null;
}