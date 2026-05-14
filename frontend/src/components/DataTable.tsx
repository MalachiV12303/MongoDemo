import { useState } from "react"
import type { Movie as MovieType } from "../App";
import Movie from "./Movie";
import { deleteMovie, updateMovie } from "../lib/api";

type SortField = "title" | "year" | null;
type SortDirection = "asc" | "desc" | null;
type Props = {
  movies: MovieType[]
  refreshMovies: () => Promise<void>
}

export default function DataTable({ movies, refreshMovies }: Props) {
  const [editedYears, setEditedYears] = useState<Record<string, string>>({});
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
  const [editedGenres, setEditedGenres] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const handleYearChange = (id: string, value: string) => {
    setEditedYears((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNameChange = (id: string, value: string) => {
    setEditedNames((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGenreChange = (id: string, value: string) => {
    setEditedGenres((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async (movie: MovieType) => {
    try {
      const updatedYear = editedYears[movie._id];
      const updatedName = editedNames[movie._id];

      const payload: Record<string, any> = {};

      if (updatedYear !== undefined) {
        payload.year = Number(updatedYear);
      }

      if (updatedName !== undefined) {
        payload.title = updatedName;
      }

      const updatedGenres = editedGenres[movie._id];
      if (updatedGenres !== undefined) {
        payload.genres = updatedGenres.split(",").map((g: string) => g.trim()).filter(Boolean);
      }

      if (Object.keys(payload).length === 0) {
        return;
      }

      await updateMovie(movie._id, movie.source, payload);

      setEditedYears((prev) => {
        const updated = { ...prev };
        delete updated[movie._id];
        return updated;
      });

      setEditedNames((prev) => {
        const updated = { ...prev };
        delete updated[movie._id];
        return updated;
      });

      setEditedGenres((prev) => {
        const updated = { ...prev };
        delete updated[movie._id];
        return updated;
      });

      await refreshMovies();

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (movie: MovieType) => {
    try {
      await deleteMovie(movie._id, movie.source);
      await refreshMovies();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSort = (field: "title" | "year") => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("desc");
      return;
    }
    if (sortDirection === "desc") {
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortField(null);
      setSortDirection(null);
    } else {
      setSortDirection("asc");
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    if (sortField === "title") {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === "asc"
        ? comparison
        : -comparison;
    }
    if (sortField === "year") {
      const comparison = a.year - b.year;
      return sortDirection === "asc"
        ? comparison
        : -comparison;
    }
    return 0;
  });

  return (
    <div className="flex flex-col">
      <span>returned: {movies.length}</span>
      <div className="flex gap-2 my-2">
        <button
          onClick={() => handleSort("title")}
          className="bg-primary hover:bg-primary-muted transition-colors px-2 py-1"
        >
          sort by title
          {sortField === "title" &&
            (sortDirection === "asc"
              ? " ↑"
              : sortDirection === "desc"
                ? " ↓"
                : "")}
        </button>

        <button
          onClick={() => handleSort("year")}
          className="bg-primary hover:bg-primary-muted transition-colors px-2 py-1"
        >
          sort by year
          {sortField === "year" &&
            (sortDirection === "asc"
              ? " ↑"
              : sortDirection === "desc"
                ? " ↓"
                : "")}
        </button>
      </div>
      <span className="text-foreground-muted text-sm">frontend sorting currently</span>
      <p className="mt-2 grid grid-cols-7 gap-2 border-b border-foreground">
        <span>owner</span>
        <span className="col-span-2">title</span>
        <span>release year</span>
        <span className="col-span-2">genres</span>
      </p>
      {sortedMovies.map((movie) => (
        <Movie
          key={movie._id}
          movie={movie}
          editedYears={editedYears}
          editedNames={editedNames}
          editedGenres={editedGenres}
          onYearChange={handleYearChange}
          onNameChange={handleNameChange}
          onGenreChange={handleGenreChange}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}