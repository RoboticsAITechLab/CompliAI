import React, { useEffect, useState } from 'react';

export const AuthDebug: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    // Get auth data from localStorage
    const authData = localStorage.getItem('auth-storage');
    setLocalStorageData(authData || 'No auth-storage found');

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setTokenInfo(parsed);
      } catch (error) {
        setTokenInfo({ error: 'Failed to parse auth data' });
      }
    }
  }, []);

  const testAPICall = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenInfo?.state?.tokens?.accessToken || 'no-token'}`
        },
        body: JSON.stringify({ firstName: 'Test' })
      });

      const result = await response.text();
      alert(`Response: ${response.status}\n${result}`);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Auth Debug Information</h1>
      
      <h2>LocalStorage Data:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {localStorageData}
      </pre>

      <h2>Parsed Token Info:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(tokenInfo, null, 2)}
      </pre>

      <h2>Access Token:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {tokenInfo?.state?.tokens?.accessToken || 'No access token found'}
      </pre>

      <h2>Test API Call:</h2>
      <button onClick={testAPICall} style={{ padding: '10px 20px', margin: '10px 0' }}>
        Test PUT /profile endpoint
      </button>

      <h2>Quick Actions:</h2>
      <button 
        onClick={() => localStorage.clear()} 
        style={{ padding: '10px 20px', margin: '10px', background: 'red', color: 'white' }}
      >
        Clear LocalStorage
      </button>
      
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: '10px 20px', margin: '10px' }}
      >
        Reload Page
      </button>
    </div>
  );
};

export default AuthDebug;