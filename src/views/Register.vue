<template>
  <div class="login-box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <h1>《好乡镇》系统平台</h1>
      <h3>注册</h3>
      <el-form-item label="用户名：" prop="bname" style="width: 500px;">
        <el-input placeholder="请输入用户名" v-model="ruleForm.bname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码：" prop="bpwd" style="width:  500px;">
        <el-input placeholder="请输入密码" v-model="ruleForm.bpwd" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="证件类型：" prop="ctype" style="width:  500px;">
        <el-input placeholder="请输入证件类型(默认身份证)" v-model="ruleForm.ctype" autocomplete="off" />
      </el-form-item>
      <el-form-item label="证件号码：" prop="idno" style="width:  500px;">
        <el-input placeholder="请输入证件号码" v-model="ruleForm.idno" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="phoneNo" style="width:  500px;">
        <el-input placeholder="请输入联系电话" v-model="ruleForm.phoneNo"  autocomplete="off" />
      </el-form-item>
      <el-form-item label="注册名称：" prop="uname" style="width:  500px;">
        <el-input placeholder="请输入注册名称" v-model="ruleForm.uname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="简介：" prop="remark" style="width:  500px;">
        <el-input placeholder="请输入简介" v-model="ruleForm.remark" autocomplete="off" />
      </el-form-item>
      <el-form-item label="验证码" prop="sidentifyMode" style="width: 500px">
        <template #default>
          <div class="code-wrapper">
            <el-input
              placeholder="请输入验证码"
              v-model="sidentifyMode"
              clearable
              class="code-input"
            ></el-input>
            <div class="code" @click="refreshCode">
              <SIdentify :identifyCode="identifyCode"></SIdentify>
            </div>
          </div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="success" class="login-btn" @click="register()">注册</el-button>
        <el-button type="primary" class="login-btn" @click="login()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import SIdentify from '@/utils/SidentifyView.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import axios from '@/utils/axios-config.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let sidentifyMode = ref('') //输入框验证码
let identifyCode = ref('') //图形验证码
let identifyCodes = ref('1234567890abcdefjhijklinopqrsduvwxyz') //验证码出现的数字和字母

onMounted(() => {
  identifyCode.value = ''
  makeCode(identifyCodes.value, 4)
})

const randomNum = (min, max) => {
  max = max + 1
  return Math.floor(Math.random() * (max - min) + min)
}

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += o[randomNum(0, o.length)]
  }
}

const refreshCode = () => {
  identifyCode.value = ''
  makeCode(identifyCodes.value, 4)
}

const ruleForm = ref({
    bname: "",
    bpwd: "",
    ctype: "",
    idno: "",
    phoneNo: "",
    remark: "",
    uname: ""
})

const rules = ref({
  uname: [
    { required: true, message: '请输入注册名称', trigger: 'blur' },
    { min: 2, max: 15, message: '用户名长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  phoneNo: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的电话号码', trigger: ['blur', 'change'] }
  ],
  bpwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const ruleFormRef = ref(null)

const register = () => {
  ruleFormRef.value.validate((valid) => {
    if (!sidentifyMode.value) {
      ElMessage({ type: 'error', message: '验证码不能为空！' })
      return
    }
    if (sidentifyMode.value !== identifyCode.value) {
      ElMessage({ type: 'error', message: '验证码错误' })
      refreshCode()
      return
    }
    if (valid) {
      const requestData = {
        bname: ruleForm.value.bname,
        bpwd: ruleForm.value.bpwd,
        ctype: ruleForm.value.ctype,
        idno: ruleForm.value.idno,
        phoneNo: ruleForm.value.phoneNo,
        remark: ruleForm.value.remark,
        uname: ruleForm.value.uname
      }
      axios.post('/buser/register', requestData)
        .then(function (response) {
          console.log('响应数据：', response.data)

          // 判断返回的 code 是否为 200
          if (response.data.code === 200 && response.data.success) {
            ElMessage({ type: 'success', message: '注册成功' })
            
            router.push('/login')
          } else {
            // 如果 code 不为 200 或 success 为 false，显示错误消息
            ElMessage({ type: 'error', message: response.data.msg || '注册失败' })
          }
        })
        .catch(function (error) {
          console.error('请求出错：', error)
        })
    }
  })
}

const login = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  background: url('src/assets/login.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  text-align: center;
  padding: 1px;
  .demo-ruleForm {
    width: 520px;
    margin: 200px auto;
    background: #ffffff;
    padding: 40px;
    border-radius: 5px;
  }
  .code-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .code-input {
    flex: 1;
    margin-right: 20px;
  }
  .code {
    text-align: center;
    margin-bottom: 10px;
  }
  .login-btn {
    width: 40%;
  }
  h2 {
    margin-bottom: 20px;
  }
}
</style>
