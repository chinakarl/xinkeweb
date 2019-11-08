<template>
 <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="enabled" label="是否启用" style="width: 60px;">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled==true">启用</span>
          <span v-if="scope.row.enabled==false">未启用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_user" label="创建人" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="管理" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNo"
      :page-size="listQuery.pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="userInfo" :rules="rules" ref="ruleForm" label-position="left" label-width="80px"
               style='width: 300px; margin:auto;'>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="userInfo.name">
          </el-input>
        </el-form-item>       
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userInfo.username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogStatus=='create'">
          <el-input type="password" v-model="userInfo.password">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" v-else>
          <el-input type="password" v-model="userInfo.password" placeholder="不填则表示不修改">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input type="text" v-model="userInfo.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="座机" prop="telephone">
          <el-input type="text" v-model="userInfo.telephone">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用">
             <el-radio class="radio" :label="1" v-model="userInfo.enabled" >
                 启用
             </el-radio>
             <el-radio class="radio" :label="0" v-model="userInfo.enabled" >
                 禁用
             </el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="text" v-model="userInfo.remark">
          </el-input>
        </el-form-item>
        
        <!-- <el-form-item label="新密码" v-else>
          <el-input type="password" v-model="tempUser.password" placeholder="不填则表示不修改">
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="角色" required>
          <el-select v-model="tempUser.roleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="昵称" required>
          <el-input type="text" v-model="tempUser.nickname">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createUser('ruleForm')">创 建</el-button>
        <el-button type="primary" v-else @click="updateUser">修 改</el-button>
      </div>
    </el-dialog>
 </div>
</template>
<script>
 import moment from 'moment'
export default {
    data(){
        return{
            totalCount: 0, //分页组件--数据总条数
            list: [],//表格的数据
            listLoading: false,//数据加载等待动画
            listQuery: {
             name: '',
             pageNo: 1,//页码
             pageSize: 10,//每页条数
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            textMap: {
                update: '编辑',
                create: '新建用户'
            },
            userInfo:{
                name:'',
                phone:'',
                telephone:'',
                address:'',
                enabled:'1',
                username:'',
                password:'',
                remark:''
            },
            rules:{
                name :[{required: true, message: '姓名不能为空', trigger: 'blur'}],
                phone :[
                    {required: true, message: '手机号码不能为空', trigger: 'blur'},
                    {
                        pattern: /^1\d{10}$/,  //正则
                        message: '手机号码必须11位'
                    }
                ],
                telephone :[{required: true, message: '座机不能为空', trigger: 'blur'}],
                username :[{required: true, message: '用户名不能为空', trigger: 'blur'}],
                password :[
                    {required: true, message: '密码不能为空', trigger: 'blur'},
                     { 
                        min: 6, 
                        max: 12,  
                        message: '长度在 6 到 12 个字符'
                      },
                    ],
            },
        }
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    ,
    created() {
      this.getList();
    },
    methods:{
        getList() {
            //查询列表
            this.listLoading = true;
            this.postRequest("/user/list",this.listQuery)
            .then(resp => {
                if (resp && resp.status == 200) 
                {
                    var data = resp.data
                    this.listLoading = false;
                    this.list = data.list;
                    this.totalCount = data.total;
                }
            })
        },
         getIndex($index) {
          //表格序号
          return (this.listQuery.pageNo - 1) * this.listQuery.pageSize + $index + 1
        },
        handleCurrentChange(pageNo) {
            //改变页码
            this.listQuery.pageNo = pageNo
            this.getList();
        },
        handleSizeChange(pageSize) {
            //改变每页数量
            this.listQuery.pageSize = pageSize
            this.handleFilter();
        },
        handleFilter() {
            //查询事件
            this.listQuery.pageNo = 1
            this.getList()
        },
        showCreate() {
        //显示新增对话框
        this.userInfo.name='';
        this.userInfo.phone='';
        this.userInfo.telephone='';
        this.userInfo.address='';
        this.userInfo.username='';
        this.userInfo.password='';
        this.userInfo.enabled='1';
        this.userInfo.remark='';
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        let user = this.list[$index];
        this.userInfo.name=user.name;
        this.userInfo.phone=user.phone;
        this.userInfo.telephone=user.telephone;
        this.userInfo.address=user.address;
        this.userInfo.username=user.username;
        this.userInfo.password=user.password;
        this.userInfo.enabled='1';
        this.userInfo.remark=user.remark;
        this.tempUser.deleteStatus = '1';
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createUser(formName) {
        this.$refs[formName].validate((valid) => {
            if (!valid) {
            console.log('error submit!!')
            return false
            } else {
                //添加新用户
                this.postRequest("/user/add",this.userInfo)
                .then(resp =>{
                    if (resp && resp.status == 200) 
                    {
                    this.getList();
                    this.dialogFormVisible = false
                    }
                })
            }
        })
      },
      updateUser() {
        //修改用户信息
        let _vue = this;
        this.api({
          url: "/user/updateUser",
          method: "post",
          data: this.tempUser
        }).then(() => {
          let msg = "修改成功";
          this.dialogFormVisible = false
          if (this.userId === this.tempUser.userId) {
            msg = '修改成功,部分信息重新登录后生效'
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              _vue.getList();
            }
          })
        })
      },
    }
}
</script>