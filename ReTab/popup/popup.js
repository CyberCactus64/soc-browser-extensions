const newTitleInput = document.getElementById('newTitle');
const rememberCheckbox = document.getElementById('remember');
const renameBtn = document.getElementById('renameBtn');
const resetBtn = document.getElementById('resetBtn');

let originalTitle = '';
let baseUrl = '';

function getBaseUrl(url) {
	const urlObj = new URL(url);
	return urlObj.origin;
}

async function getStoredTitle(base) {
	const result = await chrome.storage.local.get(base);
	return result[base] || null;
}

async function saveTitle(base, title) {
	const item = {};
	item[base] = title;
	await chrome.storage.local.set(item);
}

async function removeStoredTitle(base) {
	await chrome.storage.local.remove(base);
}

async function setTabTitle(title) {
	const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
	if (!tab) return;

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: (newTitle) => { document.title = newTitle; },
		args: [title]
	});
}

async function initialize() {
	const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
	if (!tab) return;

	baseUrl = getBaseUrl(tab.url);

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: () => document.title
	}, async (injectionResults) => {
		if (chrome.runtime.lastError || !injectionResults || !injectionResults[0]) return;
		originalTitle = injectionResults[0].result;

		const storedTitle = await getStoredTitle(baseUrl);
		if (storedTitle) {
			newTitleInput.value = storedTitle;
			rememberCheckbox.checked = true;
			setTabTitle(storedTitle);
		} else {
			newTitleInput.value = '';
			rememberCheckbox.checked = false;
			setTabTitle(originalTitle);
		}
	});
}

rememberCheckbox.addEventListener('change', async () => {
	if (!rememberCheckbox.checked) {
		await removeStoredTitle(baseUrl);
	} else {
		const newTitle = newTitleInput.value.trim();
		if (newTitle) {
			await saveTitle(baseUrl, newTitle);
		}
	}
});

renameBtn.addEventListener('click', async () => {
	const newTitle = newTitleInput.value.trim();
	if (!newTitle) return;

	setTabTitle(newTitle);

	if (rememberCheckbox.checked) {
		await saveTitle(baseUrl, newTitle);
	}
});

resetBtn.addEventListener('click', async () => {
	newTitleInput.value = '';
	setTabTitle(originalTitle);
	await removeStoredTitle(baseUrl);
	rememberCheckbox.checked = false;
});

initialize();