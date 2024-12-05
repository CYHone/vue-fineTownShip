<template>
  <div class="header-container">
    <div class="header-left">
      《好乡镇》系统平台
    </div>
    <div class="header-welcome">
      你好！{{ name }}
    </div>
    <el-popconfirm
      confirmButtonText="好的"
      cancelButtonText="不用了"
      icon="el-icon-info"
      icon-color="red"
      title="确定退出登录吗？"
      @confirm="handleLogout"
    >
      <template #reference>
        <el-button type="danger" class="logout-button" round>
          退出登录
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script>
export default {
  name: 'r-header',
  data() {
    return {
      name: null,
    }
  },
  created() {
    this.name = localStorage.getItem('bname')
  },
  methods: {
    handleLogout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #333;
  color: white;
}
.header-left {
  font-size: 20px;
}
.header-welcome {
  color: darkgoldenrod;
  padding-left: 50px;
}
.logout-button {
  margin-left: auto;
}
</style>
