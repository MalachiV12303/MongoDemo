import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Sample Database</h1>
      {movies.map((movie: any, index) => (
        <div key={index}>
          <h3>{movie.title}</h3>
          <p>{movie.year}</p>
          <p>{movie.genres?.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default App;