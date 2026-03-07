import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Session, SessionState } from "../../types/session"
import { toast } from 'react-toastify';

const API_URL = "http://127.0.0.1:8000/api/all_session";
const API_URL_CREATED = "http://127.0.0.1:8000/api/store_session";
const API_URL_DELETE = "http://127.0.0.1:8000/api/delete_session";

interface LaravelPaginationResponse {
  data: any[]; // Remplace any par ton type session si tu en as un
  current_page: number;
  last_page: number;
  total: number;
  // ajoute d'autres champs si besoin (next_page_url, etc.)
}

const initialState: SessionState = {
  sessions: [],

  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0
  },
  loading: false,
  error: null,
};

// 🔹 GET tous les sessions (Mise à jour pour inclure la recherche)
export const fetchSession = createAsyncThunk<
  LaravelPaginationResponse,
  { page?: number; search?: string } // 👈 Modification : on attend un objet avec page et search
>(
  "session/fetchAll",
  async ({ page = 1, search = "" }) => { // 👈 On déstructure et on initialise à vide
    // 👈 Ajout du paramètre search dans la requête Axios
    const response = await axios.get<LaravelPaginationResponse>(
      `${API_URL}?page=${page}&search=${search}`
    );
    return response.data;
  }
);

// 🔹 CREATE session
export const createSession = createAsyncThunk(
  "session/create",
  async (data: Omit<Session, "id">) => {
    const response = await axios.post<Session>(API_URL_CREATED, data);
    return response.data;
  }
);

// 🔹 UPDATE session
export const updateSession = createAsyncThunk(
  "session/update",
  async (data: Session) => {
    const response = await axios.put<Session>(
      `${API_URL}/${data.id}`,
      data
    );
    return response.data;
  }
);

// 🔹 DELETE session (Uniquement cette déclaration avec la bonne URL)
export const deleteSession = createAsyncThunk(
  "session/delete",
  async (id: number) => {
    // 👈 Utilisation de la nouvelle constante API_URL_DELETE
    await axios.delete(`${API_URL_DELETE}/${id}`); 
    return id;
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.data;

        // On utilise les clés envoyées par Laravel pour la pagination
        state.pagination = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total
        };
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      })

      // CREATE
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.push(action.payload);
        state.loading = false;
        toast.success('Session sauvégardée avec succès!', {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .addCase(createSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
        toast.error(state.error || 'Erreur de connexion', {
          position: "top-right",
          autoClose: 4000,
        });
      })

      // UPDATE
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      })
      
      // DELETE
      .addCase(deleteSession.fulfilled, (state, action) => {
        // On retire le session supprimé de la liste locale
        state.sessions = state.sessions.filter(
          (r) => r.id !== action.payload
        );
        // 👈 Ajout d'une notification de succès
        toast.success('Session supprimé avec succès!', {
          position: "top-right",
          autoClose: 4000,
        });
      })
      .addCase(deleteSession.rejected, (state, action) => {
        // 👈 Ajout d'une notification d'erreur en cas de souci
        toast.error('Erreur lors de la suppression de la session', {
          position: "top-right",
          autoClose: 4000,
        });
      });
      
  },
});

export default sessionSlice.reducer;