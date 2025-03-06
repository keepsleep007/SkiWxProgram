<template>
	<view>
		<uni-forms ref="form" :rules="rules" :model="formData">
			<view class="yt-list">
				<view class="yt-list-cell">
					<uni-forms-item label="预约日期" name="date" label-width="auto">
						<input class="address-input" :clearable="false" type="text" v-model="formData.date[0]+'~'+formData.date[1]" />
					</uni-forms-item>
				</view>
				<view class="yt-list-cell">
					<uni-forms-item label="合计天数" name="sumDay" label-width="auto">
						<input class="address-input" :clearable="false" type="text" v-model="formData.sumDay" />
					</uni-forms-item>
				</view>
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

		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="formData.remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{formData.sumPrice}}</text>
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
				formData: {
					// 价格数据ID
					skiTeacherInfoPriceId: '',
					//合计天数
					sumDay: '',
					// 合计价格
					sumPrice: '',
					// 预约日期
					date: [],
					//开始时间（date: [] 拆分后[0]的数据）
					startDate: '',
					//结束时间（date: [] 拆分后[1]的数据）
					endDate: '',
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
						}]
					}
				}
			}
		},
		onLoad(option) {
			console.log("onLoad", option); //打印出上个页面传递的参数。
			// 价格数据ID
			this.formData.skiTeacherInfoPriceId = option.priceId
			//合计天数
			this.formData.sumDay = option.sumDay
			// 合计价格
			this.formData.sumPrice = option.sumPrice
			// 预约日期
			this.formData.date = option.date.split(',')
		},
		methods: {
			//提交订单
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					this.formData.appToken = getToken();
					this.formData.startDate = this.formData.date[0];
					this.formData.endDate = this.formData.date[1];
					console.log("req:", this.formData)
					this.request('/app_api/teacher/addTeacherOrder', this.formData, 'POST').then(res => {
						console.log("addTeacherOrder:", res)
						if (res) {
							if (res.code == 200) {
								//订单创建成功，进入支付页面
								uni.reLaunch({
									url: '/pages/active/pay?orderId=' + res.data.id + '&type=2'
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