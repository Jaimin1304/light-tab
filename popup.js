document.getElementById('addSpace').addEventListener('click', () => {
    const spaceName = prompt('Enter Space Name:');
    if (spaceName) {
        chrome.storage.sync.get({ spaces: [] }, (result) => {
            const spaces = result.spaces;
            spaces.push({ name: spaceName, tabs: [] });
            chrome.storage.sync.set({ spaces }, () => {
                displaySpaces();
            });
        });
    }
});

function displaySpaces() {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const spacesList = document.getElementById('spacesList');
        spacesList.innerHTML = '';
        result.spaces.forEach((space, index) => {
            const spaceElement = document.createElement('div');
            spaceElement.textContent = space.name;
            spaceElement.addEventListener('click', () => switchSpace(index));
            spacesList.appendChild(spaceElement);
        });
    });
}

function switchSpace(index) {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const space = result.spaces[index];
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => chrome.tabs.remove(tab.id));
            space.tabs.forEach((tabUrl) => chrome.tabs.create({ url: tabUrl }));
        });
    });
}

displaySpaces();
