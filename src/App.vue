<template>
  <div class="home">
    <head-title @changeLayerType="changeLayerType" />
    <!-- <div class="baselayer-control"></div> -->
    <vc-config-provider>
      <vc-viewer :show-credit="false" fullscreen-button @ready="onViewerReady">
        <common-layer></common-layer>
        <vc-ajax-bar color="red" size="4px" positioning="fixed"></vc-ajax-bar>

        <vc-navigation
          :offset="[10, 80]"
          :otherOpts="{
            position: 'bottom',
            offset: [0, 25],
            statusBarOpts: { background: 'rgba(0,0,0,.6)' },
            distancelegendOpts: { background: 'rgba(0,0,0,.6)' },
          }"
        />

        <vc-layer-imagery>
          <!-- <vc-imagery-provider-baidu ref="provider" mapStyle="dark" :projection-transforms="{ from: 'BD09', to: 'WGS84' }" /> -->
          <vc-imagery-provider-tianditu map-style="img_w" token="436ce7e50d27eede2f2929307e6b33c0" ref="provider" />
        </vc-layer-imagery>

        <!-- <vc-terrain-provider-tianditu ref="provider" token="436ce7e50d27eede2f2929307e6b33c0"></vc-terrain-provider-tianditu> -->

        <over-view />

        <!-- <layer :ready="ready" :layerType="layerType" /> -->

        <!-- <vc-provider-terrain-tianditu :token="token" /> -->

        <vc-measurements
          ref="measurementsRef"
          position="top-right"
          :measurements="['polyline', 'area', 'vertical']"
          :mainFabOpts="{ color: 'rgba(0,0,0,.6)' }"
          :offset="[360, 80]"
        />

        <!-- <terrain-clip /> -->

        <!-- <vc-drawings></vc-drawings> -->
      </vc-viewer>
    </vc-config-provider>
  </div>
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'

const ready = ref(false)
const layerType = ref('travel')

function onViewerReady(readyObj: VcReadyObject) {
  const { Cesium, viewer, map } = readyObj
  window.Cesium = Cesium
  window.viewer = viewer
  window.$map = map
  // ready.value = true
  viewer.selectedEntity = undefined

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(106.69, 26.336, 5000),
  })
  viewer.scene.globe.depthTestAgainstTerrain = true
}

// function viewerReady(e) {
//   const { Cesium, viewer, map } = e
//   window.Cesium = Cesium
//   window.viewer = viewer
//   window.$map = map
//   ready.value = true
//   viewer.selectedEntity = undefined

//   viewer.camera.setView({
//     destination: Cesium.Cartesian3.fromDegrees(106.69, 26.336, 5000),
//   })
//   // viewer.scene.globe.depthTestAgainstTerrain = true;
// }

function changeLayerType(type: string) {
  layerType.value = type
}
</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh + 25px);
  :deep(.vc-location-other-controls) {
    button {
      font-size: 0.8rem;
      .vc-section {
        width: 160px;
      }
    }
  }
}
</style>
