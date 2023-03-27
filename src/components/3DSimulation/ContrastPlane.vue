<template>
  <div>卷帘对比</div>
  <div>
    <el-switch v-model="contrastDisplay" inline-prompt active-text="开启" inactive-text="关闭" @change="handleSwitch"></el-switch>
  </div>

  <div class="analysis-panel right-layers" v-show="contrastDisplay">
    <div class="title">右侧图层</div>
    <div v-for="item in layerList" :key="item.fileName">
      <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
      <el-icon @click="changeLocation(item.fileName)"><LocationFilled /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

const $vc = useVueCesium()

const contrastDisplay = ref(false)

const { tilesetList: layerList } = useLayerList()

let mapSplit, rightLayer

onMounted(initSplitControl)

onUnmounted(() => {
  $map.removeControl(mapSplit)
})

function handleSwitch(val) {
  if (val) {
    $map.addControl(mapSplit)
  } else {
    $map.removeControl(mapSplit)
  }
}

function handleLayerChange(isSelect, name) {
  if (!mapSplit) return

  const index = layerList.value.findIndex((el) => el.fileName === name)

  const layer = rightLayer[index]

  layer.show = isSelect
}

function changeLocation(name) {
  if (!mapSplit) return

  const index = layerList.value.findIndex((el) => el.fileName === name)

  const layer = rightLayer[index]

  layer.flyTo()
}

async function initSplitControl() {
  await $vc.creatingPromise
  mapSplit = new mars3d.control.MapSplit({
    rightLayer: [],
  })
  watchEffect(() => {
    rightLayer = layerList.value.map((el) => {
      const url = el.path&&el.path.includes('http')?el.path:`${window.baseUrl}3dtiles/${el.fileName}/tileset.json`
      return new mars3d.layer.TilesetLayer({ name: el.fileName, type: '3dtiles', url, show: false })
    })

    mapSplit.setOptions({ rightLayer })
  })
}
</script>

<style lang="scss">
.mars3d-slider {
  top: 70px !important;
  svg {
    margin-left: 8px;
    margin-top: 2px;
  }
}
</style>

<style lang="scss" scoped>
.right-layers {
  position: fixed;
  bottom: 10px;
  right: 10px;
  .el-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
