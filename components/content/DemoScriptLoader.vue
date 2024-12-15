<!-- components/content/ScriptLoadingDemo.vue -->
<template>
  <div class="script-loading-demo">
    <div class="section">
      <h2>Load Times Comparison</h2>
      <div class="log-container" ref="logContainer">
        <div v-for="(log, index) in logs" 
             :key="index" 
             :class="['log', log.category]">
          <span class="timestamp">[{{ log.time }}]</span> 
          {{ log.message }}
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Test Controls</h2>
      <button @click="startComparison">Start Comparison</button>
      <button @click="clearLogs">Clear Logs</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const logs = ref([])
const logContainer = ref(null)

// Logging utility
const addLog = (message, category = '') => {
  logs.value.push({
    message,
    time: new Date().toLocaleTimeString(),
    category
  })
  
  // Auto-scroll to bottom
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

// Simulated script loading with delay
const createDelayedScript = (message, delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      addLog(message)
      resolve()
    }, delay)
  })
}

// Loading methods
const loadRegularScript = async () => {
  addLog('Starting regular script load', 'regular')
  await createDelayedScript('Regular script downloaded and executed', 1000)
}

const loadAsyncScript = () => {
  addLog('Starting async script load', 'async')
  setTimeout(async () => {
    await createDelayedScript('Async script downloaded', 800)
    addLog('Async script executed', 'async')
  }, 0)
}

const loadDeferScript = () => {
  addLog('Starting defer script load', 'defer')
  setTimeout(async () => {
    await createDelayedScript('Defer script downloaded', 1200)
    addLog('Defer script executed (after HTML parse)', 'defer')
  }, 0)
}

const loadComponentScript = () => {
  addLog('Vue component mounted, waiting for idle time', 'component')
  
  setTimeout(() => {
    addLog('Script downloaded by Vue component', 'component')
    
    requestIdleCallback(async () => {
      await createDelayedScript('Vue component executed script (during idle time)', 100)
      addLog('Vue component finished processing', 'component')
    })
  }, 1500)
}

// Main control functions
const startComparison = () => {
  clearLogs()
  addLog('Starting simultaneous loading comparison...')
  
  loadRegularScript()
  loadAsyncScript()
  loadDeferScript()
  loadComponentScript()
}

const clearLogs = () => {
  logs.value = []
}
</script>

<style scoped>
.script-loading-demo {
  font-family: system-ui, -apple-system, sans-serif;
}

.log-container {
  font-family: monospace;
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: auto;
}

.log {
  margin: 5px 0;
  padding: 5px;
}

.log.regular { background: #ffebee; }
.log.async { background: #e8f5e9; }
.log.defer { background: #e3f2fd; }
.log.component { background: #fff3e0; }

.timestamp {
  color: #666;
}

.section {
  margin: 20px;
  padding: 20px;
  border: 1px solid #eee;
}

button {
  margin: 5px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #e0e0e0;
}
</style>
