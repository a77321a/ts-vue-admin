<template>
  <el-row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submit">
    <el-col :xs="{span:22}" style="width: 368px;">
      <div class="major">找回密码</div>
      <el-row class="login-form">
        <el-form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
          <el-form-item prop="mobile">
            <el-input
              v-model="form.mobile"
              prefix="ios-phone-portrait"
              size="large"
              clearable
              placeholder="请输入手机号"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item style="position:relative" prop="verifyCode">
            <el-input
              type="text"
              v-model="form.verifyCode"
              prefix="ios-lock"
              size="large"
              placeholder="验证码"
              autocomplete="off"
            />
            <img @click="getIdentCode" class="img-code" :src="`${ctx}/sms/verifyCode?${query}`" alt />
          </el-form-item>
          <el-form-item style="position:relative" prop="smsCode">
            <el-input
              v-model="form.smsCode"
              prefix="ios-person"
              size="large"
              placeholder="请输入验证码"
              autocomplete="off"
            />
            <el-button
              style="color:#2d8cf0"
              class="img-code code-btn"
              :disabled="codeBtn"
              @click="getSmsCode"
              type="text"
            >{{codeBtnInfo}}</el-button>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              type="password"
              v-model="form.newPassword"
              prefix="ios-lock"
              size="large"
              clearable
              placeholder="新密码"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              type="password"
              v-model="form.confirmPassword"
              prefix="ios-lock"
              size="large"
              placeholder="确认新密码"
            />
          </el-form-item>
        </el-form>
        <el-row>
          <el-button class="login-btn" type="primary" size="large" @click="submit" long>
            <span>重设密码</span>
          </el-button>
        </el-row>
        <el-button
          @click="$router.push({name:'Login'})"
          type="text"
          style="float:right;color:#2d8cf0"
        >返回登录</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    let validatePhone = (rule, value, callback) => {
      let reg = /^1\d{10}$/
      if (value === '') {
        callback(new Error('请输入正确的手机号码'))
      } else if (reg.test(value) === false) {
        callback(new Error('请输入正确的11位号码！'))
      } else {
        callback()
      }
    }
    // let validateCode = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入验证码'))
    //   } else {
    //     this.isMobile(callback)
    //   }
    // }
    var validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.form.reNewPass !== this.form.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      ctx: window.ctx,
      query: '',
      loginBg: require('@/assets/login_bg.png'),
      codeBtn: false, // 是否禁用获取手机验证码
      codeBtnInfo: '获取验证码', // 验证码倒计时信息
      imgIndetCode: '',
      imgkey: '',
      loading: false,
      sending: false,
      sended: false,
      maxLength: 6,
      errorCode: '',
      form: {
        mobile: '',
        code: '',
        imgCode: '',
        new_pass: '',
        confirm_new_pass: ''
      },
      rules: {
        mobile: [
          {
            required: true,
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            required: true,
            message: '图片验证码必须填写',
            trigger: 'blur'
          }
        ],
        smsCode: [
          {
            required: true,
            message: '验证码必须填写',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateRePass,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getIdentCode()
  },
  methods: {
    getIdentCode () {
      // this.$http.get('/sms/verifyCode').then(res => {})
      this.query = Math.random()
    },
    submit () {
      this.$refs['usernameLoginForm'].validate(valid => {
        if (!valid) return
        this.$http
          .post('/admin/resetPwd', {
            mobile: this.form.mobile,
            newPassword: this.form.newPassword,
            smsCode: this.form.smsCode,
            verifyCode: this.form.verifyCode,
            confirmPassword: this.form.confirmPassword
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$router.push({
                name: 'login'
              })
            } else {
              this.getIdentCode()
            }
          })
      })
    },
    getSmsCode () {
      this.$refs['usernameLoginForm'].validateField('mobile', valid => {
        if (valid === '') {
          this.$refs['usernameLoginForm'].validateField('imgCode', valid => {
            if (valid === '') {
              this.$http
                .post('/sms/send', {
                  mobile: this.form.mobile
                })
                .then(res => {
                  if (res.code === 200) {
                    let count = 60
                    this.codeBtn = true
                    this.$Message.success('验证码已发送')
                    var sendTimer = setInterval(() => {
                      count--
                      this.codeBtnInfo = '重新发送' + count
                      if (count < 0) {
                        this.codeBtn = false
                        clearInterval(sendTimer)
                        this.codeBtnInfo = '获取验证码'
                      }
                    }, 1000)
                  } else if (res.code === 201) {
                    this.getIdentCode()
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    isMobile (callback) {
      this.$http
        .post('/api/app/isMobile', {
          mobile: this.form.mobile,
          type: 1
        })
        .then(res => {
          if (res.code === 200) {
            callback()
          } else {
            callback(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url('../../assets/login_bg.png');
  background-size: 100% 100%;
  .header {
    margin-bottom: 3vh;
    text-align: center;
    .description {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 1vh;
    }
  }
  .major {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: #2d8cf0;
  }
  .login-form {
    margin-bottom: 16vh;
  }
  .ivu-tabs-nav-container {
    line-height: 2;
    font-size: 17px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    zoom: 1;
  }
  .form {
    padding-top: 1vh;
    .input-verify {
      width: 70%;
    }
    .count-verify,
    .send-verify {
      width: 100px;
    }
  }
  .forget-pass,
  .other-way {
    font-size: 14px;
  }
  .login-btn {
    display: block;
    width: 100%;
    margin-top: 3vh;
  }
  .icons {
    display: flex;
    align-items: center;
  }
  .other-icon {
    cursor: pointer;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.2);
    :hover {
      color: #2d8cf0;
    }
  }
  .foot {
    margin-bottom: 2vh;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    .help {
      margin: 0 auto 1vh;
      width: 60%;
      .item {
        color: rgba(0, 0, 0, 0.45);
      }
      :hover {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}

.ivu-tabs-nav .ivu-tabs-tab .ivu-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-bottom: 5px;
}
.img-code {
  position: absolute;
  right: 5px;
  bottom: 0;
  height: 80%;
  top: 0;
  margin: auto;
}
.code-btn {
  bottom: 9px;
}
</style>
