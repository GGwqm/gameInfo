<template>
  <div class="main">
    <div class="div-tab">
      <Tabs value="name1" class="login-tabs">
        <TabPane label="登陆" name="name1">
          <div class="tabPane">
            <Form ref="loginData" :model="loginData" :rules="loginRule">
              <FormItem  prop="user">
                <Input type="text" v-model="loginData.user" placeholder="请输入您的用户名" class="register-input"/>
              </FormItem>
              <FormItem prop="passwd" >
                <Input type="password" v-model="loginData.passwd" placeholder="请输入您的密码" class="register-input" style="margin-top: 10px"/>
              </FormItem>
              <div style="height: 10px"></div>
              <FormItem >
                <div class="re-button">
                  <Button type="primary" @click="loginHandleSubmit()">登陆</Button>
                  <Button @click="handleReset('loginData')" style="margin-left: 8px">重置</Button>
                </div>
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane label="注册" name="name2">
          <div class="tabPane">
          <Form ref="registerData" :model="registerData" :rules="registerRule">
            <FormItem  prop="user">
              <Input type="text" v-model="registerData.user" placeholder="请输入4~10位您喜欢的用户名" class="register-input"/>
              <div class="tips" v-show="tips">用户名已存在</div>
            </FormItem>
            <FormItem prop="passwd" >
              <Input type="password" v-model="registerData.passwd" class="register-input" style="margin-top: 10px"/>
            </FormItem>
            <FormItem prop="passwdCheck">
              <Input type="password" v-model="registerData.passwdCheck" class="register-input" style="margin-top: 10px"/>
            </FormItem>
            <div style="height: 10px"></div>
            <FormItem >
              <div class="re-button">
                <Button type="primary" @click="handleSubmit('registerData')">注册</Button>
                <Button @click="handleReset('registerData')" style="margin-left: 8px">重置</Button>
              </div>
            </FormItem>
          </Form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>

    export default {
      inject: ['reload'],
      name: "login",
      data () {
        // this.$Message.config({
        //   top: 100,
        //   duration: 10
        // });
        const loginValidateName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入用户名'));
          } callback();
        };
        const loginValidatePass = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入用户名'));
          } callback();
        };
        const validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入您的密码'));
          } else {
            if (this.registerData.passwdCheck !== '') {
              // 对第二个密码框单独验证
              this.$refs.registerData.validateField('passwdCheck');
            }
            callback();
          }
        };
        const validatePassCheck = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入您的密码'));
          } else if (value !== this.registerData.passwd) {
            callback(new Error('两次输入不正确，请重新输入'));
          } else {
            callback();
          }
        };
        const validateName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入用户名'));
            this.tips=false;
          }
          // 模拟异步验证效果
          setTimeout(() => {
            if (value.length<4||value.length>10) {
              callback(new Error('用户名必须为4 ~ 10位'));
            } else {
              let arr = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/ ;
              if (arr.test(value)===false) {
                callback(new Error('用户名必须为字母和数字的组合，且只能以字母开头'));
                this.tips=false;
              }else {
                const query = Bmob.Query("_User");
                query.equalTo("username","==", value);
                query.find().then(res => {
                  this.sameName=res[0].username;
                  if( value === this.sameName ){
                    this.tips=true;
                  }
                }).catch(err => {
                  this.tips=false;
                });
              }
            }
            callback();
          }, 600);

        };

        return {
          sameName:'',tips:false,
          login:{loginState:false,loginUser:true},
          userImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595868219795&di=a5f2572c8bc8e9bf8a309af7066c8e4a&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F43%2F89%2F59399eb9148bb_610.jpg',
          loginData: {
            user: '',
            passwd: '',
          },
          registerData: {
            user: '',
            passwd: '',
            passwdCheck: '',
          },
          loginRule: {
            user: [
              { validator: loginValidateName, trigger: 'blur' }
            ],
            passwd: [
              { validator: loginValidatePass, trigger: 'blur' }
            ],
          },
          registerRule: {
            user: [
              { validator: validateName, trigger: 'blur' }
            ],
            passwd: [
              { validator: validatePass, trigger: 'blur' }
            ],
            passwdCheck: [
              { validator: validatePassCheck, trigger: 'blur' }
            ]
          }
        }
      },
      created(){
        const current = Bmob.User.current();
        if(current!=null){
          this.$router.push('/')
        }
      },
      methods: {
        info () {
          this.$Message.info('This is a info tip');
        },
        handleSubmit (name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              let params = {
                username: this.registerData.user,
                password: this.registerData.passwd,
                phone: this.userImg,
                admin:false,
                state:false,
              };
              Bmob.User.register(params).then(res => {
                this.$Message.success('注册成功，请前往登陆!');
              }).catch(err => {
                this.$Message.error('因网络或其他原因，注册失败!');
              });
            }
          })
        },
        loginHandleSubmit(){
              Bmob.User.login(this.loginData.user, this.loginData.passwd).then(res => {
                if (res.admin === true) {
                } else if (res.state === true) {
                  this.$Message.error({
                    content: '您的账号已冻结',
                    duration: 2
                  });
                  Bmob.User.logout();
                } else {
                  let current2 = Bmob.User.current();
                  this.reload();
                  this.$Message.success('欢迎您');
                }
              }).catch(err => {
                this.$Message.error('用户名密码错误');
                // this.mylogin=true
              });
        },
        handleReset (name) {
          this.$refs[name].resetFields();
        }
      },

    }
</script>

<style scoped>
  .bg{
    position:absolute;

    top:0;
    left:0;
    height:100%;
    width: 100%;
    background: url("http://abc.huanpl.top/2020/08/29/92d1a8d740fa62bb8041c18b9eb60f86.jpg") no-repeat;
    background-size: 100% 100%;
    -webkit-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
  }
.main{
  height: 500px;
  display: flex;
  justify-content: center;
}

.div-tab{
  width: 400px;
  height: 400px;
  border-radius: 10px;
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.login-tabs{
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tips{
  color: #ed4014;
  font-size: 13.5px;
  position: absolute;
}
  input{
    font-size: 17px;
    height: 42px;
  }
  .re-button{
    display: flex;
    flex-grow: 1;
  }
  .re-button Button{
    width: 100%;
  }
  .tabPane:before{
    content: '';
    height: 15px;
    display: block;
  }
</style>
