<script setup lang="ts">
import { ipcRenderer } from './electron'
import {reactive, ref} from 'vue'
import Button from 'primevue/button';

const launch = () => {
  ipcRenderer.send("message", {
    command: "launch",
    args: {
      ...options
    }
  })
}
// ipcRenderer.send('message', 'Hello from App.vue!');

let log = ref("")
const id = ref<HTMLElement | null>(null);

window.electron.on("neosLog", (event: object, data2: string) => {
  log.value += (data2 + "\n")
  console.log(data2)
  id.value?.scrollTo(0, id.value.scrollHeight)
})

interface Options {
  device: string,
  neosexe: string,
  datadir: string,
  skipTutorial: boolean,
  dontopencloudhome: boolean
}

const options = reactive<Options>({
  device: "Screen",
  neosexe: "C:\\Neos\\app\\Neos.exe",
  datadir: "C:\\Neos\\DataDir",
  skipTutorial: true,
  dontopencloudhome: true
})

const test = ref(null);
</script>

<template lang="pug">
Accordion
  AccordionTab(header="test" )
    Card
      template(#title)
        | Log
        Button.p-button-sm(icon="pi pi-trash")
      template(#content)
        div#log(ref="id") {{log}}
  AccordionTab(header="Settings")
    Calendar.w-full(:inline="true" v-model="test")
div.absolute.bottom-0.pb-2
  Button(label="launch" @click="launch")

<!--  <div>-->
<!--    <button @click="launch">RANTI</button>-->
<!--    <div>-->
<!--      <label for="mode">OPTION</label>-->
<!--      <select id="mode" v-model="options.device">-->
<!--        <option value="Screen">Screen</option>-->
<!--        <option value="SteamVR">SteamVR</option>-->
<!--        <option value="RiftTouch">RiftTouch</option>-->
<!--      </select>-->
<!--    </div>-->
<!--    <div>-->
<!--      <label for="neosexe">exe</label>-->
<!--      <input type="text" id="neosexe" v-model="options.neosexe">-->
<!--    </div>-->
<!--    <div>-->
<!--      <label for="datapath">datadir</label>-->
<!--      <input type="text" id="datapath" v-model="options.datadir">-->
<!--    </div>-->
<!--    <div>-->
<!--      <label for="skiptutorial">skipTutorial</label>-->
<!--      <input type="checkbox" id="skiptutorial" v-model="options.skipTutorial">-->
<!--    </div>-->
<!--    <div>-->
<!--      <label for="dontopencloudhome">dontopencloudhome</label>-->
<!--      <input type="checkbox" id="dontopencloudhome" v-model="options.dontopencloudhome">-->
<!--    </div>-->
<!--    <div>-->
<!--      {{ options }}-->
<!--    </div>-->
<!--    <h2>Log</h2>-->
<!--    <div id="log" ref="id">{{log}}</div>-->
<!--  </div>-->
</template>

<style scoped>
#log {
  height: 70vh;
  width: 95vw;
  overflow-y: scroll;
  white-space: break-spaces;
}
</style>
