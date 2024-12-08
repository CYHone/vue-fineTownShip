<template>
    <div>
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">查询宣传信息</span>
  
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
            <el-form-item label="好乡镇宣传标题" prop="ptitle">
              <el-input v-model="queryForm.ptitle" placeholder="请输入宣传标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宣传类型" prop="type">
              <el-select v-model="queryForm.type" placeholder="请选择宣传类型">
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
            <el-form-item label="被宣传乡镇" prop="townName">
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
          <el-button type="primary" @click="searchAdvocacyInfo">查询</el-button>
          <el-button @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 查询结果表格 -->
      <el-table :data="advocacyList" style="width: 100%" v-if="advocacyList.length > 0">
        <el-table-column prop="ptitle" label="宣传标题" width="100"></el-table-column>
        <el-table-column prop="type" label="宣传类型" width="100"></el-table-column>
        <el-table-column label="地点" width="180">
            <template #default="scope">
            {{ scope.row.provinceName }} - {{ scope.row.cityName }} - {{ scope.row.townName }}
            </template>
        </el-table-column>
        <el-table-column prop="pdesc" label="宣传描述" width="250"></el-table-column>
            <el-table-column label="图片" width="200">
            <template #default="scope">
            <img
                :src="getImageUrl(scope.row.pfileList)"
                alt="宣传图片"
                style="width: 100px; height: auto;"
            />
            </template>
        </el-table-column>
        <el-table-column label="开始时间" width="180">
            <template #default="scope">
            {{ new Date(scope.row.pbeginDate).toLocaleString() }}
            </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
            <template #default="scope">
            {{ new Date(scope.row.pupdateDate).toLocaleString() }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button @click="handleAction(row)" type="primary">我助力</el-button>
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
  import { getImageUrl } from "@/utils/url-utils";
  
  const queryForm = ref({
    cityName: '',
    provinceName: '',
    ptitle: '',
    townName: '',
    type: '',
    pageNo: 1,
    pageSize: 5
  });
  
  const advocacyList = ref([]);
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    totalNum: 0,
  });
  
  const searchAdvocacyInfo = async () => {
    try {
      const response = await axios.post('/town-advocacy-info/query', queryForm.value, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      if (response.data.success) {
        advocacyList.value = response.data.data.contentList;
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
      ptitle: '',
      townName: '',
      type: '',
      pageNo: 1,
      pageSize: 10
    };
  };
  
  const handlePageChange = (page) => {
    queryForm.value.pageNo = page;
    searchAdvocacyInfo();
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
  