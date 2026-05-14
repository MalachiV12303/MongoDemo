import { useState } from "react";
import { fetchMovies, createMovie as createMovieApi, updateMovie as updateMovieApi, deleteMovie as deleteMovieApi } from "./lib/api";
import AddMovie from "./components/AddMovie";
import SearchMovies from "./components/SearchMovies";
import DataTable from "./components/DataTable";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./components/Login";
import ErrorBanner from "./components/ErrorBanner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export type Movie = {
  _id: string;
  title: string;
  year: number;
  genres: string[];
  source: string;
  ownerEmail?: string;
};

function App() {
  // form state - updates on keystroke, doesn't trigger queries
  const [inputTitle, setInputTitle] = useState("")
  const [inputLowerYear, setInputLowerYear] = useState("")
  const [inputUpperYear, setInputUpperYear] = useState("")
  const [inputGenre, setInputGenre] = useState<string[]>([])
  const [inputSampleLimit, setInputSampleLimit] = useState("20")
  const [inputUserLimit, setInputUserLimit] = useState("20")
  const [inputTableSelection, setInputTableSelection] = useState("all")

  // query params - only update when user clicks search
  const [queryParams, setQueryParams] = useState({
    title: "",
    lowerYear: "",
    upperYear: "",
    genre: [] as string[],
    sampleLimit: "20",
    userLimit: "20",
    tableSelection: "all"
  })

  const queryClient = useQueryClient();

  // fetch data based on query params (not input state)
  const {
    data: movies = [],
    isLoading,
    error
  } = useQuery({
    queryKey: [
      "movies",
      queryParams.title,
      queryParams.lowerYear,
      queryParams.upperYear,
      queryParams.genre,
      queryParams.userLimit,
      queryParams.sampleLimit,
      queryParams.tableSelection
    ],
    queryFn: () =>
      fetchMovies(
        queryParams.title,
        queryParams.lowerYear,
        queryParams.upperYear,
        queryParams.genre,
        queryParams.userLimit,
        queryParams.sampleLimit,
        queryParams.tableSelection
      ),
    staleTime: 1000 * 60 * 5
  });

  // handle search button click - update query params
  const handleSearch = () => {
    setQueryParams({
      title: inputTitle,
      lowerYear: inputLowerYear,
      upperYear: inputUpperYear,
      genre: inputGenre,
      sampleLimit: inputSampleLimit,
      userLimit: inputUserLimit,
      tableSelection: inputTableSelection
    })
  }

  // mutations for add/edit/delete
  const createMutation = useMutation({
    mutationFn: createMovieApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, source, payload }: { id: string; source: string; payload: any }) =>
      updateMovieApi(id, source, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, source }: { id: string; source: string }) =>
      deleteMovieApi(id, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  // get error messages from API responses
  const getErrorMessage = (errorData: any): string => {
    if (errorData?.response?.status === 429) {
      return "Too many requests. Please wait a moment before trying again.";
    }
    if (errorData?.response?.status === 401) {
      return "Unauthorized. Please log in and try again.";
    }
    if (typeof errorData?.response?.data?.detail === "string") {
      return errorData.response.data.detail;
    }
    return "An error occurred. Please try again.";
  }

  const queryError = error ? getErrorMessage(error) : null;
  const createError = createMutation.error ? getErrorMessage(createMutation.error) : null;
  const updateError = updateMutation.error ? getErrorMessage(updateMutation.error) : null;
  const deleteError = deleteMutation.error ? getErrorMessage(deleteMutation.error) : null;
  const allErrors = [queryError, createError, updateError, deleteError].filter((err): err is string => err !== null);

  return (
    <main className="container mb-16">
      <nav className="flex items-center justify-between h-20">
        <h1 className="text-2xl font-semibold">demo-project</h1>
        <ThemeToggle />
      </nav>
      <section className="flex flex-col gap-4">
        <Login />
        <div className="grid grid-cols-3 gap-4">
          <SearchMovies
            inputTitle={inputTitle}
            setInputTitle={setInputTitle}
            inputLowerYear={inputLowerYear}
            setInputLowerYear={setInputLowerYear}
            inputUpperYear={inputUpperYear}
            setInputUpperYear={setInputUpperYear}
            inputGenre={inputGenre}
            setInputGenre={setInputGenre}
            inputSampleLimit={inputSampleLimit}
            setInputSampleLimit={setInputSampleLimit}
            inputUserLimit={inputUserLimit}
            setInputUserLimit={setInputUserLimit}
            inputTableSelection={inputTableSelection}
            setInputTableSelection={setInputTableSelection}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          <AddMovie onCreateMovie={createMutation.mutate} isLoading={createMutation.isPending} />
        </div>
        <ErrorBanner errors={allErrors} />
      </section>
      <section className="mt-12">
        <span className="text-sm text-foreground-muted">{JSON.stringify(queryParams)}</span>
        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-foreground-muted">
            <div className="animate-spin h-4 w-4 border-2 border-foreground border-t-transparent rounded-full"></div>
            <span>Loading movies...</span>
          </div>
        )}
        {!isLoading && (
          <DataTable
            movies={movies}
            onUpdateMovie={(id, source, payload) => updateMutation.mutate({ id, source, payload })}
            onDeleteMovie={(id, source) => deleteMutation.mutate({ id, source })}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </section>
      <ReactQueryDevtools initialIsOpen={false} />
    </main>
  );
}
export default App;