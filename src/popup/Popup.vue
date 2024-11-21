<template>
  <main>
    <h3>HH.ru bot</h3>

    <div class="form">
      <!-- <label>
        URL поиска вакансий
        <input
          v-model="options.vacancySearchUrl"
          placeholder="https://lipetsk.hh.ru/search/vacancy"
        />
      </label> -->
      <label>
        cover letter
        <textarea
          rows="4"
          v-model="options.coverLetterText"
          placeholder="Добрый день! Рассмотрите, пожалуйста!"
        />
      </label>
      <button :disabled="!isValid" class="start-button" @click="runTasks">Go</button>
    </div>

    <a :href="sourceLink" target="_blank"> sources </a>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from 'vue'
import { ERequest } from '../types'
import { sourceLink } from '../config'
import { Options } from '../contentScript/options'


const getOptionsDefault = () => ({
  coverLetterText: '',
  vacancySearchUrl: '',
})
const options = ref<Options>(getOptionsDefault())

const count = ref(0)

const runTasks = () => {
  chrome.runtime.sendMessage({ type: ERequest.runTasks, options: options.value })
}

onMounted(async () => {
  options.value =
    (await chrome.storage.sync.get([ERequest.OPTIONS]))[ERequest.OPTIONS] ?? getOptionsDefault()

  watch(
    options,
    (newValue) => {
      chrome.storage.sync.set({ [ERequest.OPTIONS]: newValue })
    },
    { deep: true },
  )

  count.value = (await chrome.storage.sync.get([ERequest.count]))[ERequest.count] ?? 0

  watch(count, (newValue) => {
    chrome.storage.sync.set({ [ERequest.count]: newValue })

    chrome.runtime.sendMessage({ type: ERequest.count, value: newValue })
  })
})

const isValid = computed(() => {
  if (!options.value.vacancySearchUrl) return
  const { host, pathname } = new URL(options.value.vacancySearchUrl)
  return host?.endsWith('hh.ru') && pathname === '/search/vacancy'
})
</script>

<style>
:root {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;

  color-scheme: light dark;
  background-color: #242424;
}

@media (prefers-color-scheme: light) {
  :root {
    background-color: #fafafa;
  }

  a:hover {
    color: #42b983;
  }
}

body {
  min-width: 20rem;
  color-scheme: light dark;
}

main {
  text-align: center;
  padding: 1em;
  margin: 0 auto;
}

h3 {
  color: #42b983;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 200;
  line-height: 1.2rem;
  margin: 2rem auto;
}

.form {
  display: flex;
  flex-direction: column;
  margin: 2rem;
  gap: 8px;

  > label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 1.1rem;
  }
  input,
  textarea {
    max-width: 100%;
    min-width: 100%;
  }
}

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;

  &:hover {
    color: #42b983;
  }
}

.start-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  width: 100%;
  margin: 0 a;
  &:not(:disabled) {
    border: 1px solid #42b983;
    color: #42b983;
  }
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
