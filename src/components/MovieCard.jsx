export default function MovieCard({ movie, onDetail, onEdit, onDelete }) {
  return (
    <article className="card">
      <div className="poster">
        <img src={movie.image} alt={movie.title} loading="lazy" />
        <span className="badge">★{Number(movie.rating).toFixed(1)}</span>
      </div>
      <div className="info">
        <h3>{movie.title}</h3>
        <p className="meta">{movie.director} · {movie.release_year}</p>
        <span className="tag">{movie.genre}</span>
        <div className="row">
          <button className="btn yellow sm" onClick={() => onDetail(movie)}>Details</button>
          <button className="btn outline sm" onClick={() => onEdit(movie)}>Edit</button>
          <button className="btn red sm" onClick={() => onDelete(movie)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
