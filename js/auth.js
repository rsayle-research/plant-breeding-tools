// Define auth0Client globally
let auth0Client = null;

// --- CRITICAL FIX: Robust Path Determination for GitHub Pages ---
function getRedirectUriPath(pageName) {
    // 1. Get the path, e.g., /plant-breeding-tools/index.html
    const pathname = window.location.pathname;
    
    // 2. Safely extract the root directory.
    // If running at the root, pathSegments[1] will be the file name.
    // If running in a subdirectory (like GitHub Pages), pathSegments[1] will be the repo name.
    const pathSegments = pathname.split('/').filter(s => s.length > 0);
    
    if (pathSegments.length >= 1 && pathSegments[0] !== pageName) {
        // Assume the first segment is the subdirectory (e.g., 'plant-breeding-tools')
        const subdirectory = pathSegments[0];
        return '/' + subdirectory + '/' + pageName;
    }
    
    // Fallback for root hosting or unusual environments
    return '/' + pageName;
}
// --------------------------------------------------------------------

async function initAuth0() {
  // Use the new, corrected function to get the full path
  const redirectUri = window.location.origin + getRedirectUriPath('dashboard.html');
  
  // Log the generated URI for debugging confirmation
  console.log("Auth0 Initialization: Redirect URI is set to:", redirectUri);
  
  const config = {
    // NOTE: If this domain or clientId changed, update them here:
    domain: 'dev-hctfmbntodg4ekwd.us.auth0.com',
    clientId: 'v6yhw1p536sLDxH95gaT8DWd9KJ4nj6k',
    authorizationParams: { redirect_uri: redirectUri },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  };
  auth0Client = await auth0.createAuth0Client(config);
  await handleRedirectCallback();
}

async function handleRedirectCallback() {
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    // This removes the code/state query parameters from the URL history
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function login(extra = {}) {
  // CRITICAL: We MUST use the same URI calculated in initAuth0.
  // The SDK generally defaults to the URI set in the createAuth0Client call, 
  // but explicitly setting it again ensures consistency.
  const redirectUri = window.location.origin + getRedirectUriPath('dashboard.html');
  
  await auth0Client.loginWithRedirect({
    // FIX APPLIED HERE: We explicitly map the variable 'redirectUri' 
    // to the parameter 'redirect_uri'.
    authorizationParams: { redirect_uri: redirectUri, ...extra.authorizationParams }
  });
}

async function logout() {
  // Ensure returnTo also uses the correct path to the index page
  const returnTo = window.location.origin + getRedirectUriPath('index.html');
  await auth0Client.logout({ logoutParams: { returnTo } });
}

async function getUser() {
  return await auth0Client.getUser();
}
