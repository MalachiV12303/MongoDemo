import { useState } from "react";
import { createMovie, getCurrentUser } from "../lib/api";

type Props = {
    refreshMovies: () => void;
};

export default function AddMovie({ refreshMovies }: Props) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createMovie({
                title,
                year: Number(year),
                genres: genre.split(",").map(g => g.trim()),
            });

            setTitle("");
            setYear("");
            setGenre("");

            refreshMovies();
        } catch (err) {
            console.error("Create movie failed:", err);
        }
    };
    const currentUser = getCurrentUser();
    const isAdminOrUser = currentUser?.role === "admin" || currentUser?.role === "user";

    return (
        <form
            className="border border-foreground p-4 flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <span className="text-xl">add movie</span>
            {!isAdminOrUser && (
                <p className="text-sm text-foreground">
                    must be logged in to add movies
                </p>
            )}
            {isAdminOrUser && (
                <>
                    <div className="flex flex-col gap-2">
                        <input
                            className="border-b border-foreground focus:outline-none"
                            placeholder="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            className="border-b border-foreground focus:outline-none"
                            placeholder="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

                        <input
                            className="border-b border-foreground focus:outline-none"
                            placeholder="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>

                    <button
                        className="bg-primary hover:bg-primary-muted py-1"
                        type="submit"
                    >
                        .post
                    </button>
                </>
            )}
        </form>
    );
}