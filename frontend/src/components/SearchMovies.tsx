import { yearInvalid, titleInvalid, genreInvalid } from "../lib/validators";

type Props = {
    inputTitle: string
    setInputTitle: React.Dispatch<React.SetStateAction<string>>
    inputLowerYear: string
    setInputLowerYear: React.Dispatch<React.SetStateAction<string>>
    inputUpperYear: string
    setInputUpperYear: React.Dispatch<React.SetStateAction<string>>
    inputGenre: string[]
    setInputGenre: React.Dispatch<React.SetStateAction<string[]>>
    inputUserLimit: string
    setInputUserLimit: React.Dispatch<React.SetStateAction<string>>
    inputSampleLimit: string
    setInputSampleLimit: React.Dispatch<React.SetStateAction<string>>
    inputTableSelection: string
    setInputTableSelection: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void
    isLoading: boolean
}

export default function SearchMovies({
    inputTitle,
    setInputTitle,
    inputLowerYear,
    setInputLowerYear,
    inputUpperYear,
    setInputUpperYear,
    inputGenre,
    setInputGenre,
    inputUserLimit,
    setInputUserLimit,
    inputSampleLimit,
    setInputSampleLimit,
    inputTableSelection,
    setInputTableSelection,
    onSearch,
    isLoading
}: Props) {
    const lowerYearInvalid = yearInvalid(inputLowerYear);
    const upperYearInvalid =
        inputUpperYear !== "" && (
            yearInvalid(inputUpperYear) ||
            (inputLowerYear !== "" && !yearInvalid(inputLowerYear) && Number(inputUpperYear) < Number(inputLowerYear))
        );
    const searchTitleInvalid = inputTitle !== "" && titleInvalid(inputTitle);
    const searchGenreInvalid = inputGenre.join(",") !== "" && genreInvalid(inputGenre.join(","));
    const hasInvalidSearch = lowerYearInvalid || upperYearInvalid || searchTitleInvalid || searchGenreInvalid;
    return (
        <div className="border border-foreground p-4 grid grid-cols-2 gap-y-4 gap-x-8 col-span-2">
            <h2 className="col-span-2 text-xl">query data</h2>
            <div className="flex flex-col gap-2">
                <span className="flex flex-nowrap">
                    <span>title:</span>
                    <input
                        className={`focus:outline-none ml-2 border-b w-full ${searchTitleInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="in title"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>year:</span>
                    <input
                        className={`ml-2 focus:outline-none border-b w-20 ${lowerYearInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="after"
                        value={inputLowerYear}
                        onChange={(e) => setInputLowerYear(e.target.value)}
                    />
                    <span className="mx-2">—</span>
                    <input
                        className={`focus:outline-none border-b w-20 ${upperYearInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="before"
                        value={inputUpperYear}
                        onChange={(e) => setInputUpperYear(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>genre:</span>
                    <input
                        className={`focus:outline-none ml-2 border-b w-full ${searchGenreInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="comma-separated no spaces"
                        value={inputGenre.join(",")}
                        onChange={(e) => setInputGenre(e.target.value.split(",").map(s => s.trim()))}
                    />
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <select value={inputTableSelection} onChange={(e) => { setInputTableSelection(e.target.value); }} className="border-b border-foreground">
                    <option value="all">all collections</option>
                    <option value="sample">movies</option>
                    <option value="user">user_movies</option>
                </select>
                {(inputTableSelection == "sample" || inputTableSelection == "all") && (
                    <div>
                        <span className="text-sm mr-2">sample result limit:</span>
                        <input
                            className="focus:outline-none border-b border-foreground"
                            placeholder="sample result limit"
                            value={inputSampleLimit}
                            onChange={(e) => setInputSampleLimit(e.target.value)}
                        />
                    </div>
                )}
                {(inputTableSelection == "user" || inputTableSelection == "all") && (
                    <div>
                        <span className="text-sm mr-2">user result limit:</span>
                        <input
                            className="focus:outline-none border-b border-foreground"
                            placeholder="user result limit"
                            value={inputUserLimit}
                            onChange={(e) => setInputUserLimit(e.target.value)}
                        />
                    </div>

                )}

            </div>
            <button
                onClick={onSearch}
                disabled={hasInvalidSearch || isLoading}
                className="bg-primary hover:bg-primary-muted py-1 disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
            >
                {isLoading ? "loading..." : ".get"}
            </button>
        </div>
    );
}