import { ERequest } from '../types'
import { useLogging } from '../use/useLogging'

const eventsToPass = [
  ERequest.RUN_TASKS,
  ERequest.STOP_TASKS,
  ERequest.IS_IN_PROGRESS,
  ERequest.COUNT,
]

export const onMessage = () => {
  const { logging } = useLogging()
  chrome.runtime.onMessage.addListener((request) => {
    if (!eventsToPass.includes(request.type)) return

    logging('back', request)

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: request.type, options: request.options },
        (_response) => {
          logging('-RUN_TASKS-')
        },
      )
    })
  })
}
