import type { Movie as MovieType } from "../App";
import { getCurrentUser } from "../lib/api";

type Props = {
  movie: MovieType;
  editedYears: Record<string, string>;
  editedNames: Record<string, string>;
  onYearChange: (id: string, value: string) => void;
  onNameChange: (id: string, value: string) => void;
  onUpdate: (movie: MovieType) => Promise<void>;
  onDelete: (movie: MovieType) => Promise<void>;
};

export default function Movie({
  movie,
  editedYears,
  editedNames,
  onYearChange,
  onNameChange,
  onUpdate,
  onDelete,
}: Props) {
  const hasYearEdit = editedYears[movie._id] !== undefined;
  const hasNameEdit = editedNames[movie._id] !== undefined;
  const hasEdits = hasYearEdit || hasNameEdit;

  const currentUser = getCurrentUser();
  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";
  const isOwner = currentUser && movie.ownerEmail === currentUser.email;
  const canEdit = isAuthenticated && (isAdmin || (movie.source === "user" && isOwner));
  const canDelete = isAuthenticated && (isAdmin || (movie.source === "user" && isOwner));

  return (
    <div className="grid grid-cols-7 gap-2 items-center py-2 border-foreground-muted border-b" key={movie._id}>
      <span>{movie.ownerEmail ? movie.ownerEmail : "Sample Data"}</span>
      <h3 className="col-span-2">
        <input
          type="text"
          value={editedNames[movie._id] ?? movie.title}
          onChange={(e) => onNameChange(movie._id, e.target.value)}
          disabled={!canEdit}
          className={`focus:outline-none w-full px-2 py-1 border border-foreground-muted disabled:border-0 ${
            editedNames[movie._id] ? "text-primary" : "text-foreground"
          }`}
        />
      </h3>
      <input
        type="number"
        value={editedYears[movie._id] ?? movie.year}
        onChange={(e) => onYearChange(movie._id, e.target.value)}
        disabled={!canEdit}
        className={`hide-arrows focus:outline-none px-2 py-1 border border-foreground-muted disabled:border-0 ${
          editedYears[movie._id] ? "text-primary" : "text-foreground"
        }`}
      />
      <p className="col-span-2">
        {movie.genres?.join(", ") || "No genres listed"}
      </p>
      <div className="flex gap-2">
        {canDelete && (
          <button
            onClick={() => onDelete(movie)}
            className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
          >
            .delete
          </button>
        )}
        {canEdit && hasEdits && (
          <button
            onClick={() => onUpdate(movie)}
            className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full"
          >
            .patch
          </button>
        )}
      </div>
    </div>
  );
}