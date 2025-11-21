import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNoteInput, NoteTag } from "../../types/note";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteInput) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (onSuccess) onSuccess();
      setTitle("");
      setContent("");
      setTag("Todo");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateNoteInput = {
      title,
      content,
      tag,
    };

    mutation.mutate(payload);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2 className={css.title}>Create note</h2>

      <div className={css.field}>
        <label className={css.label}>Title</label>
        <input
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={css.field}>
        <label className={css.label}>Content</label>
        <textarea
          className={css.textarea}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={css.field}>
        <label className={css.label}>Tag</label>
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Create note"}
        </button>
      </div>

      {mutation.isError && (
        <div role="alert" className={css.submitError}>
          Error creating note — please try again.
        </div>
      )}
    </form>
  );
}
