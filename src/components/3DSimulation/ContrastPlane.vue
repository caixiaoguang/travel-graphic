<template>
  <div>卷帘对比</div>
  <div>
    <el-switch v-model="contrastDisplay" inline-prompt active-text="开启" inactive-text="关闭" @change="handleSwitch"></el-switch>
  </div>

  <div class="analysis-panel right-layers" v-show="contrastDisplay">
    <div class="title">右侧图层</div>
    <div v-for="item in layerList" :key="item.fileName">
      <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

const $vc = useVueCesium()

const contrastDisplay = ref(false)

const { layerList } = useLayerList()

const selectedLayerList = ref([])

let mapSplit

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

  if (isSelect) {
    selectedLayerList.value.push(name)
  } else {
    selectedLayerList.value = selectedLayerList.value.filter((el) => el !== name)
  }

  const rightLayer = selectedLayerList.value.map((el) => ({ name: el, type: '3dtiles', url: `${window.baseUrl}3dtiles/${el}/tileset.json` }))

  mapSplit.setOptions({ rightLayer })
}

async function initSplitControl() {
  await $vc.creatingPromise
  mapSplit = new mars3d.control.MapSplit({
    // leftLayer: [
    //   // { name: '天地图卫星', type: 'tdt', layer: 'img_d' },
    //   {
    //     name: '大雁塔',
    //     type: '3dtiles',
    //     url: '//data.mars3d.cn/3dtiles/qx-dyt/tileset.json',
    //     position: { alt: -27 },
    //   },
    // ],
    rightLayer: [],
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
}
</style>
