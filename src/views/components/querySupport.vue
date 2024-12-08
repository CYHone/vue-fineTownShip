<template>
    <div>
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">查询助力信息</span>
            
      <el-form :model="queryForm" label-width="120px" ref="formRef" class="query-form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市名称" prop="cityName">
              <el-input v-model="queryForm.cityName" placeholder="请输入城市名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="省份名称" prop="provinceName">
              <el-input v-model="queryForm.provinceName" placeholder="请输入省份名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="助力标题" prop="stitle">
              <el-input v-model="queryForm.stitle" placeholder="请输入助力标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="助力类型" prop="type">
              <el-select v-model="queryForm.type" placeholder="请选择助力类型">
                <el-option label="农家院" value="农家院"></el-option>
                <el-option label="自然风光秀丽" value="自然风光秀丽"></el-option>
                <el-option label="古建筑" value="古建筑"></el-option>
                <el-option label="土特产" value="土特产"></el-option>
                <el-option label="特色小吃" value="特色小吃"></el-option>
                <el-option label="民俗活动" value="民俗活动"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="6">
            <el-form-item label="被助力乡镇" prop="townName">
              <el-input v-model="queryForm.townName" placeholder="请输入乡镇名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="页码" prop="pageNo">
              <el-input-number v-model="queryForm.pageNo" :min="1" placeholder="请输入页码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="每页条数" prop="pageSize">
              <el-input-number v-model="queryForm.pageSize" :min="1" :max="100" placeholder="每页条数" />
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-form-item>
          <el-button type="primary" @click="searchSupportInfo">查询</el-button>
          <el-button @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 查询结果表格 -->
      <el-table :data="supportList" style="width: 100%" v-if="supportList.length > 0">
        <el-table-column prop="stitle" label="助力标题"  width="150"></el-table-column>
        <el-table-column prop="suserName" label="助力用户名"  width="100"></el-table-column>
        <el-table-column prop="sdesc" label="助力描述"  width="200"></el-table-column>
        <el-table-column prop="supportState" label="助力状态" width="100"
                        :formatter="formatSupportState"></el-table-column>
                        <el-table-column label="文件" width="200">
            <template #default="scope">
              <div v-if="isImage(scope.row.sfileList)">
                <img
                  :src="getFileUrl(scope.row.sfileList)"
                  alt="宣传图片"
                  style="width: 100px; height: auto;"
                />
              </div>
              <div v-else-if="isVideo(scope.row.sfileList)">
                <video
                  :src="getFileUrl(scope.row.sfileList)"
                  controls
                  style="width: 100px; height: auto;"
                ></video>
              </div>
              <div v-else>
                <span>文件格式不支持</span>
              </div>
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
        </el-table>
    
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
  import { ref } from 'vue';
  import axios from '@/utils/axios-config';
  import { ElNotification } from 'element-plus';
 
  import { getImageUrl, getFileUrl } from "@/utils/url-utils";

  // 判断文件是否为图片
  const isImage = (fileName) => {
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return imageFormats.includes(fileExtension);
  };

  // 判断文件是否为视频
  const isVideo = (fileName) => {
  const videoFormats = ['mp4', 'avi', 'mov'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return videoFormats.includes(fileExtension);
  };

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
  
  const queryForm = ref({
    cityName: '',
    provinceName: '',
    stitle: '',
    townName: '',
    type: '',
    pageNo: 1,
    pageSize: 5
  });
  
  const supportList = ref([]);
  const pagination = ref({
    currentPage: 1,
    pageSize: 5,
    totalNum: 0,
  });
  
  const searchSupportInfo = async () => {
    try {
      const response = await axios.post('/town-support/query', queryForm.value, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      if (response.data.success) {
        supportList.value = response.data.data.contentList;
        pagination.value.totalNum = response.data.data.totalNum;
        pagination.value.currentPage = response.data.data.currentPage;
      } else {
        ElNotification.error({ title: '查询失败', message: response.data.msg || '请稍后再试' });
      }
    } catch (error) {
      ElNotification.error({ title: '请求错误', message: '查询失败，请稍后重试' });
    }
  };
  
  const resetQueryForm = () => {
    queryForm.value = {
      cityName: '',
      provinceName: '',
      stitle: '',
      townName: '',
      type: '',
      pageNo: 1,
      pageSize: 5
    };
  };
  
  const handlePageChange = (page) => {
    queryForm.value.pageNo = page;
    searchSupportInfo();
  };
  
  const viewDetail = (row) => {
    // 这里可以执行查看详情的操作，比如跳转到详情页面
    console.log('查看详情', row);
  };
  </script>
  
  <style scoped>
  .query-form {
    margin-bottom: 20px;
  }
  </style>
  