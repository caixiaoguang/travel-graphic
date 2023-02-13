<script>
import { useVueCesium } from 'vue-cesium'

export default {
  created() {
    this.addGeojsonLayer()
  },
  methods: {
    async addGeojsonLayer() {
      const $vc = useVueCesium()
      await $vc.creatingPromise
      // this.gzs = new mars3d.layer.GeoJsonLayer({
      //   name: 'gzs',
      //   url: `/static/高速.json`,
      //   symbol: {
      //     styleOptions: {
      //       // outline: true,
      //       // outlineWidth: 2,
      //       // color: "#34c9ee83",
      //       // materialType: 'PolylineGlow',
      //       glowPower: 0.06, //发光强度
      //       width: 10, //线宽
      //       color: '#34c9ee',
      //       opacity: 0.9,
      //       clampToGround: true,
      //     },
      //     show: false,
      //   },
      //   // popup: "{NAME}",
      // })
      fetch(`${window.baseUrl}static/高速.json`).then((res) => {
        res.json().then((res) => {
          // 创建矢量数据图层
          this.graphicLayer = new mars3d.layer.GraphicLayer()
          $map.addLayer(this.graphicLayer)

          const arrData = []
          const { features } = res

          features.forEach((el) => {
            arrData.push({
              positions: el.geometry.coordinates[0],
              style: {
                width: 3.0,
                clampToGround: true,
                // distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(1000, 99999),
                color: '#6adb87',
              },
            })
          })

          const graphic = new mars3d.graphic.PolylineCombine({
            instances: arrData,
            // 高亮时的样式
            highlight: {
              type: mars3d.EventType.click,
              color: Cesium.Color.RED,
            },
          })
          this.graphicLayer.addGraphic(graphic)
        })
      })
      // $map.addLayer(this.gzs)
    },
  },
  beforeUnmount() {
    this.graphicLayer && $map.removeLayer(this.graphicLayer)
  },
}
</script>

<style></style>
