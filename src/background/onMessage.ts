import { ERequest } from '../types'

export const onMessage = () => {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === ERequest.runTasks) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: request.type, options: request.options },
          (_response) => {
            console.log('back')
          },
        )
      })
    }
  })
}
