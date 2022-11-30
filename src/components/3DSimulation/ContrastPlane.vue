<template>
  <div ref="sliderRef" class="slider"></div>
</template>

<script setup>
const sliderRef = ref()
</script>

<style lang="scss" scoped>
.slider {
  position: fixed;
  left: 50%;
  top: 60px;
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 9999;
  cursor: ew-resize;
}
</style>
