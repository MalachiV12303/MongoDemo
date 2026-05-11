import { useEffect, useState } from "react";
import axios from "axios";

type Movie = {
  title: string;
  year: number;
  genres: string[];
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");

  const fetchMovies = async () => {
    const res = await axios.get("http://localhost:8000/all-movies");
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/movies", {
      title,
      year: Number(year),
      genres: genre.split(", "),
    });

    setTitle("");
    setYear("");
    setGenre("");

    fetchMovies();
  };

  return (
    <div>
      <h1>Movies</h1>

      <form onSubmit={handleSubmit}>
        <p>{genre.split(", ").map((g) => <span key={g}>{g}</span>)}</p>
        <input
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <button type="submit">Add Movie</button>
      </form>

      {movies.map((movie, index) => (
        <div key={index}>
          <h3>{movie.title}</h3>
          <p>{movie.year}</p>
          <p>{movie.genres.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default App;