export interface NoteTag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string; // або NoteTag якщо бекенд дає об'єкт
  createdAt: string;
  updatedAt?: string;
}
