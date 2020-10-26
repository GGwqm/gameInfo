<template>
    <div class="wrapper">
      <div class="header">
        <nav>
          <div>
            <router-link to="/">
              <img src="http://abc.huanpl.top/2020/08/07/e8929d4f4089b0a180428146a1b3c16e.png" alt="" class="logo" v-show="searchShow">
              <img src="http://abc.huanpl.top/2020/08/31/a2db1899404ce53a802d1955462aac8a.png" alt="" class="logo" v-show="!searchShow">
            </router-link>
            <router-link to="/photo" v-show="searchShow">
              <div class="nav-item" >照片
                <div>[</div>
                <div>]</div>
                <span></span>
              </div>
            </router-link>
            <router-link to="/illustration" v-show="searchShow">
              <div class="nav-item" >插画
                <div>[</div>
                <div>]</div>
                <span></span>
              </div>
            </router-link>
            <router-link to="/vector" v-show="searchShow">
              <div class="nav-item" >矢量
                <div>[</div>
                <div>]</div>
                <span></span>
              </div>
            </router-link>
            <router-link to="/wallpaper" v-show="searchShow">
              <div class="nav-item" >壁纸
                <div>[</div>
                <div>]</div>
                <span></span>
              </div>
            </router-link>
            <div v-show="!searchShow" class="search_show">
              <Input v-model="valueSearch" search @on-search="searchImg" style="width: 400px">
              <Select v-model="selectList" slot="prepend" style="width: 70px" @on-change="searchSelect">
                <Option value="全部">全部</Option>
                <Option value="图片">图片</Option>
                <Option value="插画">插画</Option>
                <Option value="矢量">矢量</Option>
                <Option value="壁纸">壁纸</Option>
              </Select>
              <Button slot="append" icon="ios-search"  @click="searchImg"></Button>
              </Input>
            </div>
          </div>
          <div>
            <div class="login-text" v-show="loginState" @click="login()">
              <div class="login">登陆</div>
            </div>
            <div class="userData" v-show="!loginState"   @mouseenter="enter()" @mouseleave="leave()">
              <img :src="usersImg" class="userImg">
              <div class="userCon" v-show="navUser">
                <ul>
                  <div class="usersName">{{usersName}}</div>
                  <router-link to="/my" >
                    <li><Icon type="ios-contact-outline" size="20" class="user-li-Icon"/>个人中心</li>
                  </router-link>
                  <li @click="outLogin()"><Icon type="ios-log-out" size="20" class="user-li-Icon"/>退出登陆</li>
                </ul>
              </div>
            </div>
            <Button type="success" shape="circle" icon="md-cloud-upload" @click="upImg('tab3')">上传</Button>
          </div>
        </nav>
        <Modal v-model="modal" width="450"  @on-visible-change="modalChange(modal)">
          <div class="main">
            <div class="div-tab">
              <Tabs v-model="nameTab" class="login-tabs">
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
                    <div class="div_logoHX">
                      <img src="http://abc.huanpl.top/2020/08/31/a2db1899404ce53a802d1955462aac8a.png" class="logoHX">
                      <div>欢迎您！</div>
                    </div>
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
          <div slot="footer"></div>
        </Modal>
        <div style="height: 70px"></div>
      </div>

      <router-view class="section"/>

      <div class="footer">
        <div>
          <img src="http://abc.huanpl.top/2020/08/31/a2db1899404ce53a802d1955462aac8a.png" class="footer_logo">
          <div >
            <div class="footer_nav_title">
              <div>导航</div>
              <Icon type="md-link" />
              <Icon type="md-fastforward" />
            </div>
            <div class="footer_nav">
              <router-link to="/photo">
                <div class="footer_nav_item" >图片<Divider type="vertical" /></div>
              </router-link>
              <router-link to="/illustration">
                <div class="footer_nav_item" >插画<Divider type="vertical" /></div>
              </router-link>
              <router-link to="/vector">
                <div class="footer_nav_item" >矢量<Divider type="vertical" /></div>
              </router-link>
              <router-link to="/wallpaper">
                <div class="footer_nav_item" >壁纸</div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="footer_beianhao">
          <div class="footer_text" >计算机专业毕设项目&nbsp;&nbsp;|&nbsp; </div>
          <div class="beianhao">
            &nbsp;&copy;<div ><a style="color: #dcdee2;" href="http://beian.miit.gov.cn">豫ICP备20023673号-1</a></div>
          </div>
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41032702000057" style="color: #dcdee2;">
            <img src="" style="float:left;"/><p >&nbsp;&nbsp;|&nbsp;豫公网安备 41032702000057号</p>
          </a>
        </div>
      </div>

      <BackTop></BackTop>
    </div>
</template>

<script>
    export default {
      inject: ['reload'],
      name: "index",
      data(){
        const loginValidateName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入用户名'));
          } callback();
        };
        const loginValidatePass = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入密码'));
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
        this.$Message.config({
          top: 100,
          duration: 2
        });
       return{
         userMessage:'',
         loginState:true,navUser:false,modal:false,tips:false,searchShow:true,
         usersImg:'',usersName:'', sameName:'',valueSearch:'',selectList:'全部',
         nameTab:'name1',
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
        this.mylogin();
        // document.body.parentNode.style.overflowY = "auto";//开启纵向滚动条

        if(this.$route.path==='/search'){
          this.valueSearch=sessionStorage.getItem('searchCon');
          this.selectList=sessionStorage.getItem('searchCategory');
          this.searchShow=false;
        }else{
          this.searchShow=true;
        }
      },
      watch:{
        '$route':function(to,from){
          if (to.path === "/search") {
            this.valueSearch=sessionStorage.getItem('searchCon');
            this.selectList=sessionStorage.getItem('searchCategory');
            this.searchShow=false;
          } else {
            this.searchShow=true;
          }
        }
      },
      methods:{
        login(){
          this.modal=true;
        },
        outLogin(){
          Bmob.User.logout();
          const current = Bmob.User.current();
          if(current==null){
            // this.$Message.success('成功退出');
            this.$Notice.success({
              title: '成功退出',
              duration: 1
            });
            this.loginState=true;
            this.reload();
          }
        },
        mylogin(){
          const current = Bmob.User.current();
          if(current!=null){
            this.userMessage=current;
            const query = Bmob.Query('_User');
            query.get(this.userMessage.objectId).then(res => {
              this.usersImg=res.phone;
              this.usersName=res.username;
            }).catch(err => {
              console.log(err)
            });
            this.loginState=false;
            let logoTime=localStorage.getItem("timer");
            let dataTime = new Date();
            let nowTime=dataTime.getTime();
            let diffTime=(nowTime-logoTime)/1000/60/60;
            if(diffTime>24){
              Bmob.User.logout();
            }
          }
        },
        upImg(id){
          const current = Bmob.User.current();
          if(current==null){
            this.$Notice.warning({
              title: '您还没有登陆',
              duration: 1.5
            });
          }else {
            this.reload();
            this.$router.push({
              path: '/my',
              query: {
                id: id
              }
            });
          }
        },
        enter(){
          this.navUser=true;
          $(".userCon").slideDown(200);
        },
        leave(){
          // $(".navHide").slideUp();
          this.navUser=false
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
                //this.$Message.success('注册成功，请前往登陆!');
                this.$Notice.success({
                  title: '注册成功，请前往登陆!',
                  duration: 1
                });
                this.nameTab="name1";
                this.loginData.user=this.registerData.user;
                this.handleReset(name);
              }).catch(err => {
                //this.$Message.error('因网络或其他原因，注册失败!');
                this.$Notice.error({
                  title: '因网络或其他原因，注册失败!',
                  duration: 1
                });
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
              //let current2 = Bmob.User.current();
              this.reload();
              //this.$Message.success('欢迎您');
              this.$Notice.success({
                title: '欢迎您'+" "+res.username,
                duration: 1.5
              });
              let dataTime = new Date();
              let logoTime=dataTime.getTime();
              localStorage.setItem("timer",logoTime);
            }
          }).catch(err => {
            //this.$Message.error('用户名密码错误');
            this.$Notice.error({
              title: '用户名密码错误',
              duration: 2
            });
            // this.mylogin=true
          });
        },
        handleReset (name) {
          this.$refs[name].resetFields();
        },
        modalChange(name){
          // if(name===false){
          //   document.body.parentNode.style.overflowY = "auto";//开启纵向滚动条
          // }else {
          //   document.body.parentNode.style.overflowY = "hidden";//隐藏纵向滚动条
          // }
        },
        searchImg(){
          sessionStorage.setItem('searchCon',this.valueSearch);
          this.reload()
          // this.$refs['Childmain'].searchListCon()
        },
        searchSelect(value){
          sessionStorage.setItem('searchCategory',value);
        }
      }



    }
</script>

<style scoped>
  .router-link-active .nav-item>span{
    height: 3px;
  }
  .wrapper{
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  .header{
     flex: 0;
   }
  .section{
    flex: 1;
  }
  .nav-item>span{
    position: absolute;
    bottom: -1px;
    height: 0;
    left: 10%;
    background-color: #2b85e4;
    width: 80%;
  }
  .logo{
    margin: 15px 15px 0 20px;
    height: 40px;
  }
  nav{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 70px;
    background-color: white;
    box-shadow: 0px 1px 10px #c5c8ce  ;
    position: absolute;
    z-index: 9;
  }
  nav>div:nth-child(1){
    display: flex;
    justify-content: center;
  }
  nav div:nth-child(2){
    display: flex;
    align-items: center;
  }
  .nav-item{
    display: block;
    text-align: center;
    width: 80px;
    font-size: 14px;
    line-height: 70px;
    color: #191B26;
    position: relative;
  }
  .nav-item>div:nth-child(1),.nav-item>div:nth-child(2){
    color: #2b85e4;
    font-weight: bolder;
    position: absolute;
    line-height: 70px;
    top: 0;
    opacity: 0;
            transition:all .5s;
    -webkit-transition:all .5s; /* Safari */
  }
  .nav-item div:nth-child(1){
    left: 30px;
  }
  .nav-item div:nth-child(2){
    right: 30px;
  }

  .nav-item:hover div:nth-child(1){
    left: 15px;opacity: 1;
  }
  .nav-item:hover div:nth-child(2){
    right: 15px;opacity: 1;
  }
  @keyframes move
  {
    from {left: 30px;opacity: 0;}
    to {}
  }
  .main-title{
    font-size: 20px;
    font-weight: bolder;
    line-height: 70px;
    padding: 0 30px;
  }
  Button{
    margin: 0 30px;
  }
  .login{
    line-height: 70px;
    cursor: pointer;
  }
  .userData{
    height: 70px;
    position: relative;

  }
  .userCon{
    padding: 10px 0;
    display: flex;
    justify-content: center;
    width: 180px;
    background-color: #191b26;
    position: absolute;
    z-index: 3;
    top: 60px;
    right: -70px;
    border-radius: 3px;
    /*opacity: 0;*/
    /*transition: all .3s;*/
  }
  .userCon ul li{
    line-height: 30px;
    list-style: none;
    padding: 5px 10px;
    cursor: pointer;
    width: 180px;
    display: flex;
    align-items: center;
    color: #b6becc;
  }
   .user-li-Icon{
    margin-right: 6px;
  }
  .usersName{
    text-align: center;
    padding: 10px 0 10px 0;
    font-size: 22px;
    color: white;
    border-bottom: 1px solid #2e303d;
  }
  .userCon ul li:hover{
    background-color: #282b38;
    color: white;
  }
  .userData img{
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: absolute;
    right: 0;
    z-index: 4;
            transition: all .2s linear;
    -webkit-transition: all .2s linear;
  }
  .userImg:hover .userCon{
    background-color: #2b85e4;
    width: 300px;
  }
  .userData:hover .userImg{
        -ms-transform: scale(1.5,1.5) translate(0,10px); /* IE 9 */
    -webkit-transform: scale(1.5,1.5) translate(0,10px);/* Safari */
            transform: scale(1.5,1.5) translate(0,10px); /* 标准语法 */
  }

  /*登陆*/
  .main{
    display: flex;
    justify-content: center;
  }
  .div-tab{
    width: 100%;
  }
  .login-tabs{
    padding: 20px 20px 0 20px;
  }
  .tips{
    color: #ed4014;
    font-size: 13.5px;
    position: absolute;
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
  .div_logoHX{
    width: 100%;
    text-align: center;
  }
  .logoHX{
    width: 150px;
  }
  .footer{
    padding: 30px 40px 30px 20px;
    color: #dcdee2;
    background-color: #191b26;
    flex: 0
    /*display: flex;*/
  }
  .footer>div:nth-child(1){
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer_nav_title{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .footer_nav_title>div{
    margin-right: 8px;
  }
  .footer_nav{
    display: flex;
  }
  .footer_beianhao{
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 11px;
  }
  .footer_nav_item{
    color: white;
    /*padding: 0 10px;*/
  }
  .footer_logo{
    width: 90px;
  }
  .beianhao{
    display: flex;
  }
  .search_show{
    display: flex;
    align-items: center;
    padding: 0 0 0 30px;
  }
</style>
