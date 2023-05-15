import {
    getCurrentSong, getSongBarsTime,
    pauseSpotifyTrack,
    playSpotifyTrackOnRepeat, searchForSong, setToken
} from './services/spotifyService';
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {CurrentSongDisplay} from "./CurrentSongDisplay.tsx";
import {Song} from "./types/song";
import {findClosest} from "./utils.ts";
import SearchComponent from "./SearchBar.tsx";

function SpotifyApp() {
    const startTime = 6000; // 2 minutes
    const endTime = 10000; // 3 minutes
    const [songUri, setSongUri] = useState('');
    const [startTimeInput, setStartTimeInput] = useState(startTime);
    const [endTimeInput, setEndTimeInput] = useState(endTime);
    const [isPlaying, setIsPlayingButton] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUlOpen, setIsUlOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[] | []>([]);
    const [isSearchBarEnabled, setIsSearchBarEnabled] = useState(true);
    const accessToken: string = localStorage.getItem('access_token')!;
    setToken(accessToken);

    useEffect(() => {
        if (isPlaying) {

            const uriFromLocalStorage = localStorage.getItem('selectedUri');
            if (uriFromLocalStorage) {
                setSongUri(uriFromLocalStorage);
            }
            const fetchData = async () => {
                const newCurrentSong = await getCurrentSong(songUri);
                setCurrentSong(newCurrentSong);

                if (currentSong?.uri !== songUri) {
                    const bars = await getSongBarsTime(songUri);
                    const newStartTime = findClosest(startTimeInput, bars);
                    const newEndTime = findClosest(endTimeInput, bars);
                    setStartTimeInput(newStartTime);
                    setEndTimeInput(newEndTime);
                }

                await playSpotifyTrackOnRepeat(songUri, startTimeInput, endTimeInput);
            };

            fetchData();
        }
    }, [isPlaying, songUri, startTimeInput, endTimeInput, currentSong?.uri]);

    const handleStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);

        if (inputValue <= 0 || event.target.value === "") {
            setStartTimeInput(startTime);
            return;
        }

        if (inputValue >= endTimeInput) {
            setStartTimeInput(endTimeInput);
            setEndTimeInput(inputValue);
            return;
        }
        setStartTimeInput(inputValue);
    }

    const handleEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);

        if (inputValue <= 0 || event.target.value === "") {
            setEndTimeInput(endTime);
            return;
        }

        if (inputValue <= startTimeInput) {
            setEndTimeInput(startTimeInput);
            setStartTimeInput(inputValue);
            return;
        }

        setEndTimeInput(inputValue);
    }


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the default form submission event
    }

    const handlePlayClick = () => {
        setIsPlayingButton(true);
        setIsSearchBarEnabled(false)
    };

    const handlePauseClick = async () => {
        await pauseSpotifyTrack(accessToken);
        setIsPlayingButton(false);
        setIsSearchBarEnabled(true)
        setSearchTerm("");
    };

    const setSearchInput = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        const results: Song[] = await searchForSong(searchTerm);
        setSearchResults(results);
    };

    const handleSongSelected = (song: Song) => {
        setSongUri(song.uri);
        setSearchTerm(song.name);
    };

    const clearInputClick = () => {
        setSearchTerm("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            setSearchTerm("");
        }
    };

    return (
        <div className="player-container">
            <CurrentSongDisplay song={currentSong} isSpinning={isPlaying}/>
            <form className="input-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="start song time"
                       onChange={handleStartTimeChange}/>
                <input type="text" placeholder="end song time" onChange={handleEndTimeChange}/>
                {isSearchBarEnabled && <input
                    type="text"
                    placeholder="Search for a song"
                    onFocus={() => setIsUlOpen(true)}
                    onChange={(e) => setSearchInput(e)}
                    value={searchTerm}
                />
                }
                {searchTerm && isSearchBarEnabled && (
                    <div className="clear-input-button" onClick={() => clearInputClick()} tabIndex={0}
                         onKeyDown={handleKeyDown} aria-label="clear search button"/>
                )}
                {isSearchBarEnabled && (
                    <SearchComponent searchResults={searchResults} isUlOpen={isUlOpen} setIsUlOpen={setIsUlOpen}
                                     onSongSelected={handleSongSelected}/>
                )}

                <div className="player-controls">
                    <button onClick={handlePlayClick} disabled={isPlaying} type="submit">Play Song</button>
                    <button onClick={handlePauseClick}>Pause Track</button>
                </div>
            </form>
        </div>
    );
}

export default SpotifyApp;
