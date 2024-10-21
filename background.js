chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ spaces: [] });
});

chrome.tabs.onRemoved.addListener(() => {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const currentSpace = result.spaces.find((space) => space.isActive);
        if (currentSpace) {
            chrome.tabs.query({}, (tabs) => {
                currentSpace.tabs = tabs.map((tab) => tab.url);
                chrome.storage.sync.set({ spaces: result.spaces });
            });
        }
    });
});
