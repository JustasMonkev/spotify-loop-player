import React, {MouseEvent, useEffect, useRef} from "react";
import {Song} from "./types/song";
import "./assets/SearchComponent.css";

// Add the onSongSelected prop to the SearchComponent
const SearchComponent = ({searchResults, isUlOpen, setIsUlOpen, onSongSelected}: {
    searchResults: Song[],
    isUlOpen: boolean,
    setIsUlOpen: (open: boolean) => void,
    onSongSelected: (song: Song) => void
}) => {

    const searchRef = useRef<HTMLDivElement>(null);

    const handleClick = (song: Song) => {
        localStorage.setItem("selectedUri", song.uri);
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
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
    }, [searchRef, setIsUlOpen]);

    return (
        <div ref={searchRef}>
            <ul>
                {searchResults.map((song) => (
                    <li
                        key={song.uri}
                        onClick={() => handleClick(song)}
                        className={`search-result ${isUlOpen ? "open" : ""}`}
                    >
                        <div tabIndex={0} className="search-result-content"
                             onKeyDown={(e) => handleKeyDown(e, song)}>
                            <img src={song.image} alt="" className="song-image"/>
                            <div>
                                <div>{song.name}</div>
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
