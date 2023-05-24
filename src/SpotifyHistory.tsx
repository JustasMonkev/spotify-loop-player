import {SongHistory} from "./types/songHistory";

const SpotifyHistoryComponent = ({songs}: { songs: SongHistory[] }) => {
    return (
        <div>
            {songs.length === 0 ? (
                <p>No songs</p>
            ) : (
                songs.map((song: SongHistory) => (
                    <li key={song.song.uri}>
                        {song.song.uri} - {song.song.name}
                    </li>
                ))
            )}
        </div>
    );
}

export default SpotifyHistoryComponent;
