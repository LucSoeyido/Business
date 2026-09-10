import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_TOTAL = "https://apibusiness.lucky-dev.com/api/rapports/total-par-partenaire";

// Un partenaire avec son montant total cumulé
export interface PartenaireTotal {
  libelle: string;
  total: number;
}

interface PartenaireState {
  partenaires: PartenaireTotal[];
  loading: boolean;
  error: string;
}

const initialState: PartenaireState = {
  partenaires: [],
  loading: false,
  error: "",
};

// 🔹 GET le montant total de chaque partenaire (trié du plus élevé au plus petit côté backend)
export const fetchPartenairesTotal = createAsyncThunk<PartenaireTotal[]>(
  "partenaire/fetchTotal",
  async () => {
    const response = await axios.get<PartenaireTotal[]>(API_URL_TOTAL);
    return response.data;
  }
);

const partenaireSlice = createSlice({
  name: "partenaire",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchPartenairesTotal.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPartenairesTotal.fulfilled, (state, action) => {
        state.loading = false;
        state.partenaires = action.payload;
      })
      .addCase(fetchPartenairesTotal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur";
      });
  },
});

export default partenaireSlice.reducer;
