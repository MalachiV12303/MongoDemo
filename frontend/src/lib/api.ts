import axios from "axios";

export const fetchMovies = async (searchTitle?: string, lowerSearchYear?: string, upperSearchYear?: string, searchGenre?: string[], userResultLimit?: string, sampleResultLimit?: string) => {
    const params: Record<string, string> = {};
    if (searchTitle) params.title = searchTitle;
    if (lowerSearchYear) params.lowerYear = lowerSearchYear;
    if (upperSearchYear) params.upperYear = upperSearchYear;
    if (searchGenre) params.genre = searchGenre.map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()).join(",");
    if (userResultLimit) params.userResultLimit = userResultLimit;
    if (sampleResultLimit) params.sampleResultLimit = sampleResultLimit;

    const res = await axios.get(
        "http://localhost:8000/movies",
        { params }
    );

    return(res.data);
};