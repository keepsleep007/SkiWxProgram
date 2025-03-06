<template>
	<view class="container">
		<uni-card title=" " :sub-title="data.createBy" :extra="fullName" :thumbnail="data.avatar!=null?this.getBaseUrl()+data.avatar:'/static/img/login/defaultAvatar.png'">
			<view class="list-item">
				<text class="item-title">拼车价格</text>
				<text class="item-content">{{data.price}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">可拼数量</text>
				<text class="item-content">{{data.personNum}}人</text>
				<text class="item-content">{{data.boardNum}}雪板</text>
				<text class="item-content">{{data.packageNum}}板包</text>
			</view>
			<view class="list-item">
				<text class="item-title">出发时间</text>
				<text class="item-content">{{data.goTime}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">出发地点</text>
				<text class="item-content">{{data.goArea}}，{{data.goPlace}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">到达地点</text>
				<text class="item-content">{{data.endPlace}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">详细信息</text>
				<text class="item-content">{{data.remark}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">发布时间</text>
				<text class="item-content">{{data.createTime}}</text>
			</view>
		</uni-card>
		<uni-card title="联系方式" extra=" ">
			<view class="list-item">
				<text class="item-title">电话</text>
				<text class="item-content" style="color: blue;" @click="makePhoneCall(data.phone)">{{data.phone}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">微信</text>
				<text class="item-content" user-select="true">{{data.wechat}}</text>
			</view>
		</uni-card>
		<uni-card title="注意事项" extra=" ">
			<p>1.请确认好出发时间和地点</p>
			<p>2.联系时请告知从哪获取的信息</p>
			<p>3.平台仅提供相关信息，请您注意安全</p>
		</uni-card>
		<view class="btn-view">
			<button class="button" type="primary" open-type="share">分享</button>
			<button v-if="buttonFlag" class="button" type="primary" @click="editBtn()">编辑</button>
			<button v-if="del_buttonFlag" class="button" type="primary" @click="delBtn()">删除</button>
		</view>
		<!-- 删除提示弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="返回" confirmText="确定" title="提示" content="确定删除？" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		components: {},
		data() {
			return {
				id: '',
				data: {
					avatar: null,
					type: '',
					goType: '',
					price: '',
					personNum: '',
					boardNum: '',
					packageNum: '',
					goTime: '',
					goPlace: '',
					endPlace: '',
					remark: '',
					createTime: '',
					phone: '',
					wechat: '',
					createBy: '',
					uid: '',
					goArea: ''
				},
				buttonFlag: false,
				del_buttonFlag: false,
				snowField: [],
			}
		},
		async onShow() {
			//每次进入此页面都从后台查询最新数据
			await this.getAreaData();
			await this.getData();
		},
		methods: {
			editBtn() {
				uni.navigateTo({
					url: '/pages/me/myRelease/r-car-page-add?id=' + this.id
				});
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogConfirm() {
				console.log('点击确认')
				//调用后台删除
				let requestParam = {};
				requestParam.id = this.id;
				this.request('/app_api/carPool/delCarPoolInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("delCarPoolInfo", res)
						if (res.code == 200) {
							uni.showToast({
								title: '删除成功',
								icon: 'success',
								duration: 2000
							});
							// 使用 setTimeout 来延迟页面跳转
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1000); // 1000 毫秒 = 1 秒
						}
					}
				});
			},
			delBtn() {
				this.msgType = 'info'
				this.$refs.alertDialog.open()
			},
			//判断信息是自己发布的，则显示编辑和删除按钮
			isEdit() {
				if (this.data.uid == getToken()) {
					this.buttonFlag = true;
					this.del_buttonFlag = true;
				}
			},
			async getData() {
				let requestParam = {};
				requestParam.id = this.id;
				await this.request('/app_api/carPool/getCarPoolInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("getCarPoolInfo", res)
						if (res.code == 200) {
							this.data.avatar = res.data.avatar;
							this.data.type = res.data.type;
							this.data.goType = res.data.goType;
							this.data.price = res.data.price;
							this.data.personNum = res.data.personNum;
							this.data.boardNum = res.data.boardNum;
							this.data.packageNum = res.data.packageNum;
							this.data.goTime = res.data.goTime;
							this.data.goPlace = res.data.goPlace;
							this.data.endPlace = res.data.endPlace;
							res.data.remark == null ? this.data.remark = '' : this.data.remark = res.data.remark
							this.data.createTime = res.data.createTime;
							res.data.phone == null ? this.data.phone = '' : this.data.phone = res.data.phone
							res.data.wechat == null ? this.data.wechat = '' : this.data.wechat = res.data.wechat
							this.data.createBy = res.data.createBy;
							this.data.uid = res.data.uid;
							this.data.goArea = this.codeToName(res.data.goArea);
							//数据加载完成后，判断是否显示编辑按钮
							this.isEdit();
						}
					}
				});
			},
			makePhoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: phoneNumber,
					success: function() {
						console.log('拨打电话成功！');
					},
					fail: function(err) {
						console.error('拨打电话失败：', err);
					}
				});
			},
			async getAreaData() {
				await this.request('/app_api/carPool/loadAreaData').then(res => {
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].name;
							tmp[i]['value'] = res.data[i].id;
						}
						this.snowField = tmp;
					}
				});
			},
			codeToName(value) {
				for (let u in this.snowField) {
					if (this.snowField[u].value == value) {
						return this.snowField[u].text;
					}
				}
			}
		},
		computed: {
			fullName() {
				let type;
				if (this.data.type == 1) {
					type = '车找人'
				} else {
					type = '人找车'
				}
				let goType;
				if (this.data.goType == 1) {
					goType = '去雪场'
				} else {
					goType = '雪场返回'
				}
				return type + "-" + goType;
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log("CarOnLoad", option); //打印出上个页面传递的参数。
			this.id = option.id;
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享了拼车信息，一起看看吧~',
				path: '/pages/club/car-page-info?id=' + this.id
			}
		}
	}
</script>

<style>
	.container {
		overflow: hidden;
	}

	.list-item {
		/* 使用Flexbox布局 */
		display: flex;
		/* 使子元素在垂直方向上居中对齐 */
		align-items: center;
		/* 移除相邻元素之间的边框间隙 */
		margin: -1px;
		/* 添加浅灰色背景 */
		background-color: #F5F7FA;
		/* 添加黑色边框 */
		border: 1px solid #EBEEF5;
	}

	.item-title {
		/* 字体加粗 */
		font-weight: bold;
		/* 添加内边距 */
		padding: 5px;
		/* 防止标题文本换行 */
		white-space: nowrap;
	}

	.item-content {
		/* 移除相邻元素之间的边框间隙 */
		margin-left: -1px;
		/* 添加黑色边框 */
		border-left: 1px solid #EBEEF5;
		/* 添加浅灰色背景 */
		background-color: #ffffff;
		/* 添加内边距 */
		padding: 5px;
		/* 让这个元素填充剩余的空间 */
		flex-grow: 1;
		min-height: 22px;
	}

	.btn-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.button {
		margin-left: 15px;
		margin-right: 15px;
		width: 100%;
	}
</style>