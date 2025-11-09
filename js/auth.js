let auth0Client = null;

async function initAuth0() {
  const redirectUri = window.location.origin + '/dashboard.html';
  const config = {
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
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function login(extra = {}) {
  const redirectUri = window.location.origin + '/dashboard.html';
  await auth0Client.loginWithRedirect({
    authorizationParams: { redirect_uri, ...extra.authorizationParams }
  });
}

async function logout() {
  const returnTo = window.location.origin + '/index.html';
  await auth0Client.logout({ logoutParams: { returnTo } });
}

async function getUser() {
  return await auth0Client.getUser();
}
