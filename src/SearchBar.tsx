import React, {MouseEvent, useEffect, useRef} from "react";
import {Song} from "./types/song";
import "./assets/SearchComponent.css";

const SearchComponent = ({searchResults, isUlOpen, setIsUlOpen, onSongSelected}: {
    searchResults: Song[],
    isUlOpen: boolean,
    setIsUlOpen: (open: boolean) => void,
    onSongSelected: (song: Song) => void
}) => {

    const searchRef = useRef<HTMLDivElement>(null);

    const handleClick = (song: Song) => {
        localStorage.setItem("song", JSON.stringify(song));
        setIsUlOpen(false);
        onSongSelected(song);
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, song: Song) => {
        if (event.key === 'Enter') {
            handleClick(song);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent<Element, globalThis.MouseEvent>) => {
            const element = document.getElementById('player');

            if (element && !element.contains(event.target as Node)) {
                setIsUlOpen(false);
            }
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsUlOpen]);

    return (
        <div ref={searchRef}>
            <ul data-testid="search-results" aria-label="search-results">
                {searchResults.map((song) => (
                    <li
                        key={song.uri}
                        onClick={() => handleClick(song)}
                        className={`search-result ${isUlOpen ? "open" : ""}`}
                        aria-label="search-result"
                    >
                        <div tabIndex={0} className="search-result-content"
                             onKeyDown={(e) => handleKeyDown(e, song)}>
                            <img src={song.image} alt="" className="song-image"/>
                            <div>
                                <div data-testid="search-result">{song.name}</div>
                                <div className="artist">{song.artist}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
