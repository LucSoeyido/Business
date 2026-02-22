import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// dispatch typé
export const useAppDispatch: () => AppDispatch = useDispatch;

// selector typé
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);