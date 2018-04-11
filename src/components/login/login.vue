<template>
<div class="login-wrap">
  <el-form
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
      <el-button type="primary" @click="login">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios'
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
      const res = await axios.post('http://localhost:8888/api/private/v1/login', this.userForm)
      console.log(res)
      const data = res.data
      if (data.meta.status === 200) {
        this.$router.push({
          name: 'home'
        })
      }
    }
  }
}
</script>

<style>
</style>
