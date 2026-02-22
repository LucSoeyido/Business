import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Rapport, RapportState } from "../../types/rapport"
import { toast } from 'react-toastify';


const API_URL = "http://100.100.101.214:8000/api/all_rapport";

const API_URL_CREATED= "http://100.100.101.214:8000/api/store_rapport";

const initialState: RapportState = {
  rapports: [],
  loading: false,
  error: null,
};



// 🔹 GET tous les rapports
export const fetchRapports = createAsyncThunk(
  "rapport/fetchAll",
  async () => {
    const response = await axios.get<Rapport[]>(API_URL);
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


// 🔹 DELETE rapport
export const deleteRapport = createAsyncThunk(
  "rapport/delete",
  async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
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
        state.rapports = action.payload;
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
        state.rapports = state.rapports.filter(
          (r) => r.id !== action.payload
        );
      });
  },
});

export default rapportSlice.reducer;