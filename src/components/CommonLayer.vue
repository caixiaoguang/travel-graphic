<template>
  <div class="analysis-panel">
    <div class="title">基础图层</div>
    <div class="content">
      <el-form label-position="top">
        <el-form-item label="底图">
          <el-radio-group v-model="baseMap" @change="changeBaseMap">
            <el-radio label="satellite" style="margin-bottom: 5px">影像图</el-radio>
            <el-radio label="nightMap">暗色地图</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="天气">
          <el-checkbox v-model="rain" @change="handleRain">雨</el-checkbox>
          <el-checkbox v-model="snow" @change="handleSnow">雪</el-checkbox>
        </el-form-item>

        <el-form-item label="矢量数据">
          <el-checkbox v-model="district">行政区划</el-checkbox>
          <el-checkbox v-model="road">道路</el-checkbox>
        </el-form-item>
      </el-form>
    </div>

    <vc-layer-imagery v-if="baseMap === 'satellite'">
      <vc-imagery-provider-tianditu map-style="img_w" token="436ce7e50d27eede2f2929307e6b33c0" ref="provider" />
    </vc-layer-imagery>
    <vc-layer-imagery v-else>
      <vc-imagery-provider-baidu ref="provider" mapStyle="midnight" :projection-transforms="{ from: 'BD09', to: 'WGS84' }" />
    </vc-layer-imagery>

    <Polyline layerName="gzs_polyline" :active="district" />

    <Province v-if="road" />
  </div>
</template>

<script setup>
import { createSnowStage, createRainStage } from '@/utils/weather_glsl.js'
import Polyline from '@/components/Polyline.vue'
import { useVueCesium } from 'vue-cesium'

const $vc = useVueCesium()

const baseMap = ref('nightMap')
const rain = ref(false)
const snow = ref(false)
const district = ref(false)
const road = ref(false)

const ready = ref(false)

let collection, rainSystem, snowSystem

function changeBaseMap() {}

function handleSnow(value) {
  if (value) {
    addWeather('snow')
  } else {
    removeWeather('snow')
  }
}
function handleRain(value) {
  if (value) {
    addWeather('rain')
  } else {
    removeWeather('rain')
  }
}

function addWeather(type) {
  if (!window.Cesium || !window.viewer) {
    snow.value = false
    rain.value = false
    return
  }

  collection = window.viewer.scene.postProcessStages

  if (type === 'rain') {
    rainSystem = createRainStage()
    collection.add(rainSystem)
  } else {
    snowSystem = createSnowStage()
    collection.add(snowSystem)
  }
}
function removeWeather(type) {
  if (type === 'rain') {
    collection.remove(rainSystem)
  } else {
    collection.remove(snowSystem)
  }
}
</script>

<style lang="scss" scoped>
.analysis-panel {
  position: absolute;
  left: 0px;
  top: 70px;
  width: 240px;
}
</style>
