export const FIRST_MOVIE_YEAR = 1888;

/** Returns true when a year string represents an invalid year. Empty string returns false (field not filled in yet). */
export function yearInvalid(year: string): boolean {
    if (year === "") return false;
    const num = Number(year);
    return isNaN(num) || num < FIRST_MOVIE_YEAR || num > new Date().getFullYear();
}

/** Returns true when a title string is blank. */
export function titleInvalid(title: string): boolean {
    return title.trim() === "";
}

/** Returns true when a comma-separated genre string contains no valid entries. */
export function genreInvalid(genre: string): boolean {
    return genre.split(",").map(g => g.trim()).filter(Boolean).length === 0;
}
