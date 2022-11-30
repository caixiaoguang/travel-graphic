<template>
  <div class="slider-wrap">
    <span class="slider-name">经度：</span>
    <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="positionModify"></el-slider>
    <span class="slider-name">纬度：</span>
    <el-slider v-model="latitude" :step="0.01" :min="24" :max="30" @change="positionModify"></el-slider>
    <span class="slider-name">高度：</span>
    <el-slider v-model="height" :step="1" :min="0" :max="500" @change="positionModify"></el-slider>
  </div>
</template>

<script setup>
const longitude = ref()
const latitude = ref()
const height = ref()

function positionModify() {
  const surface = Cesium.Cartesian3.fromDegrees(
    originLon,
    originLat,
    height.value,
    // 0,
  )

  const offset = Cesium.Cartesian3.fromDegrees(longitude.value, latitude.value, height.value)
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
</script>
