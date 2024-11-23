import { ERequest } from '../types'
import { useSyncModel } from './useSyncModel'

export const useIsProgress = () => {
  const { model: isProgress, setModel } = useSyncModel(ERequest.IS_IN_PROGRESS, false)


  const start = () => setModel(true)
  const stop = () => setModel(false)

  return {
    isProgress,
    stop,
    start,
  }
}
