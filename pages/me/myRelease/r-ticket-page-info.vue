<template>
	<view class="container">
		<uni-card title=" " :sub-title="data.createBy" :extra="data.type==1?'转卖':'求购'" :thumbnail="data.avatar!=null?this.getBaseUrl()+data.avatar:'/static/img/login/defaultAvatar.png'">
			<view class="list-item">
				<text class="item-title">雪票价格</text>
				<text class="item-content">{{data.price}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">雪票数量</text>
				<text class="item-content">{{data.ticketNum}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">使用雪场</text>
				<text class="item-content">{{fullName}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">使用时间</text>
				<text class="item-content">{{data.applyTime}}</text>
			</view>
			<view class="list-item">
				<text class="item-title">雪票时段</text>
				<template v-for="(item, index) in ticketType">
					<template v-if="data.snowType.includes(item.dictValue)">
						<text class="item-content" :key="index">{{item.dictLabel}}</text>
					</template>
				</template>
			</view>
			<view class="list-item">
				<text class="item-title">交易地点</text>
				<text class="item-content">{{data.location}}</text>
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
			<p>1.请确认好雪场及使用时间</p>
			<p>2.未见面前不要先付款</p>
			<p>3.联系时请告知从哪获取的信息</p>
			<p>4.平台仅提供相关信息，请您注意安全</p>
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
					price: '',
					ticketNum: '',
					snowFieldArea: '',
					snowFieldId: '',
					applyTime: '',
					snowType: '',
					location: '',
					remark: '',
					createTime: '',
					phone: '',
					wechat: '',
					createBy: '',
					uid: ''
				},
				snowField: [],
				ticketType: []
			}
		},
		onShow() {
			//每次进入此页面都从后台查询最新数据
			this.getData();
		},
		created() {
			// 加载雪场数据
			this.request('/app_api/ticketMarket/loadAreaData', '', 'GET').then(res => {
				if (res) {
					this.snowField = res.data;
				}
			});
			//加载雪票类型数据
			this.request('/app_api/ticketMarket/loadTicketType', '', 'GET').then(res => {
				if (res) {
					this.ticketType = res.data;
				}
			});
		},
		methods: {
			editBtn() {
				uni.navigateTo({
					url: '/pages/me/myRelease/r-ticket-page-add?id=' + this.id
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
				this.request('/app_api/ticketMarket/delTicketInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("delTicketInfo", res)
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
							}, 2000); // 2000 毫秒 = 2 秒
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
				this.request('/app_api/ticketMarket/getTicketInfo', requestParam, 'GET').then(res => {
					if (res) {
						// console.log("getTicketInfo", res)
						if (res.code == 200) {
							this.data.avatar = res.data.avatar;
							this.data.price = res.data.price;
							this.data.ticketNum = res.data.ticketNum;
							this.data.snowFieldArea = res.data.snowFieldArea;
							this.data.snowFieldId = res.data.snowFieldId;
							this.data.applyTime = res.data.applyTime;
							this.data.snowType = res.data.snowType;
							this.data.location = res.data.location;
							this.data.remark = res.data.remark;
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
		computed: {
			fullName() {
				let area;
				let field;
				for (let r in this.snowField) {
					if (this.snowField[r].id == this.data.snowFieldArea) {
						area = this.snowField[r].label;
					}
					if (this.snowField[r].id == this.data.snowFieldId) {
						field = this.snowField[r].label;
					}
				}
				return area + "/" + field
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			// const item = JSON.parse(decodeURIComponent(option.detail));
			// console.log("ticketOnLoad", option); //打印出上个页面传递的参数。
			this.id = option.id;
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享了雪票信息，一起看看吧~',
				path: '/pages/club/ticket-page-info?id=' + this.id
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