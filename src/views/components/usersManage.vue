<template>
  <div style="padding-bottom: 20px;">
    <span style="font-size: 30px; font-weight: bold;">个人信息</span>
  </div>
  
  <el-card style="width: 50%">
    <el-form :model="updateForm" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="updateForm.uname" disabled></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="updateForm.idno" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="updateForm.bname" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户等级">
        <el-input v-model="updateForm.userLevel" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="updateForm.phoneNo"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="updateForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="updateForm.bpwd"></el-input>
      </el-form-item>
      <div style="display: flex; justify-content: center; margin-top: 20px;">
        <el-button type="primary" @click="updateUser">更新用户信息</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios-config';
import { ElNotification } from 'element-plus';

const updateForm = ref({
  id: '',
  uname: '',
  ctype: '',
  idno: '',
  bname: '',
  bpwd: '',
  phoneNo: '',
  userLevel: '',
  remark: ''
});

const fetchUser = async () => {
  const id = localStorage.getItem('id');
  try {
    const response = await axios.get(`/buser/view?id=${id}`);
    const userData = response.data.data;
    updateForm.value = {
      id: userData.id,
      uname: userData.uname,
      ctype: userData.ctype,
      idno: userData.idno,
      bname: userData.bname,
      bpwd: userData.bpwd,
      phoneNo: userData.phoneNo,
      userLevel: userData.userLevel,
      remark: userData.remark
    };
  } catch (error) {
    ElNotification.error({ title: '错误', message: '获取用户数据失败，请稍后重试。' });
  }
};

const updateUser = async () => {
  try {
    const response = await axios.post('/buser/update', {
      id: updateForm.value.id,
      bpwd: updateForm.value.bpwd,
      phoneNo: updateForm.value.phoneNo,
      remark: updateForm.value.remark
    });

    if (response.data.success) {
      ElNotification.success({ title: '成功', message: '用户信息更新成功！' });
    } else {
      ElNotification.error({ title: '错误', message: response.data.msg || '用户信息更新失败，请重试。' });
    }
  } catch (error) {
    ElNotification.error({ title: '错误', message: '更新失败，请检查网络或稍后重试。' });
  }
};

onMounted(() => {
  fetchUser();
});
</script>
