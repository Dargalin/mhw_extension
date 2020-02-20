import Vue from 'vue';
import App from './App.vue';
import store from './store';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/*
    Erstelle Vue-Container-Element
*/
const boxID = 'mhw_extension';
let Box = document.createElement('div');
Box.setAttribute('id', boxID);
document.body.appendChild(Box);

/* 
    Debugging mit Standalone vue-devtools
*/
if (process.env.NODE_ENV === 'development') {
  Vue.config.debug = true;
  Vue.config.devtools = true;
  const devtools = require('@vue/devtools');
  devtools.connect('http://localhost', 8098);
}

/* eslint-disable no-new */
new Vue({
  el: '#mhw_extension',
  store,
  render: h => h(App),
});
