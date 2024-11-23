export const selectors = {
  vacancyCard: "[class^='vacancy-card--']",
  itemTitle: "[data-qa='serp-item__title']",
  responseButton: "[data-qa='vacancy-serp__vacancy_response']",

  otherCountryActionButton: '.bloko-modal-footer .bloko-button_kind-success',
  coverLetterInputRequired: '[data-qa=vacancy-response-popup-form-letter-input]',

  coverLetterInput: '[data-qa=textarea-native-wrapper] textarea',
  coverLetterActivator: '[data-qa=vacancy-response-letter-toggle-text]',
  coverLetterSubmit: '[data-qa=vacancy-response-letter-submit]',

  vacancyRespondedSuccess: '[data-qa=vacancy-serp__vacancy_responded]',

  ifSeveralResumesModalActionButton: '.bloko-modal-footer .bloko-button_kind-primary', // TODO уточнить

  blackListMenuShow: '[data-qa=vacancy__blacklist-show-add]',
  blackListCurrentVacancy: '[data-qa=vacancy__blacklist-menu-add-vacancy]',

  errorText: '.vacancy-response-popup-error',
  errorModalCloseButton: '[data-qa=vacancy-response-popup-close-button]',

  pagerNext: '[data-qa="pager-next"]',
}

export const tokens = {
  responseButton: ['Respond', 'Откликнуться'],
}
