import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/afd1/check-auth`, {
          credentials: 'include',
        });

        if (!res.ok) {
          navigate('/'); // redirect to login
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/'); // redirect on error
      }
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(interval);
  }, []);
}
