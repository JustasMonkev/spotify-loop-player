import {Song} from "../types/song";
import {
    getSpotifyAnalysisApi,
    getSpotifyTrackApi,
    SPOTIFY_PAUSE_API,
    SPOTIFY_PLAY_API,
} from "../assets/constants.ts";
import {Bars} from "../types/bars";


let isPlaying = false;

let accessToken = '';

export const setToken = (newToken: string) => {
    accessToken = newToken;
}

export const playSpotifyTrack = async (songUri: string, startTime: number) => {
    return fetch(SPOTIFY_PLAY_API, {
        method: 'PUT',
        body: JSON.stringify({
            uris: [`spotify:track:${songUri}`],
            position_ms: startTime,
            play: true,
            repeat_state: 'track',
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export const pauseSpotifyTrack = (accessToken: string) => {
    isPlaying = false;
    return fetch(SPOTIFY_PAUSE_API, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    })
}

export const playSpotifyTrackOnRepeat = async (songUri: string, startTime: number, endTime: number) => {
    isPlaying = true;
    while (isPlaying) {
        await playSpotifyTrack(songUri, startTime).then(
            await new Promise(resolve => setTimeout(resolve, endTime - startTime))
        );
    }
}

export const getCurrentSong = async (id: string): Promise<Song> => {
    const response = await fetch(getSpotifyTrackApi(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status !== 200) {
        throw new Error('Invalid response from server');
    }

    const data = await response.json();

    if (!data) {
        throw new Error('Invalid response from server');
    }

    return {
        name: data.name,
        image: data.album.images[1].url,
        artist: data.artists[0].name,
        uri: data.uri.replace('spotify:track:', ''),
    };
}

export const getSongBarsTime = async (id: string): Promise<Bars[]> => {
    const bars: Bars[] = [];
    const response = await fetch(getSpotifyAnalysisApi(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    })

    if (response.status !== 200) {
        throw new Error('Invalid response from server when getting song bars');
    }

    const data = await response.json();

    if (!data || !data.bars) {
        throw new Error('Invalid response from server when getting song bars');
    }

    data.bars.forEach((bar: Bars) => {
        bars.push({
            start: bar.start * 1000,
            duration: bar.duration,
            confidence: bar.confidence,
        })
    });

    return bars;
}
