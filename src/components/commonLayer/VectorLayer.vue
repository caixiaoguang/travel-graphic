<template>
  <div class="vec-layer">
    <div class="layer-item" v-for="item in layerList" :key="item.fileName">
      <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
      <el-icon @click="changeLocation(item.fileName)"><LocationFilled /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

defineProps({ active: Boolean })

const { vectorList: layerList } = useLayerList()
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

function changeLocation(name) {
  if (!graphicGroupLayer) return
  const layer = graphicGroupLayer.getLayer(name)
  if (layer) {
    layer.flyTo()
  }
}

async function createGraphicLayer(fileName) {
  const url = `${window.location.origin + window.baseUrl}vector/${fileName}/${fileName}`
  const geojson = await shp(url).catch((e) => {
    console.log(e)
  })

  let popupStr = ''
  const properties = geojson.features[0].properties

  for (const key in properties) {
    const value = properties[key]
    popupStr += `<div>${key}：${value}</div>`
  }

  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: fileName,
    data: geojson,
    flyTo: true,
    symbol: {
      styleOptions: {
        image: `${window.baseUrl}img/4a.png`,
        label: 'xxxxxxx',
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        height: 32,
        width: 2,
        scale: 1,
        opacity: 0.8,
        color: '#7FFFFF',
      },
    },
    popup: popupStr,
  })

  return graphicLayer
}
</script>

<style>
.el-slider__button {
  height: 15px !important;
  width: 15px !important;
}
</style>

<style lang="scss" scoped>
.vec-layer {
  .el-icon {
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
