<script setup>
import { useVueCesium } from 'vue-cesium'
const $vc = useVueCesium()

const props = defineProps({
  active: { type: Boolean, default: false },
  layerName: String,
  hasMaterial: { type: Boolean, default: false },
  materialStyle: {},
  lineStyle: {},
})

let graphicLayer, geoJsonLayer

onMounted(addDemoGraphics)

watchEffect(() => {
  if (props.active) {
    geoJsonLayer && (geoJsonLayer.show = true)
  } else {
    geoJsonLayer && (geoJsonLayer.show = false)
  }
})

onUnmounted(() => {
  // graphicLayer && $map.removeLayer(graphicLayer)
})

async function addDemoGraphics() {
  await $vc.creatingPromise
  if (geoJsonLayer) return
  geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    name: '安徽各市',
    url: '//data.mars3d.cn/file/geojson/areas/520000_full.json',
    symbol: {
      type: 'polygon',
      styleOptions: {
        materialType: mars3d.MaterialType.PolyGradient, // 重要参数，指定材质
        materialOptions: {
          color: '#3388cc',
          opacity: 0.8,
          alphaPower: 1.3,
        },
        // 面中心点，显示文字的配置
        label: {
          text: '{name}', // 对应的属性名称
          opacity: 1,
          font_size: 22,
          color: '#fff',
          outline: false,
          scaleByDistance: true,
          scaleByDistance_far: 20000000,
          scaleByDistance_farValue: 0.1,
          scaleByDistance_near: 1000,
          scaleByDistance_nearValue: 1,
        },
      },
      callback: function (attr, styleOpt) {
        const randomHeight = (attr.childrenNum || 1) * 100 // 测试的高度
        return {
          materialOptions: {
            color: getColor(),
          },
          height: 0,
          diffHeight: randomHeight,
        }
      },
    },
    popup: '{name}',
  })
  geoJsonLayer.show = props.active
  $map.addLayer(geoJsonLayer)

  // 绑定事件
  geoJsonLayer.on(mars3d.EventType.load, function (event) {
    console.log('数据加载完成', event)
  })
  geoJsonLayer.on(mars3d.EventType.click, function (event) {
    console.log('单击了图层', event)
  })
}

const arrColor = ['rgb(15,176,255)', 'rgb(18,76,154)', '#40C4E4', '#42B2BE', 'rgb(51,176,204)', '#8CB7E5', 'rgb(0,244,188)', '#139FF0']

let index = 0
function getColor() {
  return arrColor[++index % arrColor.length]
}

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
</script>

<style></style>
