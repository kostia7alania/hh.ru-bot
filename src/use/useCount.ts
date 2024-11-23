import { ERequest } from '../types'
import { useSyncModel } from './useSyncModel'

export const useCount = () => {
  const { model: count, setModel, reset } = useSyncModel(ERequest.COUNT, 0)

  const increment = () => setModel((count.value += 1))
  const decrement = () => setModel((count.value -= 1))

  return {
    count,
    increment,
    decrement,
    reset,
  }
}
