// Debug utility to check auth state
// Open browser console and run: window.debugAuth()

export const debugAuth = () => {
  console.group('🔍 Auth Debug Information');
  
  // Check localStorage
  const authStorage = localStorage.getItem('auth-storage');
  console.log('📦 LocalStorage auth-storage:', authStorage);
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      console.log('📝 Parsed auth data:', parsed);
      
      const tokens = parsed?.state?.tokens;
      console.log('🔑 Tokens:', tokens);
      
      if (tokens?.accessToken) {
        console.log('✅ Access token exists:', tokens.accessToken.substring(0, 50) + '...');
        
        // Test API call
        console.log('🧪 Testing API call...');
        fetch('http://localhost:3001/api/v1/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.accessToken}`
          },
          body: JSON.stringify({ firstName: 'Debug Test' })
        })
        .then(response => {
          console.log('📡 API Response Status:', response.status);
          return response.text();
        })
        .then(text => {
          console.log('📄 API Response Body:', text);
        })
        .catch(error => {
          console.error('❌ API Error:', error);
        });
      } else {
        console.log('❌ No access token found');
      }
    } catch (error) {
      console.error('❌ Failed to parse auth storage:', error);
    }
  } else {
    console.log('❌ No auth-storage found in localStorage');
  }
  
  // Check other auth-related storage
  const rememberMe = localStorage.getItem('auth_remember_me');
  console.log('💾 Remember me preference:', rememberMe);
  
  // Check all localStorage keys
  console.log('🗂️ All localStorage keys:', Object.keys(localStorage));
  
  console.groupEnd();
};

// Make it available globally for debugging
declare global {
  interface Window {
    debugAuth: () => void;
  }
}

window.debugAuth = debugAuth;