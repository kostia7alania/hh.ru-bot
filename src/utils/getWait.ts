export const getWait = (ms = 100) => new Promise((res) => setTimeout(res, ms))

export const getWaitCancellable = (ms = 100) => {
  let cancel = () => {}

  const promise = new Promise((res, rej) => {
    setTimeout(res, ms)
    cancel = rej
  })

  return {
    promise,
    cancel,
  }
}
