<template>
  <div>
    <span style="font-size: 30px; font-weight: bold;">宣传信息</span>
  </div>

    <el-button type="success"  size="mini" @click="add()">新增宣传信息</el-button>

    <el-table :data="projects" style="width: 100%">
      <el-table-column label="标题" prop="ptitle" width="130"></el-table-column>
      <el-table-column label="类型" prop="type" width="130"></el-table-column>
      <el-table-column label="地点" width="200">
        <template #default="scope">
          {{ scope.row.provinceName }} - {{ scope.row.cityName }} - {{ scope.row.townName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="pdesc" width="300"></el-table-column>
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
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="success" plain size="mini" @click="openUpdateDialog(scope.row.pid)">更新</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.row.pid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirmUpdate">更新</el-button>
      </span>
    </el-dialog>
 
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios-config";
import { ElNotification } from "element-plus";
import { getImageUrl } from "@/utils/url-utils";
import { useRouter } from 'vue-router'
  

export default {
  setup() {
    const projects = ref([]);
    const totalNum = ref(0);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const dialogUpdateVisible = ref(false);
    const updateForm = ref({}); // 存储更新数据
    const router = useRouter()

    // 获取表格数据
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

    // 打开更新对话框
    const openUpdateDialog = async (pid) => {
      try {
        const response = await axios.get(`/town-advocacy-info/queryByPid`, { params: { pid } });
        if (response.data.success) {
          updateForm.value = response.data.data; // 将返回的数据填充到表单
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

    const fileList = ref([]); // 存储已上传文件
    // 上传成功回调
    const handleUploadSuccess = (response, file) => {
      fileList.value.push(file);
    };

    // 删除文件回调
    const handleFileRemove = (file) => {
      const index = fileList.value.indexOf(file);
      if (index !== -1) {
        fileList.value.splice(index, 1);
      }
    };

    const confirmUpdate = async () => {
      try {
        const formData = new FormData();
        formData.append("pid", updateForm.value.pid);
        formData.append("ptitle", updateForm.value.ptitle);
        formData.append("type", updateForm.value.type);
        formData.append("pdesc", updateForm.value.pdesc);
        formData.append("provinceName", updateForm.value.provinceName);
        formData.append("cityName", updateForm.value.cityName);
        formData.append("townName", updateForm.value.townName);
        formData.append("puserName", updateForm.value.puserName);

        const response = await axios.post("/town-advocacy-info/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          ElNotification.success({ title: "成功", message: "更新成功！" });
          dialogUpdateVisible.value = false;
          fetchData(currentPage.value); // 刷新表格数据
        } else {
          ElNotification.error({
            title: "错误",
            message: response.data.msg || "更新失败，请稍后重试。",
          });
        }
      } catch (error) {
        ElNotification.error({ title: "错误", message: "网络请求失败，请稍后重试。" });
      }
    };

    const handleDelete = async (pid) => {
      try {
        // 发送 DELETE 请求时，将 pid 作为 id 查询参数传递
        const response = await axios.delete(`/town-advocacy-info/delete`, {
          params: { id: pid }, // 将 pid 改为 id 传递
        });

        if (response.data.success) {
          ElNotification.success({ title: "成功", message: "删除成功！" });
          fetchData(currentPage.value); // 刷新数据
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


    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchData(1);
    };

    const add = () => {
      router.push('/addAdvocacyInfo')
    }

    onMounted(() => {
      fetchData();
    });

    return {
      projects,
      totalNum,
      pageSize,
      currentPage,
      dialogUpdateVisible,
      updateForm,
      fetchData,
      openUpdateDialog,
      confirmUpdate,
      handleDelete,
      handleSizeChange,
      getImageUrl,
      add,
    };
  },
};
</script>
