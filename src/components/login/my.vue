<template>
  <div class="body">
    <div>
      <div class="topimg"></div>
      <div class="dibu_shadow">
        <div class="dibu_div">
          <img :src="userMessage.phone" class="my_img">
          <div class="mylogo_shadow" @mouseenter="enter()" @mouseleave="leave()" @click="mylogo">
            <div v-show="mouselogo" style="font-size: 14px">修改头像</div>
          </div>

          <div class="my_name">{{userMessage.username}}</div>
        </div>
      </div>
    </div>
    <div class="content-before"></div>
    <Content class="content">
      <Tabs v-model="tabs" :animated="false" >
        <TabPane label="我的投稿" name="tab1" icon="ios-videocam" >
          <Row :gutter="16">
            <Col span="24">
              <div class="div_choice1">
                <div>
                  <RadioGroup v-model="choice1" type="button" @on-change="choice1Change()">
                    <Radio label="全部"></Radio>
                    <Radio label="照片"></Radio>
                    <Radio label="插画"></Radio>
                    <Radio label="矢量"></Radio>
                    <Radio label="壁纸"></Radio>
                  </RadioGroup>
                  <!--<div class="div_choice1_loading" v-show="choice1Loading">-->
                    <!--<Icon type="ios-loading" size=25 class="demo-spin-icon-load"></Icon>-->
                  <!--</div>-->
                </div>
                <RadioGroup v-model="choice2" type="button" @on-change="choice2Check()" v-show="checkShow">
                  <Radio label="审核中"></Radio>
                  <Radio label="审核成功"></Radio>
                  <Radio label="审核失败"></Radio>
                </RadioGroup>
              </div>
            </Col>
            <Col span="24" v-show="listNull">
              <div class="div_null">
                <img src="http://abc.huanpl.top/2020/09/02/8083e70f400a08d380c738ad0ca1733e.png" class="imgNull">
              </div>
            </Col>
            <Col span="8" v-for="(item,index) in showList" :key="index" v-show="showList">
              <div>
                <Card class="myUpImgCard" >
                  <div class="myUpImg_div">
                    <div>
                      <img :src="item.imgUrl" class="myUpImg">
                      <div class="myUpImg_s">
                        <div>浏览：50</div>
                        <div>收藏：10</div>
                      </div>
                    </div>
                    <div class="myUpImgTag">
                      <div>标签：</div>
                      <Tag color="volcano" v-for="(items,index) in item.tagArr" :key="index">{{items}}</Tag>
                    </div>
                    <div class="myUpImgCheck">
                      <div class="myUpImg_time">投稿于：{{item.createdAt.substr(0,10)}}</div>
                      <div>
                        <Tooltip content="正在审核" placement="top-end" >
                          <Icon v-if="item.checked!==true&&item.checked!==false" type="ios-clock" size="15" color="#2db7f5"/>
                        </Tooltip>
                        <Tooltip content="成功通过审核" placement="top-end">
                          <Icon v-if="item.checked===true" type="ios-checkmark-circle" size="15" color="#19be6b"/>
                        </Tooltip>
                        <Tooltip content="审核失败，存在违规行为" placement="top-end">
                          <Icon v-if="item.checked===false" type="ios-close-circle" size="15" color="#ed4014"/>
                        </Tooltip>
                        <Dropdown trigger="click" style="cursor: pointer" placement="bottom-end">
                          <Icon type="md-menu" size="15"/>
                          <DropdownMenu slot="list">
                            <DropdownItem ><div @click="myUpDelete(item.objectId)">删除投稿</div></DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      <!--<div class="myUpImg_check">-->
                      <!--<div v-if="item.check!==true&&item.check!==false" style="color: #2d8cf0">正在审核</div>-->
                      <!--<div v-if="item.check===false" style="color: red">审核不通过</div>-->
                      <!--<div v-if="item.check===true" style="color: #19be6b">审核通过</div>-->
                      <!--<div class="myUpImgTextList_delete" @click="myUpDelete(item.objectId)"><Icon type="md-close-circle" size="20"/></div>-->
                      <!--</div>-->
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
          <div class="FenYe" v-show="fenye">
            <Page :total="dataCount" :page-size="pageSize" show-total @on-change="chagePage"/>
          </div>
        </TabPane>
        <TabPane label="发布图片" name="tab2" icon="ios-document">
          <div class="cardDiv">
            <Card >
              <ul>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                  <FormItem label="标签" prop="textTitle">
                    <Input v-model="formValidate.textTitle" @on-focus="inputFocus()"  @keyup.enter.native="handleAdd()" placeholder="标签用于搜索(最多4个字符)-Enter键添加" style="width: 28%"/>
                    <div class="tips" v-show="tips">标签内容不能超过5个字符</div>
                    <Button icon="ios-add" type="dashed" @click="handleAdd" :disabled="ButtonDis">添加标签</Button>
                    <Tag v-for="item in countTag" :key="item" :name="item" closable @on-close="handleClose2" color="success" >{{item}}</Tag>
                  </FormItem>
                  <FormItem label="类别" prop="textLeiBie">
                    <Select v-model="formValidate.textLeiBie" placeholder="选择图片类别">
                      <Option value="图片">图片</Option>
                      <Option value="插画">插画</Option>
                      <Option value="矢量">矢量</Option>
                      <Option value="壁纸">壁纸</Option>
                    </Select>
                  </FormItem>
                  <div class="inputImg_div">
                    <input type="file" id="profilePhotoFileUploadImg"   multiple="multiple" class="inputImg">
                    <label for="profilePhotoFileUploadImg" @click="fileUpRelease">
                      <div class="NewinputImg" v-if="!inputImg_view_release">
                        <Icon type="md-camera" class="NewinputImg_ico" size="40"/>
                      </div>
                      <Spin fix v-if="spinShow_release">
                        <Icon type="ios-loading" size=25 class="demo-spin-icon-load"></Icon>
                      </Spin>
                    </label>
                  </div>
                  <div class="inputImg_div" v-if="inputImg_view_release">
                    <img :src="imgurl_release" class="inputImg_view_release">
                  </div>
                  <div class="inputImg_btn" v-if="revise_btn_release">
                    <Button @click="inputImgCancelRelease">重新选择</Button>
                  </div>
                  <FormItem style="margin: 30px 0">
                    <Button type="primary" @click="myImgSubmit('formValidate')">确认</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
                  </FormItem>
                </Form>
              </ul>
            </Card>
          </div>

        </TabPane>
        <TabPane label="修改信息" name="tab3" icon="md-key">
          <div class="revise_div">
            <Row :gutter="16">
              <Col span="8">
                <Card style="width:100%">
                  <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    修改头像
                  </p>
                    <!--<a >修改</a>-->
                  <ul style="margin: 71px">
                    <div class="inputImg_div" >
                      <input type="file" id="profilePhotoFileUpload"   multiple="multiple" class="inputImg">
                      <label for="profilePhotoFileUpload" @click="fileUp">
                        <div class="NewinputImg" v-if="!inputImg_view">
                          <Icon type="md-camera" class="NewinputImg_ico" size="40"/>
                        </div>
                        <Spin fix v-if="spinShow">
                          <Icon type="ios-loading" size=25 class="demo-spin-icon-load"></Icon>
                        </Spin>
                      </label>
                    </div>
                    <div class="inputImg_div" v-if="inputImg_view">
                      <img :src="imgurl" class="inputImg_view">
                    </div>
                    <div class="inputImg_btn" v-if="revise_btn">
                      <Button @click="inputImgCancel">取消</Button>
                      <Button @click="inputImgOk" type="primary" >确定</Button>
                    </div>
                  </ul>
                </Card>
              </Col>
              <Col span="16">
                <Card style="width:100%">
                  <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    修改密码
                  </p>
                  <ul>
                    <div >
                      <Steps :current="current" style="margin:20px 0 0 70px;width: 600px">
                        <Step title="确认修改"></Step>
                        <Step title="验证旧密码/修改新密码"></Step>
                        <Step title="成功修改"></Step>
                      </Steps>
                      <div v-if="current0" class="current_div_0">
                        <div style="margin: 15px 0">确定修改密码吗？</div>
                        <div style="margin: 15px 0">点击下一步</div>
                        <Button @click="current01" type="success" >下一步</Button>
                      </div>
                      <div v-if="current1" class="current_div">
                        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" style="width:300px">
                          <FormItem label="旧密码" prop="oldpasswd">
                            <Input type="password" v-model="formCustom.oldpasswd" size="large"></Input>
                          </FormItem>
                          <FormItem label="新密码" prop="passwd">
                            <Input type="password" v-model="formCustom.passwd" size="large"></Input>
                          </FormItem>
                          <FormItem label="确认密码" prop="passwdCheck">
                            <Input type="password" v-model="formCustom.passwdCheck" size="large"></Input>
                          </FormItem>
                          <FormItem style="float: right">
                            <Button @click="handleReset('formCustom')" style="margin-left: 8px" size="large">清除</Button>
                            <Button type="success" @click="handleSubmit('formCustom')" size="large">确认</Button>
                          </FormItem>
                        </Form>
                      </div>
                    </div>
                    <div v-if="current2" class="current_div_0">
                      <Icon type="ios-checkmark-circle-outline" size="120" color="#19be6b"/>
                      <div class="prompt_text">修改密码成功<span id="num">{{count}}</span>秒后退出登陆</div>
                    </div>

                  </ul>
                </Card>
              </Col>
            </Row>

          </div>

        </TabPane>
      </Tabs>
    </Content>
  </div>
</template>

<script>
    export default {
      name: "my",
      inject: ['reload'],
      data(){
        const validateOldPass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入您的旧密码'));
          } else {
            callback();
          }
        };
        const validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入您的新密码'));
          } else {
            callback();
          }
        };
        const validatePassCheck = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再一次输入您的新密码'));
          } else if (value !== this.formCustom.passwd) {
            callback(new Error('两次输入的密码不一致，请好好查对一下'));
          } else {
            callback();
          }
        };
        const validatorTag = (rule, value, callback) => {
          if(this.countTag.length===0){
            if (value === '') {
              callback(new Error('请至少输入一个素材的标签'));
            }else {
              callback();
            }
          }callback();

          // else if (value.length>4) {
          //   callback(new Error('标签内容不能超过5个字符'));
          // }

        };
        return{
          myUpImgText:[], totalList:[], showList:[],userMessage:[],countTag:[],
          dataCount:0, pageSize:15, current:0,
          current0:true,current1:false,current2:false,tips:false,
          count:"",imgurl:'',imgurl_release:'',imgName: '',tabs:"tab1",
          choice1:'全部',choice2:'',choiceCheck:'',checkShow:true,fenye:true,listNull:false,
          revise_btn:false,revise_btn_release:false, inputImg_view:false,inputImg_view_release:false,
          mouselogo:false, spinShow:false,spinShow_release:false,show:false,ButtonDis:true,
          formValidate: {
            textTitle: '',
            textLeiBie: '',
          },
          ruleValidate: {
            textTitle: [
              { validator: validatorTag, trigger: 'blur' }
            ],
            textLeiBie: [
              { required: true, message: '请选择图片类别', trigger: 'change' }
            ],
          },
          formCustom: {
            passwd: '',
            passwdCheck: '',
            oldpasswd: '',
          },
          ruleCustom: {
            passwd: [
              { validator: validatePass, trigger: 'blur' }
            ],
            passwdCheck: [
              { validator: validatePassCheck, trigger: 'blur' }
            ],
            oldpasswd: [
              { validator: validateOldPass , trigger: 'blur' }
            ]
          },
        }
      },
      methods:{
        mylogo(){
          this.tabs="tab3"
        },
        enter(){
          this.mouselogo=true
        },
        leave(){
          this.mouselogo=false
        },
        //上传头像地址
        fileUp(){
          const fileUploadControl = document.getElementById('profilePhotoFileUpload');
          fileUploadControl.onchange = () => {
            const pic = fileUploadControl.files;
            let file;
            for(let item of pic){
              file = Bmob.File(item.name, item);
            }
            this.spinShow=true;
            file.save().then(res => {
              for(let i=0;i<50;i++){
                if(res!==0){
                  i+=50;
                  this.spinShow=false;
                }
              }
              this.imgurl=res[0].url;
              this.revise_btn=true;
              this.inputImg_view=true;
            })
          }
        },
        //投稿图片地址
        fileUpRelease(){
          const fileUploadControl = document.getElementById('profilePhotoFileUploadImg');
          fileUploadControl.onchange = () => {
            const pic = fileUploadControl.files;
            let file;
            for(let item of pic){
              file = Bmob.File(item.name, item);
            }
            this.spinShow_release=true;
            console.log(this.spinShow_release);
            file.save().then(res => {
              for(let i=0;i<50;i++){
                if(res!==0){
                  i+=50;
                  this.spinShow_release=false;
                }
              }
              this.imgurl_release=res[0].url;
              this.revise_btn_release=true;
              this.inputImg_view_release=true;
            })
          }
        },
        //修改头像取消按钮
        inputImgCancel(){
          this.imgurl='';
          this.revise_btn=false;
          this.inputImg_view=false;
        },
        // 重新选择
        inputImgCancelRelease(){
          let div = document.getElementById("profilePhotoFileUploadImg");
          div.click();
        },
        //修改头像确定按钮
        inputImgOk(){
          const query = Bmob.Query('_User');
          query.get(this.userMessage.objectId).then(res => {
            res.set('phone',this.imgurl);
            res.save();
            this.$Notice.success({
              title: '修改成功',
              duration: 1
            });
            this.imgurl='';
            this.revise_btn=false;
            this.inputImg_view=false;
            this.getUser();
            this.reload();
          }).catch(err => {
            console.log(err)
          })
        },
        //修改密码下一步
        current01(){
          this.current=1;
          this.current0=false;
          this.current1=true;
          this.current2=false;
        },
        // 修改密码
        handleSubmit (name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              let objectId =this.userMessage.objectId;
              let data = {
                oldPassword: this.formCustom.oldpasswd,
                newPassword: this.formCustom.passwd
              };
              Bmob.updateUserPassword(objectId,data).then(res => {
                //console.log(res.code);
                this.current=2;
                this.current0=false;
                this.current1=false;
                this.current2=true;
                if(this.current2===true){
                  const TIME_COUNT = 3;
                  if(!this.timer){
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(()=>{
                      if(this.count > 0 && this.count <= TIME_COUNT){
                        this.count--;
                      }else{
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;
                        //跳转的页面写在此处
                        Bmob.User.logout();
                        this.reload();
                        this.$router.push("/");
                      }
                    },1000)
                  }
                }
                this.$Notice.success({
                  title: '修改成功，请重新登陆!',
                  duration: 1
                });

              }).catch(err => {
                if(err.code===210){
                  this.$Notice.error({
                    title: '旧密码不正确',
                    duration: 1.5
                  });
                }
              });
            }
          })
        },
        // 投稿图片
        myImgSubmit(name){
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.spinShow_release=true;
              const pointer = Bmob.Pointer('_User');
              const poiID = pointer.set(this.userMessage.objectId);
              const upImg = Bmob.Query('upImg');
              upImg.set("tag",this.countTag.toString());
              upImg.set("tagArr",this.countTag);
              upImg.set("category",this.formValidate.textLeiBie);
              upImg.set("imgUrl",this.imgurl_release);
              //upImg.set("own",this.userMessage.objectId);
              //upImg.set("check",false);
              upImg.save().then(res => {
                upImg.get(res.objectId).then(res => {
                  res.set('own',poiID);
                  res.save()
                });

                this.handleReset (name);
                const relation = Bmob.Relation('upImg'); // 需要关联的表
                const relID = relation.add(res.objectId);
                const query = Bmob.Query('_User');
                query.get(this.userMessage.objectId).then(res => {
                  for(let i=0;i<50;i++){
                    if(res!==0){
                      i+=50;
                      this.spinShow_release=false;
                    }
                  }
                  res.set('myUp',relID);
                  res.save();
                  this.$Notice.success({
                    title: '投稿成功，请耐心等待审核',
                    duration: 2
                  });
                  this.reload()
                });
              }).catch(err => {
                this.$Notice.error({
                  title: '投稿失败',
                  duration: 1.5
                });
              })

            }
          });
        },
        // 清除按钮
        handleReset (name) {
          this.$refs[name].resetFields();
          this.imgurl_release='';
          this.revise_btn_release=false;
          this.inputImg_view_release=false;
          this.countTag=[];
        },
        //分页
        chagePage(index){
          let start_ =(index-1)*this.pageSize;
          let end_ =index*this.pageSize;
          this.showList=this.totalList.slice(start_,end_);
        },
        //删除投稿按钮
        myUpDelete(objectId){
          this.$Modal.confirm({
            title: '确定删除此条投稿？',
            onOk: () => {
              const query = Bmob.Query('upImg');
              query.destroy(objectId).then(res => {
                this.myupList()
              }).catch(err => {
              })
            },
            onCancel: () => {

            }
          })
        },
        //获取用户投稿内容
        myupList(){
          const my_ImgText = Bmob.Query('_User');
          my_ImgText.field('myUp',this.userMessage.objectId);
          my_ImgText.order("-createdAt");
          my_ImgText.relation('upImg').then(res => {
            if(res.results.length===0){
              this.listNull=true;
              this.fenye=false;
            }else {
              this.listNull=false;
              this.myUpImgText=res.results;
              this.totalList=this.myUpImgText;
              this.dataCount=this.myUpImgText.length;
              this.fenye=true;
              if(this.dataCount<this.pageSize){
                this.showList=this.totalList
              }else {
                this.showList=this.totalList.slice(0,this.pageSize)
              }
            }
          })
        },
        //获取用户信息
        getUser(){
          let currents = Bmob.User.current();
          this.userMessage=currents;
          if(currents==null){
            this.$router.push('/')
          }
          const query = Bmob.Query('_User');
          query.get(this.userMessage.objectId).then(res => {
            this.userMessage=res;
            //this.usersName=res.username;
          }).catch(err => {
            console.log(err)
          });
        },
        //添加标签按钮
        handleAdd () {
          if (this.formValidate.textTitle.length>4) {
            this.tips=true;
          } else {
            this.tips=false;
            this.countTag.push(this.formValidate.textTitle);
            this.formValidate.textTitle='';
            this.ButtonDis=true;
            // this.$Message.error("标签不能为空")
          }
        },
        //删除标签
        handleClose2 (event, name) {
          const index = this.countTag.indexOf(name);
          this.countTag.splice(index, 1);
        },
        //标签输入框获取焦点
        inputFocus(){
          this.ButtonDis=false;
        },
        //单选素材类别获取相应数据
        choice1ChangeCon(){
            let ChangeConArray=[];
            for (let i in this.myUpImgText) {
              if (this.myUpImgText[i].category===this.choice1) {
                ChangeConArray.push(this.myUpImgText[i]);
              };
            }
            this.totalList=ChangeConArray;
            if(this.totalList.length===0){
              this.listNull=true;
              this.fenye=false;
            }else {
              this.listNull=false;
              this.fenye=true;
            }
            // this.totalList=this.myUpImgText;
            this.dataCount=this.totalList.length;
            if(this.dataCount<this.pageSize){
              this.showList=this.totalList
            }else {
              this.showList=this.totalList.slice(0,this.pageSize)
            }
        },
        //单选获取审核状态
        choice2CheckCon(){
          let CheckConArray=[];
          for (let i in this.myUpImgText) {
            if (this.myUpImgText[i].checked===this.choiceCheck) {
              CheckConArray.push(this.myUpImgText[i]);
            };
            this.totalList=CheckConArray;
            if(this.totalList.length===0){
              this.listNull=true;
              this.fenye=false;
            }else {
              this.listNull=false;
              this.fenye=true;
            }
            // this.totalList=this.myUpImgText;
            this.dataCount=this.totalList.length;
            if(this.dataCount<this.pageSize){
              this.showList=this.totalList
            }else {
              this.showList=this.totalList.slice(0,this.pageSize)
            }
          }
        },
        //单选素材类别
        choice1Change(){
          if(this.choice1==='全部'){
            this.choice2='';
            this.checkShow=true;
            this.myupList();
          }else {
            this.checkShow=false;
            this.choice1ChangeCon();
          }
        },
        //审查单选框
        choice2Check(){
          switch (this.choice2) {
            case "审核中":
              this.choiceCheck=undefined;
              this.choice2CheckCon();
              break;
            case "审核成功":
              this.choiceCheck=true;
              this.choice2CheckCon();
              break;
            case "审核失败":
              this.choiceCheck=false;
              this.choice2CheckCon();
              break;
          }
        },
        //获取收藏数
        getCollection(){
          const queryLiked = Bmob.Query('upImg');
          queryLiked.field('liked',this.id);
          queryLiked.relation('_User').then(res => {
            this.collectionCount=res.count;
            for(let i=0;i<res.count;i++){
              if(res.results[i].objectId===this.userMessage.objectId){
                this.like=false;
                break;
              }
            }
          });
        }
      },
      created(){
        this.tabs=this.$route.query.id;
        this.getUser();
        this.myupList()
      },

    }
</script>

<style scoped>
  .body{
    background-color: #f4f5f7;
    padding-bottom: 30px;
  }
  .topimg{
    background: url(http://abc.huanpl.top/2020/08/07/4996a53540364c47809ecb16598886e5.jpg) no-repeat top center;
    height: 200px;
    position: relative;
  }
  .dibu_shadow{
    margin-top: -200px;
    position: relative;
    z-index: 2;
    height:200px ;
    background: -webkit-linear-gradient(rgba(255, 213, 82, 0.00), rgba(0,0,0,0.5)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgba(234,195,76,0.00), rgba(0,0,0,0.5)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgba(234,195,76,0.00), rgba(0,0,0,0.5)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgba(234,195,76,0.00), rgba(0,0,0,0.5)); /* 标准的语法（必须放在最后） */
  }
  .content{
    width: 80%;
    height: auto;
    margin: 0 auto;
    /*background-color: white;*/
    /*margin-top: -40px;*/
    padding: 0px 20px 50px 20px;
  }
  .content-before{
    background-color: white;
    height: 60px;
    width: 77.4%;
    margin: 0 auto;
  }
  .dibu_div{
    padding: 0 20px;
    height: 200px;
    display: flex;
    align-items: flex-end;
    width: 79%;
    margin: 0 auto;
  }
  .my_img{
    margin-bottom: -40px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .mylogo_shadow{
    color: white;
    margin-bottom: -40px;
    width: 100px;
    height: 100px;
    margin-left: -100px;
    border-radius: 50%;
    top: 0;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mylogo_shadow:hover{
    background-color: rgba(0,0,0,0.6);
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    -ms-transition: all .4s;
    -o-transition: all .4s;
    transition: all .4s;
  }
  .my_name{
    margin-left: 20px;
    font-size: 20px;
    font-weight: bolder;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .cardDiv{
    width: 99.9%;
    margin: 8px 0 20px 0;
  }
  .cardDiv ul{
    margin: 30px 0;
  }
  .revise_div{
    /*margin: 8px 0 20px 0;*/
  }
  .inputImg_div{
    display: flex;
    justify-content: center;
  }
  .inputImg_btn{
    margin-top: 10px;
    text-align: center;
  }
  .inputImg{
    display: none;
  }
  .NewinputImg{
    border-radius: 5px;
    border: 1px dashed #a4a9bf;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin: 72px 0;*/
  }
  .inputImg_view{
    border-radius: 5px;
    width: 100px;
    height: 100px;
    border: 1px dashed #a4a9bf;
    object-fit: cover;
  }
  .inputImg_view_release{
    width: 100%;
    height: 500px;
    border: 1px dashed #a4a9bf;
    object-fit: contain;
  }
  .current_div_0{
    padding: 40px 40px;
    text-align: center;
  }
  .current_div{
    padding: 40px 40px;
    display: flex;
    justify-content: center;
  }
  .myUpImg{
    width: 100%;
    height: 200px;
    object-fit: contain;

  }
  .myUpImgTag{
    position: absolute;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 8px 0;
  }
  .myUpImg_category{
    margin-right: 10px;

  }
  .myUpImgCheck{
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    color: #a699a6;
    font-size: 12px;
  }
  .myUpImgCard{
    width: 100%;
    margin-bottom: 15px;
  }
  .myUpImg_div{
    /*width: 300px;*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    position: relative;
    align-items: center;
  }
  .myUpImg_div>div:nth-child(1){
    position: relative;
  }
  .myUpImg_div>div:nth-child(1):hover .myUpImg_s{
    height: 44px;
    /*visibility: visible;*/
  }
  .myUpImg_s{
    padding: 0 20px;
    position: absolute;
    bottom: 4px;
    color: #ffffff;
    left: 0;
    right: 0;
    background-image: linear-gradient(rgba(0, 0, 0, 0.0),rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.4));
    line-height: 44px;
    height: 0;
    transition: height 0.3s ;
    display: flex;
    /*visibility: hidden;*/
    justify-content: space-between;
  }

  .myUpImgTextList_LeiBie_title{
    display: flex;
  }
  .myUpImg_timeCheck{
    display: flex;
  }
  .myUpImg_time{
    margin-right: 15px;
  }
  .myUpImg_check{
    display: flex;
  }
  .myUpImgTextList_delete{
    margin-left: 20px;
    cursor: pointer;
  }
  .FenYe{
    display: flex;
    justify-content: center;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .tips{
    color: #ed4014;
    font-size: 13.5px;
    position: absolute;
  }
  .div_choice1{
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }
  .div_choice1 div:nth-child(1){
    display: flex;
  }
  .div_choice1_loading{
    margin: 2px 0 0 10px;
  }
  .div_null{
    text-align: center;
  }
  .imgNull{
    width: 300px;
  }
</style>
