<template>
  <div class="head-bar">
    <div class="menu left">
      <div :class="['diamond-btn', { active: active === item.index }]" v-for="item in leftMenu" :key="item.title" @click="handleClick(item)">
        <el-icon>
          <Component :is="item.icon" />
        </el-icon>

        <span class="text">{{ item.title }}</span>
      </div>
      <div :class="['diamond-btn', { active: commonLayerActive }]" @click="commonLayerActive = !commonLayerActive">
        <el-icon>
          <Operation />
        </el-icon>
        <span class="text">基础图层</span>
      </div>
    </div>
    <div class="title">旅游地理图谱信息系统</div>
    <div class="menu right">
      <div :class="['diamond-btn', { active: active === item.index }]" v-for="item in rightMenu" :key="item.title" @click="handleClick(item)">
        <el-icon>
          <Component :is="item.icon" />
        </el-icon>
        <span class="text">{{ item.title }}</span>
      </div>
    </div>

    <common-layer v-show="commonLayerActive"></common-layer>

    <three-simulation v-if="active === '3DSimulation'"></three-simulation>

    <traval-info v-show="active === 'overview'" :active="active === 'overview'"></traval-info>

    <photo v-if="active === '720'" />

    <video-monitor v-if="active === 'videoMonitor'"></video-monitor>
  </div>
</template>

<script setup lang="ts">
const active = ref('')
const commonLayerActive = ref(true)
const leftMenu = [
  { title: '旅游概况', index: 'overview', icon: 'Promotion' },
  { title: '三维模拟', index: '3DSimulation', icon: 'Grid' },
]
const rightMenu = [
  { title: '720全景', index: '720', icon: 'HelpFilled' },
  { title: '视频接入', index: 'videoMonitor', icon: 'VideoCameraFilled' },
]

function handleClick(item) {
  if (active.value === item.index) {
    active.value = ''
  } else {
    active.value = item.index
  }
}
</script>

<style lang="scss">
.head {
  .el-button {
    background-color: #91dbef69;
    border: 1px solid #34c9ee;
    color: #34c9ee;
    transform: translateY(-30px);
    &.btn1 {
      margin-right: 500px;
    }
  }
}
</style>

<style lang="scss" scoped>
.head-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 70px;
  // line-height: 60px;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  color: #fff;
  width: 100%;
  background: no-repeat center url('/img/title-bg.png');
  background-size: 100% 100%;
  padding: 7px;
  .title {
    width: 600px;
    height: 100%;
    line-height: 60px;
    font-size: 20px;
    font-weight: 700;
    margin: auto;
    text-align: center;
    background: no-repeat center url('/img/center-title.png');
    background-size: 100% 100%;
  }

  .menu {
    margin-top: 7px;
    flex: 1;
    display: flex;
    &.left {
      flex-direction: row-reverse;
    }
  }

  .diamond-btn {
    font-size: 14px;
    height: 40px;
    display: flex;
    margin: 0 10px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    background-image: url('/img/btn-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    user-select: none;
    &:hover {
      background-size: 101% 101%;
    }
    &.active {
      background-image: url('/img/btn-bg-active.png');
    }

    .el-icon {
      margin: 0 5px 0 15px;
    }
    .text {
      margin: 0 15px 0 0px;
      white-space: nowrap;
    }
  }
}
</style>
