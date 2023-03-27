<template>
  <div>卷帘对比</div>
  <div>
    <el-switch v-model="contrastDisplay" inline-prompt active-text="开启" inactive-text="关闭"
      @change="handleSwitch"></el-switch>
  </div>

  <div class="analysis-panel right-layers" v-show="contrastDisplay">
    <div>
      <div class="title">左侧图层</div>
      <el-checkbox-group v-model="leftLayer">
        <el-checkbox v-for="(item, index) in layerList" :key="item.fileName" :label="item.fileName">{{ item.label ||
          item.fileName
        }}
          <el-icon @click="changeLocation(index,'left')">
            <LocationFilled />
          </el-icon>
        </el-checkbox>

      </el-checkbox-group>
    </div>

    <div>
      <div class="title">右侧图层</div>
      <el-checkbox-group v-model="rightLayer">
        <el-checkbox v-for="(item,index) in layerList" :key="item.fileName" :label="item.fileName">{{ item.label || item.fileName
        }}
          <el-icon @click="changeLocation(index,'right')">
            <LocationFilled />
          </el-icon>
        </el-checkbox>

      </el-checkbox-group>
    </div>

  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

const $vc = useVueCesium()

const contrastDisplay = ref(false)

const { tilesetList: layerList } = useLayerList()

const leftLayer = ref([])
const rightLayer = ref([])

let mapSplit, left, right

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

function handleLayerChange(isSelect, name, type) {
  if (!mapSplit) return

  // const index = layerList.value.findIndex((el) => el.fileName === name)

  layer.show = isSelect
}

function changeLocation(index, type) {
  if (!mapSplit) return

  // const index = layerList.value.findIndex((el) => el.fileName === name)

  const layer = type === 'left' ? left[index] : right[index]

  layer.flyTo()
}

async function initSplitControl() {
  await $vc.creatingPromise
  mapSplit = new mars3d.control.MapSplit({
    leftLayer: [],
    rightLayer: [],
  })
  watchEffect(() => {
    left = leftLayer.value.map((item) => {
      const el = layerList.value.find((el) => el.fileName === item)
      const url = el.path && el.path.includes('http') ? el.path : `${window.baseUrl}3dtiles/${el.fileName}/tileset.json`
      return new mars3d.layer.TilesetLayer({ name: el.fileName, type: '3dtiles', url,position:{alt_offset	:el.height||0} })
    })
    right = rightLayer.value.map((item) => {
      const el = layerList.value.find((el) => el.fileName === item)
      const url = el.path && el.path.includes('http') ? el.path : `${window.baseUrl}3dtiles/${el.fileName}/tileset.json`
      return new mars3d.layer.TilesetLayer({ name: el.fileName, type: '3dtiles', url,position:{alt_offset	:el.height||0} })
    })

    mapSplit.setOptions({ leftLayer: left, rightLayer: right })
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
  max-width: 200px;

  .el-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
