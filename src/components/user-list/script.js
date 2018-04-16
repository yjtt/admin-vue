export default {
  async created () {
    // 第一次进来请求的分页数据：第一页，每页两条
    this.loadUsersByPage(1)
  },
  data () {
    return {
      searchText: '',
      tableData: [], // 表格列表数据
      totalSize: 0, // 总记录数据
      currentPage: 1, // 当前页码
      pageSize: 1, // 当前每页大小
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 控制添加用户的对话框的显示和隐藏
      dialogFormVisible: false,
      // 控制编辑用户对话框的显示和隐藏
      dialogEditFormVisible: false,
      // 添加rules验证规则
      addUserFormRules: {
        username: [
          {require: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 18, message: '长度在3到18个字符', trigger: 'blur'}
        ],
        password: [
          {require: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 18, message: '长度在3到18个字符', trigger: 'blur'}
        ],
        email: [
          {require: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        mobile: [
          {require: true, message: '请输入手机号', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async handleSizeChange (pageSize) {
      // console.log('每页大小：', pageSize)
      // 价格用户选择的页码大小存储起来
      // 用于页码改变之后，再次点击页码的时候获取最新用户选择的每页大小
      this.pageSize = pageSize
      // 页码发生改变
      // 重新请求列表数据
      // 用户改变每页大小之后，我们请求新的数据，以新的每页大小的第一页为准
      this.loadUsersByPage(1, pageSize)
      // 页码改变之后，不仅让数据到了第1页
      // 同时也要让页码高亮状态也跑到第1页
      this.currentPage = 1
    },
    async handleCurrentChange (currentPage) {
      // console.log('页码：', currentPage)
      // 将 currentPage 更新为最新点击的页码
      // Element 插件的页码发生改变的时候，不会修改我们的数据 currentPage
      // 我们这里让其每一次页码变化的时候，手动将 currentPage 赋值为当前最新页码
      // this.currentPage = currentPage
      // 页码改变，请求当前页码对应的数据
      // 注意：这里我们请求的每页大小先写死
      //       为什么呢？
      //       我们的每页大小是会变化的
      this.loadUsersByPage(currentPage, this.pageSize)
    },
    handleSearch () {
      this.loadUsersByPage(1)
    },
    // 根据页码加载用户列表
    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: {
          //  请求参数，对象会被转换为 k=v&k=v 的格式，然后拼接到请求路径 ? 后面发起请求
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText
        }
      })
      const {users, total} = res.data.data
      this.tableData = users
      // 请求数据成功，我们从服务器得到了总记录数据
      // 然后我们就可以把总记录数据交给分页插件来使用
      this.totalSize = total
    },
    // 改变用户的状态
    async handleStateChange (state, user) {
      const {id: userId} = user
      // 拿到用户的id
      // 拿到Switch开关的选中状态
      // 发起请求改变状态
      const res = await this.$http.put(`users/${userId}/state/${state}`)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${state ? '启用' : '禁用'}成功`
        })
      }
    },
    async handleAddUser () {
      console.log(111)
      // 1. 获取表单数据
      // 2. 表单验证
      // 3. 发起请求添加用户
      // 4. 根据相应做交互
      // 添加用户成功，给出提示
      // 关闭对话框
      // 重新加载当前列表数据
      this.$refs['addUserForm'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        // 代码执行到这里就表示表单验证通过了，我们可以提交表单了
        const res = await this.$http.post('/users', this.userForm)
        console.log(res)
        if (res.data.meta.status === 201) {
          this.$message({
            // 添加成功提示消息
            type: 'success',
            message: '添加用户成功'
          })
          // 关闭对话框
          this.dialogFormVisible = false
          // 重新加载用户列表数据
          this.loadUsersByPage(this.currentPage)
          // 清空表单内容
          for (let key in this.userForm) {
            this.userForm[key] = ''
          }
        }
      })
    },
    // 处理删除用户
    async handleDeleteUser (user) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'waring'
      }).then(async () => {
        // 点击确认执行该方法
        const res = await this.$http.delete(`/users/${user.id}`)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 删除成功，重新加载列表数据
          this.loadUsersByPage(this.currentPage)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    
    // 处理编辑用户
    async handleEditUser () {
      console.log(888)
      const {id: userId} = this.editUserForm
      const res = await this.$http.put(`/users/${userId}`, this.editUserForm)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新用户成功'
        })
        // 关闭编辑用户表单对话框
        this.dialogEditFormVisible = false
        // 重新加载当前页面的数据
        this.loadUsersByPage(this.currentPage)
      }
    },
    // 处理显示被编辑的用户表单信息
    async handleShowEditForm (user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      this.editUserForm = res.data.data
    }  
  }
}