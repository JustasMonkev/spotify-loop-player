import {Song} from "./types/song";

export const CurrentSongDisplay = ({song, isSpinning, isPlaying}: {
    song: Song | null,
    isSpinning: boolean,
    isPlaying: boolean
}) => {
    return (
        <div className="song-display">
            {isPlaying && song ? (
                <div>
                    <h1> Now playing: {song.name}</h1>
                    <h2> By: {song.artist}</h2>
                    <img src={song.image} alt="song image cover" className={isSpinning ? "rotating" : ""}/>
                </div>
            ) : (
                <p>No song is playing...</p>
            )}
        </div>
    );
};
