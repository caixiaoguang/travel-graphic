<template>
  <div class="analysis-panel three-wrap">
    <div class="title">
      <el-icon>
        <Grid />
      </el-icon>
      <div>三维模拟</div>
    </div>
    <div class="content">
      <div>图层列表</div>
      <div class="layer-item" v-for="item in layerList" :key="item.fileName">
        <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName
        }}</el-checkbox>

        <vc-primitive-tileset v-if="selectedLayerList.includes(item.fileName)"
          :url="item.path || `${baseUrl + item.fileName}/tileset.json`"
          @readyPromise="(tileset, viewer) => onTilesetReady(tileset, viewer, item.fileName)"></vc-primitive-tileset>

        <el-popover ref="popover" placement="right" trigger="click" title="调整位置" :width="200">
          <template #reference>
            <el-icon>
              <Edit />
            </el-icon>
          </template>
          <div class="slider-wrap">
            <span class="slider-name">经度：</span>
            <el-slider v-model="locationObj[item.fileName].longitude" :step="0.000001" :min="103" :max="109"
              @change="changeLocation(item.fileName)"></el-slider>
            <span class="slider-name">纬度：</span>
            <el-slider v-model="locationObj[item.fileName].latitude" :step="0.000001" :min="24" :max="30"
              @change="changeLocation(item.fileName)"></el-slider>
            <span class="slider-name">高度：</span>
            <el-slider v-model="locationObj[item.fileName].height" :step="0.5" :min="-100" :max="100"
              @input="changeLocation(item.fileName)"></el-slider>
          </div>
        </el-popover>

        <el-icon @click="flyTo(item.fileName)">
          <LocationFilled />
        </el-icon>
        <el-icon @click="changeLocation(item.fileName, true)">
          <RefreshLeft />
        </el-icon>
        <el-icon @click="changeLocation(item.fileName, true)">
          <Flag />
        </el-icon>
      </div>

      <el-divider></el-divider>

      <flood-analysis></flood-analysis>

      <el-divider></el-divider>
      <contrast-plane />
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

defineProps({ active: Boolean })

const baseUrl = `${window.baseUrl}3dtiles/`

const { tilesetList: layerList } = useLayerList()

const selectedLayerList = ref([])
const tilesetObj = {}

const locationObj = reactive({})

watchEffect(() => {
  layerList.value.forEach((el) => {
    locationObj[el.fileName] = {}
  })
})

const flood = ref()

const $vc = useVueCesium()

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

function flyTo(name) {
  const location = locationObj[name]

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
  width: 210px;

  .content {
    display: block;
  }

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
}</style>
