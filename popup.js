let currentSelection = 0
const NUM_SPACES = 9

// 初始化并显示所有 space
document.addEventListener('DOMContentLoaded', () => {
    displaySpaces()
})

// 显示所有space
function displaySpaces() {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const spacesList = document.getElementById('spacesList')
        spacesList.innerHTML = ''

        for (let i = 1; i <= NUM_SPACES; i++) {
            const space = result.spaces[i - 1] || { index: `${i}.`, name: `Space ${i}`, tabs: [] }
            const spaceElement = document.createElement('div')
            spaceElement.classList.add('space')

            const spaceIndex = document.createElement('h3')
            spaceIndex.textContent = `${i}. `

            const spaceName = document.createElement('input')
            spaceName.type = 'text'
            spaceName.value = space.name
            spaceName.style.flex = '1'

            const saveButton = document.createElement('button')
            saveButton.textContent = 'Save'
            saveButton.addEventListener('click', () => saveSpace(i, spaceName.value))

            const goButton = document.createElement('button')
            goButton.textContent = 'Go'
            goButton.addEventListener('click', () => switchSpace(i))

            spaceElement.appendChild(spaceIndex)
            spaceElement.appendChild(spaceName)
            spaceElement.appendChild(saveButton)
            spaceElement.appendChild(goButton)

            spacesList.appendChild(spaceElement)
        }

        highlightCurrentSelection()
    })
}

function saveSpace(index, name) {
    chrome.tabs.query({}, (tabs) => {
        const tabUrls = tabs.map(tab => tab.url)
        chrome.storage.sync.get({ spaces: [] }, (result) => {
            const spaces = result.spaces
            spaces[index - 1] = { name, tabs: tabUrls }
            chrome.storage.sync.set({ spaces }, () => {
                console.log(`Space ${index} saved!`)
            })
        })
    })
}

function switchSpace(index) {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const space = result.spaces[index - 1]
        if (space && space.tabs.length > 0) {
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => chrome.tabs.remove(tab.id))
                space.tabs.forEach(tabUrl => chrome.tabs.create({ url: tabUrl }))
            })
        } else {
            chrome.tabs.create({ url: 'chrome://newtab' })
        }
    })
}

// 高亮显示当前选中的 space
function highlightCurrentSelection() {
    const spacesList = document.querySelectorAll('.space')
    spacesList.forEach((space, index) => {
        if (index === currentSelection) {
            space.style.backgroundColor = 'gray'
        } else {
            space.style.backgroundColor = 'black'
        }
    })
}

// 移动游标选择
function moveSelection(direction) {
    if (direction === 'up') {
        currentSelection = (currentSelection - 1 + NUM_SPACES) % NUM_SPACES
    } else if (direction === 'down') {
        currentSelection = (currentSelection + 1) % NUM_SPACES
    }
    highlightCurrentSelection()
}

// 切换到当前选中的 space
function switchToSelectedSpace() {
    chrome.storage.sync.get({ spaces: [] }, (result) => {
        const space = result.spaces[currentSelection]
        if (space && space.tabs.length > 0) {
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => chrome.tabs.remove(tab.id))
                space.tabs.forEach(tabUrl => chrome.tabs.create({ url: tabUrl }))
            })
        } else {
            chrome.tabs.create({ url: 'chrome://newtab' })
        }
    })
}

document.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey) {
        if (event.key === 'ArrowUp') {
            moveSelection('up')
        } else if (event.key === 'ArrowDown') {
            moveSelection('down')
        }
    }
})

document.addEventListener('keyup', (event) => {
    if (!event.altKey && !event.shiftKey) {
        switchToSelectedSpace() // 松开Shift+Alt时打开当前选中的space
    }
})
