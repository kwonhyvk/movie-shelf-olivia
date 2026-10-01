const API = import.meta.env.VITE_API_URL;

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const getMovies = () => request(API);                                   // GET
export const createMovie = (data) =>
  request(API, { method: "POST", body: JSON.stringify(data) });                // POST
export const updateMovie = (id, data) =>
  request(`${API}/${id}`, { method: "PUT", body: JSON.stringify(data) });      // PUT (update penuh)
export const patchMovie = (id, data) =>
  request(`${API}/${id}`, { method: "PATCH", body: JSON.stringify(data) });    // PATCH (update sebagian)
export const deleteMovie = (id) => request(`${API}/${id}`, { method: "DELETE" }); // DELETE
