<template>
  <div class="app-container">
    <h2 class="leave-audit">请假审核</h2>
    <el-row class="button-list" :gutter="5">
      <el-button type="primary" @click="passLeave">通过</el-button>
      <el-button @click="rejectLeave">不通过</el-button>
      <el-button @click="deleteLeave">删除</el-button>
      <el-button @click="downloadLeave">全部导出</el-button>
    </el-row>
    <el-table
      class="leave-list"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center"
                       type="selection"
      >
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          {{ statusMap[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentId }}</span>
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
import { deleteTeachersLeave, getLeavesDownload, getTeachersLeaveList, postTeachersLeaveProcess } from '@/api/table'
import { server } from '../../settings.js'

export default {
  data() {
    return {
      statusMap: {
        0: '正在审核',
        1: '未通过',
        2: '已通过'
      },
      list: null,
      listLoading: true,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTeachersLeaveList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async passLeave() {
      // console.log(this.multipleSelection)
      await this.multipleSelection.forEach((row, index) => {
        const data = {
          id: row.id,
          toState: 2
        }
        postTeachersLeaveProcess(data)
      })
      this.fetchData()
    },
    async rejectLeave() {
      await this.multipleSelection.forEach((row, index) => {
        const data = {
          id: row.id,
          toState: 1
        }
        postTeachersLeaveProcess(data)
      })
      this.fetchData()
    },
    async deleteLeave() {
      await this.multipleSelection.forEach((row, index) => {
        const param = row.id
        deleteTeachersLeave(param)
      })
      this.fetchData()
    },
    funcDownload(content, filename, type = 'text/plain') {
      const downLink = document.createElement('a')

      // 支持a链接下载？
      if (!('download' in downLink)) return false

      downLink.download = filename
      downLink.style.display = 'none'

      // 字符串内容转blob地址
      const blobURL = new Blob([content], { type })
      downLink.href = URL.createObjectURL(blobURL)

      // 触发下载
      document.body.appendChild(downLink)
      downLink.click()

      // 移除 a 节点
      document.body.removeChild(downLink)
    },
    downloadLeave() {
      getLeavesDownload().then(res => {
        const data = res.data
        const fileName = res.headers['content-disposition'].split('=')[1]
        const type = 'text/csv;charset=utf-8'
        this.funcDownload('\ufeff' + data, fileName, type)
      })
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
.leave-audit {
  color: #666;
}

.leave-list {
  margin-top: 10px;
}

</style>
