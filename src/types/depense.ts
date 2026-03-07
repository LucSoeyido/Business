export interface Depense {
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

export interface DepenseState {
  depenses: Depense[];
  pagination: PaginationData;
  loading: boolean;
  error: string | null;
}