<template>
  <div>
    <el-aside
      width="120px"
      style="background-color: #324157; height: 700px; border: 1px solid #eee"
    >
      <el-scrollbar>
        <el-menu style="background-color: #324157">
          <router-link to="/home">
            <el-menu-item index="0" class="menu-item-centered">
              <span style="color: #ffffff">主页</span>
            </el-menu-item>
          </router-link>
          
          <!-- <router-link to="/reportStatistics">
            <el-menu-item index="1" class="menu-item-centered">
              <span style="color: #ffffff">项目统计</span>
            </el-menu-item>
          </router-link>

          <router-link to="/projectInfo">
            <el-menu-item index="2" class="menu-item-centered">
              <span style="color: #ffffff">项目概要</span>
            </el-menu-item>
          </router-link> -->

        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const creatorId = ref('');
creatorId.value = localStorage.getItem('username');

</script>


<style scoped>
/* 给选项框添加背景色和白色字体 */
.el-menu-item {
  background-color: #202d3d !important;
  color: #ffffff !important;
}

/* Center the menu item content */
.menu-item-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Add hover effect */
.menu-item-centered:hover {
  background-color: #1E90FF !important; /* DodgerBlue */
}
</style>
