import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthResponse = async () => {
      try {
        // Get user info after OAuth2 login
        const response = await fetch('http://localhost:3001/api/user/oauth2/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get user info');
        }

        const data = await response.json();

        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store additional profile info if available
        if (data.user.picture) {
          localStorage.setItem('userPicture', data.user.picture);
        }

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth2 redirect error:', error);
        navigate('/login');
      }
    };

    handleOAuthResponse();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Logging you in...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;