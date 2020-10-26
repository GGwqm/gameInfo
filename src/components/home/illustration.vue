<template>
  <div class="main">
    <section>
      <div class="img-wrapper" v-for="(item, index) in data" :key="index" @click="clickImage(item.imgUrl,item.objectId)">
        <div class="img" :style="'backgroundImage: url('+item.imgUrl+');'">
          <img :src="item.imgUrl" alt="" srcset="">
        </div>
        <div class="info">
          <div>
            <span class="size" v-for="(list, tag) in item.tagArr" :key="tag">{{list}}</span>
          </div>
          <img src="" alt="" srcset="">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
    export default {
      name: "illustration",
      data(){
        return{
          data:[],
        }
      },
      created(){
        this.$Loading.start();
        const query = Bmob.Query("upImg");
        query.equalTo("category", "==", "插画");
        query.find().then(res => {
          this.data=res;
          if(this.data!==[]){
            this.$Loading.finish();
          }
        });
      },
      methods:{
        clickImage(url,id){
          this.$router.push({
            path: '/details',
            query: {
              url: url,
              id:id,
            }
          })
        }
      }
    }
</script>

<style scoped>
  @import '../../assets/css/imgList.css';

</style>
