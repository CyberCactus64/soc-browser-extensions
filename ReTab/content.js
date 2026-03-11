(async () => {
	const baseUrl = location.origin;
	const stored = await new Promise(resolve =>
		chrome.storage.local.get(baseUrl, res => resolve(res[baseUrl]))
	);
	if (stored) {
		document.title = stored;
	}
})();