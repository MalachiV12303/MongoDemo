import { useState } from "react"
import axios from "axios"
import type { Movie } from "../App";
import { getCurrentUser } from "../lib/api";

type SortField = "title" | "year" | null;
type SortDirection = "asc" | "desc" | null;
type Props = {
  movies: Movie[]
  refreshMovies: () => Promise<void>
}

export default function DataTable({ movies, refreshMovies }: Props) {
  const [editedYears, setEditedYears] = useState<Record<string, string>>({});
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});
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

  const handleUpdate = async (movie: Movie) => {
    try {
      const token = localStorage.getItem("token");

      const updatedYear = editedYears[movie._id];
      const updatedName = editedNames[movie._id];

      const payload: Record<string, any> = {};

      if (updatedYear !== undefined) {
        payload.year = Number(updatedYear);
      }

      if (updatedName !== undefined) {
        payload.title = updatedName;
      }

      if (Object.keys(payload).length === 0) {
        return;
      }

      const endpoint =
        movie.source === "user"
          ? `http://localhost:8000/user-movies/${movie._id}`
          : `http://localhost:8000/sample-movies/${movie._id}`;

      await axios.patch(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

      await refreshMovies();

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (movie: Movie) => {
    try {
      const token = localStorage.getItem("token");

      const endpoint =
        movie.source === "user"
          ? `http://localhost:8000/user-movies/${movie._id}`
          : `http://localhost:8000/sample-movies/${movie._id}`;

      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
      <p className="mt-2 grid grid-cols-6 gap-2 border-b border-foreground">
        <span className="col-span-2">title</span>
        <span>release year</span>
        <span className="col-span-2">genres</span>
      </p>
      {sortedMovies.map((movie) => {
        const hasYearEdit = editedYears[movie._id] !== undefined;
        const hasNameEdit = editedNames[movie._id] !== undefined;
        const hasEdits = hasYearEdit || hasNameEdit;
        const currentUser = getCurrentUser();
        const isAuthenticated = currentUser !== null;
        const isAdmin = currentUser?.role === "admin";
        const canEdit = isAuthenticated && (movie.source === "user" || isAdmin);
        const canDelete = isAuthenticated && (movie.source === "user" || isAdmin);
        return (
          <div className="grid grid-cols-6 gap-2 items-center py-2 border-foreground-muted border-b" key={movie._id}>
            <h3 className="col-span-2"><input
              type="text"
              value={editedNames[movie._id] ?? movie.title}
              onChange={(e) =>
                handleNameChange(movie._id, e.target.value)
              }
              disabled={!canEdit}
              className={`focus:outline-none w-full px-2 py-1 border border-foreground-muted disabled:border-0 ${editedNames[movie._id]
                ? "text-primary"
                : "text-foreground"
                }`}
            /></h3>
            <input
              type="number"
              value={editedYears[movie._id] ?? movie.year}
              onChange={(e) =>
                handleYearChange(movie._id, e.target.value)
              }
              disabled={!canEdit}
              className={`hide-arrows focus:outline-none px-2 py-1 border border-foreground-muted disabled:border-0 ${editedYears[movie._id]
                ? "text-primary"
                : "text-foreground"
                }`}
            />
            <p className="col-span-2">
              {movie.genres?.join(", ") || "No genres listed"}
            </p>
            <div className="flex gap-2">
              {canDelete && (
                <button
                  onClick={() => handleDelete(movie)}
                  className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
                >
                  .delete
                </button>
              )}
              {canEdit && hasEdits && (
                <button
                  onClick={() => handleUpdate(movie)}
                  className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
                >
                  .patch
                </button>
              )}
            </div>
          </div>
        )
      }
      )}
    </div>
  );
}