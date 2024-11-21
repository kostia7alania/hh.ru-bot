<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ERequest } from '../types'
import { sourceLink } from '../config'

const countSync = ref(0)

onMounted(async () => {
  const result = await chrome.storage.sync.get([ERequest.count])

  countSync.value = result[ERequest.count] ?? 0

  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === ERequest.count) {
      countSync.value = request?.value ?? 0
    }
  })
})
</script>

<template>
  <main>
    <h3>Options Page</h3>

    <h4>Count from Popup: {{ countSync }}</h4>

    <a :href="sourceLink" target="_blank"> sources </a>
  </main>
</template>

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

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;

  &:hover {
    color: #42b983;
  }
}
</style>
