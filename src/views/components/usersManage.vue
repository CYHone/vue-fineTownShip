<template>
    <div style="padding-bottom: 20px;">
      <span style="font-size: 24px; font-weight: bold;">用户管理</span>
    </div>
  
    <el-card style="width: 80%">
      <div>
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="id" label="ID" width="100px"></el-table-column>
          <el-table-column prop="username" label="用户名" width="200px"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
          <el-table-column label="操作" width="600">
            <template #default="scope">
              <el-button type="success" round size="mini" @click="handleUpdate(scope.row)">修改用户</el-button>
              <el-button type="danger" round size="mini" @click="handleDelete(scope.row)">删除用户</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="fetchUsers"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>
  
    <el-dialog v-model="updateDialogVisible" title="修改用户" :visible="updateDialogVisible" width="600px">
      <el-form :model="updateForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/utils/axios-config';
  import { ElNotification } from 'element-plus';
  
  const users = ref([]);
  const totalNum = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10); // 默认每页显示条数
  const updateDialogVisible = ref(false); // 修改为 false
  const updateForm = ref({
    id: '',
    username: '',
    email: '',
    password: ''
  });
  
  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get('/users/all', {
        params: {
          pageNo: page,
          pageSize: pageSize.value
        }
      });
  
      if (response.data.success) {
        const { totalPage, currentPage, totalNum, contentList } = response.data.data;
        users.value = contentList;
        totalNum.value = totalNum;
        currentPage.value = currentPage;
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  };
  
  const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    fetchUsers(currentPage.value);
  };
  
  const handleUpdate = (user) => {
    updateDialogVisible.value = true;
    updateForm.value = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: ''
    };
  };
  
  const updateUser = async () => {
    try {
      const response = await axios.put(`/users/${updateForm.value.id}`, {
        username: updateForm.value.username,
        email: updateForm.value.email,
        password: updateForm.value.password
      });
      if (response.data.success) {
        ElNotification.success('成功更新用户信息');
        updateDialogVisible.value = false;
        fetchUsers(currentPage.value);
      } else {
        ElNotification.error('更新用户信息失败');
      }
    } catch (error) {
      console.error('更新用户信息失败', error);
      ElNotification.error('更新用户信息失败');
    }
  };
  
  onMounted(() => {
    fetchUsers();
  });
  </script>