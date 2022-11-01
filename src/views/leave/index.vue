<template>
  <div class="app-container">
    <h2 class="my-leave">我的请假</h2>
    <el-button type="primary" @click="dialogFormVisible = true">我要请假</el-button>
    <el-dialog title="发起请假" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <div class="bh-form-groupname">基础信息</div>
        <el-form-item label="学号" :label-width="formLabelWidth">
          {{ id }}
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          {{ name }}
        </el-form-item>
        <div class="bh-form-groupname">请假信息</div>
        <el-form-item label="请假日期" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="11">
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.date1"
                              style="width:100%"
              ></el-date-picker>
            </el-col>
            <el-col :span="2">
              <div style="text-align: center">-</div>
            </el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" value-format="hh:mm:ss" v-model="form.date2" style="width:100%"
              ></el-time-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="请假天数" :label-width="formLabelWidth">
          <el-input-number v-model="form.days" style="width:100%"></el-input-number>
        </el-form-item>
        <el-form-item label="去往目的地" :label-width="formLabelWidth">
          <el-input v-model="form.destination"></el-input>
        </el-form-item>
        <el-form-item label="交通方式" :label-width="formLabelWidth">
          <el-select v-model="form.transportation" placeholder="请选择交通方式" style="width:100%">
            <el-option value="步行"></el-option>
            <el-option value="单车/摩托车"></el-option>
            <el-option value="公交/地铁"></el-option>
            <el-option value="出租车"></el-option>
            <el-option value="私家车"></el-option>
            <el-option value="火车/飞机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请假事由" :label-width="formLabelWidth">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="证明材料" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="actionUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      class="leave-list"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          {{ statusMap[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="申请日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假开始日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.leaveTime }}
        </template>
      </el-table-column>
      <el-table-column label="请假天数" align="center">
        <template slot-scope="scope">
          {{ scope.row.days }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="去往目的地" align="center">
        <template slot-scope="scope">
          {{ scope.row.destination }}
        </template>
      </el-table-column>
      <el-table-column label="交通方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.transportation }}
        </template>
      </el-table-column>
      <el-table-column label="请假事由" align="center">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="证明材料" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="getImgUrl(scope)"
            :preview-src-list="getImgUrlArray(scope)"
          >
            <div slot="error" class="image-slot">
            </div>
          </el-image>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStudentsLeaveList, putStudentsLeave } from '@/api/table'
import { mapGetters } from 'vuex'
import { server } from '../../settings.js'

export default {
  computed: {
    ...mapGetters([
      'id',
      'name'
    ])
  },
  data() {
    return {
      statusMap: {
        0: '正在审核',
        1: '未通过',
        2: '已通过'
      },
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        date1: '',
        date2: '',
        days: '',
        destination: '',
        transportation: '',
        reason: '',
        phone: '',
        material: ''
      },
      formLabelWidth: '120px',
      actionUrl: process.env.VUE_APP_BASE_API + '/leaves/upload'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getStudentsLeaveList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    onSubmit() {
      this.dialogFormVisible = false
      const form = {
        leaveTime: this.form.date1 + ' ' + this.form.date2,
        days: this.form.days,
        destination: this.form.destination,
        transportation: this.form.transportation,
        reason: this.form.reason,
        phone: this.form.phone,
        material: this.form.material
      }
      putStudentsLeave(form).then(response => {
        this.$message(response.msg)
        this.fetchData()
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(response, file, fileList) {
      this.form.material = response.data
      // console.log(this.form.material)
    },
    getImgUrl(scope) {
      if (scope.row.material != null && scope.row.material.length > 1) {
        return server + scope.row.material.substring(1)
      }
      return ''
    },
    getImgUrlArray(scope) {
      if (scope.row.material != null && scope.row.material.length > 1) {
        return [server + scope.row.material.substring(1)]
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.my-leave {
  color: #666;
}

.leave-list {
  margin-top: 10px;
}

.bh-form-groupname {
  font-size: 16px;
  font-weight: 700;
  border-left: 4px solid #3E50B4;
  padding-left: 8px;
  line-height: 16px;
  min-height: 0 !important;
  float: none !important;
  margin-bottom: 8px;
}

</style>
