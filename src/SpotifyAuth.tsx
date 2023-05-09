import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import "./assets/styles.css";
import SpotifyApp from "./SpotifyApp.tsx";

interface SpotifyAuthProps {
    client_id: string;
    redirect_uri: string;
    scopes: string[];
}

const userID = import.meta.env.VITE_USER_ID;

if (!userID) {
    throw new Error('Missing client_id is not set in the environment variables');
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({client_id, redirect_uri, scopes}) => {
    const [token, setToken] = useState<string | null>(null);
    const {search} = useLocation();
    const params = new URLSearchParams(search);
    const code = params.get('code');
    const error = params.get('error');
    const navigate = useNavigate();
    const hasFetchedAccessToken = useRef(false);

    useEffect(() => {
        if (code && !hasFetchedAccessToken.current) {
            fetchAccessToken(code);
            hasFetchedAccessToken.current = true;
        } else if (error) {
            alert('There was an error during the authentication');
        }
    }, [code, error]);

    useEffect(() => {
        if (token) {
            navigate('/spotify/player');
        }
    }, [token, navigate]);


    const fetchAccessToken = async (code: string) => {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(client_id + ':' + userID),
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri,
                    client_id,
                }),
            });

            const data = await response.json();

            console.log(data)

            setToken(data.access_token);

            localStorage.setItem('access_token', data.access_token);

        } catch (error) {
            console.error('Failed to fetch access token', error);
        }
    };

    const initiateAuthorization = async () => {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}&show_dialog=true`;
    };

    return (
        <div className="authButtonContainer">
            {token ? <SpotifyApp/> :
                <button onClick={initiateAuthorization} className="authButton"></button>}
        </div>
    );
};

export default SpotifyAuth;
