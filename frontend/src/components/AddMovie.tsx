import axios from "axios";
import { useState } from "react";
type Props = {
    refreshMovies: () => void
}
export default function AddMovie({ refreshMovies }: Props) {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");

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
        refreshMovies();
    };

    return (
        <form className="border border-foreground p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <span className="text-xl">add movie</span>
            <div className="flex flex-col gap-2">
            <input
                className="focus:outline-none border-b border-foreground"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                className="focus:outline-none border-b border-foreground"
                placeholder="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <input
                className="focus:outline-none border-b border-foreground"
                placeholder="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            </div>
            <button className="bg-primary hover:bg-primary-muted transition-colors py-1 mt-auto" type="submit">.post</button>
        </form>
    );
}