import { ERequest } from '../types'

import { getRunTasks } from './utils'

export const onMessage = () => {
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === ERequest.runTasks) {
      console.log('action', message?.action)


      Object.freeze(document.location)

      console.log('---- AFTER ------')

      const runTasks = getRunTasks(message.options)
      runTasks()

      // sendResponse('--->', message)
    }

    return true
  })
}
