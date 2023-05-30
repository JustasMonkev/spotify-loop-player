import React, {MouseEvent, useEffect, useRef} from 'react';
import Modal from 'react-modal';
import {SongHistory} from "./types/songHistory";
import "./assets/SearchComponent.css";
import {convertMillisecondsToMinutesAndSeconds} from "./utils.ts";
import {Song} from "./types/song";
import "./assets/SpotifyHistoryModalComponent.css";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'black',
        background: '#0eee91',
        borderRadius: '10px',
    },
};

Modal.setAppElement('#root');

function SpotifyHistoryModal({songs, onSongSelected}: {
    songs: SongHistory[],
    onSongSelected: (song: Song | null) => void
}) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const parentDivRef = useRef<HTMLDivElement>(null);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent<Element, globalThis.MouseEvent>) => {
            if (parentDivRef.current && !parentDivRef.current.contains(event.target as Node)) {
                setIsOpen(false);
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
    }, [setIsOpen]);

    const handleClick = (song: Song) => {
        setIsOpen(false);
        onSongSelected(song)
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, song: Song) => {
        if (event.key === 'Enter') {
            setIsOpen(false);
            onSongSelected(song)
        }
    };

    return (
        <div>
            <button onClick={openModal} aria-label="Open Spotify History dialog" className='history-button'
                    data-testid='open-spotify-history'>Song
                History
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <button onClick={closeModal} className={'close-button'} aria-label="close spotify history mocdal"
                        data-testid='close-spotify-history'/>
                <div className='modal-content' data-testid="spotify-history-modal">
                    {songs.length ? (
                        songs.map((song) => (
                            <div tabIndex={0} className="history-result-content" key={song.song.uri}
                                 onClick={() => handleClick(song.song)}
                                 onKeyDown={(e) => handleKeyDown(e, song.song)}>
                                <img src={song.song.image} alt="" className="song-image"/>
                                <div>
                                    <div data-testid="search-result">{song.song.name}</div>
                                    <div className="artist"
                                         data-testid="spotify-history-song-artist">{song.song.artist}</div>
                                    <div data-testid='song-start-time'>start
                                        time: {convertMillisecondsToMinutesAndSeconds(song.songStartTime)}</div>
                                    <div data-testid='song-end-time'>end
                                        time: {convertMillisecondsToMinutesAndSeconds(song.songEndTime)}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-results-message' data-testid='spotify-history-no-results'>No songs
                            played</div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default SpotifyHistoryModal;
