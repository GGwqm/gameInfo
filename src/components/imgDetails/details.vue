<template>

<div class="body">
  <Row :gutter="24" class="imgRow">
    <Col span="18">
      <div class="divImg">
        <img :src="imgUrl" class="imgUrl">
      </div>
      <div class="form_comment" v-show="loginJudge">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" >
          <FormItem prop="desc" >
            <Input  v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入200字以内评论" @on-focus="formFocus()"></Input>
          </FormItem>
        </Form>
        <div v-show="btn_comm">
          <Button type="success" shape="circle" icon="ios-search" @click="handleSubmit('formValidate')">发布</Button>
          <Button shape="circle" icon="ios-search" @click="handleReset('formValidate')">取消</Button>
        </div>
      </div>
      <div v-show="!loginJudge" class="loginJudge">请先登陆再发表评论</div>
      <div class="div_comment" v-for="(item,key) in commentList" :key="key">
        <div>
          <div class="img_data">
            <img :src="item.userImg" class="comment_img">
            <Time :time="item.createdAt" class="comment_data"/>
          </div>
          <div class="comment_name">{{item.username}}</div>
        </div>
        <div class="comment_con">{{item.content}}</div>
        <div class="underline"></div>
      </div>
      <div class="more" @click="more()" v-show="moreBtn">显示更多
        <Icon v-show="iconLoad" type="ios-loading" size=17 class="demo-spin-icon-load"></Icon>
      </div>

    </Col>
    <Col span="6">
      <div class="div_own" v-if="own.own">
        <img :src="own.own.phone" class="own_img">
        <div>
          <div class="own_user">{{own.own.username}}</div>
          <!--<div>共18张照片</div>-->
        </div>
      </div>
      <Divider />
      <div class="div_btn">
        <Button v-show="like"  shape="circle" icon="ios-thumbs-up" type="primary" class="btn_star" @click="liked()">{{likeCount}}</Button>
        <Button v-show="!like" shape="circle" icon="ios-thumbs-up" type="primary" class="btn_stared" @click="unLiked()">{{likeCount}}</Button>
        <Button v-show="myCollect" shape="circle" icon="ios-star" type="primary" class="btn_good" @click="collect()">{{collectCount}}</Button>
        <Button v-show="!myCollect" shape="circle" icon="ios-star" type="primary" class="btn_gooded" @click="unCollect()">{{collectCount}}</Button>
      </div>
      <Divider />
      <!--<div class="div_btn_down">-->
        <!--<Button type="success" shape="circle" icon="ios-download-outline" style="width: 80%" @click="downs()">下载</Button>-->
      <!--</div>-->
      <!--<a :href="imgUrl" download="">下载</a>-->
      <!--<Divider />-->
      <div>
        <div v-if="own.tagArr"><Tag size="medium" color="default" v-for="(item, index) in own.tagArr" :key="index">{{item}}</Tag></div>
      </div>
      <div>
        <div class="hot_img">
          <Icon type="ios-flame" />
          <div>热门图片</div>
        </div>
        <div class="hot_img_list">
          <div class="img-wrapper" v-for="(item, index) in data" :key="index" @click="clickImage(item.imgUrl,item.objectId)">
            <div class="img" :style="'backgroundImage: url('+item.imgUrl+');'">
              <img :src="item.imgUrl" alt="" srcset="">
            </div>
          </div>
        </div>
      </div>
    </Col>
  </Row>

</div>
</template>

<script>
    export default {
      inject: ['reload'],
      name: "details",
      data(){
          return{
            imgUrl:'',own:'',id:'',userMessage:'',likeCount:'',collectCount:'',data:'',randomImg: '',collectId:'',
            like:true,myCollect:true,btn_comm:false,iconLoad:false,moreBtn:false,
            comList:5,
            commentList:[],
            formValidate:{
              desc:''
            },
            ruleValidate: {
              desc: [
                { required: true, message: '不能发表无内容的评论', trigger: 'blur' },
                { type: 'string', max: 200, message: '最多发表200字评论', trigger: 'blur' }
                // { validator: validateForm, trigger: 'blur' }
              ]
            }
          };

      },
      created(){
        //获取用户登陆信息
        this.userMessage = Bmob.User.current();
        //获取路由传参
        this.imgUrl=this.$route.query.url;
        this.id=this.$route.query.id;

        this.loginJudges();

        this.getUpUser();

        this.getRandomImg();
        this.likeJudge();
        this.collectJudge();
        this.commentJudge();
      },
      methods:{
        //用户是登陆判断
        loginJudges(){
          if(this.userMessage===null){
            this.loginJudge=false;
          }else {
            this.loginJudge=true;
          }
        },
        //获取每日随机推荐
        getRandomImg(){
          const queryHot = Bmob.Query("upImg");
          queryHot.equalTo("selected", "==", true);
          queryHot.find().then(res => {
            this.randomImg=res;
            this.randomImgClick();
          });
        },
        //获取此图片的上传用户信息
        getUpUser(){
          const query = Bmob.Query('upImg');
          query.include('own');
          query.get(this.id).then(res => {
            this.own=res;
          }).catch(err => {
            console.log(err)
          });
        },
        //评论判断
        commentJudge(){
          const queryComment = Bmob.Query('upImg');
          queryComment.field('comment',this.id);
          queryComment.limit(this.comList);
          queryComment.relation('comment').then(res => {
            this.commentList=res.results;
            if(res.count>this.comList){
              this.moreBtn=true;
            }
          });
        },
        //收藏判断
        collectJudge(){
          const queryLiked = Bmob.Query('upImg');
          queryLiked.field('collect',this.id);
          queryLiked.relation('_User').then(res => {
            this.collectCount=res.count;
            for(let i=0;i<res.count;i++){
              if(res.results[i].objectId===this.userMessage.objectId){
                this.myCollect=false;
                break;
              }
            }
          });
        },
        //喜欢判断
        likeJudge(){
          const queryLiked = Bmob.Query('upImg');
          queryLiked.field('liked',this.id);
          queryLiked.relation('_User').then(res => {

            this.likeCount=res.count;
            // console.log(res.count);
            // console.log(res.results[0])
            // console.log()
            for(let i=0;i<res.count;i++){
              // console.log(res.count+"数量for")
              //
              if(res.results[i].objectId===this.userMessage.objectId){
                  this.like=false;
                  break;
              }
            }

          });
        },
        //点击喜欢按钮
        liked(){
          if(this.userMessage===null){
            this.$Notice.warning({
              title: '请先登录',
              duration: 1
            });
          }else {
            const relation = Bmob.Relation('_User');// 需要关联的表
            const relID = relation.add(this.userMessage.objectId);//关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
            const query = Bmob.Query('upImg');
            query.get(this.id).then(res => {
              res.set('liked',relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
              res.save();
              this.like=false;
              this.likeJudge();
              this.$Notice.success({
                title: '点赞成功',
                duration: 1
              });
            })
          }
        },
        //取消喜欢
        unLiked(){
          const relation = Bmob.Relation('_User');
          const relID = relation.remove(this.userMessage.objectId);
          const query = Bmob.Query('upImg');
          query.get(this.id).then(res => {
            res.set('liked',relID);
            res.save();
            this.like=true;
            this.likeJudge();
            this.$Notice.success({
              title: '取消点赞',
              duration: 1
            });
          })
        },
        //点击收藏按钮
        collect(){
          if(this.userMessage===null){
            this.$Notice.warning({
              title: '请先登录',
              duration: 1
            });
          }else {
            const relation = Bmob.Relation('_User');// 需要关联的表
            const relID = relation.add(this.userMessage.objectId);//关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
            const query = Bmob.Query('upImg');
            query.get(this.id).then(res => {
              res.set('collect', relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
              res.save();
              const relation = Bmob.Relation('upImg');// 需要关联的表
              const relimgID = relation.add(this.id);//关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
              const query = Bmob.Query('_User');
              query.get(this.userMessage.objectId).then(res => {
                res.set('myCollect',relimgID); // 将Relation对象保存到two字段中，即实现了一对多的关联
                res.save();
                this.myCollect = false;
                setTimeout(()=>{
                  this.collectJudge();
                },200)
                this.$Notice.success({
                  title: '收藏成功',
                  duration: 1
                });
              })
            })
          }
        },
        //取消收藏
        unCollect(){
          const relation = Bmob.Relation('_User');
          const relID = relation.remove(this.userMessage.objectId);
          const query = Bmob.Query('upImg');
          query.get(this.id).then(res => {
            res.set('collect',relID);
            res.save();
            const relation = Bmob.Relation('upImg');// 需要关联的表
            const relimgID = relation.remove(this.id);//关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
            const query = Bmob.Query('_User');
            query.get(this.userMessage.objectId).then(res => {
              res.set('myCollect',relimgID); // 将Relation对象保存到two字段中，即实现了一对多的关联
              res.save();
              this.myCollect = true;
              setTimeout(()=>{
                this.collectJudge();
              },200)
              this.$Notice.success({
                title: '取消收藏',
                duration: 1
              });
            })
          })
        },
        //推荐图片跳转详情
        clickImage(url,id){
          this.$router.push({
            path: '/details',
            query: {
              url: url,
              id:id,
            }
          });
          this.reload();
        },
        //评论框获取焦点
        formFocus(){
          this.btn_comm=true;
        },
        //评论按钮
        handleSubmit (name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              const queryCon = Bmob.Query('comment');
              queryCon.set("userId",this.userMessage.objectId);
              queryCon.set("username",this.userMessage.username);
              queryCon.set("userImg",this.userMessage.phone);
              queryCon.set("content",this.formValidate.desc);
              queryCon.save().then(res => {
                const relation = Bmob.Relation('comment');// 需要关联的表
                const relID = relation.add(res.objectId);//关联表中需要关联的objectId, 返回一个Relation对象, add方法接受string和array的类型参数
                const query = Bmob.Query('upImg');
                query.get(this.id).then(res => {
                  res.set('comment',relID); // 将Relation对象保存到two字段中，即实现了一对多的关联
                  res.save();
                  this.commentJudge();
                  this.$Notice.success({
                    title: '评论成功',
                    duration: 2
                  });
                  this.handleReset(name);
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              this.$Notice.success({
                title: '评论失败',
                duration: 1
              });
            }
          })
        },
        //取消评论按钮
        handleReset (name) {
          this.$refs[name].resetFields();
          this.btn_comm=false;
        },
        //加载更多评论
        more(){
          this.iconLoad=true;
          const queryComment = Bmob.Query('upImg');
          queryComment.field('comment',this.id);
          this.comList+=5;
          queryComment.limit(this.comList);
          queryComment.relation('comment').then(res => {
            this.commentList=res.results;
            this.iconLoad=false;
            if(this.comList>res.results.length){
              this.moreBtn=false;
            }else {
              this.moreBtn=true;
            }
          });
        },
        //随机推荐图片
        randomImgClick(){
          for (let i = 0, len = this.randomImg.length; i < len; i++) {
            let rand = parseInt(Math.random() * len);
            let temp = this.randomImg[rand];
            this.randomImg[rand] = this.randomImg[i];
            this.randomImg[i] = temp;
          }
          this.data = this.randomImg.slice(0,5);
        },
        // 下载图片

          download (url,name){
            // const ele = document.createElement('a');
            // ele.setAttribute('href', url); //设置下载文件的url地址
            // let str=url.substring(url.lastIndexOf("/"));
            // let str2=str.split('/')[1];
            // ele.setAttribute('download',str2);//用于设置下载文件的文件名
            // ele.click();
            // let urlImg = window.URL.createObjectURL(new Blob([url]));
            // let link = document.createElement('a');
            // link.style.display = 'none';
            // link.href = urlImg;
            // link.setAttribute('download', url);
            // document.body.appendChild(link);
            // link.click()

            var image = new Image()
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function() {
              var canvas = document.createElement('canvas')
              canvas.width = image.width
              canvas.height = image.height
              var context = canvas.getContext('2d')
              context.drawImage(image, 0, 0, image.width, image.height)
              var url = canvas.toDataURL('image/png')
              var a = document.createElement('a')
              var event = new MouseEvent('click')
              a.download = name || 'photo'
              a.href = url
              a.dispatchEvent(event)
            }
            image.src = url
          },
          downs(){
            this.download(this.imgUrl, 'pic')
          }


      }
    }
</script>

<style scoped>
  .body{
    padding: 30px 110px 20px 100px;
    height: auto;
  }
  .imgUrl{
    width: 100%;
    height: 100%;
    object-fit: contain;
    /*box-shadow: #dedee2 0px 0px 10px;*/
  }
  .divImg{
    height: 600px;
  }
  .div_own{
    display: flex;
    flex-direction: row;
  }
  .own_img{
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 50%;
  }
  .own_user{
    font-size: 25px;
    line-height: 45px;
    margin-left: 20px;
  }
  .div_btn{
    display: flex;
    width: 100%;
  }
  .div_btn_down{
    display: flex;
    justify-content: center;
  }
  .btn_star,.btn_good{
    width: 100%;
    margin: 0 15px;
  }
  .btn_stared,.btn_gooded{
    opacity: 0.5;
    width: 100%;
    margin: 0 15px;
  }
  .hot_img{
    background-color: #393b57;
    display: flex;
    color: white;
    align-items: center;
    margin: 15px 0;
    padding: 10px 10px;
  }
  .hot_img>div{
    margin-left: 8px;
  }
  .hot_img_list{
    display: flex;
    flex-wrap: wrap;
  }
  .img-wrapper {
    flex-grow: 1;
    margin: 5px;
    position: relative;
    overflow: hidden;
    height: 100px;
  }
  .img-wrapper .img,.loop-bg {
    /*object-fit: cover;*/
    background-size: cover;
    background-position: center;
  }
  .img-wrapper .img img {
    opacity: 0;
    min-width: 100%;
    height: 100px;
    cursor: pointer;
  }


  .form_comment{
    margin: 40px 0 ;
  }
  .div_comment>div:nth-child(1){
    /*display: flex;*/
    /*align-items: center;*/
    position: relative;
  }
  .comment_img{
    position: absolute;
    top: 5px;
    width: 45px;
    height: 45px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 50%;
  }
  .comment_data{
    position: absolute;
    right: 0;
    top: 5px;
    font-size: 13px;
    color: #4d5669;
  }
  .comment_name{
    color: #2d8cf0;
    margin-left: 60px;
    margin-bottom: 8px;
    font-size: 18px;
  }
  .comment_con{
    margin-left: 60px;
  }
  .underline{
    width: 100%;
    margin: 15px 0;
    height: 1px;
    background-color: #edeff0;
  }
  .more{
    text-align: center;
    background-color: #f4f4f4;
    width: 100%;
    padding: 10px 0;
    cursor: pointer;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
    margin-left: 8px;
  }
  .loginJudge{
    text-align: center;
    background-color: #f4f4f4;
    width: 100%;
    padding: 20px 0;
    margin: 15px 0;
    border-radius: 5px;
  }
</style>
