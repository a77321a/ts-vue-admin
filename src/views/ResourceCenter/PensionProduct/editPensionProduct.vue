<!--
 * @Descripttion:新增、编辑养老产品
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 23:16:29
 -->
<template>
  <div id="edit-event">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="服务类型" prop="pensionServiceTypeId">
        <!-- <el-select
          clearable
          v-model="formInfo.pensionServiceTypeId"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in serviceTypeList"
            :key="index"
            :label="item.pensionServiceTypeName"
            :value="item.pensionServiceTypeId"
          ></el-option>
        </el-select> -->
        <el-cascader
          clearable
          :props="{
            value: 'pensionServiceTypeId',
            label: 'pensionServiceTypeName',
            emitPath: false
          }"
          :options="serviceTypeList"
          v-model="formInfo.pensionServiceTypeId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="产品名称" prop="pensionServiceProductName">
        <el-input
          :maxlength="28"
          placeholder="请输入产品名称，最多不超过28个字"
          show-word-limit
          v-model="formInfo.pensionServiceProductName"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品简介" prop="description">
        <el-input
          :maxlength="68"
          placeholder="请输入产品简介，最多不超过68个字"
          show-word-limit
          type="textarea"
          v-model="formInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品封面" prop="indexPic">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.indexPic != ''" class="avatars">
            <img
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.indexPic
              "
              alt
            />
          </div>
          <el-upload
            action="apii/public/img"
            :show-file-list="false"
            :before-upload="uploadImg"
            accept="image/*"
          >
            <el-button type="primary" icon="ios-cloud-upload-outline"
              >选择文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="产品详情">
        <UEditor v-model="formInfo.detail"></UEditor>
      </el-form-item>
      <div class="title">价格/类型</div>

      <el-form-item label="价目表">
        <sku :priceList="priceList" ref="sku"></sku>
      </el-form-item>
      <el-form-item label="价格" prop="pensionPrice">
        <el-input-number
          :precision="2"
          v-model="formInfo.pensionPrice"
          controls-position="right"
          placeholder="0.01~500000"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="划线价" prop="pensionPlineationPrice">
        <el-input-number
          :precision="2"
          placeholder="0.01~500000"
          v-model="formInfo.pensionPlineationPrice"
          controls-position="right"
          :min="0"
        ></el-input-number
        >元
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import sku from "@/components/SKU/sku.vue";
export default {
  name: "eventCenterEdit",
  components: {
    sku
  },
  data() {
    return {
      formInfo: {
        pensionServiceProductName: "",
        description: "",
        indexPic: "",
        detail: "",
        pensionPrice: 0,
        pensionPlineationPrice: 0,
        pensionServiceTypeId: "",
        pensionServiceProductPrice: {}
      },
      priceList: [],
      rules: {
        pensionServiceProductName: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入产品介绍", trigger: "blur" }
        ],
        indexPic: [
          { required: true, message: "请上传产品封面", trigger: "blur" }
        ],
        detail: [
          { required: true, message: "请输入产品详情", trigger: "blur" }
        ],
        pensionPrice: [
          { required: true, message: "请输入产品价格", trigger: "blur" }
        ],
        pensionServiceTypeId: [
          { required: true, message: "请选择产品服务类型", trigger: "change" }
        ]
      },
      serviceTypeList: []
    };
  },
  created() {
    if (this.$route.query.pid) {
      this.getProductInfo();
    }
    this.getServiceType();
  },
  methods: {
    getServiceType() {
      this.$http.post("/pension/service/type/tree", {}).then(res => {
        if (res.code === SUCCESS) {
          this.serviceTypeList = res.payload;
          this.serviceTypeList.forEach(i => {
            // i第一层
            if (i.children.length > 0) {
              i.children.forEach(j => {
                if (j.children.length > 0) {
                  j.children.forEach(n => {
                    delete n.children;
                  });
                }
              });
            }
          });
        }
      });
      // this.$http
      //   .post('/pension/service/type/pageSerach', { pageSize: MAXSIZE })
      //   .then(res => {
      //     this.serviceTypeList = res.payload.records

      //   })
    },
    /**
     * @descripttion: 获取信息
     * @return: 信息
     */
    getProductInfo() {
      this.$http
        .get(
          "/pension/service/product/detail?pensionServiceProductId=" +
            this.$route.query.pid
        )
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload;
            console.log(res.payload.pensionServiceProductPrice);
            this.priceList = res.payload.pensionServiceProductPrice;
            this.$set(
              this.formInfo,
              "pensionServiceTypeId",
              res.payload.pensionServiceTypeDetail.pensionServiceTypeId
            );
          }
        });
    },
    // 保存按钮
    handleSave() {
      let priceList = this.$refs.sku.toConfirm();
      this.formInfo.pensionServiceProductPrice = priceList;
      this.$refs["formInfo"].validate(valid => {
        if (!valid) return;
        let url = this.$route.query.pid
          ? "/pension/service/product/update"
          : "/pension/service/product/add";
        this.$http
          .post(url, {
            pensionServiceProductId: this.formInfo.pensionServiceProductId,
            description: this.formInfo.description,
            detail: this.formInfo.detail,
            indexPic: this.formInfo.indexPic,
            pensionPlineationPrice: this.formInfo.pensionPlineationPrice,
            pensionPrice: this.formInfo.pensionPrice,
            pensionServiceProductName: this.formInfo.pensionServiceProductName,
            pensionServiceProductPrice: this.formInfo
              .pensionServiceProductPrice,
            pensionServiceTypeId: this.formInfo.pensionServiceTypeId
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success("操作成功");
              this.$router.go(-1);
            }
          });
      });
    },
    uploadImg(file) {
      let formdata = new FormData();
      formdata.append("file", file);
      this.$http.postForm("/file/upload", formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.indexPic = res.payload;
        }
      });
      return false;
    }
  }
};
</script>
<style lang="scss"></style>
