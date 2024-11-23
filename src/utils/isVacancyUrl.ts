export const isVacancyUrl = (url: string) => {
  if (!url) return
  const { host, pathname } = new URL(url)
  return host?.endsWith('hh.ru') && pathname === '/search/vacancy'
}
