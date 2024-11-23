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

      <label class="items-col">
        <input v-model="options.isRequiredCoverLetter" type="checkbox" />
        Всегда прикреплять сопроводительное
      </label>

      <label class="items-row">
        Сопроводительное
        <textarea
          rows="4"
          v-model="options.coverLetterText"
          placeholder="Добрый день! Рассмотрите, пожалуйста!"
        />
      </label>

      <button v-if="!isProgress" :disabled="!isValid" class="start-button" @click="runTasks">
        Go
      </button>
      <button v-else class="start-button" @click="stopTasks">Stop</button>

      <div class="count-wrapper">
        <div>Sent: {{ count }}</div>
        <div class="count-buttons">
          <button @click="increment">+</button>
          <button @click="decrement">-</button>
          <button @click="resetCount">Reset</button>
        </div>
      </div>
    </div>

    <a :href="sourceLink" target="_blank"> sources </a>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from 'vue'
import { ERequest } from '../types'
import { sourceLink } from '../config'

import { isVacancyUrl, useCurrentTab } from '../utils'
import { useIsProgress } from '../use/useIsProgress'
import { useCount } from '../use/useCount'
import { Options } from '../contentScript/types'

const getOptionsDefault = () => ({
  coverLetterText: '',
  vacancySearchUrl: '',
  isRequiredCoverLetter: false,
})

const options = ref<Options>(getOptionsDefault())

const { count, reset: resetCount, increment, decrement } = useCount()

const { currentTabUrl } = useCurrentTab()

const isValid = computed(() => {
  return isVacancyUrl(currentTabUrl.value)
})

const { isProgress, start, stop } = useIsProgress()

const runTasks = () => {
  chrome.runtime.sendMessage({ type: ERequest.RUN_TASKS, options: options.value })
  start()
  resetCount()
}

const stopTasks = () => {
  chrome.runtime.sendMessage({ type: ERequest.STOP_TASKS })
  stop()
}

const init = async () => {
  options.value =
    (await chrome.storage.sync.get([ERequest.OPTIONS]))[ERequest.OPTIONS] ?? getOptionsDefault()

  watch(
    options,
    (newValue) => {
      chrome.storage.sync.set({ [ERequest.OPTIONS]: newValue })
    },
    { deep: true },
  )
}

init()
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

body {
  min-width: 20rem;
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

  .items-col {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.6rem;
    input {
      min-width: 10px;
    }
  }

  .items-row {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 4px;
    font-size: 0.6rem;
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
.count-wrapper {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: space-between;
  
  .count-buttons {
    display: flex;
    gap: 4px;
    align-items: center;
  }
}
</style>
