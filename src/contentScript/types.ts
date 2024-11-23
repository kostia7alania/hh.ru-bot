export type ReportTypes =
  | 'error'
  | 'withCoverLetter'
  | 'alreadyResponded'
  | 'addedToBlackList'
  | 'alreadyAddedToBlackList'

export type Options = {
  isRequiredCoverLetter: boolean
  coverLetterText: string
  // vacancySearchUrl?: string
}
