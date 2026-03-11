chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "searchAbuseIPDB",
		title: "Search selected domain or ip address on AbuseIPDB",
		contexts: ["selection"]
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "searchAbuseIPDB" && info.selectionText) {
		const query = encodeURIComponent(info.selectionText.trim());
		const url = `https://www.abuseipdb.com/check/${query}`;
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
					const url = `https://www.abuseipdb.com/check/${encodeURIComponent(selectedText)}`;
					chrome.tabs.create({ url });
				} else {
					alert("Please select a domain or ip address text on the page before clicking the extension.");
				}
			}
		}
	);
});