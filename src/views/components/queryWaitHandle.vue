<template>
    <div>
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">助力信息</span>
      <el-table :data="supportList" style="width: 100%">
        <el-table-column prop="stitle" label="助力标题"  width="150"></el-table-column>
        <el-table-column prop="suserName" label="助力用户名"  width="100"></el-table-column>
        <el-table-column prop="sdesc" label="助力描述"  width="200"></el-table-column>
        <el-table-column prop="supportState" label="助力状态" width="100"
                        :formatter="formatSupportState"></el-table-column>
        <el-table-column label="图片" width="200">
            <template #default="scope">
            <img
                :src="getImageUrl(scope.row.sfileList)"
                alt="宣传图片"
                style="width: 100px; height: auto;"
            />
            </template>
        </el-table-column>
            <el-table-column label="助力时间" width="180">
                <template #default="scope">
                {{ new Date(scope.row.supportDate).toLocaleString() }}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
                <template #default="scope">
                {{ new Date(scope.row.updateDate).toLocaleString() }}
                </template>
            </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button @click="handleAction(row)" type="primary">处理</el-button>
          </template>
        </el-table-column>
      
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/utils/axios-config';
  import { ElNotification } from 'element-plus';
  import { getImageUrl } from "@/utils/url-utils";
  
  const supportList = ref([]);
  
  onMounted(async () => {
        try {
            const puserName = localStorage.getItem('uname'); // 获取 localStorage 中的用户名

            if (!puserName) {
            ElNotification.error({ title: '错误', message: '未找到用户信息，请重新登录' });
            return;
            }

            const response = await axios.post('/town-support/queryWaitHandle', 
            `pageNo=1&pageSize=5&puserName=${puserName}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // 确保传递的是 x-www-form-urlencoded 格式
            }
            });

            if (response.data.success) {
            supportList.value = response.data.data.contentList;
            } else {
            ElNotification.error({ title: '错误', message: '加载数据失败' });
            }
        } catch (error) {
            ElNotification.error({ title: '错误', message: '请求失败，请稍后重试' });
        }
        });



  // Format supportState to display corresponding Chinese status
  const formatSupportState = (row, column, cellValue) => {
    switch (cellValue) {
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
  
  // Handle the action when the "处理" button is clicked
  const handleAction = (row) => {
    ElNotification.success({
      title: '成功',
      message: `处理了助力信息: ${row.stitle}`,
    });
  };
  </script>
  
  <style scoped>
  /* You can add custom styling here */
  </style>
  