<template>
  <div class="vec-layer">
    <div class="layer-item" v-for="item in layerList" :key="item.fileName">
      <el-checkbox @change="(val) => handleLayerChange(val, item)">{{ item.label || item.fileName }}</el-checkbox>
      <el-icon @click="changeLocation(item.fileName)">
        <LocationFilled />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

// import  VectorTileImageryProvider from 'cesiumvectortile'

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
  await loadScripts([
    'https://unpkg.com/@turf/turf@latest/turf.min.js',
    '/lib/mars3d/thirdParty/weiVectorTile/CesiumVectorTile.js',
    '/lib/mars3d/thirdParty/weiVectorTile/WeiVectorTileLayer.js',
  ])
  $map.addLayer(graphicGroupLayer)
}

async function handleLayerChange(isSelect, item) {
  if (!graphicGroupLayer) return

  const layer = graphicGroupLayer.getLayer(item.fileName)

  if (isSelect) {
    if (layer) {
      layer.show = true
    } else {
      const graphicLayer = await createGraphicLayer(item)
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

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script')
    script.src = url
    script.onload = function () {
      resolve(url)
    }
    script.onerror = function () {
      reject(new Error('Failed to load script: ' + url))
    }
    document.head.appendChild(script)
  })
}

function loadScripts(scriptUrls) {
  var promises = []
  scriptUrls.forEach(function (url) {
    promises.push(loadScript(url))
  })
  return Promise.all(promises)
}

async function createGraphicLayer(layer) {
  await loadScripts([
    // 'https://unpkg.com/@turf/turf@latest/turf.min.js',
    '/lib/mars3d/thirdParty/weiVectorTile/CesiumVectorTile.js',
    // '/lib/mars3d/thirdParty/weiVectorTile/WeiVectorTileLayer.js',
  ])

  const url = `${window.location.origin + window.baseUrl}vector/${layer.fileName}/${layer.fileName}`
  const geojson = await shp(url).catch((e) => {
    // console.log(e)
  })

  let popupStr = ''
  const properties = geojson.features[0].properties

  for (const key in properties) {
    const value = properties[key]
    popupStr += `<div>${key}：${value}</div>`
  }

  const height = window.document.documentElement.clientHeight - 200
  const width = window.document.documentElement.clientWidth - 400

  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: layer.fileName,
    data: geojson,
    flyTo: true,
    symbol: {
      styleOptions: {
        opacity: layer.opacity || 0.5,
        clampToGround: true,
        label: {
          text: `{${layer.field}}`, // 对应的属性名称
          opacity: 1,
          font_size: 16,
          color: '#fff',
          outline: false,
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
        },
      },
      callback: (attr) => {
        return { color: getRandomColor() }
      },
    },
    // popup: popupStr,
    popup: (e) => {
      const title = e.graphic.attr[layer.field]
      const desc = e.graphic.attr['DESC']
      const imgNameList = e.graphic.attr['IMG']?.split(',') || []
      let imgStr = ''
      imgNameList.forEach((el) => {
        imgStr += `<img src="${window.location.origin + window.baseUrl}vector/${layer.fileName}/${el}" style="width:50%">`
      })
      const textImgStr = `<div style="width:500px;"><h2 style="text-align:center">${title}</h2><p>${desc}</p>${imgStr}</div>`
      return imgStr ? textImgStr : popupStr
    },
    popupOptions: { maxWidth: width + 100, maxHeight: height + 40 },
  })

  const colorDic = {}
  const tileLayer = new mars3d.layer.WeiVectorTileLayer({
    id: layer.fileName,
    source: geojson,
    removeDuplicate: false,
    zIndex: 20,
    // encoding: 'utf-8',
    defaultStyle: {
      // 参考api文档的Cesium.VectorStyle类
      tileCacheSize: 200,
      fill: true, // 是否填充，仅面数据有效。
      fillColor: '#4aa196',
      outline: true, // 是否显示边，仅面数据有效。
      outlineColor: 'rgba(209,204,226,1)',
      // lineDash: [3, 10],
      lineWidth: 1,
      showCenterLabel: true, // 是否显示文本，仅对线和面数据有效
      centerLabelPropertyName: 'name',
      fontColor: 'rgba(255,255,255,0.8)',
      fontSize: 23,
      labelOffsetX: -10,
      labelOffsetY: -5,
    },
    styleFilter: function (feature, style, x, y, level) {
      if (level < 6) {
        style.fontSize = level * 2
      } else {
        style.fontSize = 23
      }

      if (feature?.properties[layer.field]) {
        const name = feature.properties[layer.field]
        if (!colorDic[name]) {
          colorDic[name] = getRandomColor()
        }
        style.fillColor = colorDic[name]
      }
      return style
    },
    maximumLevel: 20,
    minimumLevel: 1,
    simplify: false,
    allowPick: true, // 允许单击
    maxLength: -1,
    popup: 'all',
    flyTo: true,
  })

  return layer.fileName === '水系' ? tileLayer : graphicLayer
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
