chrome.commands.onCommand.addListener((command) => {
  if (command === "move_up") {
    chrome.runtime.sendMessage({ action: "move_up" })
  } else if (command === "move_down") {
    chrome.runtime.sendMessage({ action: "move_down" })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "move_up") {
    moveSelection("up")
  } else if (message.action === "move_down") {
    moveSelection("down")
  } else if (message.action === "open_selected_space") {
    switchToSelectedSpace()
  }
})
