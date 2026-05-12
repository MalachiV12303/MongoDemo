import { useEffect, useState } from "react";
import { fetchMovies } from "./lib/api";
import AddMovie from "./components/AddMovie";
import SearchMovies from "./components/SearchMovies";
import DataTable from "./components/DataTable";

export type Movie = {
  _id: string;
  title: string;
  year: number;
  genres: string[];
  source: string;
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTitle, setSearchTitle] = useState("")
  const [lowerSearchYear, setLowerSearchYear] = useState("")
  const [upperSearchYear, setUpperSearchYear] = useState("")
  const [searchGenre, setSearchGenre] = useState<string[]>([])
  const [sampleResultLimit, setSampleResultLimit] = useState("20")
  const [userResultLimit, setUserResultLimit] = useState("20")

  const refreshMovies = async () => {
    const data = await fetchMovies(
      searchTitle,
      lowerSearchYear,
      upperSearchYear,
      searchGenre,
      userResultLimit,
      sampleResultLimit
    )
    setMovies(data)
  }

  useEffect(() => {
    refreshMovies();
  }, []);

  return (
    <main className="container mb-16">
      <nav className="flex items-center justify-between h-20">
        <h1 className="text-2xl font-semibold">demo-project</h1>
      </nav>
      <section className="">
        <div className="grid grid-cols-3 gap-4">
          <SearchMovies
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
            lowerSearchYear={lowerSearchYear}
            setLowerSearchYear={setLowerSearchYear}
            upperSearchYear={upperSearchYear}
            setUpperSearchYear={setUpperSearchYear}
            searchGenre={searchGenre}
            setSearchGenre={setSearchGenre}
            userResultLimit={userResultLimit}
            setUserResultLimit={setUserResultLimit}
            sampleResultLimit={sampleResultLimit}
            setSampleResultLimit={setSampleResultLimit}
            refreshMovies={refreshMovies} />
          <AddMovie refreshMovies={refreshMovies}/>
        </div>
      </section>
      <section className="mt-16">
        <span>returned: {movies.length}</span>
        <DataTable movies={movies} refreshMovies={refreshMovies} />
      </section>
    </main>
  );
}
export default App;