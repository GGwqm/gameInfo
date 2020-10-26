<template>
  <div>
    <div class="search">
    <div class="search-main">
      <div>免费高清图片素材库</div>
      <div>欢喜素材库拥有优质图片素材，让你轻松应对各种设计场景</div>
      <div class="search-input">
        <Icon type="md-search" size="24" color="#5c6b77" class="search-icon" @click="searchOk()"/>
        <input type="search" @keyup.enter="searchOk()" v-model="searchCon" autocomplete="on"/>
        <div class="select">
          <div class="selectInput" @click="openValue">
            <input v-model="value" type="text" placeholder="全部" readonly>
            <Icon type="ios-arrow-down" class="select-icon" color="#5c6b77" size="18"/>
          </div>
          <div class="selectList" v-show="show">
            <ul>
              <li @click="getvalue(item)" v-for="(item,index) in cityList" :key="index">{{ item.label }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="popular">
        <div>热门搜索：</div>
        <span v-for="(item, index) in popularSpan" :key="index">{{item.text}}</span>
      </div>
    </div>
    <div class="loop">
      <Carousel  loop v-model="loopValue" dots="none" autoplay autoplay-speed="8000">
        <CarouselItem v-for="(item, index) in loop" :key="index">
          <div class="demo-carousel">
            <img :src="item.img" class="loop-bg">
          </div>
        </CarouselItem>
      </Carousel>
    </div>
  </div>
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: "homeSearch",
      data(){
          return{
            loop:[],
            popularSpan:[
              {text:'城市'},{text:'动画'},{text:'游戏'},{text:'明星'},{text:'夏天'}
            ],
            cityList: [
              {
                value: '全部',
                label: '全部'
              },
              {
                value: '图片',
                label: '图片'
              },
              {
                value: '插画',
                label: '插画'
              },
              {
                value: '矢量',
                label: '矢量'
              },
              {
                value: '图标',
                label: '图标'
              }
            ],
            value:'全部',loopValue:0,model: '',searchCon:'',
            show:false,
          }
      },
      methods:{
        openValue(){
          this.show=!this.show;
        },
        getvalue(item){
          this.value=item.label;
          this.show=false;
        },
        searchOk(){
          sessionStorage.setItem('searchCon',this.searchCon);
          sessionStorage.setItem('searchCategory',this.value);
          this.$router.push('/search')
        }
      },
      created(){
        const query = Bmob.Query("loop");
        query.find().then(res => {
          this.loop=res;
        })
      },
    }
</script>

<style scoped>
  .search{
    width: 100%;
    height: 500px;
    position: relative;
    background-color:rgba(0, 0, 0, 0.3) ;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }
  .search-main{
    position: absolute;
    z-index: 2;
  }
  .loop{
    width: 100%;
    position: absolute;
    height: 500px;
  }
  .loop-bg{
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
  .search-main>div:nth-child(1){
    font-size: 32px;
    text-shadow: rgba(0, 0, 0, 0.7) 1px 1px 2px;
  }
  .search-main>div:nth-child(2){
    font-size: 16px;
    margin: 15px 0 28px 0;
    text-shadow: rgba(0, 0, 0, 0.7) 1px 1px 2px;
  }
  .popular{
    color: white;
    margin: 10px 10px 0 0;
    font-size: 14px;
    display: flex;
    justify-content: center;
  }
  .popular span{
    margin: 0 5px;
    cursor: pointer;
    text-shadow: rgba(0, 0, 0, 0.7) 1px 1px 2px;
  }
  .search-input input{
    border: none;
    font-size: 17px;
    width: 600px;
  }
  .search-input input:focus{
    outline: none;
    border: none;
  }
  .search-input{
    background-color: white;
    border-radius: 5px;
    height: 55px;
    width: auto;
    display: flex;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 5px;
  }
  .search-icon{
    cursor: pointer;
    margin: 0 15px;
  }
  .select{
    position: relative;
    cursor: pointer;
  }
  .selectInput:hover .select-icon{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* IE 9 */
    -webkit-transform:rotate(180deg); /* Safari and Chrome */
  }
  .select-icon{
    transition:all .2s;
  }
  ul li{
    list-style: none;
  }
  .selectInput{
    width: 80px;
    height: 40px;
    line-height: 40px;
    left: 0;
    display: flex;
    align-items: center;
    position: relative;

  }
  .selectInput input{
    border: none;
    outline: none;
    width: 50px;
    color: black;
    cursor: pointer;
  }
  .selectList{
    width: 100px;
    overflow: hidden;
    color: #d3d5d6;
    background-color: #191b26;
    position: absolute;
    top: 50px;
    right: 0;
    padding: 10px;
  }
  .selectList ul li{
    width: 100%;
    height: 30px;
    cursor: pointer;
    line-height: 30px;
    font-size: 13px;
  }
  .selectList ul li:hover{
    background-color: #22242f;
    color: white;
  }
</style>
