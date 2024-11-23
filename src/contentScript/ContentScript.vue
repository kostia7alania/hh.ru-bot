<template>
  <main v-if="isProgress || count" class="content-script">
    <h2>[hh bot]</h2>
    <div v-if="isProgress">in progress...</div>
    <div>Отправлено: {{ count }}</div>

    <button v-if="isProgress" @click="stopTasks" class="button">Stop</button>
  </main>
</template>

<script setup lang="ts">
import { useIsProgress } from '../use/useIsProgress'
import { useCount } from '../use/useCount'
import { ERequest } from '../types';

const { count } = useCount()

const { isProgress, stop: stopIsProgress } = useIsProgress()

const stopTasks = () => {
  chrome.runtime.sendMessage({ type: ERequest.STOP_TASKS })
  stopIsProgress()
}
</script>

<style scoped lang="scss">
.content-script {
  background-color: #242424;
  color: white;

  padding: 16px;

  position: fixed;
  z-index: 100;

  bottom: 100px;
  right: 10px;
  width: 135px;

  border-radius: 8px;

  h2 {
    margin-bottom: 8px;
    color: wheat;
  }
}

.button {
  color: white;
  width: 100%;
  padding: 4px;
  border-radius: 16px;
}
</style>
