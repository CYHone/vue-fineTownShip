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
              <div v-if="isImage(scope.row.pfileList)">
                <img
                  :src="getFileUrl(scope.row.pfileList)"
                  alt="宣传图片"
                  style="width: 100px; height: auto;"
                />
              </div>
              <div v-else-if="isVideo(scope.row.pfileList)">
                <video
                  :src="getFileUrl(scope.row.pfileList)"
                  controls
                  style="width: 100px; height: auto;"
                ></video>
              </div>
              <div v-else>
                <span>文件格式不支持</span>
              </div>
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


        <!-- 新增对话框 -->
    <el-dialog v-model="dialogAddVisible" title="新增助力" width="40%">
      <el-form :model="addForm" label-width="120px">

        <el-form-item label="标题">
          <el-input v-model="addForm.stitle"></el-input>
        </el-form-item>
        <el-form-item label="助力描述">
          <el-input v-model="addForm.sdesc"></el-input>
        </el-form-item>
                <!-- 文件上传 -->
        <el-form-item label="上传文件" prop="files" :rules="[{ required: true, message: '请上传宣传文件', trigger: 'blur' }]">
          <el-upload
            action=""
            :on-success="handleFileSuccess"
            :on-remove="handleFileRemove"
            multiple
            :limit="5"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :http-request="dummyRequest"
            :show-file-list="true"
          >
            <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmAdd">新增</el-button>
      </span>
    </el-dialog>

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

  const dialogAddVisible = ref(false);
  const addForm = ref({});

  const form = ref({
    files: []
  });

  const fileList = ref([]); 
  // 假的上传请求（因为后端接口需要文件）
  const dummyRequest = (options) => {
    setTimeout(() => {
      options.onSuccess();
    }, 1000);
  };
  
  // 文件上传前校验
  const beforeUpload = (file) => {
    const isFileSizeValid = file.size / 1024 / 1024 < 10; // 文件大小不超过10MB
    if (!isFileSizeValid) {
      ElNotification.error({ title: '文件大小超出限制', message: '每个文件最大为 10MB' });
    }
    return isFileSizeValid;
  };
  
  // 文件上传成功的回调
  const handleFileSuccess = (response, file) => {
    fileList.value.push(file);
    form.value.files = fileList.value;
  };
  
  // 文件移除的回调
  const handleFileRemove = (file) => {
    const index = fileList.value.indexOf(file);
    if (index !== -1) {
      fileList.value.splice(index, 1);
    }
  };
  const confirmAdd = async () => {
  try {
    const formData = new FormData();
      formData.append('stitle', addForm.value.stitle);
      formData.append('sdesc', addForm.value.sdesc);
      formData.append('suserName', localStorage.getItem('uname')); 
      formData.append('pid', localStorage.getItem('pid'));
      const files = fileList.value;  // 确保 files 是期望的数组
      if( files.length !== 0 ){
        files.forEach(file => formData.append('files', file.raw));
      }

    const response = await axios.post("/town-support/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "助力成功！" });
      dialogAddVisible.value = false;
      fetchData(currentPage.value); // Refresh data
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "助力失败，请稍后重试。",
      });
    }
  } catch (error) {
    // ElNotification.error({ title: "错误", message: "请稍后重试。" });
  }
};

const handleAction = (row) =>{
  localStorage.setItem('pid', row.pid)
  dialogAddVisible.value = true;
}
  
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
  