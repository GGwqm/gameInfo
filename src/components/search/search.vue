<template>
  <div class="main">
    <!--<div class="div_null" v-show="searchNull">-->
      <!--<img src="http://abc.huanpl.top/2020/09/02/8083e70f400a08d380c738ad0ca1733e.png" class="imgNull">-->
    <!--</div>-->
    <div class="srerch_result">
      <Divider orientation="left" style="color: #4d5669;font-size: 15px">为您找到{{this.data.length}}张素材</Divider>
    </div>
    <section>
      <div class="img-wrapper" v-for="(item, index) in data" :key="index" @click="clickImage(item.imgUrl,item.objectId)">
        <div class="img" :style="'backgroundImage: url('+item.imgUrl+');'">
          <img :src="item.imgUrl" alt="" srcset="">
        </div>
        <div class="info" >
          <div>
            <span class="size" v-for="(list, tag) in item.tagArr" :key="tag">{{list}}</span>
          </div>
          <img src="" alt="" srcset="" >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
    export default {
      inject: ['reload'],
      name: "search",
      data(){
          return{
            data:[],
          }
      },
      created(){
        this.searchListCon()
      },
      methods:{
        searchListCon(){
          let searchCon=sessionStorage.getItem('searchCon');
          let searchCategory=sessionStorage.getItem('searchCategory');
          const querySearch = Bmob.Query("upImg");
          if(searchCategory===''||searchCategory==='全部'){
            this.$Loading.start();
            querySearch.find().then(res => {
              for (let i = 0; i < res.length; i++) {
                if (res[i].tag.indexOf(searchCon) >= 0) {
                  this.data.push(res[i]);
                };
              }
              this.$Loading.finish();
            });
          }else {
            this.$Loading.start();
            querySearch.equalTo("category", "==", searchCategory);
            querySearch.find().then(res => {
              console.log(res,4444)
              // alert(res.length);
                for (let i = 0; i < res.length; i++) {
                  if (res[i].tag.indexOf(searchCon) >= 0) {
                    this.data.push(res[i]);
                  };
                }
                // this.reload();
                // console.log(this.data)
                this.$Loading.finish();
            });
          }
        },
        clickImage(url,id){
          this.$router.push({
            path: '/details',
            query: {
              url: url,
              id:id,
            }
          })
        }
      },
    }
</script>

<style scoped>
  @import '../../assets/css/imgList.css';
  .div_null{
    text-align: center;
  }
  .imgNull{
    width: 300px;
  }
  .srerch_result{
    padding: 0 20px;
  }
  .main{
    display: flex;
    flex-direction: column;
  }
  section{
    padding: 0 20px 20px 20px;
  }
</style>
