<template>
    <div>
      <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">助力信息</span>
      <el-card :body-style="{ padding: '10px', height: '100%' }" style="width: 100%;
   max-width: 2000px; margin: 20px auto; height: 550px; overflow-y: auto;">

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
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="success" plain size="mini" @click="openUpdateDialog(scope.row)">更新</el-button>
                <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
      
      </el-table>

      </el-card>
    </div>

            <!-- 更新对话框 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新助力" width="40%">
      <el-form :model="updateForm" label-width="120px">

        <el-form-item label="标题">
          <el-input v-model="updateForm.stitle"></el-input>
        </el-form-item>
        <el-form-item label="助力描述">
          <el-input v-model="updateForm.sdesc"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <img
            :src="getImageUrl(updateForm.sfileList)"
            alt="宣传图片"
            style="width: 100px; height: auto;"
          />
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
        <el-button @click="dialogUpdateVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmAdd">更新</el-button>
      </span>
    </el-dialog>


  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/utils/axios-config';
  import { ElNotification } from 'element-plus';
  import { getImageUrl } from "@/utils/url-utils";
  import { useRouter } from 'vue-router';
  const router = useRouter();
  
  const supportList = ref([]);
  const dialogUpdateVisible = ref(false);
  const updateForm = ref({});

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
      formData.append('stitle', updateForm.value.stitle);
      formData.append('sdesc', updateForm.value.sdesc);
      formData.append('suserName', localStorage.getItem('uname')); 
      formData.append('pid', localStorage.getItem('pid'));
      formData.append('sid', localStorage.getItem('sid'));
      const files = fileList.value;  // 确保 files 是期望的数组
      if( files.length !== 0 ){
        files.forEach(file => formData.append('files', file.raw));
      }

    const response = await axios.post("/town-support/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "更新成功！" });
      dialogUpdateVisible.value = false;
      fetchData();
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


const openUpdateDialog = async (row) => {
  const sid = row.sid;
  try {
    const response = await axios.get(`/town-support/queryBySid`, { params: { sid } });
    if (response.data.success) {
      localStorage.setItem('sid', row.sid)
      localStorage.setItem('pid', row.pid)
      updateForm.value = response.data.data;
      dialogUpdateVisible.value = true;
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "获取数据失败，请稍后重试。",
      });
    }
  } catch (error) {
    ElNotification.error({ title: "错误", message: "网络请求失败，请稍后重试。" });
  }
};


const fetchData  = async () => {
        try {
            const suserName = localStorage.getItem('uname'); // 获取 localStorage 中的用户名

            if (!suserName) {
            ElNotification.error({ title: '错误', message: '未找到用户信息，请重新登录' });
            return;
            }

            const response = await axios.post('/town-support/queryByName', 
            `pageNo=1&pageSize=999&suserName=${suserName}`, {
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
        };



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

  const handleDelete = async (row) => {
    const sid = row.sid;
  try {
    const response = await axios.delete(`/town-support/delete`, { params: { id: sid } });
    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "删除成功！" });
      fetchData();
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "删除失败，请稍后重试。",
      });
    }
  } catch (error) {
    //ElNotification.error({ title: "错误", message: "删除失败，请稍后重试。" });
  }
};
  

onMounted(() => {
  fetchData();
});
  // Handle the action when the "处理" button is clicked
  const handleAction = (row) => {
    ElNotification.success({
      title: '成功',
      message: `处理了助力信息: ${row.stitle}`,
    });
  };
  const add = () => {
    router.push('/addSupport');
  };
  </script>
  
  <style scoped>
  /* You can add custom styling here */
  </style>
  