import App from './App'
import request from 'utils/request.js' //引入异步请求函数
import share from '@/utils/share.js'
Vue.mixin(share)
// #ifndef VUE3
import Vue from 'vue'
// uview
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
Vue.prototype.request = request.request //挂载到全局
Vue.prototype.request_sync = request.request_sync //挂载到全局
Vue.prototype.getBaseUrl = request.getBaseUrl //挂载到全局
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})

function jump(url) {
	uni.navigateTo({
		url: url
	});
}
// function GoLogin(url){
// 	uni.redirectTo({
// 		url: '/pages/login/login'
// 	});
// uni.switchTab({
//     url: '/pages/index/index'
// });
// }

function Godetails(v, url) {
	console.log(JSON.stringify(v))
	uni.navigateTo({
		url: url + '?params=' + JSON.stringify(v)
	})
}

function ZH(json) {
	return JSON.parse(json)
}

function mes(str) {
	uni.showToast({
		title: str,
		icon: 'none'
	})
}
Vue.prototype.jump = jump;
Vue.prototype.mes = mes;
Vue.prototype.Godetails = Godetails;
Vue.prototype.ZH = ZH;
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif