<template>
	<view>
		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="g-item">
				<view class="right">
					<text class="title clamp">{{productInfo.productName}}</text>
					<view class="price-box">
						<text class="price">￥{{productInfo.price}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="yt-list" v-if="dateFlag">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">日期</text>
				<text class="cell-tip">{{dataProductInfo.stockDate}}</text>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">数量</text>
				<uni-number-box :min="1" v-model="number" @change="numberChange" />
			</view>
		</view>

		<uni-forms ref="form" :rules="rules" :model="formData">
			<view class="yt-list">
				<view class="yt-list-cell">
					<uni-forms-item label="联系人" required name="contacts" label-width="auto">
						<input class="address-input" :clearable="false" type="text" v-model="formData.contacts" placeholder="联系人姓名" placeholder-class="placeholder" />
					</uni-forms-item>
				</view>
				<view class="yt-list-cell">
					<uni-forms-item label="手机号" required name="phone" label-width="auto">
						<input class="address-input" :clearable="false" type="number" v-model="formData.phone" placeholder="请填写,以便我们联系您,提供服务" placeholder-class="placeholder" />
					</uni-forms-item>
				</view>
				<view class="yt-list-cell">
					<uni-forms-item label="地址" name="address" label-width="auto">
						<input class="address-input" :clearable="false" type="text" v-model="formData.address" placeholder="请填写地址" placeholder-class="placeholder" />
					</uni-forms-item>
				</view>
				<view class="yt-list-cell">
					<uni-forms-item label="微信号" name="wechat" label-width="auto">
						<input class="address-input" :clearable="false" type="text" v-model="formData.wechat" placeholder="请填写,以便我们联系您,提供服务" placeholder-class="placeholder" />
					</uni-forms-item>
				</view>
			</view>
		</uni-forms>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer" v-if="subFlag">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{sumPrice}}</text>
			</view>
			<text class="submit" @click="submit('form')">提交订单</text>
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
				coverImage: '',
				//活动id
				activeId: '',
				// 产品数据
				productInfo: {},
				// 库存数据
				dataProductInfo: {},
				// 购买数量;
				number: 1,
				//合计价格，数量*单价
				sumPrice: 0,
				//控制日期是否显示
				dateFlag: false,
				//联系人
				contacts: '',
				//手机号
				phone: '',
				//地址
				address: '',
				//微信号
				wechat: '',
				//备注
				remark: '',
				//控制提交订单按钮是否渲染，无库存的时候不渲染
				subFlag: false,
				formData: {
					//联系人
					contacts: '',
					//手机号
					phone: '',
					//地址
					address: '',
					//微信号
					wechat: ''
				},
				rules: {
					contacts: {
						rules: [{
							required: true,
							errorMessage: '联系人不能为空'
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '手机号不能为空'
						}, {
							pattern: "^1[3-9]\\d{9}$",
							errorMessage: '手机号格式不正确',
						}]
					}
				}
			}
		},
		onLoad(option) {
			// console.log("id", option.id); //打印出上个页面传递的参数。
			// console.log("stockType", option.stockType); //打印出上个页面传递的参数。
			// console.log("currDate", option.currDate); //打印出上个页面传递的参数。
			// console.log("coverImage", option.coverImage); //打印出上个页面传递的参数。
			this.coverImage = option.coverImage;
			this.activeId = option.activeId;
			// 总量库存
			if (option.stockType == 0) {
				//查询单个产品的详细数据
				let requestParam = {};
				requestParam.id = option.id;
				this.request('/app_api/activity/getProductInfo', requestParam, 'GET').then(res => {
					// console.log("getProductInfo", res)
					if (res) {
						if (res.code == 200) {
							//产品数据
							this.productInfo = res.data;
							// 计算总价
							this.sumPrice = this.productInfo.price * this.number;
							this.subFlag = true;
						}
					}
				});
			}
			//日期库存
			if (option.stockType == 1) {
				//查询单个产品的详细数据
				let requestParam = {};
				requestParam.id = option.id;
				this.request('/app_api/activity/getProductInfo', requestParam, 'GET').then(res => {
					console.log("getProductInfo", res)
					if (res) {
						if (res.code == 200) {
							//产品数据
							this.productInfo = res.data;
							//日期库存，继续查询日期库存数据
							let requestParam = {};
							requestParam.stockDate = option.currDate;
							requestParam.skiActivityProductId = option.id;
							this.request('/app_api/activity/getDataProductInfo', requestParam, 'GET').then(res => {
								// console.log("getDataProductInfo", res)
								if (res) {
									if (res.code == 200) {
										//会有2种情况，1有数据，库存为0；2没数据，直接data就是空
										if (res.data.length == 0) {
											//提示库存为0
											console.log("未查到数据");
											uni.showToast({
												title: '当前没有库存',
												icon: 'none',
												duration: 3000
											});
											return;
										}
										if (res.data[0].stockNumber == 0) {
											//提示库存为0
											console.log("库存为0");
											uni.showToast({
												title: '当前没有库存',
												icon: 'none',
												duration: 3000
											});
											return;
										}
										this.dataProductInfo = res.data[0];
										// 计算总价
										this.sumPrice = this.productInfo.price * this.number;
										// 设置显示日期
										this.dateFlag = true;
										this.subFlag = true;
									}
								}
							});
						}
					}
				});
			}
		},
		methods: {
			numberChange(data) {
				this.number = data;
				// 计算总价
				this.sumPrice = this.productInfo.price * this.number;
			},
			//提交订单
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					let requestParam = {};
					requestParam.appToken = getToken();
					requestParam.skiActivityInfoId = this.activeId;
					requestParam.skiActivityProductId = this.productInfo.id;
					requestParam.dataProductId = this.dataProductInfo.id;
					requestParam.useDate = this.dataProductInfo.stockDate;
					requestParam.saleNumber = this.number;
					requestParam.contacts = this.formData.contacts;
					requestParam.phone = this.formData.phone;
					requestParam.address = this.formData.address;
					requestParam.wechat = this.formData.wechat;
					requestParam.remark = this.remark;
					requestParam.coverImage = this.coverImage;
					if (this.number <= 0) {
						uni.showToast({
							title: '购买数量不能为0',
							icon: 'none',
							duration: 3000
						});
					}
					this.request('/app_api/activity/addActiveOrder', requestParam, 'POST').then(res => {
						// console.log("addActiveOrder:", requestParam)
						console.log("addActiveOrder:", res)
						if (res) {
							if (res.code == 200) {
								//订单创建成功，进入支付页面
								uni.reLaunch({
									url: '/pages/active/pay?orderId=' + res.data.id + '&type=0'
								})
							}
							if (res.code == 500) {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 3000
								});
							}
						}
					});
				}).catch(err => {
					console.log('err', err);
				})


			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
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

	.address-tit {
		flex-shrink: 0;
		width: 120upx;
		font-size: 30upx;
		color: $font-color-dark;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			// margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
				margin: 10upx;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
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
		z-index: 998;
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