<template>
  <div>
    <span style="font-size: 30px; font-weight: bold; padding-right: 50px;">宣传信息</span>
    <el-button  type="success" size="mini" @click="add">新增宣传信息</el-button>
  </div>

  <el-card :body-style="{ padding: '20px', height: '100%' }" style="width: 100%;
   max-width: 800px; margin: 20px auto; height: 550px; overflow-y: auto;">
  <el-row v-for="item in projects" :key="item.pid" class="post-container" style="margin-bottom: 20px;">
      <!-- 标题 -->
      <el-col :span="24">
        <h3>标题：{{ item.ptitle }} 类型：{{ item.type }} 
          地点：{{ item.provinceName }} - {{ item.cityName }} - {{ item.townName }}</h3>
      </el-col>
      
      <!-- 描述 -->
      <el-col :span="24">
        <p>描述：{{ item.pdesc }}</p>
      </el-col>

      <!-- 图片/视频展示 -->
      <el-col :span="24" class="media-container">
        <div v-if="isImage(item.pfileList)">
          <img :src="getFileUrl(item.pfileList)" alt="宣传图片" class="media" />
        </div>
        <div v-else-if="isVideo(item.pfileList)">
          <video :src="getFileUrl(item.pfileList)" controls class="media"></video>
        </div>
        <div v-else>
          <span>文件格式不支持</span>
        </div>
      </el-col>

      <!-- 时间 -->
      <el-col :span="12">
        <p>开始时间: {{ new Date(item.pbeginDate).toLocaleString() }}</p>
      </el-col>
      <el-col :span="12">
        <p>更新时间: {{ new Date(item.pupdateDate).toLocaleString() }}</p>
      </el-col>

      <!-- 操作按钮 -->
      <el-col :span="24" class="operation-buttons">
        <el-button type="success" plain size="mini" @click="openUpdateDialog(item.pid)">更新</el-button>
        <el-button type="danger" plain size="mini" @click="handleDelete(item.pid)">删除</el-button>
      </el-col>
    </el-row>
</el-card>



    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      @current-change="fetchData"
      @size-change="handleSizeChange"
    ></el-pagination>

    <!-- 更新对话框 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新模块" width="40%">
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="updateForm.ptitle"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="updateForm.type"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="updateForm.pdesc"></el-input>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="updateForm.provinceName" placeholder="省份"></el-input>
          <el-input v-model="updateForm.cityName" placeholder="城市"></el-input>
          <el-input v-model="updateForm.townName" placeholder="乡镇"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <img
            :src="getImageUrl(updateForm.pfileList)"
            alt="宣传图片"
            style="width: 100px; height: auto;"
          />
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

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmUpdate">更新</el-button>
      </span>
    </el-dialog>
 
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios-config";
import { ElNotification } from "element-plus";
import { getImageUrl, getFileUrl } from "@/utils/url-utils";
import { useRouter } from 'vue-router';

const projects = ref([]);
const totalNum = ref(0);
const pageSize = ref(5);
const currentPage = ref(1);
const dialogUpdateVisible = ref(false);
const updateForm = ref({});
const router = useRouter();


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


// Fetch table data
const fetchData = async (page = 1) => {
  try {
    const puserName = localStorage.getItem("uname");
    if (!puserName) {
      ElNotification.error({ title: "错误", message: "用户名未找到，请先登录。" });
      return;
    }

    const response = await axios.post(
      `/town-advocacy-info/queryByName`,
      null,
      {
        params: { pageNo: page, pageSize: pageSize.value, puserName },
      }
    );

    if (response.data.success) {
      const { totalNum: total, contentList } = response.data.data;
      projects.value = contentList;
      totalNum.value = total;
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
  const confirmUpdate = async () => {
  try {
    const formData = new FormData();
      formData.append('ptitle', updateForm.value.ptitle);
      formData.append('type', updateForm.value.type);
      formData.append('pdesc', updateForm.value.pdesc);
      formData.append('provinceName', updateForm.value.provinceName);
      formData.append('cityName', updateForm.value.cityName);
      formData.append('townName', updateForm.value.townName);
      formData.append('puserName', localStorage.getItem('uname')); 
      formData.append('pid', updateForm.value.pid);
      const files = fileList.value;  // 确保 files 是期望的数组
      if( files.length !== 0 ){
        files.forEach(file => formData.append('files', file.raw));
      }

    const response = await axios.post("/town-advocacy-info/save", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "更新成功！" });
      dialogUpdateVisible.value = false;
      fetchData(currentPage.value); // Refresh data
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "更新失败，请稍后重试。",
      });
    }
  } catch (error) {
    ElNotification.error({ title: "错误", message: "请稍后重试。" });
  }
};


const openUpdateDialog = async (pid) => {
  try {
    const response = await axios.get(`/town-advocacy-info/queryByPid`, { params: { pid } });
    if (response.data.success) {
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





const handleDelete = async (pid) => {
  try {
    const response = await axios.delete(`/town-advocacy-info/delete`, { params: { id: pid } });
    if (response.data.success) {
      ElNotification.success({ title: "成功", message: "删除成功！" });
      fetchData(currentPage.value);
    } else {
      ElNotification.error({
        title: "错误",
        message: response.data.msg || "删除失败，请稍后重试。",
      });
    }
  } catch (error) {
    ElNotification.error({ title: "错误", message: "删除失败，请稍后重试。" });
  }
};

// Handle pagination size change
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchData(1);
};

// Navigate to the add page
const add = () => {
  router.push('/addAdvocacyInfo');
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.post-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 18px;
  font-weight: bold;
}

p {
  font-size: 14px;
  color: #666;
}

.media-container {
  text-align: center;
  margin: 10px 0;
}

.media {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.operation-buttons {
  text-align: right;
  margin-top: 10px;
}

.operation-buttons .el-button {
  margin-left: 10px;
}
</style>
