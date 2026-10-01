import { useState } from "react";

const EMPTY = {
  title: "", director: "", genre: "", release_year: "",
  rating: "", description: "", image: "",
};

function validate(v) {
  const e = {};
  const year = Number(v.release_year);
  const rating = Number(v.rating);
  if (!v.title.trim()) e.title = "Title is required.";
  if (!v.director.trim()) e.director = "Director is required.";
  if (!v.genre.trim()) e.genre = "Genre is required.";
  if (v.release_year === "" ) e.release_year = "Release year is required.";
  else if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 5)
    e.release_year = "Enter a valid year (1888 or later).";
  if (v.rating === "") e.rating = "Rating is required.";
  else if (isNaN(rating) || rating < 0 || rating > 10) e.rating = "Rating must be between 0 and 10.";
  if (!v.description.trim()) e.description = "Description is required.";
  if (!v.image.trim()) e.image = "Image URL is required.";
  else if (!/^https?:\/\/.+/i.test(v.image.trim())) e.image = "Image URL must start with http:// or https://";
  return e;
}

export default function MovieForm({ initial, submitLabel, saving, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [errors, setErrors] = useState({});
  const [imgOk, setImgOk] = useState(true);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (name === "image") setImgOk(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      title: values.title.trim(),
      director: values.director.trim(),
      genre: values.genre.trim(),
      release_year: Number(values.release_year),
      rating: Number(values.rating),
      description: values.description.trim(),
      image: values.image.trim(),
    });
  };

  const field = (name, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input className="input" name={name} value={values[name]} onChange={change} {...props} />
      {errors[name] && <small className="err">{errors[name]}</small>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate>
      {field("title", "Title", { placeholder: "e.g. Interstellar" })}
      {field("director", "Director")}
      <div className="two">
        {field("genre", "Genre", { placeholder: "Pick or type", list: "genres" })}
        {field("release_year", "Release year", { type: "number", placeholder: "2014" })}
      </div>
      <datalist id="genres">
        {["Action", "Animation", "Comedy", "Drama", "Horror", "Science Fiction"].map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
      {field("rating", "Rating (0–10)", { type: "number", step: "0.1", placeholder: "8.7" })}
      <label className="field">
        <span>Description</span>
        <textarea className="input" name="description" rows={3} value={values.description} onChange={change} />
        {errors.description && <small className="err">{errors.description}</small>}
      </label>
      <div className="imgrow">
        {field("image", "Image URL", { placeholder: "https://images.unsplash.com/…" })}
        <div className="preview">
          {values.image && imgOk ? (
            <img src={values.image} alt="Preview" onError={() => setImgOk(false)} />
          ) : (
            <small>{values.image ? "Can't load" : "Preview"}</small>
          )}
        </div>
      </div>
      <div className="actions">
        <button type="submit" className="btn pink" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="btn outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
