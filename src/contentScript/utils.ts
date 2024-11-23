import { useCount } from '../use/useCount'
import { useLogging } from '../use/useLogging'
import { getWaitCancellable, triggerInputChange } from '../utils'
import { selectors, tokens } from './config'
import { ReportTypes, Options } from './types'

const report: Record<ReportTypes, any[]> = {
  error: [],
  withCoverLetter: [],
  alreadyResponded: [],
  addedToBlackList: [],
  alreadyAddedToBlackList: [],
}

const addReport = (reportItem: object, type: ReportTypes) => {
  report[type].push(reportItem)
}

const log = (...args: any) => useLogging().logging(...args)

let options: Options = {
  coverLetterText: '',
  isRequiredCoverLetter: false,
}

const prevLoc = `${window.location.href}#from-go-back`

navigation.addEventListener('navigate', (e) => {
  // TODO: think about preventing leave the page
  console.error('GO BACK', e.destination.url)
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  // history.back()
  window.location.href = prevLoc
})

let cancelCallback = () => {}

const getWait = (ms: number) => {
  const { promise, cancel } = getWaitCancellable(ms)

  cancelCallback = cancel

  return promise
}
const runTasks = async () => {
  const { increment } = useCount()

  const items = document.querySelectorAll(selectors.vacancyCard)
  for (const [index, item] of items.entries()) {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' })
    item.style.boxShadow = '0 0 5px red'

    const { innerText: jobTitle, href: jobHref } = item.querySelector(selectors.itemTitle) ?? {}

    const target = item.querySelector(selectors.responseButton)

    if (tokens.responseButton.includes(target?.innerText)) {
      log(index, 'RESPOND', item)

      target.click()
      await getWait(2000)

      // Вы откликаетесь на вакансию в другой стране
      document.querySelector(selectors.otherCountryActionButton)?.click()

      const coverLetterRequired = document.querySelector(selectors.coverLetterInputRequired)

      if (coverLetterRequired) {
        triggerInputChange(coverLetterRequired, options.coverLetterText)

        addReport({ title: jobTitle, href: jobHref }, 'withCoverLetter')
      } else {
        // если cover-letter не обязателен
        if (options.isRequiredCoverLetter) {
          item.querySelector(selectors.coverLetterActivator)?.click()

          await getWait(400)

          const coverLetter = document.querySelector(selectors.coverLetterInput)

          if (coverLetter) {
            triggerInputChange(coverLetter, options.coverLetterText)
            item.querySelector(selectors.coverLetterSubmit)?.click()
            await getWait(400)

            addReport({ title: jobTitle, href: jobHref }, 'withCoverLetter')
          }
        }
      }

      document.querySelector(selectors.ifSeveralResumesModalActionButton)?.click() // TODO уточнить

      await getWait(1111)

      const { innerText: error } = document.querySelector(selectors.errorText) ?? {}
      if (error) {
        addReport({ title: jobTitle, href: jobHref, error }, 'error')
        document.querySelector(selectors.errorModalCloseButton)?.click() // close modal
        continue
      }
    } else {
      addReport({ title: jobTitle, href: jobHref }, 'alreadyResponded')
      log(index, 'already RESPONDED', item)
    }

    await getWait(100)

    const blacklist = item.querySelector(selectors.blackListMenuShow)

    if (blacklist) {
      blacklist.click()
      await getWait(100)
      document.querySelector(selectors.blackListCurrentVacancy)?.click()

      addReport({ title: jobTitle, href: jobHref }, 'addedToBlackList')
      log(index, 'TO BLACK LIST', item)
    } else {
      addReport({ title: jobTitle, href: jobHref }, 'alreadyAddedToBlackList')
      log(index, 'already blacklisted', item)
    }

    await getWait(1000)
    item.style.boxShadow = ''

    const isSuccess = item.querySelector(selectors.vacancyRespondedSuccess)

    if (isSuccess) {
      increment()
    }
  }

  const next = document.querySelector(selectors.pagerNext)

  if (next) {
    next.click()
    await getWait(4000)
    log('GO TO NEXT PAGE')
    return runTasks()
  }
}

export const getRunTasks = (optionsNew: Options) => {
  log('[getRunTasks]', optionsNew)

  options = optionsNew

  return {
    promise: runTasks(),
    stop: () => cancelCallback(),
  }
}
