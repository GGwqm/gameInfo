import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index';


Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', component: resolve => require(['@/components/index'], resolve),name:'index',children:[
        {path:'/',component: resolve => require(['@/components/home/homeSearch'], resolve),name:'homeSearch',children:[
            {path:'/',component: resolve => require(['@/components/home/home'], resolve),name:'homeIndex'},
            {path:'/illustration',component: resolve => require(['@/components/home/illustration'], resolve),name:'illustration'},
            {path:'/photo',component: resolve => require(['@/components/home/photo'], resolve),name:'photo'},
            {path:'/vector',component: resolve => require(['@/components/home/vector'], resolve),name:'vector'},
            {path:'/wallpaper',component: resolve => require(['@/components/home/wallpaper'], resolve),name:'wallpaper'},
          ]},
        {path:'/details',component: resolve => require(['@/components/imgDetails/details'], resolve),name:'details'},
        {path:'/transition',component: resolve => require(['@/components/transition'], resolve),name:'transition'},
        {path:'/login',component: resolve => require(['@/components/login/login'], resolve),name:'login'},
        {path:'/my',component: resolve => require(['@/components/login/my'], resolve),name:'my'},
        {path:'/search',component: resolve => require(['@/components/search/search'], resolve),name:'search'},
      ]},
  ]
})
