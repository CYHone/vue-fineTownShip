<template>
  <div>
    <el-container>
      <!-- <rHeader /> -->
      <el-header
        style="
          height: 40px;
          text-align: right;
          font-size: 18px;
          background-color: #252F42 ;
          border-radius: 3px;
        "
      >
        <rHeader></rHeader>
      </el-header>
      <el-container>
        <rAside></rAside>
        <el-main>
          <router-view>

            
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import rHeader from '@/components/r-header.vue'
import rAside from '@/components/r-aside.vue'
</script>

<style scoped></style>