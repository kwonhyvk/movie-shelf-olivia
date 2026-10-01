import MovieCard from "./MovieCard.jsx";

export default function MovieList({ movies, onDetail, onEdit, onDelete }) {
  return (
    <section className="grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
