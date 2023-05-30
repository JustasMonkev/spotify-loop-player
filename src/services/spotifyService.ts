import {Song} from "../types/song";
import {
    getSpotifyAnalysisApi, getSpotifySearchApi,
    getSpotifyTrackApi,
    SPOTIFY_PAUSE_API,
    SPOTIFY_PLAY_API,
} from "../assets/constants.ts";
import {Bars} from "../types/bars";
import Cookies from "js-cookie";


let isPlaying = false;

let accessToken = '';

export const setToken = (newToken: string) => {
    accessToken = newToken;
}

export const playSpotifyTrack = async (songUri: string | undefined, startTime: number) => {
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

export const playSpotifyTrackOnRepeat = async (songUri: string | undefined, startTime: number, endTime: number) => {
    isPlaying = true;
    while (isPlaying) {
        await playSpotifyTrack(songUri, startTime).then(
            await new Promise(resolve => setTimeout(resolve, endTime - startTime)).then(
                await new Promise(resolve => setTimeout(resolve, 500)
                )
            )
        )
    }
}

export const getCurrentSong = async (id: string | undefined): Promise<Song> => {
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
        duration: data.duration_ms,
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

    if (response.status === 401) {
        Cookies.remove('access_token');
        window.location.reload();
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

export const searchForSong = async (query: string): Promise<Song[]> => {
    if (!query.trim()) {
        return [];
    }

    const response = await fetch(getSpotifySearchApi(encodeURIComponent(query)), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    })

    if (response.status !== 200) {
        throw new Error('Invalid response from server when searching for song');
    }

    const data = await response.json();

    if (!data) {
        throw new Error('Invalid response from server when searching for song');
    }

    const songs: Song[] = [];

    data.tracks.items.forEach((item: any) => {
        if (songs.find(song => song.name === item.name)) {
            return;
        }
        songs.push({
            name: item.name,
            image: item.album.images[1].url,
            artist: item.artists[0].name,
            uri: item.uri.replace('spotify:track:', ''),
            duration: item.duration_ms,
        })
    })

    return songs;
}
