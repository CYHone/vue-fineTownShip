<template>
    <div>
      <!-- 标题 -->
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">处理助力</span>
      
      <!-- 助力列表 -->
      <el-table :data="supportList" style="width: 100%">
        <el-table-column prop="stitle" label="助力标题" width="150"></el-table-column>
        <el-table-column prop="suserName" label="助力用户名" width="150"></el-table-column>
        <el-table-column prop="sdesc" label="助力描述" width="200"></el-table-column>
        <el-table-column prop="supportState" label="助力状态" width="100" :formatter="formatSupportState"></el-table-column>
        
        <!-- 图片展示 -->
        <el-table-column label="图片" width="150">
          <template #default="scope">
            <img :src="getImageUrl(scope.row.sfileList)" alt="宣传图片" style="width: 100px; height: auto;" />
          </template>
        </el-table-column>
  
        <!-- 助力时间 -->
        <el-table-column label="助力时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.supportDate).toLocaleString() }}
          </template>
        </el-table-column>
  
        <!-- 更新时间 -->
        <el-table-column label="更新时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.updateDate).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="success" plain size="mini" @click="accept(scope.row)">接受</el-button>
                <el-button type="danger" plain size="mini" @click="refuse(scope.row)">拒绝</el-button>
              </template>
            </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        v-if="pagination.totalNum > 0"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.totalNum"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { ElNotification } from 'element-plus';
  import axios from "@/utils/axios-config";
  import { getImageUrl } from "@/utils/url-utils";


  const refuse = async (row) => {
  const sid = row.sid;  // 获取sid

  try {
    // 通过查询参数传递sid
    const response = await axios.post('/town-support/refuse', null, { params: { sid: sid } });

    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "拒绝成功！" });
      fetchData();
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "拒绝失败，请稍后重试。",
      });
    }
  } catch (error) {
    ElNotification.error({ title: "错误", message: "拒绝失败，请稍后重试。" });
  }
};




  
  // 分页信息
  const pagination = ref({
    currentPage: 1,
    pageSize: 5,
    totalNum: 0,
  });
  
  // 助力数据
  const supportList = ref([]);
  
  // 请求数据函数
  const fetchData = async () => {
    try {
      const puserName = localStorage.getItem('uname'); // 获取用户名
      if (!puserName) {
        ElNotification.error({ title: '错误', message: '未找到用户信息，请重新登录' });
        return;
      }
  
      // 请求的查询参数
      const queryForm = {
        puserName: puserName,
        pageNo: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
      };
  
      // 发送请求
      const response = await axios.post('/town-support/queryWaitHandle', queryForm, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (response.data.success) {
        const { totalNum, contentList } = response.data.data;
        pagination.value.totalNum = totalNum;  // 更新总条数
        supportList.value = contentList;       // 更新列表数据
      } else {
        ElNotification.error({ title: '错误', message: '加载数据失败' });
      }
    } catch (error) {
      ElNotification.error({ title: '错误', message: '请求失败，请稍后重试' });
    }
  };
  
  // 分页切换
  const handlePageChange = (newPage) => {
    pagination.value.currentPage = newPage;
    fetchData();  // 重新获取数据
  };
  
  // 格式化助力状态
  const formatSupportState = (row) => {
    switch (row.supportState) {
      case 0:
        return '待接受';
      case 1:
        return '已接受';
      case 2:
        return '拒绝';
      case 3:
        return '取消';
      default:
        return '未知状态';
    }
  };
  
  
  // 页面加载时请求数据
  onMounted(() => {
    fetchData();
  });
  </script>
  
  <style scoped>
  .el-table {
    margin-bottom: 20px;
  }
  </style>
  