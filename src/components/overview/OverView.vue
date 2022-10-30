<template>
  <div class="analysis-panel" v-show="active">
    <div class="title">统计情况</div>
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

<script setup lang="ts">
import './overview.css'

import { loadRemoteFile } from '@/utils/utils'
import { useVueCesium } from 'vue-cesium'
import type { VcViewerProvider, VcReadyObject } from 'vue-cesium/es/utils/types'

const $vc: VcViewerProvider = useVueCesium()

const props = withDefaults(defineProps<{ active: boolean }>(), { active: false })

// const baseUrl = process.env.BASE_URL
const overviewDataUrl = `/static/旅游数据/4A5A景区.xlsx`
const columns = ['旅游资源类型', '个数']
let overviewData, collection

const anaData = ref([])

onMounted(getOverView)

async function getOverView() {
  const data = await loadRemoteFile(overviewDataUrl)
  overviewData = data[0]
  anaData.value = data[2]
  addEntityPoint(overviewData)
}

function addEntityPoint(data: Array<Record<string, any>>) {
  // $vc.viewer.scene.postProcessStages.fxaa.enabled = false
  console.log($vc.Cesium)

  collection = new $vc.Cesium.CustomDataSource()

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const entity = new $vc.Cesium.Entity({
      id: item['旅游景区名称'],
      position: $vc.Cesium.Cartesian3.fromDegrees(item.x, item.y, 10),
      properties: {
        index: i,
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
        image: item['A级'] === '4A' ? require('../../assets/img/4a.png') : require('../../assets/img/5a.png'),
        distanceDisplayCondition: item['A级'] === '4A' ? new $vc.Cesium.DistanceDisplayCondition(0, 500000.0) : undefined,
        height: 32,
        width: 32,
      },
      label:
        item['A级'] === '5A'
          ? {
              text: item['旅游景区名称'],
              scale: 0.5,
              font: 'bold 30px MicroSoft YaHei',
              pixelOffset: new $vc.Cesium.Cartesian2(0, -30),
            }
          : undefined,
    })
    collection.entities.add(entity)
  }
  $vc.viewer.dataSources.add(collection)
  collection.show = true
}

function bindClickEvent() {
  this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  this.handler.setInputAction((movement) => {
    if (this.graphicLayer) {
      this.graphicLayer.clear()
    }

    const pick = viewer.scene.pick(movement.position)
    if (Cesium.defined(pick)) {
      const clickEntity = pick.id
      addDivPopup(clickEntity)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

function addDivPopup(entity) {
  if (!this.graphicLayer) {
    this.graphicLayer = new mars3d.layer.DivLayer()
    $map.addLayer(this.graphicLayer)
  }

  let imgHtml = ''
  const entityIndex = entity.properties.getValue().index
  const imgPathList = this.overviewData[entityIndex]['图片'].split(',')
  if (imgPathList.length === 1) {
    imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
        src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[0]}">`
  }
  if (imgPathList.length > 1) {
    imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
        src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[0]}">`
    imgHtml += `<img style="height:100px;width:100%;object-fit:contain;"
        src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[1].trim()}">`
  }

  const graphic = new mars3d.graphic.DivGraphic({
    position: entity.position,
    style: {
      html: `<div class="divpoint2">
                            <div class="title">${entity.id}</div>
                            <div class="content">
                             ${imgHtml}
                            </div>
                        </div >`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true,
    },
  })
  this.graphicLayer.addGraphic(graphic)
}

// export default {
//   props: {
//     active: false,
//   },
//   components: {},
//   data() {
//     return {
//       anaData: [],
//       columns: ['旅游资源类型', '个数'],
//     }
//   },
//   created() {
//     this.getOverView()
//   },
//   watch: {
//     active(newVal) {
//       if (this.collection) {
//         this.collection.show = newVal
//       }

//       newVal ? this.bindClickEvent() : this.handler.destroy()

//       if (!newVal && this.graphicLayer) {
//         this.graphicLayer.clear()
//       }
//     },
//   },
//   methods: {
//     async getOverView() {
//       const data = await loadRemoteFile(overviewDataUrl)
//       this.overviewData = data[0]
//       this.anaData = data[2]
//       this.addEntityPoint(this.overviewData)
//     },

//     addEntityPoint(data) {
//       viewer.scene.postProcessStages.fxaa.enabled = false
//       this.collection = new Cesium.CustomDataSource()

//       for (let i = 0; i < data.length; i++) {
//         const item = data[i]
//         const entity = new Cesium.Entity({
//           id: item['旅游景区名称'],
//           position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 10),
//           properties: {
//             index: i,
//           },
//           point:
//             item['A级'] === '4A'
//               ? {
//                   color: Cesium.Color.fromCssColorString('#23bcf0'),
//                   pixelSize: 10,
//                   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(500000.0),
//                 }
//               : null,
//           billboard: {
//             image: item['A级'] === '4A' ? require('../../assets/img/4a.png') : require('../../assets/img/5a.png'),
//             distanceDisplayCondition: item['A级'] === '4A' ? new Cesium.DistanceDisplayCondition(0, 500000.0) : null,
//             height: 32,
//             width: 32,
//           },
//           label:
//             item['A级'] === '5A'
//               ? {
//                   text: item['旅游景区名称'],
//                   scale: 0.5,
//                   font: 'bold 30px MicroSoft YaHei',
//                   pixelOffset: new Cesium.Cartesian2(0, -30),
//                 }
//               : null,
//         })
//         this.collection.entities.add(entity)
//       }
//       viewer.dataSources.add(this.collection)
//       this.collection.show = this.active
//     },

//     bindClickEvent() {
//       this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
//       this.handler.setInputAction((movement) => {
//         if (this.graphicLayer) {
//           this.graphicLayer.clear()
//         }

//         const pick = viewer.scene.pick(movement.position)
//         if (Cesium.defined(pick)) {
//           const clickEntity = pick.id
//           this.addDivPopup(clickEntity)
//         }
//       }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
//     },

//     addDivPopup(entity) {
//       if (!this.graphicLayer) {
//         this.graphicLayer = new mars3d.layer.DivLayer()
//         $map.addLayer(this.graphicLayer)
//       }

//       let imgHtml = ''
//       const entityIndex = entity.properties.getValue().index
//       const imgPathList = this.overviewData[entityIndex]['图片'].split(',')
//       if (imgPathList.length === 1) {
//         imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
//         src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[0]}">`
//       }
//       if (imgPathList.length > 1) {
//         imgHtml = `<img style="height:100px;width:100%;object-fit:contain;"
//         src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[0]}">`
//         imgHtml += `<img style="height:100px;width:100%;object-fit:contain;"
//         src="${baseUrl}static/旅游数据/A级景区图片/${imgPathList[1].trim()}">`
//       }

//       const graphic = new mars3d.graphic.DivGraphic({
//         position: entity.position,
//         style: {
//           html: `<div class="divpoint2">
//                             <div class="title">${entity.id}</div>
//                             <div class="content">
//                              ${imgHtml}
//                             </div>
//                         </div >`,
//           horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           clampToGround: true,
//         },
//       })
//       this.graphicLayer.addGraphic(graphic)
//     },
//   },

//   beforeUnmount() {
//     if (this.graphicLayer) {
//       $map.removeLayer(this.graphicLayer)
//     }

//     if (this.collection) {
//       viewer.dataSources.remove(this.collection)
//     }

//     this.handler.destroy()
//   },
// }
</script>

<style lang="scss" scoped>
.content {
  width: 355px;
  .cell {
    width: 50%;
  }
}
</style>
