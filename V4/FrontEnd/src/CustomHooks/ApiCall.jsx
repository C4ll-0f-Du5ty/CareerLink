import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';

const useApiCall = () => {
    const { authTokens, updateToken } = useContext(AuthContext);

    return async (config) => {
        config.headers = {
            ...config.headers,
            'Authorization': `Dusty ${authTokens.access}`,
        };

        try {
            const response = await fetch(config.url, {
                method: config.method,
                headers: config.headers,
                body: config.body,
            });

            if (response.status === 401 && !config.retry) {
                await updateToken();
                console.log("before:  ", config.headers['Authorization'])
                // Update the config with the refreshed access token
                const newAuthTokens = JSON.parse(localStorage.getItem('authTokens'));
                config.headers['Authorization'] = `Dusty ${newAuthTokens.access}`;
                console.log("after:  ", config.headers['Authorization'])
                config.retry = true; // To prevent infinite retry loop
                const retryResponse = await fetch(config.url, {
                    method: config.method,
                    headers: config.headers,
                    body: config.body,
                });

                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }

                return retryResponse;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;

        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    };
};

export default useApiCall;
