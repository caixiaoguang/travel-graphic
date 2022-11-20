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
    <polyline layerName="gzs_polyline" :active="district" />
  </div>
</template>

<script setup lang="ts">
import { createSnowStage, createRainStage } from '@/utils/weather_glsl.js'
// import Polyline from '@/components/Polyline.vue'

const baseMap = ref('satellite')
const rain = ref(false)
const snow = ref(false)
const district = ref(false)
const road = ref(false)

let collection, rainSystem, snowSystem

function changeBaseMap() {}

function handleSnow(value: string) {
  if (value) {
    addWeather('snow')
  } else {
    removeWeather('snow')
  }
}
function handleRain(value: string) {
  if (value) {
    addWeather('rain')
  } else {
    removeWeather('rain')
  }
}

function addWeather(type: string) {
  if (!window.Cesium || !window.viewer) {
    snow.value = false
    rain.value = false
    return
  }

  collection = viewer.scene.postProcessStages

  if (type === 'rain') {
    rainSystem = createRainStage()
    collection.add(rainSystem)
  } else {
    snowSystem = createSnowStage()
    collection.add(snowSystem)
  }
}
function removeWeather(type: string) {
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
