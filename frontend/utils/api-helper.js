/**
 * API Helper - Device ID Auto-Injection
 * Automatically adds device ID to all API calls
 * Master mode support added (2025-01-07)
 * Auto-sync tickets from backend response (2025-01-07)
 */

/**
 * Fetch wrapper with device ID
 * @param {string} url - API URL
 * @param {object} options - fetch options
 * @returns {Promise<Response>}
 */
async function fetchWithDeviceId(url, options = {}) {
  // Get device ID
  let deviceId;
  if (typeof getOrCreateDeviceId === 'function') {
    deviceId = await getOrCreateDeviceId();
  } else {
    // Fallback: Direct read from localStorage
    deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
  }
  
  // Add device ID to headers
  const headers = {
    ...options.headers,
    'X-Device-Id': deviceId
  };
  
  // Add master code to headers if master mode
  if (typeof isMasterMode === 'function' && isMasterMode()) {
    headers['X-Master-Code'] = 'cooal';
    console.log('Master code added to API call');
  }
  
  // Call fetch
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Sync tickets from backend response
  if (response.ok && typeof syncTicketsFromBackend === 'function') {
    try {
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      
      if (typeof data.remaining_tickets === 'number') {
        syncTicketsFromBackend(data.remaining_tickets);
      }
    } catch (e) {
      // Ignore JSON parse errors (images, etc.)
    }
  }
  
  return response;
}

// Global exposure
window.fetchWithDeviceId = fetchWithDeviceId;

console.log('API helper loaded (with master mode and auto-sync support)');