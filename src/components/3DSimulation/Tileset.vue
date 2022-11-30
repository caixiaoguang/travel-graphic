<template>
  <vc-primitive-tileset :url="baseUrl + fileName + '/tileset.json'" @readyPromise="onTilesetReady"></vc-primitive-tileset>
</template>

<script setup>
defineProps({ fileName: String })

const baseUrl = `${window.baseUrl}3dtiles/`
let curTileset

function onTilesetReady(tileset, viewer) {
  const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)

  curTileset = tileset

  // longitude.value = originLon = Cesium.Math.toDegrees(cartographic.longitude)
  // latitude.value = originLat = Cesium.Math.toDegrees(cartographic.latitude)
  // height.value = cartographic.height
}

defineExpose({ tileset: curTileset })
</script>
