<template>
	<view class="container">
		<view class="order-info">
			<text class="pord-title">{{data.title}}</text>
			<text class="pord-currDate">游玩日期：{{data.useDate}}</text>
			<text class="pord-price">单价：￥{{data.price}}</text>
			<text class="pord-price">数量：{{data.saleNumber}}</text>
		</view>
		<view class="order-info">
			<text class="pord-title">取票人</text>
			<template v-for="(person, index) in persons">
				<view class="person-view" :key="index">
					<view class="person-info">
						<text class="person-name">姓名：{{person.userName}}</text>
						<text class="person-phone">手机：{{person.userPhone}}</text>
						<text class="person-idcard">身份证：{{person.userIdcard}}</text>
						<view class="ticket-container" v-if="person.ticketElecFlag">
							<text class="elec-title">——雪票电子码——</text>
							<text class="person-idcard" v-if="person.ticketElectronicCode!=null&&person.ticketElectronicCode!=''">{{person.ticketElectronicCode}}</text>
							<image v-if="person.ticketQrCode!=null&&person.ticketQrCode!=''" :src="getBaseUrl() + person.ticketQrCode" style="margin-top: 5px;height: 100px; width: 100px;" />
						</view>
					</view>
				</view>
			</template>
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
				persons: []
			}
		},
		onLoad(options) {
			// console.log('options', options)
			this.getTicketOrderInfo(options.id)
		},
		methods: {
			getTicketOrderInfo(orderId) {
				let requestParam = {};
				//订单id
				requestParam.id = orderId
				//创建人id,只允许查询自己创建的订单
				requestParam.createBy = getToken();
				console.log(requestParam)
				this.request('/app_api/ticket/getOrderinfo', requestParam, 'GET').then(res => {
					// console.log("getOrderinfo", res);
					if (res) {
						if (res.code == 200) {
							this.data = res.data
							this.getUserContacts(res.data.skiAppUserInfoIds)
						}
					}
				});
			},
			async getUserContacts(skiAppUserInfoIds) {
				let requestParam = {};
				requestParam.skiAppUserId = getToken();
				requestParam.id = skiAppUserInfoIds;
				const res = await this.request('/app_api/userContacts/getUserContacts_ticketOrderInfo', requestParam, 'GET');
				// console.log(" getUserContacts_ticketOrderInfo", res);
				if (res) {
					if (res.code == 200) {
						await this.getElectronicCode(this.data, res.data)
						// console.log("persons:", res.data);
						this.persons = res.data;
					};
				}
			},
			async getElectronicCode(orderData, personsData) {
				// console.log("orderData", orderData);
				// console.log("personsData", personsData);
				let requestParam = {};
				requestParam.orderNo = orderData.orderNo
				requestParam.createBy = orderData.createBy
				await this.request('/app_api/ticket/getElectronicCode', requestParam, 'GET').then(res => {
					console.log("getElectronicCode", res);
					if (res) {
						if (res.code == 200) {
							// 遍历 personsData 和 res.data， 找到匹配项并复制字段
							const updatedPersonsData = personsData.map(person => {
								const matchingResData = res.data.find(item => item.skiAppUserInfoId === person.id);
								if (matchingResData) {
									person.ticketElectronicCode = matchingResData.ticketElectronicCode
									person.ticketQrCode = matchingResData.ticketQrCode
									person.ticketElecFlag = false
									if (person.ticketElectronicCode != null && person.ticketElectronicCode != '') {
										person.ticketElecFlag = true
									}
									if (person.ticketQrCode != null && person.ticketQrCode != '') {
										person.ticketElecFlag = true
									}
								}
							});
						}
					}
				});
			},
			toPay(orderId) {
				//订单创建成功，进入支付页面
				uni.navigateTo({
					url: '/pages/active/pay?orderId=' + orderId + '&type=1'
				})
			}
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

	.elec-title {
		font-size: 20px;
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

	.center-text {
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 初始高度为0，由内容撑开 */
		margin-top: auto;
		/* 将此元素之前的所有空间推到底部 */
		margin-bottom: auto;
		/* 将此元素之后的所有空间推到顶部 */
	}

	.ticket-container {
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中（在这个场景中可能不需要，因为内容已经是单行/单图） */
		flex-direction: column;
		/* 改为列布局以垂直堆叠电子码和二维码（如果需要水平布局则移除此行） */
	}
</style>