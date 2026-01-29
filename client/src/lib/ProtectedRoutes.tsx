import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

const ProtectedRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/api/auth/');
                if (data.ok) setIsLoggedIn(true);
                else setIsLoggedIn(false);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);
    if (isLoggedIn === null)
        return (
            <div className={'flex items-center justify-center'}>
                {' '}
                <Spinner />{' '}
            </div>
        );
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoutes;
