<template>
  <div class="analysis-panel three-wrap">
    <div class="title">
      <el-icon>
        <Grid />
      </el-icon>
      <div>三维模拟</div>
    </div>
    <div class="content">
      <el-form label-position="top">
        <el-form-item label="图层列表">
          <div class="layer-item" v-for="item in layerList" :key="item.fileName">
            <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>

            <vc-primitive-tileset
              v-if="selectedLayerList.includes(item.fileName)"
              :url="`${baseUrl + item.fileName}/tileset.json`"
              @readyPromise="(tileset, viewer) => onTilesetReady(tileset, viewer, item.fileName)"
            ></vc-primitive-tileset>

            <el-popover ref="popover" placement="right" trigger="click" title="调整位置" :width="200">
              <template #reference>
                <el-icon><Edit /></el-icon>
              </template>
              <div class="slider-wrap">
                <span class="slider-name">经度：</span>
                <el-slider v-model="locationObj[item.fileName].longitude" :step="0.000001" :min="103" :max="109" @change="changeLocation(item.fileName)"></el-slider>
                <span class="slider-name">纬度：</span>
                <el-slider v-model="locationObj[item.fileName].latitude" :step="0.000001" :min="24" :max="30" @change="changeLocation(item.fileName)"></el-slider>
                <span class="slider-name">高度：</span>
                <el-slider v-model="locationObj[item.fileName].height" :step="0.5" :min="-100" :max="100" @change="changeLocation(item.fileName)"></el-slider>
              </div>
            </el-popover>

            <el-icon @click="changeLocation(item.fileName)"><LocationFilled /></el-icon>
            <el-icon @click="changeLocation(item.fileName, true)"><RefreshLeft /></el-icon>
          </div>
        </el-form-item>
        <!-- 
        <el-form-item label="经度">
          <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="changeLocation"></el-slider>
        </el-form-item> -->

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

    <contrast-plane v-if="contrastDisplay" />

    <!-- <vc-analysis-flood ref="flood" :min-height="-1" :max-height="4000" :speed="10" :polygon-hierarchy="polygonHierarchy"></vc-analysis-flood> -->
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'

defineProps({ active: Boolean })

const baseUrl = `${window.baseUrl}3dtiles/`

const selectedLayerList = ref([])
const layerList = reactive([{ fileName: 'xingyi', label: '兴义' }])
const tilesetObj = {}
const locationObj = reactive({})
layerList.forEach((el) => {
  locationObj[el.fileName] = {}
})

const flood = ref()

const $vc = useVueCesium()

const photo = ref(false)
const single = ref(false)

const contrastDisplay = ref(false)

const polygonHierarchy = ref([])

function handleLayerChange(isSelect, name) {
  if (isSelect) {
    selectedLayerList.value.push(name)
  } else {
    selectedLayerList.value = selectedLayerList.value.filter((el) => el !== name)
  }
}

function onTilesetReady(tileset, viewer, name) {
  tilesetObj[name] = tileset
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)

  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)

  locationObj[name] = {}
  locationObj[name].longitude = longitude
  locationObj[name].originLongitude = longitude
  locationObj[name].originLatitude = latitude
  locationObj[name].latitude = latitude
  locationObj[name].surface = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0)
  // locationObj[name].height = cartographic.height
  locationObj[name].height = 0

  changeLocation(name)
}

function changeLocation(name, reset = false) {
  const location = locationObj[name]
  const tileset = tilesetObj[name]
  const { longitude, latitude, height } = location

  const surface = location.surface
  if (reset) {
    location.height = 0
    location.longitude = location.originLongitude
    location.latitude = location.originLatitude
  }

  const offset = reset ? surface : Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
  const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())

  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)

  const destination = new Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 1000)

  $map.flyToPoint(destination, {
    radius: 1500, //距离目标点的距离
    pitch: -30,
    duration: 3,
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
.three-wrap {
  left: 250px;
  top: 80px;
  width: 200px;
  .title {
    margin-bottom: 10px;
  }
  .layer-item {
    width: 100%;
    .el-icon {
      cursor: pointer;
      margin-left: 10px;
      font-size: 15px;
    }
  }
}
</style>
