export default function MovieDetail({ movie, onClose }) {
  return (
    <>
      <div className="detail">
        <img src={movie.image} alt={movie.title} />
        <div>
          <p><b>Director:</b> {movie.director}</p>
          <p><b>Genre:</b> {movie.genre}</p>
          <p><b>Year:</b> {movie.release_year}</p>
          <p><b>Rating:</b> ★ {movie.rating} / 10</p>
          <p className="desc">{movie.description}</p>
        </div>
      </div>
      <div className="actions">
        <button className="btn outline" onClick={onClose}>Close</button>
      </div>
    </>
  );
}
