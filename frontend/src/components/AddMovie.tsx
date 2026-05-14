import { useState } from "react";
import { yearInvalid, titleInvalid, genreInvalid } from "../lib/validators";

type Props = {
    onCreateMovie: (movie: { title: string; year: number; genres: string[] }) => void;
    isLoading: boolean;
};

export default function AddMovie({ onCreateMovie, isLoading }: Props) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");

    const isTitleInvalid = titleInvalid(title);
    const isYearInvalid = yearInvalid(year);
    const isGenreInvalid = genreInvalid(genre);
    const formInvalid = isTitleInvalid || isYearInvalid || isGenreInvalid || year === "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formInvalid) return;

        try {
            onCreateMovie({
                title,
                year: Number(year),
                genres: genre.split(",").map(g => g.trim()).filter(Boolean),
            });

            setTitle("");
            setYear("");
            setGenre("");
        } catch (err) {
            console.error("Create movie failed:", err);
        }
    };

    return (
        <form
            className="border border-foreground p-4 flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <span className="text-xl">add movie</span>
            <div className="flex flex-col gap-2">
                <input
                    className={`border-b focus:outline-none ${isTitleInvalid && title !== "" ? "border-primary" : "border-foreground"}`}
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className={`border-b focus:outline-none ${isYearInvalid ? "border-primary" : "border-foreground"}`}
                    placeholder="year (≥ 1888)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    type="text"
                    inputMode="numeric"
                />
                <input
                    className={`border-b focus:outline-none ${isGenreInvalid && genre !== "" ? "border-primary" : "border-foreground"}`}
                    placeholder="genre (comma-separated)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />
            </div>
            <button
                className="bg-primary hover:bg-primary-muted py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={formInvalid || isLoading}
            >
                {isLoading ? "posting..." : ".post"}
            </button>
        </form>
    );
}