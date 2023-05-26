import {Song} from "./types/song";

export const CurrentSongDisplay = ({song, isSpinning}: { song: Song | null, isSpinning: boolean }) => {
    return (
        <div className="song-display" data-testid="active-song">
            {song ? (
                <div>
                    <h1 data-testid="song-name"> Now playing: {song.name}</h1>
                    <h2 data-testid="song-artist"> By: {song.artist}</h2>
                    <img src={song.image} alt="song image cover" className={isSpinning ? "rotating" : "image-wrapper"}
                         data-testid="song-image"/>
                </div>
            ) : (
                <p data-testid="no-song-playing" role="contentinfo">No song is playing...</p>
            )}
        </div>
    );
};
