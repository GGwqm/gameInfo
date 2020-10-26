// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/js/key'
// import 'view-design/dist/styles/iview.css';
// import { Button,Icon,Dropdown,DropdownMenu,
//          DropdownItem,Carousel,CarouselItem,
//          Tabs,TabPane,Form,FormItem,Input,Message,
//         Row,Col,Card,Steps,Step,Page,Select,Options ,Option } from 'view-design';
import '../mytheme/theme.less';

const Vue = require('vue');

router.beforeEach((to, from, next) => {
  iview.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iview.LoadingBar.finish();
});
// Vue.prototype.$Message=Message;
// Vue.config.productionTip = false;
// Vue.component("Button", Button);
// Vue.component("Icon", Icon);
// Vue.component("Dropdown", Dropdown);
// Vue.component("DropdownMenu", DropdownMenu);
// Vue.component("DropdownItem", DropdownItem);
// Vue.component("Carousel", Carousel);
// Vue.component("CarouselItem", CarouselItem);
// Vue.component("Tabs", Tabs);
// Vue.component("TabPane", TabPane);
// Vue.component("Form", Form);
// Vue.component("FormItem", FormItem);
// Vue.component("Input", Input);
// Vue.component("Row", Row);
// Vue.component("Col", Col);
// Vue.component("Card", Card);
// Vue.component("Page", Page);
// Vue.component("Steps", Steps);
// Vue.component("Step", Step);
// Vue.component("Select", Select);
// Vue.component("Option", Option);
// Vue.component("Options", Options);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
