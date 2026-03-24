<template>
  <div class="stats-chart">
    <h3 class="chart-title">本周任务完成趋势</h3>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()
const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return
  
  const weekData = store.weekStats
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      data: ['完成任务', '番茄钟'],
      bottom: 0,
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weekData.map(d => d.date),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: '完成任务',
        type: 'bar',
        data: weekData.map(d => d.tasks),
        itemStyle: {
          color: '#4A90D9',
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '30%'
      },
      {
        name: '番茄钟',
        type: 'bar',
        data: weekData.map(d => d.pomodoros),
        itemStyle: {
          color: '#52C41A',
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '30%'
      }
    ]
  }
  
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

watch(() => store.weekStats, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.stats-chart {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
}

.chart-container {
  width: 100%;
  height: 220px;
}
</style>
