<template>
    <div>
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">新增宣传信息</span>
    </div>

    <el-card style="width: 60%">
      <el-form :model="form" label-width="120px" ref="formRef">
        <!-- 宣传标题 -->
        <el-form-item label="宣传标题" prop="ptitle" :rules="[{ required: true, message: '请输入宣传标题', trigger: 'blur' }]">
          <el-input v-model="form.ptitle" placeholder="请输入宣传标题"></el-input>
        </el-form-item>
  
        <!-- 宣传类型 -->
        <el-form-item label="宣传类型" prop="type" :rules="[{ required: true, message: '请输入宣传类型', trigger: 'blur' }]">
          <el-input v-model="form.type" placeholder="请输入宣传类型"></el-input>
        </el-form-item>
  
        <!-- 宣传描述 -->
        <el-form-item label="宣传描述" prop="pdesc" :rules="[{ required: true, message: '请输入宣传描述', trigger: 'blur' }]">
          <el-input v-model="form.pdesc" placeholder="请输入宣传描述" type="textarea"></el-input>
        </el-form-item>
  
        <!-- 地点 -->
        <el-form-item label="省份" prop="provinceName" :rules="[{ required: true, message: '请输入省份', trigger: 'blur' }]">
          <el-input v-model="form.provinceName" placeholder="请输入省份"></el-input>
        </el-form-item>
  
        <el-form-item label="城市" prop="cityName" :rules="[{ required: true, message: '请输入城市', trigger: 'blur' }]">
          <el-input v-model="form.cityName" placeholder="请输入城市"></el-input>
        </el-form-item>
  
        <el-form-item label="乡镇" prop="townName" :rules="[{ required: true, message: '请输入乡镇', trigger: 'blur' }]">
          <el-input v-model="form.townName" placeholder="请输入乡镇"></el-input>
        </el-form-item>
  
        <!-- 文件上传 -->
        <el-form-item label="上传图片" prop="files" :rules="[{ required: true, message: '请上传宣传图片', trigger: 'blur' }]">
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
  
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from "@/utils/axios-config";
  import { ElNotification } from "element-plus";
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const form = ref({
    ptitle: '',
    type: '',
    pdesc: '',
    provinceName: '',
    cityName: '',
    townName: '',
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
  
  // 提交表单
  const submitForm = async () => {
  const { ptitle, type, pdesc, provinceName, cityName, townName, files } = form.value;
  if (!ptitle || !type || !pdesc || !provinceName || !cityName || !townName || files.length === 0) {
    ElNotification.error({ title: '错误', message: '请完整填写所有必填项' });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('ptitle', ptitle);
    formData.append('type', type);
    formData.append('pdesc', pdesc);
    formData.append('provinceName', provinceName);
    formData.append('cityName', cityName);
    formData.append('townName', townName);
    formData.append('puserName', localStorage.getItem('uname')); // 假设“Zhiend”为发布用户名

    // 通过 FormData 正确地上传文件
    files.forEach(file => formData.append('files', file.raw));

    const response = await axios.post('/town-advocacy-info/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      ElNotification.success({ title: '成功', message: '宣传信息已保存' });
    
    } else {
      ElNotification.error({ title: '错误', message: response.data.msg || '保存失败' });
    }
  } catch (error) {
    ElNotification.error({ title: '错误', message: '提交失败，请稍后重试' });
  }
};

  
  // 重置表单
  const resetForm = () => {
    form.value = {
      ptitle: '',
      type: '',
      pdesc: '',
      provinceName: '',
      cityName: '',
      townName: '',
      files: []
    };
    fileList.value = [];
  };
  </script>
  
  <style scoped>
  /* 可以根据需要添加自定义样式 */
  </style>
  