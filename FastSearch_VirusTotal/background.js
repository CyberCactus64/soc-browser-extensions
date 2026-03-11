chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "searchVirusTotal",
		title: "Search selected hash on VirusTotal",
		contexts: ["selection"]
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "searchVirusTotal" && info.selectionText) {
		const query = encodeURIComponent(info.selectionText.trim());
		const url = `https://www.virustotal.com/gui/search/${query}`;
		chrome.tabs.create({ url });
	}
});

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript(
		{
			target: { tabId: tab.id },
			function: () => window.getSelection().toString(),
		},
		(results) => {
			if (results && results[0].result) {
				const selectedText = results[0].result.trim();
				if (selectedText) {
					const url = `https://www.virustotal.com/gui/search/${encodeURIComponent(selectedText)}`;
					chrome.tabs.create({ url });
				} else {
					alert("Please select a SHA256 hash text on the page before clicking the extension.");
				}
			}
		}
	);
});