<template>
  <div class="stats-chart">
    <h3 class="chart-title">本周任务完成趋势</h3>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
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
  const maxValue = Math.max(
    ...weekData.map(d => d.tasks),
    ...weekData.map(d => d.pomodoros),
    1
  )
  const yAxisMax = Math.ceil(maxValue * 1.2)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 13
      },
      padding: [12, 16],
      confine: true,
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px;'
    },
    legend: {
      data: ['完成任务', '番茄钟'],
      bottom: 0,
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
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
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yAxisMax,
      interval: 1,
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 11,
        formatter: (value) => {
          return Number.isInteger(value) ? value : ''
        }
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
          color: '#667eea',
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: '30%',
        emphasis: {
          itemStyle: {
            color: '#5568d3'
          }
        }
      },
      {
        name: '番茄钟',
        type: 'bar',
        data: weekData.map(d => d.pomodoros),
        itemStyle: {
          color: '#10b981',
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: '30%',
        emphasis: {
          itemStyle: {
            color: '#059669'
          }
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

onMounted(() => {
  store.loadFromStorage()
  initChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
  chartInstance?.dispose()
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
