<template>
  <div style="margin-bottom: 10px">淹没分析</div>
  <div style="margin-bottom: 20px">
    <div v-show="!showResult">
      <el-button size="small" icon="edit-pen" @click="btnDraw">绘制分析区域</el-button>
      <el-button size="small" @click="begin">开始</el-button>
    </div>

    <div style="margin-bottom: 8px; line-height: 30px" v-show="showResult">
      <el-row>
        <el-col :span="6">高度</el-col>
        <el-col :span="18">
          <el-slider v-model="params.height" :min="params.minHeight" :max="params.maxHeight" @input="onChangeHeight"></el-slider>
        </el-col>
      </el-row>
      <el-button size="small">暂停</el-button>
      <el-button size="small" @click="clearDraw">结束</el-button>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import { ElMessage, ElLoading } from 'element-plus'

const $vc = useVueCesium()

const params = reactive({
  minHeight: 0,
  maxHeight: 0,
  speed: 5,
  height: 0,
})

const showResult = ref(false)

let floodByGraphic
let drawPotions

onMounted(async () => {
  await $vc.creatingPromise
  initFloodAnalysisInstance()
})

onUnmounted(clearDraw)

function initFloodAnalysisInstance() {
  // 基于polygon矢量面抬高模拟，只支持单个区域
  floodByGraphic = new mars3d.thing.FloodByGraphic({
    // perPositionHeight: true, // 是否每个分析点高度都不一样
    style: {
      color: '#007be6',
      opacity: 0.5,
      outline: false,
    },
  })
  $map.addThing(floodByGraphic)

  floodByGraphic.on(mars3d.EventType.change, function (e) {
    const height = e.height
    params.height = height
  })
}

function btnDraw(callback) {
  clearDraw()
  $map.graphicLayer.startDraw({
    type: 'polygon',
    style: {
      color: '#007be6',
      opacity: 0.5,
      outline: false,
    },
    success: function (graphic) {
      const loading = ElLoading.service({
        lock: true,
        text: '正在计算',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      const positions = graphic.positionsShow

      drawPotions = positions

      if (floodByGraphic.options.perPositionHeight) {
        params.minHeight = Math.ceil(-100)
        params.maxHeight = Math.ceil(100)
        loading.close()
      } else {
        // 求最大、最小高度值
        mars3d.PolyUtil.getHeightRange(positions, $map.scene).then((result) => {
          loading.close()
          params.minHeight = Math.ceil(result.minHeight)
          params.maxHeight = Math.ceil(result.maxHeight)
        })
      }
    },
  })
}

function begin(callback) {
  if (!drawPotions) {
    ElMessage.warning('请先绘制分析区域！')
    return
  }

  showResult.value = true

  $map.graphicLayer.clear()

  floodByGraphic.setOptions({
    positions: drawPotions,
    minHeight: Number(params.minHeight),
    maxHeight: Number(params.maxHeight),
    speed: Number(params.speed),
  })
  floodByGraphic.start()

  // callback()
}

function clearDraw() {
  drawPotions = null
  $map.graphicLayer.clear()
  showResult.value = false

  if (floodByGraphic) {
    floodByGraphic.clear()
  }
}

function onChangeHeight(height) {
  floodByGraphic.height = height
}
</script>
