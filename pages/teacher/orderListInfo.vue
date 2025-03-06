<template>
	<view class="container">
		<view class="order-info">
			<text class="pord-title">{{data.title}}</text>
			<text class="pord-currDate">预约开始日期：{{data.startDate}}</text>
			<text class="pord-price">预约结束日期：{{data.endDate}}</text>
			<text class="pord-price">合计天数：{{data.sumDay}}天</text>
			<template v-for="(teachMode) in teachModeList">
				<template v-if="data.tcMode==teachMode.dictValue">
					<text :key="teachMode.dictValue" class="pord-price">教学模式：{{teachMode.dictLabel}}</text>
				</template>
			</template>
			<text class="pord-price">教学时间：{{data.tcTime}}小时</text>
		</view>
		<view class="order-info">
			<text class="pord-title">联系人</text>
			<view class="person-view">
				<view class="person-info">
					<text class="person-name">姓名：{{data.contacts}}</text>
					<text class="person-phone">手机：{{data.phone}}</text>
					<text class="person-phone">地址：{{data.address}}</text>
					<text class="person-phone">微信号：{{data.wechat}}</text>
				</view>
			</view>
		</view>
		<view class="order-info">
			<view class="remark-view">
				<text class="remark-text">备注</text>
				<text class="remark-desc">{{data.remark}}</text>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text v-if="data.payStatus==='0'">未支付</text>
				<text v-if="data.payStatus==='1'">已支付</text>
				<text v-if="data.payStatus==='3'">已支付(部分退款)</text>
				<text v-if="data.payStatus==='2'">已退款</text>
				<text class="price-tip">￥</text>
				<text class="price" v-if="data.payStatus!=='0'">{{data.payMoney}}</text>
				<text class="price" v-if="data.payStatus==='0'">{{data.wantPayMoney}}</text>
			</view>
			<text v-if="data.orderStatus==='3'" class="submit" @click="toPay(data.id)">立即支付</text>
		</view>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				data: {},
				teachModeList: {},
			}
		},
		onLoad(option) {
			console.log("id", option.id); //打印出上个页面传递的参数。
			// 查询订单详情
			let requestParam = {};
			requestParam.id = option.id;
			requestParam.createBy = getToken();
			this.request('/app_api/teacher/getOrderinfo', requestParam, 'GET').then(res => {
				console.log("getOrderInfo", res)
				if (res) {
					if (res.code == 200) {
						this.data = res.data;
						if (res.data.useDate != null) {
							this.data.useDate = res.data.useDate.split('T')[0];
						}
					}
				}
			});
			this.loadTeacherSystemTag();
		},
		methods: {
			toPay(orderId) {
				//订单创建成功，进入支付页面
				uni.navigateTo({
					url: '/pages/active/pay?orderId=' + orderId + '&type=2'
				})
			},
			loadTeacherSystemTag() {
				this.request('/app_api/teacher/loadTeacherSystemTag', 'GET').then(res => {
					if (res) {
						this.teachModeList = res.data[2];
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #efeff4;
	}

	.container {
		margin: 10px;
	}

	.order-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px;
		box-sizing: border-box;
		background: #fff;
		margin-bottom: 10px;
		border-radius: 10px;
	}

	.pord-title {
		font-size: 20px;
		margin-bottom: 10px;
	}

	.pord-currDate {
		margin-bottom: 10px;
	}

	.pord-price {
		margin-bottom: 10px;
	}

	.person-view {
		display: flex;
		margin-bottom: 10px;
		width: 100%;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		margin-left: 30px;
	}

	.del-icon {
		top: 20px;
		right: -10px;
		background-color: transparent;
		/* 移除背景色 */
		padding: 0;
		/* 移除内边距 */
		margin: 0;
		/* 移除外边距 */
		width: 25px;
		height: 25px;
	}

	/* .person-add-view 的样式 */
	.person-add-view {
		display: flex;
		/* 使其成为弹性容器，用于居中内部元素 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中，但这里需要.person-view有定义的高度 */
		width: 100%;
		/* 与父容器同宽 */
	}

	/* .person-add 的样式 */
	.person-add {
		border: 2px dashed $base-color;
		/* 虚线边框 */
		padding: 10px 20px;
		/* 内边距 */
		border-radius: 10px;
		/* 圆角边框 */
		background-color: #efeff4;
		/* 背景颜色 */
		width: 100%;
		text-align: center;
		/* 文本水平居中 */
		color: $base-color;
	}


	.remark-view {
		display: flex;
		/* 设置为 Flexbox 容器 */
		align-items: center;
		/* 垂直居中对齐子元素 */
		width: 100%;
	}

	.remark-text {
		font-size: 16px;
	}

	.remark-desc {
		margin-left: 5px;
	}

	.address-input {
		flex: 1;
		font-size: 30upx;
		margin-top: 5px;
		color: $font-color-dark;
		width: 100%;
	}

	.uni-forms-item {
		width: 100%;
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		line-height: 70upx;
		position: relative;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
</style>