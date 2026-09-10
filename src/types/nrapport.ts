export interface Rapport {
  id: number;
  libelle: string;
  montant: number| null;
  created_at: Date;
  session_id:number

}

export interface RapportState {
  rapports: Rapport[];
  loading: boolean;
  error: string | null;
}