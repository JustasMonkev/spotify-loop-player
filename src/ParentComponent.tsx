import React, {MouseEvent, useEffect, useRef} from 'react';
import Modal from 'react-modal';
import {SongHistory} from "./types/songHistory";
import "./assets/SearchComponent.css";
import {convertMillisecondsToMinutesAndSeconds} from "./utils.ts";
import {Song} from "./types/song";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'black',
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function ParentComponent({songs}: { songs: SongHistory[] }) {
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
        localStorage.removeItem("song")
        localStorage.setItem("song", JSON.stringify(song));
    };

    return (
        <div>
            <button onClick={openModal}>Song History</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className='modal-content'>
                    {songs.map((song) => (
                        <div tabIndex={0} className="search-result-content" key={song.song.uri}>
                            <img src={song.song.image} alt="" className="song-image"/>
                            <div onClick={() => handleClick(song.song)}>
                                <div data-testid="search-result">{song.song.name}</div>
                                <div className="artist">{song.song.artist}</div>
                                <div>start time: {convertMillisecondsToMinutesAndSeconds(song.songStartTime)}</div>
                                <div>end time: {convertMillisecondsToMinutesAndSeconds(song.songEndTime)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={closeModal}>close</button>
            </Modal>
        </div>
    );
}

export default ParentComponent;
