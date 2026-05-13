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

    return (
        <div className="border border-foreground p-4 grid grid-cols-2 gap-y-4 gap-x-8 col-span-2">
            <h2 className="col-span-2 text-xl">query data</h2>
            <div className="flex flex-col gap-2">
                <span className="flex flex-nowrap">
                    <span>title:</span>
                    <input
                        className="focus:outline-none ml-2 border-b border-foreground w-full"
                        placeholder="in title"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>year:</span>
                    <input
                        className="ml-2 focus:outline-none border-b border-foreground w-20"
                        placeholder="after"
                        value={lowerSearchYear}
                        onChange={(e) => setLowerSearchYear(e.target.value)}
                    />
                    <span className="mx-2">—</span>
                    <input
                        className="focus:outline-none border-b border-foreground w-20"
                        placeholder="before"
                        value={upperSearchYear}
                        onChange={(e) => setUpperSearchYear(e.target.value)}
                    />
                </span>
                <span className="flex flex-nowrap">
                    <span>genre:</span>
                    <input
                        className="focus:outline-none ml-2 border-b border-foreground w-full"
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
                <input
                    className="focus:outline-none border-b border-foreground"
                    placeholder="sample result limit (default 20)"
                    value={sampleResultLimit !== "20" ? sampleResultLimit : ""}
                    onChange={(e) => setSampleResultLimit(e.target.value)}
                />
                <input
                    className="focus:outline-none border-b border-foreground"
                    placeholder="user result limit (default 20)"
                    value={userResultLimit !== "20" ? userResultLimit : ""}
                    onChange={(e) => setUserResultLimit(e.target.value)}
                />
            </div>
            <button
                onClick={refreshMovies}
                className="bg-primary hover:bg-primary-muted transition-colors py-1 mt-auto col-span-2"
            >
                .get
            </button>
        </div>
    );
}