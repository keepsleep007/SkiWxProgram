<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.wantPayMoney}}</text>
			<text>请在{{ countdown }}内完成支付</text>
		</view>
		<view class="pay-type-list">
			<view class="type-item b-b" @click="changePayType(1)">
				<u-icon name="weixin-circle-fill" color="#36cb59" size="38"></u-icon>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<!-- <view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view> -->
		</view>
		<text v-if="payBtn" class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				//支付方式，默认选择微信支付
				payType: 1,
				//订单id
				orderId: '',
				//订单类型 1-雪票 0-活动
				orderType: '',
				//订单信息数据
				orderInfo: {},
				//支付信息数据
				payment: {},
				//服务器时间
				serverTime: 0,
				// 初始化倒计时
				countdown: '10:00',
				//支付按钮显示控制
				payBtn: true
			};
		},
		computed: {

		},
		async onLoad(options) {
			console.log(options)
			this.orderId = options.orderId
			this.orderType = options.type
			if (options.type == '1') {
				//查询订单信息（雪票订单）
				this.getTicketOrderinfo();
			}
			if (options.type == '0') {
				//查询订单信息（活动订单）
				this.getActiveOrderinfo();
			}
			if (options.type == '2') {
				//查询订单信息（教练订单）
				this.getTeackerOrderinfo();
			}
		},
		onShow() {
			this.getServerTime();
		},
		methods: {
			getTicketOrderinfo() {
				let requestParam = {};
				//订单id
				requestParam.id = this.orderId
				//创建人id,只允许查询自己创建的订单
				requestParam.createBy = getToken();
				this.request('/app_api/ticket/getOrderinfo', requestParam, 'GET').then(res => {
					console.log("getTicketOrderinfo:", res)
					if (res) {
						if (res.code == 200) {
							this.updateCountdown(res.data.createTime);
							this.interval = setInterval(() => {
								this.updateCountdown(res.data.createTime);
							}, 1000);
							this.orderInfo = res.data
						}
					}
				});
			},
			getActiveOrderinfo() {
				let requestParam = {};
				//订单id
				requestParam.id = this.orderId
				//创建人id,只允许查询自己创建的订单
				requestParam.createBy = getToken();
				this.request('/app_api/activity/getOrderInfo', requestParam, 'GET').then(res => {
					console.log("getActiveOrderinfo:", res)
					if (res) {
						if (res.code == 200) {
							this.updateCountdown(res.data.createTime);
							this.interval = setInterval(() => {
								this.updateCountdown(res.data.createTime);
							}, 1000);
							this.orderInfo = res.data
						}
					}
				});
			},
			getTeackerOrderinfo() {
				let requestParam = {};
				//订单id
				requestParam.id = this.orderId;
				//创建人id,只允许查询自己创建的订单
				requestParam.createBy = getToken();
				this.request('/app_api/teacher/getOrderinfo', requestParam, 'GET').then(res => {
					console.log("getTeackerOrderinfo:", res)
					if (res) {
						if (res.code == 200) {
							this.updateCountdown(res.data.createTime);
							this.interval = setInterval(() => {
								this.updateCountdown(res.data.createTime);
							}, 1000);
							this.orderInfo = res.data
						}
					}
				});
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付,调用后台创建预支付订单
			confirm: async function() {
				//活动订单
				if (this.orderType == '0') {
					let requestParam = {};
					//雪场id
					requestParam.id = this.orderId
					requestParam.createBy = getToken();
					this.request('/app_api/activity/createPayment', requestParam, 'POST').then(res => {
						console.log("createPayment:", res)
						if (res) {
							if (res.code == 200) {
								this.payment = res.data
								this.requestPayment(this.payment);
							}
						}
					});
				}
				//雪票订单
				if (this.orderType == '1') {
					let requestParam = {};
					//雪场id
					requestParam.id = this.orderId
					requestParam.createBy = getToken();
					this.request('/app_api/ticket/createPayment', requestParam, 'POST').then(res => {
						console.log("createPayment:", res)
						if (res) {
							if (res.code == 200) {
								this.payment = res.data
								this.requestPayment(this.payment);
							}
						}
					});
				}
				//教练订单
				if (this.orderType == '2') {
					let requestParam = {};
					//雪场id
					requestParam.id = this.orderId
					requestParam.createBy = getToken();
					this.request('/app_api/teacher/createPayment', requestParam, 'POST').then(res => {
						console.log("createPayment:", res)
						if (res) {
							if (res.code == 200) {
								this.payment = res.data
								this.requestPayment(this.payment);
							}
						}
					});
				}
			},
			requestPayment(payment) {
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: payment.timeStamp,
					nonceStr: payment.nonceStr,
					package: payment.packageVal,
					signType: payment.signType,
					paySign: payment.paySign,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						//success:{"errMsg":"requestPayment:ok"}
						uni.redirectTo({
							url: '/pages/active/paySuccess'
						})
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			async getServerTime() {
				await this.request('/app_api/util/getServerTime', '', 'GET').then(res => {
					if (res) {
						console.log("getServerTime", res)
						if (res.code == 200) {
							this.serverTime = res.data
						}
					}
				});
			},
			calculateCountdown(createTime) {
				const createTimeTimestamp = new Date(createTime).getTime() / 1000;
				const orderExpirationTime = createTimeTimestamp + 10 * 60; // 订单过期时间为创建时间后的10分钟
				const currentTime = this.serverTime + (Date.now() / 1000 - this.serverTime); // 当前时间基于服务器时间
				const remainingTime = orderExpirationTime - currentTime;
				if (remainingTime <= 0) {
					this.payBtn = false;
					return '00:00';
				}
				const minutes = Math.floor(remainingTime / 60);
				const seconds = Math.floor(remainingTime % 60);
				return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			},
			updateCountdown(createTime) {
				let formattedDate = this.formatDate(createTime)
				this.countdown = this.calculateCountdown(formattedDate);
			},
			formatDate(dateString) {
				// 手动解析日期字符串,(IOS不兼容 yyyy-MM-dd 格式的日期，必须是yyyy/MM/dd)
				const [datePart, timePart] = dateString.split(' ');
				const [year, month, day] = datePart.split('-');
				const [hours, minutes, seconds] = timePart.split(':');
				// 创建 Date 对象
				const date = new Date(year, month - 1, day, hours, minutes, seconds);
				// 格式化输出
				const yearStr = String(date.getFullYear());
				const monthStr = String(date.getMonth() + 1).padStart(2, '0');
				const dayStr = String(date.getDate()).padStart(2, '0');
				const hoursStr = String(date.getHours()).padStart(2, '0');
				const minutesStr = String(date.getMinutes()).padStart(2, '0');
				const secondsStr = String(date.getSeconds()).padStart(2, '0');
				return `${yearStr}/${monthStr}/${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
			}
		},
		beforeDestroy() {
			clearInterval(this.interval);
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			padding-left: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
			margin-left: 10px;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>