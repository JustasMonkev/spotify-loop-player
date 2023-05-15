const SPOTIFY_BASE_API = 'https://api.spotify.com/v1/me';
const SPOTIFY_BASE_API_ANALYSIS = 'https://api.spotify.com/v1/audio-analysis';
const SPOTIFY_BASE_API_TRACKS = 'https://api.spotify.com/v1/tracks';
export const SPOTIFY_PLAY_API = `${SPOTIFY_BASE_API}/player/play`;
export const SPOTIFY_PAUSE_API = `${SPOTIFY_BASE_API}/player/pause`;
export const getSpotifyAnalysisApi = (id: string) => `${SPOTIFY_BASE_API_ANALYSIS}/${id}`;

export const getSpotifyTrackApi = (id: string | undefined) => `${SPOTIFY_BASE_API_TRACKS}/${id}`;

export const getSpotifySearchApi = (query: string) => `https://api.spotify.com/v1/search?type=track&query=${query}&limit=5`;
