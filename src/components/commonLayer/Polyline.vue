<script setup>
import { useVueCesium } from 'vue-cesium'
const $vc = useVueCesium()

const defaultLineStyle = {
  outline: true,
  outlineWidth: 2,
  color: '#34c9ee83',
}

const defaultMaterialStyle = {
  materialType: 'PolylineGlow',
  glowPower: 0.06, //发光强度
  width: 30, //线宽
  color: '#34c9ee',
  opacity: 0.9,
}

const props = defineProps({
  active: { type: Boolean, default: false },
  layerName: String,
  hasMaterial: { type: Boolean, default: false },
  materialStyle: {},
  lineStyle: {},
})

let graphicLayer

onMounted(addLayer)

watchEffect(() => {
  if (props.active) {
    graphicLayer && (graphicLayer.show = true)
  } else {
    graphicLayer && (graphicLayer.show = false)
  }
})

onUnmounted(() => {
  // graphicLayer && $map.removeLayer(graphicLayer)
})

async function addLayer() {
  await $vc.creatingPromise
  graphicLayer = new mars3d.layer.GraphicLayer()
  $map.addLayer(graphicLayer)
  Cesium.GeoJsonDataSource.load(`${window.baseUrl}static/${props.layerName}.json`).then((dataSource) => {
    addGraphics(dataSource)
  })
}

function addGraphics(dataSource) {
  dataSource.entities.values.forEach((feature) => {
    const primitive = new mars3d.graphic.PolylinePrimitive({
      positions: feature.polyline.positions._value,
      style: {
        width: 6,
        clampToGround: true,
        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
          image: `${window.baseUrl}/img/LinkPulse.png`,
          color: Cesium.Color.CORAL,
          repeat: new Cesium.Cartesian2(10.0, 1.0),
          speed: 1,
        }),
      },
    })
    graphicLayer.show = props.active
    graphicLayer.addGraphic(primitive)
  })
}

function addGeojsonLayer() {
  graphicLayer = new mars3d.layer.GraphicLayer()
  $map.addLayer(graphicLayer)

  const layer = new mars3d.layer.GeoJsonLayer({
    name: props.layerName,
    url: `${window.baseUrl}static/${props.layerName}.json`,
    symbol: {
      styleOptions: {
        // outline: true,
        // outlineWidth: 2,
        // color: "#34c9ee83",
        materialType: 'PolylineGlow',
        glowPower: 0.06, //发光强度
        width: 30, //线宽
        color: '#34c9ee',
        opacity: 0.9,
        clampToGround: true,
      },
    },
    onCreateGraphic: (data) => {
      // console.log(data);
    },
  })
  $map.addLayer(layer)
  layer.show = false
  graphicLayer.show = props.active
}

// export default {
//   props: {
//     active: false,
//     layerName: '',
//     hasMaterial: false,
//     materialStyle: {},
//     lineStyle: {},
//   },
//   created() {
//     // addGeojsonLayer();
//     addLayer()
//   },
//   watch: {
//     active(newVal) {
//       console.log('sss')
//       graphicLayer && (graphicLayer.show = newVal)
//     },
//   },
//   methods: {
//     addLayer() {
//       graphicLayer = new mars3d.layer.GraphicLayer()
//       $map.addLayer(graphicLayer)
//       Cesium.GeoJsonDataSource.load(`/static/${layerName}.json`).then((dataSource) => {
//         addGraphics(dataSource)
//       })
//     },
//     addGraphics(dataSource) {
//       let positions = []
//       dataSource.entities.values.forEach((feature) => {
//         const primitive = new mars3d.graphic.PolylinePrimitive({
//           positions: feature.polyline.positions._value,
//           style: {
//             width: 6,
//             material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
//               image: require('../assets/img/LinkPulse.png'),
//               color: Cesium.Color.CORAL,
//               repeat: new Cesium.Cartesian2(10.0, 1.0),
//               speed: 1,
//             }),
//           },
//         })
//         graphicLayer.show = active
//         graphicLayer.addGraphic(primitive)
//       })
//     },
//     addGeojsonLayer() {
//       graphicLayer = new mars3d.layer.GraphicLayer()
//       $map.addLayer(graphicLayer)

//       const layer = new mars3d.layer.GeoJsonLayer({
//         name: layerName,
//         url: `${baseUrl}static/${layerName}.json`,
//         symbol: {
//           styleOptions: {
//             // outline: true,
//             // outlineWidth: 2,
//             // color: "#34c9ee83",
//             materialType: 'PolylineGlow',
//             glowPower: 0.06, //发光强度
//             width: 30, //线宽
//             color: '#34c9ee',
//             opacity: 0.9,
//             clampToGround: true,
//           },
//         },
//         onCreateGraphic: (data) => {
//           // console.log(data);
//         },
//       })
//       $map.addLayer(layer)
//       layer.show = false
//       graphicLayer.show = active
//     },
//   },
//   beforeUnmount() {
//     graphicLayer && $map.removeLayer(graphicLayer)
//   },
// }
</script>

<style></style>
