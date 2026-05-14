import type { Movie as MovieType } from "../App";
import { getCurrentUser } from "../lib/api";
import { yearInvalid, titleInvalid, genreInvalid } from "../lib/validators";

type Props = {
  movie: MovieType;
  editedYears: Record<string, string>;
  editedNames: Record<string, string>;
  editedGenres: Record<string, string>;
  onYearChange: (id: string, value: string) => void;
  onNameChange: (id: string, value: string) => void;
  onGenreChange: (id: string, value: string) => void;
  onUpdate: (movie: MovieType) => Promise<void>;
  onDelete: (movie: MovieType) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
};

export default function Movie({
  movie,
  editedYears,
  editedNames,
  editedGenres,
  onYearChange,
  onNameChange,
  onGenreChange,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: Props) {
  const hasYearEdit = editedYears[movie._id] !== undefined;
  const hasNameEdit = editedNames[movie._id] !== undefined;
  const hasGenreEdit = editedGenres[movie._id] !== undefined;
  const hasEdits = hasYearEdit || hasNameEdit || hasGenreEdit;

  const yearValue = editedYears[movie._id] ?? String(movie.year);
  const isYearInvalid = hasYearEdit && yearInvalid(yearValue);
  const isTitleInvalid = hasNameEdit && titleInvalid(editedNames[movie._id] ?? "");
  const isGenreInvalid = hasGenreEdit && genreInvalid(editedGenres[movie._id] ?? "");
  const hasInvalidEdit = isYearInvalid || isTitleInvalid || isGenreInvalid;

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
          className={`focus:outline-none w-full px-2 py-1 border disabled:border-0 ${
            isTitleInvalid
              ? "border-primary text-primary"
              : editedNames[movie._id]
              ? "border-foreground-muted text-primary"
              : "border-foreground-muted text-foreground"
          }`}
        />
      </h3>
      <input
        type="number"
        value={yearValue}
        onChange={(e) => onYearChange(movie._id, e.target.value)}
        disabled={!canEdit}
        className={`hide-arrows focus:outline-none px-2 py-1 border disabled:border-0 ${
          isYearInvalid
            ? "border-primary text-primary"
            : hasYearEdit
            ? "border-foreground-muted text-primary"
            : "border-foreground-muted text-foreground"
        }`}
      />
      <input
        type="text"
        value={editedGenres[movie._id] ?? movie.genres?.join(", ")}
        onChange={(e) => onGenreChange(movie._id, e.target.value)}
        disabled={!canEdit}
        className={`col-span-2 focus:outline-none px-2 py-1 border disabled:border-0 ${
          isGenreInvalid
            ? "border-primary text-primary"
            : editedGenres[movie._id]
            ? "border-foreground-muted text-primary"
            : "border-foreground-muted text-foreground"
        }`}
      />
      <div className="flex gap-2">
        {canDelete && (
          <button
            onClick={() => onDelete(movie)}
            disabled={isDeleting}
            className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "deleting..." : ".delete"}
          </button>
        )}
        {canEdit && hasEdits && (
          <button
            onClick={() => onUpdate(movie)}
            disabled={hasInvalidEdit || isUpdating}
            className="bg-primary hover:bg-primary-muted transition-colors px-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "patching..." : ".patch"}
          </button>
        )}
      </div>
    </div>
  );
}