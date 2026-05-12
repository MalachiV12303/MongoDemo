import { useState } from "react"
import axios from "axios"
import type { Movie } from "../App";

type Props = {
  movies: Movie[]
  refreshMovies: () => Promise<void>
}

export default function DataTable({ movies, refreshMovies }: Props) {
      const [editedYears, setEditedYears] = useState<Record<string, string>>({});
     const [editedNames, setEditedNames] = useState<Record<string, string>>({});

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

     const handleUpdate = async (id: string) => {
       try {
         const updatedYear = editedYears[id];
         const updatedName = editedNames[id];

         const payload: Record<string, any> = {};
         if (updatedYear !== undefined) {
           payload.year = Number(updatedYear);
         }
         if (updatedName !== undefined) {
           payload.title = updatedName;
         }
         await axios.patch(
           `http://localhost:8000/movies/${id}`,
           payload
         );

         setEditedYears((prev) => {
           const updated = { ...prev };
           delete updated[id];
           return updated;
         });

         setEditedNames((prev) => {
           const updated = { ...prev };
           delete updated[id];
           return updated;
         });

         refreshMovies();
       } catch (error) {
         console.error("Update failed:", error);
       }
     };

     const handleDelete = async (id: string) => {
       try {
         await axios.delete(`http://localhost:8000/movies/${id}`);
         refreshMovies();
       } catch (error) {
         console.error("Error deleting movie:", error);
       }
     };

    return (
        <div className="flex flex-col">
            <p className="grid grid-cols-6 gap-2 border-b border-foreground">
                <span className="col-span-2">title</span>
                <span>release year</span>
                <span className="col-span-2">genres</span>
            </p>
            {movies.map((movie) => {
                const hasYearEdit = editedYears[movie._id] !== undefined;
                const hasNameEdit = editedNames[movie._id] !== undefined;
                const hasEdits = hasYearEdit || hasNameEdit;
                return (
                    <div className="grid grid-cols-6 gap-2 items-center py-2 border-foreground-muted border-b" key={movie._id}>
                        <h3 className="col-span-2"><input
                            type="text"
                            value={editedNames[movie._id] ?? movie.title}
                            onChange={(e) =>
                                handleNameChange(movie._id, e.target.value)
                            }
                            disabled={movie.source !== "user"}
                            className={`w-full px-2 py-1 border border-foreground-muted disabled:border-0 ${editedNames[movie._id]
                                ? "text-primary"
                                : "text-white"
                                }`}
                        /></h3>
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

                                {hasEdits && (
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
                )
            }
            )}
        </div>
    );
}