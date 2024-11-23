import { onMounted, ref } from 'vue'

export const useCurrentTab = () => {
  const currentTabUrl = ref('')

  onMounted(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabsNew) => {
      currentTabUrl.value = tabsNew[0].url ?? ''
    })
  })

  return {
    currentTabUrl,
  }
}
