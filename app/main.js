// Bootstraps the Kalandria statistics site: renders the current hash route
// and re-renders whenever the hash changes. No network requests are made.

window.addEventListener("hashchange", render);
render();
