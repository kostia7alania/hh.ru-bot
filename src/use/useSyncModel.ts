import { onMounted, ref } from 'vue'
import { ERequest } from '../types'
import { useLogging } from './useLogging'

// https://stackoverflow.com/questions/19241094/disable-max-write-operations-per-hour-when-developing
// https://developer.chrome.com/docs/extensions/reference/api/storage#sync
const storageType: 'local' | 'sync' = 'local'

export const useSyncModel = <T>(prop: ERequest, defaultValue: T) => {
  const model = ref<T>(defaultValue)

  const init = async () => {
    useLogging().logging('-- [useSyncModel] init--')
    model.value = (await chrome.storage[storageType].get([prop]))[prop] ?? defaultValue
  }

  const setModel = async (newValue: T) => {
    useLogging().logging('-- [useSyncModel] setModel --')

    await chrome.storage[storageType].set({ [prop]: newValue })
    chrome.runtime.sendMessage({ type: prop })
    model.value = newValue
  }

  const reset = () => setModel(defaultValue)

  onMounted(init)

  onMounted(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === prop) {
        init()
      }
    })
  })

  return {
    model,
    setModel,
    reset,
  }
}

