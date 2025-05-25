import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignOut() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token'); //remove token from localStorage
        navigate('/'); //redirect to login page
    };

    // check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            navigate('/signIn'); 
        }
    }, [navigate]);

    return (
        <>
            <button onClick={handleSignOut}>Sign Out</button>
        </>
    );
}

export default SignOut;