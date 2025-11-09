// Define auth0Client globally
let auth0Client = null;

// --- CRITICAL FIX: Define the base path correctly ---
// This function determines the correct path regardless of where the file is hosted
function getRedirectUriPath(pageName) {
    // window.location.pathname will be something like: /plant-breeding-tools/index.html
    const pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);

    // If the path has more than one segment, assume the last segment is the file name
    // and the second-to-last segment is the subdirectory (e.g., 'plant-breeding-tools').
    if (pathSegments.length > 1) {
        // Construct the full path: /subdirectory/pageName
        const subdirectory = pathSegments[0];
        return '/' + subdirectory + '/' + pageName;
    }
    
    // If hosted at the root (e.g., mysite.com/index.html), use just /pageName
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
    authorizationParams: { redirect_uri, ...extra.authorizationParams }
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
