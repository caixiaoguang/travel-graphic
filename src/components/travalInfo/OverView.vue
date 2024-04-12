<template>
  <div class="analysis-panel overview-layer" element-loading-background="transparent">
    <div class="title">
      <el-icon>
        <PieChart />
      </el-icon>
      <div>概况</div>
    </div>
    <div class="content">
      <div class="cell" v-for="item in anaData" :key="item">
        <div class="name">
          <i class="el-icon-pie-chart"></i>
          {{ item['旅游资源类型'] }}
        </div>
        <div class="count">
          <span>{{ item['个数'] }}</span>
          个
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { loadRemoteFile } from '@/utils/utils.js'
import { useVueCesium } from 'vue-cesium'

const props = defineProps({ active: { type: Boolean, default: false } })

const $vc = useVueCesium()

let overviewData, collection, handler, graphicLayer

const anaData = ref([])

onMounted(async () => {
  await $vc.creatingPromise
  getOverView()
  bindClickEvent()
})

// watch(
//   () => props.active,
//   (newVal) => {
//     console.log(newVal)
//     collection && (collection.show = newVal)
//   },
// )

// watchEffect(() => {
//   console.log(props.active)
//   if (props.active && !handler) {
//     bindClickEvent()
//   }

//   if (!props.active) {
//     handler = null
//   }

//   collection && (collection.show = props.active)
//   graphicLayer && (graphicLayer.show = props.active)
// })

onUnmounted(() => {
  if (graphicLayer) {
    $map.removeLayer(graphicLayer)
  }

  if (collection) {
    $vc.viewer.dataSources.remove(collection)
  }

  handler.destroy()
})

async function getOverView() {
  const overviewDataUrl = `${window.baseUrl}static/旅游数据/4A5A景区.xlsx`
  const data = await loadRemoteFile(overviewDataUrl)
  overviewData = data[0]
  anaData.value = data[2]
  nextTick(() => {
    addEntityPoint(overviewData)
  })
}

function addEntityPoint(data) {
  $vc.viewer.scene.postProcessStages.fxaa.enabled = false
  collection = new $vc.Cesium.CustomDataSource()

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const entity = new $vc.Cesium.Entity({
      id: item['旅游景区名称'],
      position: $vc.Cesium.Cartesian3.fromDegrees(item.x, item.y, 10),
      properties: {
        index: i,
        grade: item['A级'],
      },
      point:
        item['A级'] === '4A'
          ? {
              color: $vc.Cesium.Color.fromCssColorString('#23bcf0'),
              pixelSize: 10,
              distanceDisplayCondition: new $vc.Cesium.DistanceDisplayCondition(500000.0),
            }
          : undefined,
      billboard: {
        image: item['A级'] === '4A' ? `${window.baseUrl}img/4a.png` : `${window.baseUrl}img/5a.png`,
        distanceDisplayCondition: item['A级'] === '4A' ? new $vc.Cesium.DistanceDisplayCondition(0, 500000.0) : undefined,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        height: 32,
        width: 32,
      },
      label:
        item['A级'] === '5A'
          ? {
              text: item['旅游景区名称'],
              scale: 0.5,
              font: 'bold 30px MicroSoft YaHei',
              pixelOffset: new $vc.Cesium.Cartesian2(0, -50),
            }
          : undefined,
    })
    collection.entities.add(entity)
  }
  $vc.viewer.dataSources.add(collection)
  collection.show = true
}

function bindClickEvent() {
  handler = new Cesium.ScreenSpaceEventHandler($vc.viewer.scene.canvas)
  handler.setInputAction((action) => {
    if (graphicLayer) {
      graphicLayer.clear()
    }

    const pick = $vc.viewer.scene.pick(action.position)

    if (Cesium.defined(pick)) {
      const clickEntity = pick.id
      addDivPopup(clickEntity)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

function addDivPopup(entity) {
  if (!graphicLayer) {
    graphicLayer = new mars3d.layer.GraphicLayer()
    window.$map.addLayer(graphicLayer)
  }

  let imgHtml = ''
  const entityIndex = entity.properties.getValue().index
  const grade = entity.properties.getValue().grade
  const imgPathList = overviewData[entityIndex]['图片'].split(',')

  if (imgPathList.length === 1) {
    imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
        src="/static/旅游数据/A级景区图片/${imgPathList[0]}">`
  }
  if (imgPathList.length > 1) {
    imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
        src="/static/旅游数据/A级景区图片/${imgPathList[0]}">`
    imgHtml += `<img style="height:100px;width:100%;object-fit:contain;"
        src="/static/旅游数据/A级景区图片/${imgPathList[1].trim()}">`
  }

  const graphic = new mars3d.graphic.DivGraphic({
    position: entity.position,
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-${grade === '4A' ? 'blue' : 'red'}">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">${entity.id}</div>
                      <div class="label-content">
                       ${imgHtml}
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true,
    },
  })
  graphicLayer.addGraphic(graphic)
}
</script>

<style lang="scss" scoped>
.overview-layer {
  min-height: 300px;
  position: fixed;
  bottom: 25px;
  right: 370px;
  .content {
    width: 350px;
    .cell {
      width: 50%;
    }
  }
}
// .analysis-panel {
//   display: block !important;
// }
</style>
