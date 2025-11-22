import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>

          <span className={css.tag}>{note.tag}</span>

          <p className={css.content}>{note.content}</p>

          <button
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(note.id)}
            className={css.button}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
