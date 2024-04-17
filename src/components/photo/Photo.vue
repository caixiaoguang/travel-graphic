<template>
  <div class="analysis-panel photo-wrap">
    <div class="title">
      <el-icon>
        <HelpFilled />
      </el-icon>
      <div>720全景</div>
    </div>
    <div class="content">
      <div>图层列表</div>
      <div class="layer-item" v-for="item in photoList" :key="item.fileName">
        <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
        <el-icon @click="changeLocation(item.fileName)">
          <LocationFilled />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

const { photoList } = useLayerList()
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

function changeLocation() {
  if (!graphicGroupLayer) return
  const layer = graphicGroupLayer.getLayer(name)
  if (layer) {
    layer.flyTo()
  }
}

async function createGraphicLayer(fileName) {
  const url = `${window.location.origin + window.baseUrl}720/${fileName}/${fileName}`
  const geojson = await shp(url).catch((e) => {
    // console.log(e)
  })

  // const cartesians = []

  // console.log(geojson);
  // geojson.features.forEach(el => {
  //   const cartesian3 = Cesium.Cartesian3.fromDegrees(...el.geometry.coordinates)
  //   cartesians.push(cartesian3)
  // })

  // $map.scene
  //   .clampToHeightMostDetailed(cartesians)
  //   .then(function (clampedCartesians) {
  //     for (let i = 0; i < cartesians.length; i++) {
  //       viewer.entities.add({
  //         position: clampedCartesians[i],
  //         type: 'point',
  //         ellipsoid: {
  //           radii: new Cesium.Cartesian3(0.2, 0.2, 0.2),
  //           material: Cesium.Color.RED,
  //         },
  //       });
  //     }
  //   })
  const height = window.document.documentElement.clientHeight - 200
  const width = window.document.documentElement.clientWidth - 400

  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: fileName,
    data: geojson,
    flyTo: true,
    graphicOptions: { clampToTileset: true },
    symbol: {
      styleOptions: {
        image: `${window.baseUrl}img/photo.png`,
        label: 'xxxxxxx',
        height: 32,
        width: 32,
        scale: 1,
        clampToGround: true,
      },
    },
    popup: (e) => {
      const url = e.graphic.attr['720address']

      return `<div><iframe height="${height}" width="${width}" src="${url}"></iframe><div>`
    },
    popupOptions: { maxWidth: width + 100, maxHeight: height + 40 },
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
.photo-wrap {
  left: 485px;
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
