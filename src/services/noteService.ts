import axios from "axios";
import type { Note, CreateNoteInput } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

const api = axios.create({
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

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
  page: number;
  total: number;
};

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "" } = params;

  const res = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });

  return res.data;
}

export async function createNote(payload: CreateNoteInput): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
