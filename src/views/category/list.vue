<template>
  <div>
    <div style="text-align: left">
      <el-input
        placeholder="输入类别名称搜索类别..."
        style="width: 500px;margin: 0px;padding: 0px;"
        size="mini"
        prefix-icon="el-icon-search"
        v-model="keywords">
      </el-input>
    </div>
    <div>
      <el-tree
        :props="defaultProps"
        :data="categories"
        ref="tree"
        :filter-node-method="filterNode"
        v-loading="treeLoading"
        style="width: 500px;margin-top: 10px"
        :render-content="renderContent">
      </el-tree>
      <div style="text-align: left">
        <!-- <el-dialog
          title="添加类别"
          :visible.sync="dialogVisible"
          width="25%">
          <div>
            <span>上级类别</span>
            <el-select v-model="pDep" style="width: 200px" placeholder="请选择" size="mini">
              <el-option
                v-for="item in allDeps"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span>类别名称</span>
            <el-input size="mini" style="width: 200px;" v-model="depName" placeholder="请输入类别名称..." @keyup.enter.native="addDep"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取消</el-button>
    <el-button size="small" type="primary" @click="addDep">添加</el-button>
  </span>
        </el-dialog> -->
      </div>
    </div>
  </div>
</template>
<script>
 import moment from 'moment'
export default {
    data(){
        return{
            keywords: '',
            treeLoading: false,
            dialogVisible: false,
            dialogStatus: 'create',
            categories:[],
            dialogFormVisible: false,
            textMap: {
                update: '编辑',
                create: '新建用户'
            },
            categoryInfo:{
                categroyName: '', //类别名称
                categroyCode: '',//类别编码
                parentId: 0,//父级别id
                hierarchy:'',
            },
            defaultProps: {
                label: 'categoryName',
                isLeaf: 'leaf',
                children: 'children'
            }
            ,
            activeColItem: -1,
            // rules:{
            //     name :[{required: true, message: '姓名不能为空', trigger: 'blur'}],
            //     phone :[
            //         {required: true, message: '手机号码不能为空', trigger: 'blur'},
            //         {
            //             pattern: /^1\d{10}$/,  //正则
            //             message: '手机号码必须11位'
            //         }
            //     ],
            //     telephone :[{required: true, message: '座机不能为空', trigger: 'blur'}],
            //     username :[{required: true, message: '用户名不能为空', trigger: 'blur'}],
            //     password :[
            //         {required: true, message: '密码不能为空', trigger: 'blur'},
            //          { 
            //             min: 6, 
            //             max: 12,  
            //             message: '长度在 6 到 12 个字符'
            //           },
            //         ],
            // },
        }
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    ,
    created() {
      this.loading = true;
      //this.getList();
      this.initCategories();
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        addCategory(){
          this.loading = true;
          this.postRequest("/category/add", {
            categoryCode: this.categoryPrefix + this.categoryInfo.categoryCode,
            categoryName: this.categoryInfo.categoryName,
            parentId    : this.categoryInfo.parentId,
          }).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.initCategories();
              categroyCode = '';
              categroyName = '';
            } else {
              _this.loading = false;
            }
          })
      },
      initCategories(){
        this.postRequest("/category/list",
        {
            parentId : '0'
        }).then(resp=> {
          this.loading = false;
          if (resp && resp.status == 200) {
              var data = resp.data;  
              this.categories = data.list;
              this.activeColItem=-1
          }
        })
      },
       deleteCategory(cgId, cgName){    
        this.$confirm('删除类别[' + cgName + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.deleteRequest("/category/del/" + rid).then(resp=> {
            if (resp && resp.status == 200) {
              _this.initCategories();
            } else {
              this.loading = false;
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      renderContent(h, {node, data, store}) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
          <span>{node.label}</span>
        </span>
        <span>
        <el-button style="font-size: 12px;" type="primary" size="mini" style="padding:3px" on-click={ () => this.showAddDepView(data,event) }>添加类别</el-button>
        <el-button style="font-size: 12px;" type="danger" size="mini" style="padding:3px" on-click={ () => this.deleteDep(data,event) }>删除类别</el-button>
        </span>
        </span>);
      }
    }
}
</script>