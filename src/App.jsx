import { useEffect, useState } from "react";
import { getMovies, createMovie, updateMovie, deleteMovie } from "./api";
import MovieList from "./components/MovieList.jsx";
import MovieForm from "./components/MovieForm.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Modal from "./components/Modal.jsx";

const RATING_OPTIONS = [
  { label: "Any rating", value: 0 },
  { label: "6+ stars", value: 6 },
  { label: "7+ stars", value: 7 },
  { label: "8+ stars", value: 8 },
  { label: "9+ stars", value: 9 },
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setMovies(await getMovies());
    } catch (e) {
      setError("Couldn't load movies. Check your MockAPI URL and connection, then try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const genres = ["All", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  const visible = movies.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q || m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q);
    const matchGenre = genre === "All" || m.genre === genre;
    return matchSearch && matchGenre && Number(m.rating) >= minRating;
  });

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      const created = await createMovie(data);
      setMovies((prev) => [...prev, created]);
      setModal(null);
    } catch {
      alert("Couldn't add the movie. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      const updated = await updateMovie(modal.movie.id, data);
      setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setModal(null);
    } catch {
      alert("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMovie(modal.movie.id);
      setMovies((prev) => prev.filter((m) => m.id !== modal.movie.id));
      setModal(null);
    } catch {
      alert("Couldn't delete the movie. Please try again.");
    }
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>
            My <span className="hl">Movie</span> Shelf
          </h1>
          <p className="sub">Keep track of everything you've watched and loved.</p>
        </div>
        <button className="btn pink" onClick={() => setModal({ type: "add" })}>
          + Add movie
        </button>
      </header>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by title or director…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input select"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          {RATING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="chips">
        {genres.map((g) => (
          <button
            key={g}
            className={`chip ${genre === g ? "active" : ""}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {loading && (
        <div className="state">
          <div className="spinner" />
          <p>Loading movies…</p>
        </div>
      )}

      {!loading && error && (
        <div className="state error">
          <p>{error}</p>
          <button className="btn outline" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="state"><p>No movies match your filters.</p></div>
      )}

      {!loading && !error && visible.length > 0 && (
        <MovieList
          movies={visible}
          onDetail={(movie) => setModal({ type: "detail", movie })}
          onEdit={(movie) => setModal({ type: "edit", movie })}
          onDelete={(movie) => setModal({ type: "delete", movie })}
        />
      )}

      {modal?.type === "add" && (
        <Modal title="Add a movie" onClose={() => setModal(null)}>
          <MovieForm submitLabel="Add movie" saving={saving} onSubmit={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit movie" onClose={() => setModal(null)}>
          <MovieForm
            initial={modal.movie}
            submitLabel="Save changes"
            saving={saving}
            onSubmit={handleEdit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === "detail" && (
        <Modal title={modal.movie.title} onClose={() => setModal(null)}>
          <MovieDetail movie={modal.movie} onClose={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete this movie?" onClose={() => setModal(null)}>
          <p>
            Are you sure you want to delete <b>"{modal.movie.title}"</b>? This can't be undone.
          </p>
          <div className="actions">
            <button className="btn outline" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn red" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
