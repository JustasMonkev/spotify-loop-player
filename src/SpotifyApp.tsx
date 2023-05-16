import {
    getCurrentSong,
    getSongBarsTime,
    pauseSpotifyTrack,
    playSpotifyTrackOnRepeat, searchForSong, setToken
} from './services/spotifyService';
import React, {ChangeEvent, FormEvent, useEffect, useState, KeyboardEvent} from "react";
import {CurrentSongDisplay} from "./CurrentSongDisplay.tsx";
import {Song} from "./types/song";
import {findClosest} from "./utils.ts";
import SearchComponent from "./SearchBar.tsx";

function SpotifyApp() {
    const startTime = 6000; // 2 minutes
    const endTime = 10000; // 3 minutes
    const [startTimeInput, setStartTimeInput] = useState(startTime);
    const [endTimeInput, setEndTimeInput] = useState(endTime);
    const [isPlaying, setIsPlayingButton] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUlOpen, setIsUlOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[] | []>([]);
    const [isSearchBarEnabled, setIsSearchBarEnabled] = useState(true);
    const accessToken: string = localStorage.getItem('access_token')!;
    const storedSongJsonString = localStorage.getItem("selectedUri");

    setToken(accessToken);

    useEffect(() => {
        if (storedSongJsonString) {
            const storedSong = JSON.parse(storedSongJsonString) as Song;
            setCurrentSong(storedSong);
        }
    }, [storedSongJsonString]);


    useEffect(() => {
        if (isPlaying) {
            const fetchData = async () => {
                const newCurrentSong = await getCurrentSong(currentSong?.uri);
                setCurrentSong(newCurrentSong);

                if (currentSong) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const bars = await getSongBarsTime(currentSong.uri!);
                    const newStartTime = findClosest(startTimeInput, bars);
                    const newEndTime = findClosest(endTimeInput, bars);
                    setStartTimeInput(newStartTime);
                    setEndTimeInput(newEndTime);
                }

                await playSpotifyTrackOnRepeat(currentSong?.uri, startTimeInput, endTimeInput);
            };

            fetchData();
        }
    }, [isPlaying, startTimeInput, endTimeInput, currentSong?.uri]);


    function numberOnly(event: KeyboardEvent) {
        if (event.key.match(/[^0-9]/) && event.key !== 'Backspace'
            && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' ) {
            event.preventDefault();
        }
    }

    const handleTimeInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        isStartTime: boolean,
    ) => {
        const inputValue = Number(event.target.value.replace(/\D/g, ''));
        const maxValue = getCurrentSongDuration()

        // Handle the case when the input value is empty or less than or equal to 0
        if (inputValue <= 0 || event.target.value === '') {
            if (isStartTime) {
                setStartTimeInput(startTime)
            } else {
                setEndTimeInput(endTime)
            }
            return
        }

        // Handle the case when the input value is greater than the song's duration
        if (inputValue > maxValue) {
            if (isStartTime) {
                setStartTimeInput(0)
            } else {
                setEndTimeInput(maxValue)
            }
            return
        }

        // Handle the case when updating start time input
        if (isStartTime) {
            // If the input value is greater than or equal to the end time input, adjust both start and end times
            if (inputValue >= endTimeInput) {
                setStartTimeInput(endTimeInput)
                setEndTimeInput(inputValue)
            } else {
                // Otherwise, just update the start time input
                setStartTimeInput(inputValue)
            }
        }
        // Handle the case when updating end time input
        else {
            // If the input value is less than or equal to the start time input, adjust both start and end times
            if (inputValue <= startTimeInput) {
                setEndTimeInput(startTimeInput)
                setStartTimeInput(inputValue)
            } else {
                // Otherwise, just update the end time input
                setEndTimeInput(inputValue)
            }
        }
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

    const getCurrentSongDuration = () => {
        if (currentSong) {
            return currentSong.duration
        }
        return 0;
    }

    return (
        <div className="player-container">
            <CurrentSongDisplay song={currentSong} isSpinning={isPlaying}/>
            <form className="input-form" onSubmit={handleSubmit}>
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
                {isSearchBarEnabled && searchTerm && (
                    <SearchComponent searchResults={searchResults} isUlOpen={isUlOpen} setIsUlOpen={setIsUlOpen}
                                     onSongSelected={handleSongSelected}/>
                )}
                {currentSong && (
                    <div className="input-form">
                        <input type="text" placeholder="start song time"
                               pattern="[0-9]*"
                               onKeyDown={numberOnly}
                               onChange={(e => handleTimeInputChange(e, true))}/>
                        <input type="text" placeholder="end song time"
                               pattern="[0-9]*"
                               onKeyDown={numberOnly}
                               onChange={(e => handleTimeInputChange(e, false))}/>
                        <div className="player-controls">
                            <button onClick={handlePlayClick} disabled={isPlaying}>Play Song</button>
                            <button onClick={handlePauseClick}>Pause Track</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default SpotifyApp;
