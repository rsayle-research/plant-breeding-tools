// Define auth0Client globally
let auth0Client = null;

// --- CRITICAL FIX: Robust Path Determination for All Environments ---
function getRedirectUriPath(pageName) {
    // 1. Get the current URL path (e.g., /my-repo/dashboard.html)
    const pathname = window.location.pathname;
    
    // 2. Find the index of the last slash (the start of the filename)
    const lastSlashIndex = pathname.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
        // 3. Extract the directory path (e.g., /my-repo/)
        const directoryPath = pathname.substring(0, lastSlashIndex + 1);
        // 4. Return the full path to the desired page (e.g., /my-repo/index.html)
        return directoryPath + pageName;
    }
    
    // Fallback for root hosting (e.g., just /index.html)
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
    const redirectUri = window.location.origin + getRedirectUriPath('dashboard.html');
    
    await auth0Client.loginWithRedirect({
        authorizationParams: { redirect_uri: redirectUri, ...extra.authorizationParams }
    });
}

async function logout() {
    // The returnTo variable is now guaranteed to hold the correct absolute path
    const returnTo = window.location.origin + getRedirectUriPath('index.html');
    await auth0Client.logout({ logoutParams: { returnTo } });
}

async function getUser() {
    return await auth0Client.getUser();
}
