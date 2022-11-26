<template>
  <div class="analysis-panel traval-layer">
    <div class="title">
      <el-icon>
        <Grid />
      </el-icon>
      <div>三维模拟</div>
    </div>
    <div class="content">
      <el-form label-position="top">
        <el-form-item label="">
          <el-checkbox v-model="photo">倾斜摄影</el-checkbox>
          <el-checkbox v-model="single">单体建筑</el-checkbox>
        </el-form-item>
        <div class="slider-wrap">
          <span class="slider-name">经度：</span>
          <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="positionModify"></el-slider>
          <span class="slider-name">纬度：</span>
          <el-slider v-model="latitude" :step="0.01" :min="24" :max="30" @change="positionModify"></el-slider>
          <span class="slider-name">高度：</span>
          <el-slider v-model="height" :step="1" :min="0" :max="500" @change="positionModify"></el-slider>
        </div>
      </el-form>
    </div>

    <vc-primitive-tileset url="http://159.75.121.194/xingyi/tileset.json" @readyPromise="onTilesetReady" v-if="photo && active"></vc-primitive-tileset>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'

defineProps({ active: Boolean })

const $vc = useVueCesium()

const photo = ref(false)
const single = ref(false)
const longitude = ref()
const latitude = ref()
const height = ref()

let curTileset, originLon, originLat

function onTilesetReady(tileset, viewer) {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  curTileset = tileset
  longitude.value = originLon = Cesium.Math.toDegrees(cartographic.longitude)
  latitude.value = originLat = Cesium.Math.toDegrees(cartographic.latitude)
  height.value = 0

  positionModify()

  // viewer.zoomTo(tileset)
}

function positionModify() {
  const surface = Cesium.Cartesian3.fromDegrees(
    originLon,
    originLat,
    // cartographic.height
    0,
  )

  const offset = Cesium.Cartesian3.fromDegrees(longitude.value, latitude.value, height.value - 1135)
  const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())

  curTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)

  const destination = new Cesium.Cartesian3.fromDegrees(longitude.value, latitude.value, 100)

  $map.flyToPoint(destination, {
    radius: 500, //距离目标点的距离
    pitch: -30,
    duration: 4,
    complete: (e) => {
      //飞行完成回调方法
    },
  })
}
</script>

<style lang="scss" scoped>
.traval-layer {
  //   position: fixed;
  left: 250px;
  top: 80px;
  .title {
    margin-bottom: 10px;
  }
}
</style>
