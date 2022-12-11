<template>
  <div class="analysis-panel video-wrap">
    <div class="title">
      <el-icon>
        <VideoCameraFilled />
      </el-icon>
      <div>视频接入</div>
    </div>
    <div class="content">
      <div>图层列表</div>
      <div class="layer-item" v-for="item in layerList" :key="item.fileName">
        <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
        <el-icon @click="changeLocation(item.fileName)"><LocationFilled /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

defineProps({ active: Boolean })

const { videoList: layerList } = useLayerList()
let graphicGroupLayer

const $vc = useVueCesium()

onMounted(init)

onUnmounted(() => {
  $map.removeLayer(graphicGroupLayer)
})

async function init() {
  await $vc.creatingPromise
  graphicGroupLayer = new mars3d.layer.GraphicGroupLayer()
  $map.addLayer(graphicGroupLayer)
}

async function handleLayerChange(isSelect, name) {
  if (!graphicGroupLayer) return

  const layer = graphicGroupLayer.getLayer(name)

  if (isSelect) {
    if (layer) {
      layer.show = true
    } else {
      const graphicLayer = await createGraphicLayer(name)
      graphicGroupLayer.addLayer(graphicLayer)
    }
  } else {
    layer.show = false
  }
}

function changeLocation() {}

async function createGraphicLayer(fileName) {
  const url = `${window.location.origin + window.baseUrl}video/${fileName}/${fileName}`
  const geojson = await shp(url).catch((e) => {
    console.log(e)
  })

  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: fileName,
    data: geojson,
    flyTo: true,
    symbol: {
      styleOptions: {
        image: `${window.baseUrl}img/video.png`,
        label: 'xxxxxxx',
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        height: 32,
        width: 32,
        scale: 1,
      },
    },
    popup: (e) => {
      const monitorURL = e.graphic.attr['monitorURL']
      const nestURL = e.graphic.attr['nestURL']
      return `<div class="video-iframe-wrap"><div><iframe height="400" width="350" src="${monitorURL}"></iframe></div><div><iframe height="400" width="350" src="${nestURL}"></iframe></div><div>`
    },
    popupOptions: { offsetY: -30 },
  })

  return graphicLayer
}
</script>

<style>
.el-slider__button {
  height: 15px !important;
  width: 15px !important;
}
.video-iframe-wrap {
  display: flex;
}
</style>

<style lang="scss" scoped>
.video-wrap {
  left: 250px;
  top: 80px;
  width: 200px;
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
}
</style>
