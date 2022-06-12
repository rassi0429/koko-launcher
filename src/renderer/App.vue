<script setup lang="ts">
import { ipcRenderer } from './electron'
import { ref } from 'vue'

const launch = () => {
  ipcRenderer.send("message", {
    command: "launch"
  })
}
ipcRenderer.send('message', 'Hello from App.vue!');

let logw = ref("")

const id = ref<HTMLElement | null>(null);

window.electron.on("neosLog", (event: object, data2: string) => {
  logw.value += (data2 + "\n")
  console.log(data2)
  id.value?.scrollTo(0, id.value.scrollHeight)
})
</script>

<template>
  <div>
    <button @click="launch">LAUNCH NEOSVR!!!!</button>
    <h2>Log</h2>
    <div id="log" ref="id">{{logw}}</div>
  </div>
</template>
<style scoped>
#log {
  height: 70vh;
  width: 95vw;
  overflow-y: scroll;
  white-space: break-spaces;
}

button {
  height: 40px;
  width: 400px;
  font-size: 30px;
  border-radius: 30px;
}

</style>
