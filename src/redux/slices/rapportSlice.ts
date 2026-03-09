import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Rapport, RapportState } from "../../types/rapport"
import { toast } from 'react-toastify';

const API_URL = "https://apibusiness.lucky-dev.com/api/all_rapport";
const API_URL_CREATED = "https://apibusiness.lucky-dev.com/api/store_rapport";
const API_URL_DELETE = "https://apibusiness.lucky-dev.com/api/delete_rapport";

interface LaravelPaginationResponse {
  data: any[]; // Remplace any par ton type Rapport si tu en as un
  current_page: number;
  last_page: number;
  total: number;
  // ajoute d'autres champs si besoin (next_page_url, etc.)
}

const initialState: RapportState = {
  rapports: [],

  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0
  },
  loading: false,
  error: null,
};

// 🔹 GET tous les rapports (Mise à jour pour inclure la recherche)
export const fetchRapports = createAsyncThunk<
  LaravelPaginationResponse,
  { page?: number; search?: string } // 👈 Modification : on attend un objet avec page et search
>(
  "rapport/fetchAll",
  async ({ page = 1, search = "" }) => { // 👈 On déstructure et on initialise à vide
    // 👈 Ajout du paramètre search dans la requête Axios
    const response = await axios.get<LaravelPaginationResponse>(
      `${API_URL}?page=${page}&search=${search}`
    );
    return response.data;
  }
);

// 🔹 CREATE rapport
export const createRapport = createAsyncThunk(
  "rapport/create",
  async (data: Omit<Rapport, "id">) => {
    const response = await axios.post<Rapport>(API_URL_CREATED, data);
    return response.data;
  }
);

// 🔹 UPDATE rapport
export const updateRapport = createAsyncThunk(
  "rapport/update",
  async (data: Rapport) => {
    const response = await axios.put<Rapport>(
      `${API_URL}/${data.id}`,
      data
    );
    return response.data;
  }
);

// 🔹 DELETE rapport (Uniquement cette déclaration avec la bonne URL)
export const deleteRapport = createAsyncThunk(
  "rapport/delete",
  async (id: number) => {
    // 👈 Utilisation de la nouvelle constante API_URL_DELETE
    await axios.delete(`${API_URL_DELETE}/${id}`); 
    return id;
  }
);

const rapportSlice = createSlice({
  name: "rapport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchRapports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRapports.fulfilled, (state, action) => {
        state.loading = false;
        state.rapports = action.payload.data;

        // On utilise les clés envoyées par Laravel pour la pagination
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total
        };
      })
      .addCase(fetchRapports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })

      // CREATE
      .addCase(createRapport.fulfilled, (state, action) => {
        state.rapports.push(action.payload);
        state.loading = false;
        toast.success('Rapport sauvégardé avec succès!', {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .addCase(createRapport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRapport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
        toast.error(state.error || 'Erreur de connexion', {
          position: "top-right",
          autoClose: 4000,
        });
      })

      // UPDATE
      .addCase(updateRapport.fulfilled, (state, action) => {
        const index = state.rapports.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.rapports[index] = action.payload;
        }
      })
      
      // DELETE
      .addCase(deleteRapport.fulfilled, (state, action) => {
        // On retire le rapport supprimé de la liste locale
        state.rapports = state.rapports.filter(
          (r) => r.id !== action.payload
        );
        // 👈 Ajout d'une notification de succès
        toast.success('Rapport supprimé avec succès!', {
          position: "top-right",
          autoClose: 4000,
        });
      })
      .addCase(deleteRapport.rejected, (state, action) => {
        // 👈 Ajout d'une notification d'erreur en cas de souci
        toast.error('Erreur lors de la suppression du rapport', {
          position: "top-right",
          autoClose: 4000,
        });
      });
      
  },
});

export default rapportSlice.reducer;