
<template>
  <div class>
    <el-form label-position="left" size="mini" label-width="80px">
      <div class="form-group">
        <div class="form-item" v-for="(attr,index) in attrs" :key="`attr${index}`">
          <el-form-item label="规格类型">
            <el-input
              @input="calculateTableData"
              style="width:130px"
              type="text"
              v-model="attr.pName"
              placeholder="规格名"
            />
            <span class="delete" @click="toDelete(index)">×</span>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="规格值">
            <!-- <ul class="form-list"> -->
            <!-- <li > -->
            <el-input
              :key="`item${index2}`"
              v-for="(item,index2) in attr.spec"
              class="spec-item"
              type="text"
              @input="calculateTableData"
              v-model="item.cName"
            />
            <!-- </li> -->
            <el-button class="button-new-tag" size="mini" @click="addSize(attr)">添加</el-button>
            <!-- </ul> -->
          </el-form-item>
        </div>
        <el-button style="display:block;width:100%" @click="addItem">+ 添加规格项目</el-button>
        <div class="form-table" v-show="tableData.length">
          <table class="table-sku" border="1px solid #ccc">
            <thead>
              <tr style="background:#f5f5f5">
                <td v-for="(list,index) in tableData" :key="`list${index}`">{{list['pName']}}</td>
                <td>价格</td>
                <td>划线价</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,index) in rows" :key="`row${index}`">
                <td
                  v-for="(item,index2) in tableData"
                  v-if="!((row-1)%item['rowspan'])"
                  :rowspan="item['rowspan']"
                  :key="`item${index2}`"
                >{{item|getName(row)}}</td>
                <td>
                  <el-input-number
                    size="mini"
                    :controls="false"
                    :min="0"
                    :precision="2"
                    type="text"
                    @focus="$event.target.value = ''"
                    v-model="tableList[row-1]['price']"
                  />
                </td>
                <td>
                  <el-input-number
                    size="mini"
                    :controls="false"
                    :min="0"
                    :precision="2"
                    type="text"
                    @focus="$event.target.value = ''"
                    v-model="tableList[row-1]['number']"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      attrs: [],
      inputVisible: false,
      inputValue: '',
      tableList: [],
      tableData: [],
      rows: 0
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.priceList.attrs) {
        this.attrs = [...this.priceList]
      }
    })
  },
  watch: {
    priceList (val) {
      console.log(val)
      if (val.attrs) {
        this.attrs = val.attrs
        this.tableList = val.tableList
      }
    },
    attrs () {
      this.calculateTableData()
    },
    tableData () {
      // this.calculateTableList()
    }
  },
  filters: {
    getName: function (obj, index) {
      if (obj) {
        var r = parseInt((index - 1) / obj['rowspan'])
        var l = obj['specLen'] || 1
        var key = r % l
        return obj['spec'] && obj['spec'][key] && obj['spec'][key]['cName']
      }
    }
  },
  props: ['priceList'],
  computed: {
    // tableData: function () {
    //   var attrs = this.attrs
    //   var len = attrs.length
    //   if (len == 0) {
    //     return
    //   }
    //   var tData = []
    //   // 初始化tableData
    //   for (var i = 0; i < len; i++) {
    //     var row = {}
    //     row['pName'] = attrs[i]['pName']
    //     row['spec'] = []
    //     row['price'] = {}
    //     row['number'] = {}
    //     var len2 = attrs[i]['spec'].length
    //     var specLen = 0
    //     for (var j = 0; j < len2; j++) {
    //       var spe = {}
    //       var cName = attrs[i]['spec'][j]['cName']
    //       if (!cName) {
    //         continue
    //       }
    //       ++specLen
    //       spe['cName'] = cName
    //       row['spec'].push(spe)
    //     }
    //     row['specLen'] = specLen
    //     tData.push(row)
    //   }
    //   // 获取rowspan
    //   for (var k = 0, len3 = tData.length; k < len3; k++) {
    //     var rowspan = 1
    //     for (var k1 = k + 1; k1 < len3; k1++) {
    //       var kSpecLen = tData[k1]['specLen'] || 1
    //       rowspan *= kSpecLen
    //     }
    //     tData[k]['rowspan'] = rowspan
    //   }
    //   return tData
    // // },
    // rows: function () {
    //   if (!this.tableData) {
    //     return
    //   }
    //   var rows = 1
    //   var tableData = this.tableData
    //   var len = tableData.length
    //   for (var i = 0; i < len; i++) {
    //     var specLen = tableData[i]['specLen'] || 1
    //     rows *= specLen
    //   }
    //   // 每条rowspan都为1情况
    //   if (rows == 1) {
    //     return tableData[0]['spec'].length
    //   }
    //   return rows
    // }
    // tableList: {
    //   get () {
    //     if (!this.tableData) {
    //       return
    //     }
    //     var rows = this.rows
    //     var tList = []
    //     var srcData = this.tableData
    //     console.log(srcData)
    //     for (var i = 0; i < rows; i++) {
    //       var listItem = {}
    //       // 构建动态项
    //       for (var j = 0; j < srcData.length; j++) {
    //         // 构造第一类目
    //         var key = srcData[j]['pName']
    //         var rowspan = srcData[j]['rowspan']
    //         var len = srcData[j]['specLen']
    //         if (!len) {
    //           continue
    //         }
    //         var spec = srcData[j]['spec']
    //         var index = parseInt(i / rowspan) % len
    //         listItem[key] = spec[index]['cName']
    //         // listItem['pName'] = pName
    //         // listItem['pVal'] = spec[index]['cName']
    //       }
    //       // 构建固定项(price,number)
    //       listItem['price'] = ''
    //       listItem['number'] = ''
    //       tList.push(listItem)
    //     }
    //     return tList
    //   },
    //   set () {}
    // }
  },
  components: {},
  methods: {
    calculateRows () {
      if (!this.tableData) {
        return
      }
      var rows = 1
      var tableData = this.tableData
      var len = tableData.length
      for (var i = 0; i < len; i++) {
        var specLen = tableData[i]['specLen'] || 1
        rows *= specLen
      }
      // 每条rowspan都为1情况
      if (rows == 1) {
        this.rows = tableData[0]['spec'].length
      } else {
        this.rows = rows
      }
      this.calculateTableList()
    },
    calculateTableData () {
      var attrs = this.attrs
      var len = attrs.length
      if (len == 0) {
        this.tableData = []
        return
      }
      var tData = []
      // 初始化tableData
      for (var i = 0; i < len; i++) {
        var row = {}
        row['pName'] = attrs[i]['pName']
        row['spec'] = []
        row['price'] = {}
        row['number'] = {}
        var len2 = attrs[i]['spec'].length
        var specLen = 0
        for (var j = 0; j < len2; j++) {
          var spe = {}
          var cName = attrs[i]['spec'][j]['cName']
          if (!cName) {
            continue
          }
          ++specLen
          spe['cName'] = cName
          row['spec'].push(spe)
        }
        row['specLen'] = specLen
        tData.push(row)
      }
      // 获取rowspan
      for (var k = 0, len3 = tData.length; k < len3; k++) {
        var rowspan = 1
        for (var k1 = k + 1; k1 < len3; k1++) {
          var kSpecLen = tData[k1]['specLen'] || 1
          rowspan *= kSpecLen
        }
        tData[k]['rowspan'] = rowspan
      }
      this.tableData = tData
      this.calculateRows()
    },
    calculateTableList () {
      if (!this.tableData) {
        return
      }
      var rows = this.rows
      var tList = []
      var srcData = this.tableData
      console.log(srcData)

      for (var i = 0; i < rows; i++) {
        var listItem = {}
        // 构建动态项
        for (var j = 0; j < srcData.length; j++) {
          // 构造第一类目
          var key = srcData[j]['pName']
          var rowspan = srcData[j]['rowspan']
          var len = srcData[j]['specLen']
          if (!len) {
            continue
          }
          var spec = srcData[j]['spec']
          var index = parseInt(i / rowspan) % len
          listItem[key] = spec[index]['cName']
          // listItem['pName'] = pName
          // listItem['pVal'] = spec[index]['cName']
        }
        // 构建固定项(price,number)

        listItem['price'] = this.tableList[i] ? this.tableList[i].price : ''
        listItem['number'] = this.tableList[i] ? this.tableList[i].number : ''
        tList.push(listItem)
      }
      this.tableList = tList
    },
    addSize (data) {
      data.spec.push({ cName: '' })
      this.calculateTableData()
    },
    addItem: function () {
      var obj = {
        pName: '',
        rowspan: 1,
        spec: [{ cName: '' }]
      }
      if (this.attrs.length >= 4) {
        this.$message.warn('无法添加更多规则')
        return
      }
      this.$set(this.attrs, this.attrs.length, obj)
      this.calculateTableData()
      this.$forceUpdate()
    },
    toDelete: function (index) {
      this.attrs.splice(index, 1)
      if (this.attrs.length == 0) {
        this.tableData = []
        this.rows = 0
        this.tableList = []
      }
    },
    toConfirm: function () {
      return { attrs: this.attrs, tableList: this.tableList }
      // return this.tableData
    }
  }
}
</script>

<style lang="scss" scoped>
/**reset*/
button,
input {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
}
.btn {
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
  cursor: pointer;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
}
// .btn.active,
// .btn:active,
// .btn:focus,
// .btn:hover {
//   text-decoration: none;
//   color: #333;
//   background-color: #fcfcfc;
//   border-color: #ccc;
// }
/*table*/
table {
  border: 0;
}
table.table-sku {
  width: 100%;
  background-color: #fff;
  text-align: left;
}
table {
  tr,
  td {
    padding-left: 10px;
    height: 40px !important;
    line-height: 40px !important;
  }
  border-collapse: collapse;
  border-spacing: 0;
}
table.table-sku td {
  border: 1px solid #e5e5e5;
}
// table.table-sku td input {
//   padding: 10px;
//   border: 1px solid #ccc;
// }
/**/
.form-title {
  background: #f8f8f8;
  padding: 10px;
  position: relative;
}
.form-title .label {
  color: #999;
}
.form-title input {
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
}
.form-list {
  display: inline-block;
  margin-top: 0;
}
.form-list li {
  display: inline-block;
  vertical-align: middle;
}

.form-list,
.form-title {
  text-align: left;
}
.form-list input {
  background: #fff;
  margin-right: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}
.form-group {
  /* border: 1px solid #ccc; */
  /* padding: 10px; */
  .form-item {
    border: 1px solid #ccc;
    padding: 5px 0 5px 15px;
    margin-bottom: 5px;

    .spec-item {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;
      margin-right: 5px;
    }
    .button-new-tag {
      vertical-align: middle;
      position: relative;
      top: -1px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-divider {
      margin: 10px 0;
    }
    .delete {
      width: 20px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #ccc;
      border-radius: 50%;
      position: absolute;
      right: 15px;
      top: 50%;
      margin-top: -10px;
      text-align: center;
      color: #fff;
      background: #ccc;
      cursor: pointer;
    }
  }
}
.form-table {
  margin-top: 5px;
}
.form-btn-group {
  /* margin-top: 20px; */
  background: #f8f8f8;
  padding: 10px;
}
.stock-title,
.form-h {
  height: 40px;
  line-height: 40px;
}
</style>

    © 2019 GitHub, Inc.
    Terms
    Privacy
    Security
    Status
    Help

    Contact GitHub
    Pricing
    API
    Training
    Blog
    About
