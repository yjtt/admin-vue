<template>
<div class="login-wrap">
  <el-form
    class="login-from"
    label-position="top"
    ref="form"
    :model="userForm"
    label-width="80px">
    <el-form-item label="用户名">
      <el-input
        v-model="userForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input
        type="password"
        v-model="userForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="login"
        class="login-btn">立即创建</el-button>
    </el-form-item>
</el-form>
</div>
</template>

<script>
import {saveUserInfo} from '@/assets/js/auth'
export default {
  data () {
    return {
      userForm: {
        user: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      // 1. 采集表单数据
      // 2. 表单验证
      const res = await this.$http.post('/login', this.userForm)
      console.log(res)
      const data = res.data
      if (data.meta.status === 200) {
        // 登陆成功，将服务器签发给用户的Token身份令牌记录到localStorage中
        // 其他需要使用Token的都去本地存储获取
        saveUserInfo(data.data)
        this.$router.push({
          name: 'home'
        })
        // 给出登录成功的提示消息
        this.$message({
          type: 'success',
          message: '登录成功'
        })
      }
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding:30px;
  border-radius: 5px;
}
.login-wrap .login-form .login-btn {
  width:100%;
}
</style>
