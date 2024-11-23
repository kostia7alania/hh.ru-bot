import { onMessage } from './onMessage'

import { createApp } from 'vue'

import App from './ContentScript.vue'
const id = 'hh-ru-content-script-app'

const div = document.createElement('div')

div.id = id

document.body.append(div)

createApp(App).mount(`#${id}`)

console.info('[contentScript] is running')

onMessage()
