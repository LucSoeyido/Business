import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Depense, DepenseState } from "../../types/depense"
import { toast } from 'react-toastify';

const API_URL = "http://127.0.0.1:8000/api/all_depense";
const API_URL_CREATED = "http://127.0.0.1:8000/api/store_depense";
const API_URL_DELETE = "http://127.0.0.1:8000/api/delete_depense";

interface LaravelPaginationResponse {
  data: any[]; // Remplace any par ton type Rapport si tu en as un
  current_page: number;
  last_page: number;
  total: number;
  // ajoute d'autres champs si besoin (next_page_url, etc.)
}

const initialState: DepenseState = {
  depenses: [],

  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0
  },
  loading: false,
  error: null,
};

// 🔹 GET tous les rapports (Mise à jour pour inclure la recherche)
export const fetchDepenses = createAsyncThunk<
  LaravelPaginationResponse,
  { page?: number; search?: string } // 👈 Modification : on attend un objet avec page et search
>(
  "depense/fetchAll",
  async ({ page = 1, search = "" }) => { // 👈 On déstructure et on initialise à vide
    // 👈 Ajout du paramètre search dans la requête Axios
    const response = await axios.get<LaravelPaginationResponse>(
      `${API_URL}?page=${page}&search=${search}`
    );
    return response.data;
  }
);

// 🔹 CREATE depense
export const createDepense = createAsyncThunk(
  "depense/create",
  async (data: Omit<Depense, "id">) => {
    const response = await axios.post<Depense>(API_URL_CREATED, data);
    return response.data;
  }
);

// 🔹 UPDATE rapport
export const updateDepense = createAsyncThunk(
  "depense/update",
  async (data: Depense) => {
    const response = await axios.put<Depense>(
      `${API_URL}/${data.id}`,
      data
    );
    return response.data;
  }
);

// 🔹 DELETE rapport (Uniquement cette déclaration avec la bonne URL)
export const deleteDepense = createAsyncThunk(
  "depense/delete",
  async (id: number) => {
    // 👈 Utilisation de la nouvelle constante API_URL_DELETE
    await axios.delete(`${API_URL_DELETE}/${id}`); 
    return id;
  }
);

const depenseSlice = createSlice({
  name: "depense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchDepenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepenses.fulfilled, (state, action) => {
        state.loading = false;
        state.depenses = action.payload.data;

        // On utilise les clés envoyées par Laravel pour la pagination
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total
        };
      })
      .addCase(fetchDepenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })

      // CREATE
      .addCase(createDepense.fulfilled, (state, action) => {
        state.depenses.push(action.payload);
        state.loading = false;
        toast.success('Dépense sauvégardée avec succès!', {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .addCase(createDepense.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
        toast.error(state.error || 'Erreur de connexion', {
          position: "top-right",
          autoClose: 4000,
        });
      })

      // UPDATE
      .addCase(updateDepense.fulfilled, (state, action) => {
        const index = state.depenses.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.depenses[index] = action.payload;
        }
      })
      
      // DELETE
      .addCase(deleteDepense.fulfilled, (state, action) => {
        // On retire le rapport supprimé de la liste locale
        state.depenses = state.depenses.filter(
          (r) => r.id !== action.payload
        );
        // 👈 Ajout d'une notification de succès
        toast.success('Dépense supprimée avec succès!', {
          position: "top-right",
          autoClose: 4000,
        });
      })
      .addCase(deleteDepense.rejected, (state, action) => {
        // 👈 Ajout d'une notification d'erreur en cas de souci
        toast.error('Erreur lors de la suppression de la dépense', {
          position: "top-right",
          autoClose: 4000,
        });
      });
      
  },
});

export default depenseSlice.reducer;