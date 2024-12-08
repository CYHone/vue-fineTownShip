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
          <router-link to="/advocacyInfo">
            <el-menu-item index="1" class="menu-item-centered">
              <span style="color: #ffffff">我宣传</span>
            </el-menu-item>
          </router-link>
          <router-link to="/queryAdvocacyInfo">
            <el-menu-item index="2" class="menu-item-centered">
              <span style="color: #ffffff">宣传查询</span>
            </el-menu-item>
          </router-link>
          <router-link to="/queryWaitHandle">
            <el-menu-item index="3" class="menu-item-centered">
              <span style="color: #ffffff">我助力</span>
            </el-menu-item>
          </router-link>
          <router-link to="/handleSupport">
            <el-menu-item index="4" class="menu-item-centered">
              <span style="color: #ffffff">处理助力</span>
            </el-menu-item>
          </router-link>
          <router-link to="/querySupport">
            <el-menu-item index="5" class="menu-item-centered">
              <span style="color: #ffffff">助力查询</span>
            </el-menu-item>
          </router-link>
          <router-link to="/usersManage">
            <el-menu-item index="9" class="menu-item-centered">
              <span style="color: #ffffff">个人信息</span>
            </el-menu-item>
          </router-link>
          
                    <!-- 条件渲染用户管理菜单项 -->
                    <!-- <router-link v-if="creatorId === 'admin'" to="/usersManage">
            <el-menu-item index="9" class="menu-item-centered">
              <span style="color: #ffffff">用户管理</span>
            </el-menu-item>
          </router-link>
           -->

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
