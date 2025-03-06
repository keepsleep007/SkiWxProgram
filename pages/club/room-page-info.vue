<template>
	<view class="container">
		<uni-card title=" " :sub-title="data.createBy" :extra="data.type==1?'房找人':'人找房'" :thumbnail="data.avatar!=null?this.getBaseUrl()+data.avatar:'/static/img/login/defaultAvatar.png'">
			<view class="list-item">
				<text class="item-title">拼房价格</text>
				<text class="item-content">{{data.price}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">入住时间</text>
				<text class="item-content">{{data.inTime}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">退房时间</text>
				<text class="item-content">{{data.outTime}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">本人性别</text>
				<text class="item-content">{{data.iSex==0?'男':''||data.iSex==1?'女':''}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">要求性别</text>
				<text class="item-content">{{data.ySex==0?'男':''||data.ySex==1?'女':''||data.ySex==2?'不限':''}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">拼房地区</text>
				<template v-for="(item, index) in areaData">
					<template v-if="data.region.includes(item.id)">
						<text class="item-content" :key="index">{{item.name}}</text>
					</template>
				</template>
			</view>
			<view class="list-item">
				<text class="item-title">房间类型</text>
				<template v-for="(item, index) in roomType">
					<template v-if="data.roomType.includes(item.dictValue)">
						<text class="item-content" :key="index">{{item.dictLabel}}</text>
					</template>
				</template>
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
			<p>1.请确认好时间和地点</p>
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
				buttonFlag: false,
				del_buttonFlag: false,
				data: {
					avatar: null,
					type: '',
					price: '',
					inTime: '',
					outTime: '',
					iSex: '',
					ySex: '',
					region: '',
					roomType: '',
					remark: '',
					createTime: '',
					phone: '',
					wechat: '',
					createBy: '',
					uid: ''
				},
				areaData: [],
				roomType: []
			}
		},
		onShow() {
			//每次进入此页面都从后台查询最新数据
			this.getData();
		},
		methods: {
			editBtn() {
				uni.navigateTo({
					url: '/pages/club/room-page-add?id=' + this.id
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
				this.request('/app_api/roomPool/delRoomPoolInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("delRoomPoolInfo", res)
						if (res.code == 200) {
							uni.showToast({
								title: '删除成功',
								icon: 'success',
								duration: 2000
							});
							// 使用 setTimeout 来延迟页面跳转
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/club/club?tabIndex=1'
								});
							}, 1000); // 2000 毫秒 = 2 秒
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
			getData() {
				let requestParam = {};
				requestParam.id = this.id;
				this.request('/app_api/roomPool/getRoomPoolInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("getRoomPoolInfo", res)
						if (res.code == 200) {
							this.data.avatar = res.data.avatar;
							this.data.type = res.data.type;
							this.data.price = res.data.price;
							this.data.inTime = res.data.inTime;
							this.data.outTime = res.data.outTime;
							this.data.iSex = res.data.iSex;
							this.data.ySex = res.data.ySex;
							this.data.region = res.data.region;
							this.data.roomType = res.data.roomType;
							res.data.remark == null ? this.data.remark = '' : this.data.remark = res.data.remark
							this.data.createTime = res.data.createTime;
							res.data.phone == null ? this.data.phone = '' : this.data.phone = res.data.phone
							res.data.wechat == null ? this.data.wechat = '' : this.data.wechat = res.data.wechat
							this.data.createBy = res.data.createBy;
							this.data.uid = res.data.uid;
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
			}
		},
		computed: {},
		created() {
			// 加载房型数据
			this.request('/app_api/roomPool/load_roomType', '', 'GET').then(res => {
				if (res) {
					this.roomType = res.data;
				}
			});
			//加载拼房地区数据
			this.request('/app_api/roomPool/loadRoomAreaData', '', 'GET').then(res => {
				if (res) {
					this.areaData = res.data;
				}
			});
		},
		onLoad: function(option) {
			//option为object类型，会序列化上个页面传递的参数
			// const item = JSON.parse(decodeURIComponent(option.detail));
			// url: '/pages/club/room-page-info?id=' + detail.id + "&areaData=" + this.areaData + "&roomType=" + this.roomType
			console.log("RoomOnLoad", option); //打印出上个页面传递的参数。
			this.id = option.id;
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享了拼房信息，一起看看吧~',
				path: '/pages/club/room-page-info?id=' + this.id
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
		/* 让这个元素填充这一行剩余的空间 */
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