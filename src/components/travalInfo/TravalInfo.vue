<template>
  <div class="analysis-panel traval-layer">
    <div class="title">
      <el-icon>
        <Promotion />
      </el-icon>
      <span>旅游概况</span>
    </div>
    <div class="content">
      <el-form label-position="top">
        <el-form-item>
          <el-checkbox-group v-model="travalList" size="large">
            <el-checkbox-button label="overview">概况</el-checkbox-button>
            <el-checkbox-button label="youshidu">优势度</el-checkbox-button>
            <el-checkbox-button label="province">重点县</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>

    <over-view v-if="travalList.includes('overview') && active" />

    <cylinder-you-shi :active="travalList.includes('youshidu') && active"></cylinder-you-shi>

    <focus-province :active="travalList.includes('province') && active"></focus-province>
  </div>
</template>

<script setup>
defineProps({ active: Boolean })
const travalList = ref([])
</script>

<style lang="scss" scoped>
.traval-layer {
  //   position: fixed;
  left: 250px;
  top: 80px;
  .title {
    margin-bottom: 10px;
  }
}
</style>
