import { useEffect, useState } from "react";
import axios from "axios";

type Movie = {
  _id: string;
  title: string;
  year: number;
  genres: string[];
  source: string;
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [editedYears, setEditedYears] = useState<Record<string, string>>({});

  const handleYearChange = (id: string, value: string) => {
    setEditedYears((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async (id: string) => {
    try {
      const updatedYear = editedYears[id];

      await axios.patch(
        `http://localhost:8000/movies/${id}`,
        {
          year: Number(updatedYear)
        }
      );

      setEditedYears((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      fetchMovies();

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const fetchMovies = async () => {
    const params: Record<string, string> = {};

    if (searchTitle) params.title = searchTitle;
    if (searchYear) params.year = searchYear;
    if (searchGenre) params.genre = searchGenre;

    const res = await axios.get(
      "http://localhost:8000/all-movies",
      { params }
    );

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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/movies/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <main className="container mb-16">
      <nav className="flex items-center justify-between h-16">
        <h1 className="text-2xl font-semibold">demoproject</h1>
      </nav>
      <section className="mt-16">
        <div className="grid grid-cols-3 gap-4">
          <form className="border border-foreground p-4 flex flex-col gap-2" onSubmit={handleSubmit}>
            <span className="text-lg">add a movie to users_movies</span>
            <input
              className="bg-background rounded-lg"
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
            <button className="bg-primary hover:bg-primary-muted transition-colors py-1" type="submit">.post</button>
          </form>
          <div className="border border-foreground p-4 flex flex-col gap-2">
            <span className="text-lg">search movies and user_movies</span>
            <input
              placeholder="Search title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <input
              placeholder="Year after..."
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
            />
            <input
              placeholder="Genre"
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
            />
            <button
              onClick={fetchMovies}
              className="bg-primary hover:bg-primary-muted transition-colors py-1"
            >
              .get
            </button>
          </div>
          <div className="border border-foreground p-4">
            <span className="text-lg">placeholder...</span>
          </div>
        </div>
      </section>
      <section className="mt-16">
        <div className="flex flex-col">
          <p className="grid grid-cols-6 gap-2 border-b border-foreground">
            <span className="col-span-3">title</span>
            <span>release year</span>
            <span className="col-span-2">genres</span>
          </p>
          {movies.map((movie) => (
            <div className="grid grid-cols-6 gap-2 items-center py-2 border-foreground-muted border-b" key={movie._id}>
              <h3 className="col-span-2">{movie.title}</h3>
              <input
                type="number"
                value={editedYears[movie._id] ?? movie.year}
                onChange={(e) =>
                  handleYearChange(movie._id, e.target.value)
                }
                disabled={movie.source !== "user"}
                className={`hide-arrows px-2 py-1 border border-foreground-muted disabled:border-0 ${editedYears[movie._id]
                  ? "text-primary"
                  : "text-white"
                  }`}
              />
              <p className="col-span-2">
                {movie.genres?.join(", ") || "No genres listed"}
              </p>
              {movie.source === "user" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
                  >
                    .delete
                  </button>

                  {editedYears[movie._id] && (
                    <button
                      onClick={() => handleUpdate(movie._id)}
                      className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
                    >
                      .patch
                    </button>
                  )}
                </div>
              ) : (
                <span>sample data</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default App;