<template>
  <div class="analysis-panel wrap">
    <div class="title">
      <el-icon>
        <Grid />
      </el-icon>
      <div>三维模拟</div>
    </div>
    <div class="content">
      <el-form label-position="top">
        <el-form-item label="图层列表">
          <div class="layer-item">
            <el-checkbox v-model="photo">倾斜摄影1</el-checkbox>
          </div>
          <div class="layer-item">
            <el-checkbox v-model="photo">倾斜摄影2</el-checkbox>
          </div>
          <div class="layer-item">
            <el-checkbox v-model="photo">倾斜摄影3</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="single">单体建筑</el-checkbox>
          </div>
        </el-form-item>
        <!-- 
        <el-form-item label="经度">
          <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="positionModify"></el-slider>
        </el-form-item> -->

        <div class="slider-wrap">
          <span class="slider-name">经度：</span>
          <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="positionModify"></el-slider>
          <span class="slider-name">纬度：</span>
          <el-slider v-model="latitude" :step="0.01" :min="24" :max="30" @change="positionModify"></el-slider>
          <span class="slider-name">高度：</span>
          <el-slider v-model="height" :step="1" :min="0" :max="500" @change="positionModify"></el-slider>
        </div>
        <el-form-item label="淹没分析">
          <el-button size="small" @click="start">开始</el-button>
          <el-button size="small">暂停</el-button>
          <el-button size="small">结束</el-button>
        </el-form-item>

        <el-form-item label="卷帘对比">
          <el-switch v-model="contrastDisplay"></el-switch>
        </el-form-item>
      </el-form>
    </div>

    <vc-primitive-tileset url="http://159.75.121.194/xingyi/tileset.json" @readyPromise="onTilesetReady" v-if="photo && active"></vc-primitive-tileset>

    <contrast-plane v-if="contrastDisplay" />

    <!-- <vc-analysis-flood ref="flood" :min-height="-1" :max-height="4000" :speed="10" :polygon-hierarchy="polygonHierarchy"></vc-analysis-flood> -->
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'

defineProps({ active: Boolean })

const flood = ref()

const $vc = useVueCesium()

const photo = ref(false)
const single = ref(false)
const longitude = ref()
const latitude = ref()
const height = ref()

const contrastDisplay = ref(false)

const polygonHierarchy = ref([])

let curTileset, originLon, originLat

function onTilesetReady(tileset, viewer) {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  curTileset = tileset

  longitude.value = originLon = Cesium.Math.toDegrees(cartographic.longitude)
  latitude.value = originLat = Cesium.Math.toDegrees(cartographic.latitude)
  height.value = 0
  polygonHierarchy.value = [
    [longitude.value - 1, latitude.value - 1],
    [longitude.value + 1, latitude.value - 1],
    [longitude.value + 1, latitude.value + 1],
    [longitude.value - 1, latitude.value + 1],
  ]

  positionModify()
}

function positionModify() {
  const surface = Cesium.Cartesian3.fromDegrees(
    originLon,
    originLat,
    // cartographic.height
    0,
  )

  const offset = Cesium.Cartesian3.fromDegrees(longitude.value, latitude.value, height.value - 24)
  const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())

  curTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)

  const destination = new Cesium.Cartesian3.fromDegrees(longitude.value, latitude.value, 1000)

  $map.flyToPoint(destination, {
    radius: 1500, //距离目标点的距离
    pitch: -30,
    duration: 4,
    complete: (e) => {
      //飞行完成回调方法
    },
  })
}

function start() {
  flood.value.start()
}
</script>

<style>
.el-slider__button {
  height: 15px !important;
  width: 15px !important;
}
</style>

<style lang="scss" scoped>
.wrap {
  left: 250px;
  top: 80px;
  width: 200px;
  .title {
    margin-bottom: 10px;
  }
  .layer-item {
    width: 100%;
  }
}
</style>
