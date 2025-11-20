import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  total: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "" } = params;
  const res: AxiosResponse = await api.get("/notes", {
    params: { page, perPage, search },
  });

  return {
    notes: res.data.data || res.data.notes || [],
    totalPages: res.data.totalPages ?? res.data.total_pages ?? 1,
    page: res.data.page ?? page,
    total: res.data.total ?? 0,
  };
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res: AxiosResponse = await api.post("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<{ id: string }> {
  const res: AxiosResponse = await api.delete(`/notes/${id}`);
  return res.data;
}
