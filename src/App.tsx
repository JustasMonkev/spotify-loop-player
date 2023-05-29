import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import SpotifyAuth from "./SpotifyAuth.tsx";
import React, {ReactNode} from "react";
import SpotifyApp from "./SpotifyApp.tsx";
import Cookies from 'js-cookie';

const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
const client_id = import.meta.env.VITE_CLIENT_ID;

if (!client_id) {
    throw new Error('Missing client_id is not set in the environment variables');
}

if (!redirect_uri) {
    throw new Error('Missing redirect_uri is not set in the environment variables');
}

const scopes: string[] = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'user-follow-modify',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
    'user-read-private',
];

const Redirect = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/');
    }, [navigate]);

    return null;
};

const SpotifyPlayerGuard = ({children}: { children: ReactNode }) => {
    const accessToken: string | undefined = Cookies.get('access_token');

    if (!accessToken) {
        localStorage.clear();
        return <Navigate to={'/'}/>
    }

    // Render the children when the token is present
    return <>{children}</>;
}

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/"
                       element={<SpotifyAuth client_id={client_id} redirect_uri={redirect_uri} scopes={scopes}/>}/>
                <Route path="/" element={<Redirect/>}/>
                <Route path="/spotify/player"
                       element={
                           <SpotifyPlayerGuard>
                               <SpotifyApp/>
                           </SpotifyPlayerGuard>
                       }/>
            </Routes>
        </Router>
    );
};

export default App;
