<template>
  <div class="analysis-panel photo-wrap">
    <div class="title">
      <el-icon>
        <HelpFilled />
      </el-icon>
      <div>720全景</div>
    </div>
    <div class="content">
      <div>图层列表</div>
      <div class="layer-item" v-for="item in layerList" :key="item.fileName">
        <el-checkbox @change="(val) => handleLayerChange(val, item.fileName)">{{ item.label || item.fileName }}</el-checkbox>
        <el-icon @click="changeLocation(item.fileName)"><LocationFilled /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVueCesium } from 'vue-cesium'
import useLayerList from '../useLayerList.js'

defineProps({ active: Boolean })

const baseUrl = `${window.baseUrl}3dtiles/`

const { photoList } = useLayerList()

const layerList = ref([])

const selectedLayerList = ref([])

const $vc = useVueCesium()

function handleLayerChange(isSelect, name) {
  if (isSelect) {
    selectedLayerList.value.push(name)
  } else {
    selectedLayerList.value = selectedLayerList.value.filter((el) => el !== name)
  }
}

function changeLocation() {}
</script>

<style>
.el-slider__button {
  height: 15px !important;
  width: 15px !important;
}
</style>

<style lang="scss" scoped>
.photo-wrap {
  left: 250px;
  top: 80px;
  width: 200px;
  .content {
    display: block;
  }
  .title {
    margin-bottom: 10px;
  }
  .layer-item {
    width: 100%;
    .el-icon {
      cursor: pointer;
      margin-left: 10px;
      font-size: 15px;
    }
  }
}
</style>
