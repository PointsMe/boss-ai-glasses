<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
</script>

<template>
  <div class="main">首页</div>
</template>
<style scoped lang="scss">
.main {
  padding: 8px;
  .margin-top-12 {
    margin-top: 12px;
  }
  .bg-bg_color {
    background-color: #fff;
    padding: 12px;
    border-radius: 3px;
    .top-row {
      margin-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 12px;
    }
    .bottom-row {
      padding-top: 12px;
    }
  }
}
</style>
