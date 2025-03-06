import {
	getToken
} from "./auth";
import {
	baseUrl,
	uploadUrl
} from "./apiconfig";
async function request(method, params, type, callBack) {
	//创建一个名为request请求的方法函数
	if (!type) {
		type = 'GET';
	}
	let header = {
		//设置请求头信息
		// 'Authorization': getToken(),
		// 'X-Requested-With': 'XMLHttpRequest',
		"Accept": "application/json",
		"Content-Type": "application/json; charset=UTF-8"
	};
	let http = {
		url: baseUrl + method,
		data: params,
		method: type,
		header: header
	};
	let promise = new Promise((resolve, reject) => {
		uni.request(http).then(res => {
			let newdata = res[1].data; // if (newdata.code == 403) {
			if (newdata == -1) {
				//如果错误码为 -1 提示
				uni.showToast({
					title: res[1].data.msg,
					icon: 'none'
				});
			}
			resolve(res[1].data);
		}).catch(err => {
			reject(err);
			console.log(err);
		});
	});
	return promise;
}

//同步的request方法，非异步
function request_sync(method, params, type, callBack) {
	//创建一个名为request请求的方法函数
	if (!type) {
		type = 'GET';
	}
	let header = {
		//设置请求头信息
		"Accept": "application/json",
		"Content-Type": "application/json; charset=UTF-8"
	};
	// 返回一个Promise  
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + method,
			data: params,
			method: type,
			header: header,
			success: (res) => {
				resolve(res.data); // 在请求成功时解析Promise  
			},
			fail: (err) => {
				reject(err); // 在请求失败时拒绝Promise  
			}
		});
	});
}

async function requestJson(mehtod, params, type, headerParams, callBack) {
	//创建一个名为request请求的方法函数
	let header = {
		//设置请求头信息
		'X-Requested-With': 'XMLHttpRequest',
		"Accept": "application/json",
		"Content-Type": "application/json; charset=UTF-8"
	};
	if (headerParams) {
		header = Object.assign(header, headerParams);
	}
	let http = {
		url: mehtod,
		data: params,
		method: type,
		header: header
	};
	let promise = new Promise((resolve, reject) => {
		uni.request(http).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
			console.log(err);
		});
	});
	return promise;
}

async function requestForm(mehtod, params, type, callBack) {
	//创建一个名为request请求的方法函数
	let header = {
		//设置请求头信息
		'X-Requested-With': 'XMLHttpRequest',
		"Accept": "application/json",
		"Content-Type": "application/x-www-form-urlencoded"
	};
	let http = {
		url: mehtod,
		data: params,
		method: type,
		header: header
	};
	let promise = new Promise((resolve, reject) => {
		uni.request(http).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
			console.log(err);
		});
	});
	return promise;
}

function getBaseUrl() {
	return baseUrl;
}

export default {
	request,
	request_sync,
	requestJson,
	requestForm,
	getBaseUrl
};