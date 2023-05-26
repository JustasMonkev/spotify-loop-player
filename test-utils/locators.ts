const selectors = {
    authorizationButton: "[data-testid = 'authorization-button']",
    songSearchInput: "[data-testid = 'search-input']",
    searchResults: "[data-testid = 'search-results']",
    clearSearchButton: "[data-testid = 'clear-input-button']",
    songName: "[data-testid = 'song-name']",
    songArtist: "[data-testid = 'song-artist']",
    songImage: "[data-testid = 'song-image']",
    songStarTimeInput: "[data-testid = 'start-time-input']",
    songEndTimeInput: "[data-testid = 'end-time-input']",
    playSongButton: "[data-testid='play-button-enabled']",
    disabledSongButton: "[data-testid = 'play-button-disabled']",
    pauseSongButton: "[data-testid = 'pause-button']",
    noSongPlayingBlock: "[data-testid = 'no-song-playing']",
    spotifySelectors: {
        userNameInput: "#login-username",
        passwordInput: "#login-password",
        loginButton: "#login-button",
        allowButton: `[data-testid="auth-accept"]`,
    },
    spotifyHistorySelectors: {
        historyButton: "[data-testid = 'open-spotify-history']",
        historyModal: "[data-testid = 'spotify-history-modal']",
        historyModalCloseButton: "[data-testid = 'close-spotify-history']",
        historyModalSongArtist: "[data-testid = 'spotify-history-song-artist']",
        historyStartSongTime: "[data-testid = 'song-start-time']",
        historyEndSongTime: "[data-testid = 'song-end-time']",
        historyNoResults: "[data-testid = 'spotify-history-no-results']",
        clearHistoryButton: "[data-testid = 'clear-history-button']",
    }
}

export default selectors;
