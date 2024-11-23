import { ERequest } from '../types'
import { useLogging } from '../use/useLogging'

import { getRunTasks } from './utils'

let stop = () => {
  //
}
export const onMessage = () => {
  const { logging } = useLogging()

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === ERequest.RUN_TASKS) {
    logging('action', message?.action)

      Object.freeze(document.location)

      try {
        const tasks = getRunTasks(message.options)
        stop = tasks.stop ?? stop

        await tasks.promise
      } catch {
        logging('---error--')
      }

      // sendResponse('--->', message)
    }

    if (message.action === ERequest.STOP_TASKS) {
      logging('action ---STOP---', message?.action)
      stop()
    }

    return true
  })
}
