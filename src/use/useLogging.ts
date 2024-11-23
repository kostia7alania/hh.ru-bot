import { ERequest } from '../types'
import { useSyncModel } from './useSyncModel'

export const useLogging = () => {
  const { model } = useSyncModel(ERequest.IS_DEBUG, true)

  const logging = (...opts: any[]) => {
    if (!model.value) return
    console.log(...opts)
  }

  return {
    logging,
  }
}
