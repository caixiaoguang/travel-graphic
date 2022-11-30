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
          <el-checkbox-group v-model="selectedLayerList">
            <div class="layer-item" v-for="item in layerList" :key="item.fileName">
              <el-checkbox :label="item.fileName">{{ item.label || item.fileName }}</el-checkbox>

              <vc-primitive-tileset
                v-if="selectedLayerList.includes(item.fileName)"
                :url="`${baseUrl + item.fileName}/tileset.json`"
                @readyPromise="onTilesetReady"
              ></vc-primitive-tileset>

              <el-popover ref="popover" placement="right" trigger="click" title="调整位置" :width="200">
                <template #reference>
                  <el-icon><LocationFilled /></el-icon>
                </template>
                <tileset-location-change></tileset-location-change>
              </el-popover>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <!-- 
        <el-form-item label="经度">
          <el-slider v-model="longitude" :step="0.01" :min="103" :max="109" @change="positionModify"></el-slider>
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
const layerList = ref([{ fileName: 'xingyi', label: '兴义' }])

const flood = ref()

const $vc = useVueCesium()

const photo = ref(false)
const single = ref(false)

const contrastDisplay = ref(false)

const polygonHierarchy = ref([])

function onTilesetReady(tileset, viewer) {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
  viewer.zoomTo(tileset)
  console.log('ss')

  // curTileset = tileset

  // longitude.value = originLon = Cesium.Math.toDegrees(cartographic.longitude)
  // latitude.value = originLat = Cesium.Math.toDegrees(cartographic.latitude)
  // height.value = cartographic.height
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
  }
}
</style>
