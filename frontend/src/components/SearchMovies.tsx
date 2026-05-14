import { yearInvalid, titleInvalid, genreInvalid } from "../lib/validators";

type Props = {
    searchTitle: string
    setSearchTitle: React.Dispatch<React.SetStateAction<string>>
    lowerSearchYear: string
    setLowerSearchYear: React.Dispatch<React.SetStateAction<string>>
    upperSearchYear: string
    setUpperSearchYear: React.Dispatch<React.SetStateAction<string>>
    searchGenre: string[]
    setSearchGenre: React.Dispatch<React.SetStateAction<string[]>>
    userResultLimit: string
    setUserResultLimit: React.Dispatch<React.SetStateAction<string>>
    sampleResultLimit: string
    setSampleResultLimit: React.Dispatch<React.SetStateAction<string>>
    tableSelection: string
    setTableSelection: React.Dispatch<React.SetStateAction<string>>
    refreshMovies: () => void
}

export default function SearchMovies({
    searchTitle,
    setSearchTitle,
    lowerSearchYear,
    setLowerSearchYear,
    upperSearchYear,
    setUpperSearchYear,
    searchGenre,
    setSearchGenre,
    userResultLimit,
    setUserResultLimit,
    sampleResultLimit,
    setSampleResultLimit,
    tableSelection,
    setTableSelection,
    refreshMovies
}: Props) {
    const lowerYearInvalid = yearInvalid(lowerSearchYear);
    const upperYearInvalid =
        upperSearchYear !== "" && (
            yearInvalid(upperSearchYear) ||
            (lowerSearchYear !== "" && !yearInvalid(lowerSearchYear) && Number(upperSearchYear) < Number(lowerSearchYear))
        );
    const searchTitleInvalid = searchTitle !== "" && titleInvalid(searchTitle);
    const searchGenreInvalid = searchGenre.join(",") !== "" && genreInvalid(searchGenre.join(","));
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
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>year:</span>
                    <input
                        className={`ml-2 focus:outline-none border-b w-20 ${lowerYearInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="after"
                        value={lowerSearchYear}
                        onChange={(e) => setLowerSearchYear(e.target.value)}
                    />
                    <span className="mx-2">—</span>
                    <input
                        className={`focus:outline-none border-b w-20 ${upperYearInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="before"
                        value={upperSearchYear}
                        onChange={(e) => setUpperSearchYear(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>genre:</span>
                    <input
                        className={`focus:outline-none ml-2 border-b w-full ${searchGenreInvalid ? "border-primary" : "border-foreground"}`}
                        placeholder="comma-separated no spaces"
                        value={searchGenre.join(",")}
                        onChange={(e) => setSearchGenre(e.target.value.split(",").map(s => s.trim()))}
                    />
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <select value={tableSelection} onChange={(e) => { setTableSelection(e.target.value); }} className="border-b border-foreground">
                    <option value="all">all collections</option>
                    <option value="sample">movies</option>
                    <option value="user">user_movies</option>
                </select>
                {(tableSelection == "sample" || tableSelection == "all") && (
                    <div>
                        <span className="text-sm mr-2">sample result limit:</span>
                        <input
                            className="focus:outline-none border-b border-foreground"
                            placeholder="sample result limit"
                            value={sampleResultLimit}
                            onChange={(e) => setSampleResultLimit(e.target.value)}
                        />
                    </div>
                )}
                {(tableSelection == "user" || tableSelection == "all") && (
                    <div>
                        <span className="text-sm mr-2">user result limit:</span>
                        <input
                            className="focus:outline-none border-b border-foreground"
                            placeholder="user result limit"
                            value={userResultLimit}
                            onChange={(e) => setUserResultLimit(e.target.value)}
                        />
                    </div>

                )}

            </div>
            <button
                onClick={refreshMovies}
                disabled={hasInvalidSearch}
                className="bg-primary hover:bg-primary-muted py-1 disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
            >
                .get
            </button>
        </div>
    );
}