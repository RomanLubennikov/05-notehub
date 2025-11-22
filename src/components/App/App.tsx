import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FetchNotesResponse } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  const queryKey = useMemo(
    () => ["notes", debouncedSearch, page],
    [debouncedSearch, page]
  );

  const { data, isFetching, isError } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: {
      notes: [],
      totalPages: 1,
      page: 1,
      total: 0,
    },
    staleTime: 1000 * 30,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {isError && <p>Error loading notes</p>}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes found</p>}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Loading */}
      {isFetching && <p>Loading...</p>}
    </div>
  );
}
