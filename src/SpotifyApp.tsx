import {
    getCurrentSong, getSongBarsTime,
    pauseSpotifyTrack,
    playSpotifyTrackOnRepeat, setToken
} from './services/spotifyService';
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
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
    };

    const handlePauseClick = async () => {
        await pauseSpotifyTrack(accessToken);
        setIsPlayingButton(false);
    };


    return (
        <div className="player-container">
            <CurrentSongDisplay song={currentSong} isSpinning={isPlaying}/>
            <form className="input-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="start song time"
                       onChange={handleStartTimeChange}/>
                <input type="text" placeholder="end song time" onChange={handleEndTimeChange}/>
                <SearchComponent/>
                <div className="player-controls">
                    <button onClick={handlePlayClick} disabled={isPlaying} type="submit">Play Song</button>
                    <button onClick={handlePauseClick}>Pause Track</button>
                </div>
            </form>
        </div>
    );
}

export default SpotifyApp;
