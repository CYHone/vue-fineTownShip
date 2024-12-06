<template>
  <div>
    <span style="font-size: 30px; font-weight: bold;">宣传信息</span>

    <el-table :data="projects" style="width: 100%">
      <el-table-column label="标题" prop="ptitle" width="130"></el-table-column>
      <el-table-column label="类型" prop="type" width="130"></el-table-column>
      <el-table-column label="地点" width="200">
        <template #default="scope">
          {{ scope.row.provinceName }} - {{ scope.row.cityName }} - {{ scope.row.townName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="pdesc" width="320"></el-table-column>
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
          <el-button type="success" plain size="mini" @click="handleUpdate(scope.row)">更新</el-button>
          <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios-config";
import { ElNotification } from "element-plus";
import { getImageUrl } from "@/utils/url-utils";

export default {
  setup() {
    const projects = ref([]);
    const totalNum = ref(0);
    const pageSize = ref(10);
    const currentPage = ref(1);

    const fetchData = async (page = 1) => {
      try {
        const puserName = localStorage.getItem("uname");
        if (!puserName) {
          ElNotification.error({ title: "错误", message: "用户名未找到，请先登录。" });
          return;
        }

        const response = await axios.post(
          `/town-advocacy-info/queryByName`,
          null, // 无请求体
          {
            params: {
              pageNo: page,
              pageSize: pageSize.value,
              puserName, // 正确传递为查询参数
            },
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

    const handleUpdate = (row) => {
      ElNotification.info({
        title: "更新",
        message: `更新功能暂未实现。目标ID: ${row.pid}`,
      });
    };

    const handleDelete = async (row) => {
      try {
        const response = await axios.post("/town-advocacy-info/delete", { id: row.pid });
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

    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchData(1);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      projects,
      totalNum,
      pageSize,
      currentPage,
      fetchData,
      handleUpdate,
      handleDelete,
      handleSizeChange,
      getImageUrl,
    };
  },
};
</script>

<style scoped>
</style>
