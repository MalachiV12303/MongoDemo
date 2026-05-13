import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: "http://localhost:8000",
});

// attaches JWT automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const fetchMovies = async (
    searchTitle?: string,
    lowerSearchYear?: string,
    upperSearchYear?: string,
    searchGenre?: string[],
    userResultLimit?: string,
    sampleResultLimit?: string,
    tableSelection?: string
) => {
    const params: Record<string, string> = {};

    if (searchTitle) params.title = searchTitle;
    if (lowerSearchYear) params.lowerYear = lowerSearchYear;
    if (upperSearchYear) params.upperYear = upperSearchYear;

    if (searchGenre) {
        params.genre = searchGenre
            .map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())
            .join(",");
    }

    if (tableSelection) params.tableSelection = tableSelection;
    if (userResultLimit) params.userResultLimit = userResultLimit;
    if (sampleResultLimit) params.sampleResultLimit = sampleResultLimit;

    const res = await api.get("/movies", { params });
    return res.data;
};

export const createMovie = async (movie: {
    title: string;
    year: number;
    genres: string[];
}) => {
    return api.post("/movies", movie);
};

export const deleteMovie = async (id: string, source: string) => {
    const endpoint =
        source === "user"
            ? `/user-movies/${id}`
            : `/sample-movies/${id}`;

    return api.delete(endpoint);
};

export const updateMovie = async (
    id: string,
    source: string,
    payload: any
) => {
    const endpoint =
        source === "user"
            ? `/user-movies/${id}`
            : `/sample-movies/${id}`;

    return api.patch(endpoint, payload);
};

export type DecodedUser = {
  email: string;
  role: "admin" | "user";
  exp: number;
  sub?: string;
  id?: string;
};

export const getCurrentUser = (): DecodedUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<DecodedUser>(token);
  } catch {
    return null;
  }
};