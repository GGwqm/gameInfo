<template>
  <div id="app" >
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  watch:{
    '$route':function(to,from){
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
/*template {*/
  /*overflow-y: scroll;*/
/*}*/

/*:root {*/
  /*overflow-y: auto;*/
  /*overflow-x: hidden;*/
/*}*/

/*:root #app {*/
  /*position: absolute;*/
/*}*/

#app {
  /*width: 100vw;*/
  /*overflow: hidden;*/
  min-width: 1200px !important;
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
}
</style>
