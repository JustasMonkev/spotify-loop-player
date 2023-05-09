import {ChangeEvent, MouseEvent, useEffect, useRef, useState} from "react";
import {searchForSong} from "./services/spotifyService.ts";
import {Song} from "./types/song";
import "./assets/SearchComponent.css";

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Song[] | []>([]);
    const [isUlOpen, setIsUlOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleUlOpen = () => {
        setIsUlOpen(true);
    };

    const setSearchInput = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        const results: Song[] = await searchForSong(searchTerm);
        setSearchResults(results);
    };

    const handleClick = (uri: string, name: string) => {
        localStorage.setItem("selectedUri", uri);
        setSearchTerm(name)
        setIsUlOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, uri: string, name: string) => {
        if (event.key === 'Enter') {
            handleClick(uri, name);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent<Element, globalThis.MouseEvent>) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsUlOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    return (
        <div ref={searchRef} className='search-container'>
            <input
                type="text"
                placeholder="Search for a song"
                onFocus={handleUlOpen}
                onChange={(e) => setSearchInput(e)}
                value={searchTerm}
                className="search-input"
            />
            <ul className="search-input">
                {searchResults.map((result) => (
                    <li
                        key={result.uri}
                        onClick={() => handleClick(result.uri, result.name)}
                        className={`search-result ${isUlOpen ? "open" : ""}`}
                    >
                        <div tabIndex={0} className="search-result-content"
                             onKeyDown={(e) => handleKeyDown(e, result.uri, result.name)}>
                            <img src={result.image} alt="" className="song-image"/>
                            <div>
                                <div>{result.name}</div>
                                <div className="artist">{result.artist}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
