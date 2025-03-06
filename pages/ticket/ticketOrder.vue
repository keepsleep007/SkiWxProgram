<template>
	<view class="container">
		<view class="order-info">
			<text class="pord-title">{{title}}</text>
			<text class="pord-currDate">游玩日期：{{currDate}}</text>
			<text class="pord-price">单价：￥{{price}}</text>
		</view>
		<view class="order-info">
			<view class="number-view">
				<text class="number">数量</text>
				<uni-number-box class="number-input" :min="1" v-model="number" @change="numberChange" />
			</view>
		</view>
		<view class="order-info">
			<text class="pord-title">取票人</text>
			<template v-for="(person, index) in selectedPersons">
				<view class="person-view">
					<image class="del-icon" src="/static/img/del.png" mode="widthFix" @click="delPerson(index)"></image>
					<view class="person-info">
						<text class="person-name">姓名：{{person.userName}}</text>
						<text class="person-phone">手机：{{person.userPhone}}</text>
						<text class="person-idcard">身份证：{{person.userIdcard}}</text>
					</view>
				</view>
			</template>
			<view class="person-view">
				<view class="person-add-view" @click="selectPerson">
					<text class="person-add">选择</text>
				</view>
			</view>
		</view>
		<view class="order-info">
			<view class="remark-view">
				<text class="remark-text">备注</text>
				<input class="remark-desc" type="text" v-model="remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{sumPrice}}</text>
			</view>
			<text class="submit" @click="submit()">提交订单</text>
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
				//雪场id
				sonwId: '',
				//商品id
				productId: '',
				// 选择的日期
				currDate: '',
				// 单价
				price: '',
				//商品名称
				title: '',
				//选择的用信息
				selectedPersons: [],
				// 购买数量，默认初始化1件
				number: 1,
				//合计价格，数量*单价
				sumPrice: 0,
				//备注
				remark: '',
				//控制提交订单按钮是否渲染，无库存的时候不渲染
				subFlag: false,
			}
		},
		onLoad(options) {
			console.log('options', options)
			//雪场id
			this.sonwId = options.sonwId
			//商品id
			this.productId = options.productId
			// 选择的日期
			this.currDate = options.stockDate
			// 单价
			this.price = options.price
			//商品名称
			this.title = options.title
			//初始化页面时，先计算合计价格（进入页面时默认时买一件）
			this.numberChange(this.number);
		},
		onShow() {
			// 获取从人员选择界面传来的数据
			this.selectedPersons = uni.getStorageSync('selectedPersons');
		},
		methods: {
			numberChange(data) {
				this.number = data;
				// 计算总价
				this.sumPrice = this.price * this.number;
			},
			//提交订单
			submit(ref) {
				let requestParam = {};
				//雪场id
				requestParam.snowFieldId = this.sonwId
				//商品id
				requestParam.ticketProductId = this.productId
				// 选择的日期
				requestParam.useDate = this.currDate
				// 购买数量，默认初始化1件
				requestParam.saleNumber = this.number
				//备注
				requestParam.remark = this.remark
				requestParam.appToken = getToken();
				//判断购买数量不能为0
				if (this.number <= 0) {
					uni.showToast({
						title: '购买数量不能为0',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				//判断必须选择取票人
				if (this.selectedPersons.length == 0) {
					uni.showToast({
						title: '请选择取票人',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				//判断取票人数量必须等于购票数量
				if (this.selectedPersons.length != this.number) {
					uni.showToast({
						title: '取票人数量需与购买数量相同',
						icon: 'none',
						duration: 3000
					});
					return;
				}
				let tmpSelect = []
				this.selectedPersons.forEach(item => {
					tmpSelect.push(item.id)
				})
				//选择的使用人信息
				requestParam.skiAppUserInfoIds = tmpSelect.join(',')
				this.request('/app_api/ticket/addTicketOrder', requestParam, 'POST').then(res => {
					console.log("addTicketOrder:", res)
					if (res) {
						if (res.code == 200) {
							//清除选择的雪票使用人缓存信息
							uni.removeStorageSync('selectedPersons');
							//订单创建成功，进入支付页面
							uni.reLaunch({
								url: '/pages/active/pay?orderId=' + res.data.id + '&type=1'
							})
						}
						if (res.code == 500) {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			},
			selectPerson() {
				let persons = [];
				//进入选择页面前，先循环本页面中的人员信息，用于在选择页面回显勾选状态
				if (this.selectedPersons.length > 0) {
					this.selectedPersons.forEach(item => {
						persons.push(item.id)
					})
				}
				let id = ''
				if (persons.length > 0) {
					id = persons.join(',')
				}
				uni.navigateTo({
					url: '/pages/ticket/personSelect?id=' + id + '&number=' + this.number
				});
			},
			delPerson(index) {
				this.selectedPersons.splice(index, 1)
				// 将数据保存到本地存储，因为每次显示此页面都会从缓存读取数据，所以数据删除后要及时更新缓存，否则会出现删除数据后进入选择界面再回来，删除的数据又出现了
				uni.setStorageSync('selectedPersons', this.selectedPersons);
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

	.number-view {
		display: flex;
		/* 设置为 Flexbox 容器 */
		align-items: center;
		/* 垂直居中对齐子元素 */
		width: 100%;
	}

	.number-view .number {
		/* 这里不需要额外的 flex 属性，因为默认就是 flex-item */
		font-size: 16px;
		/* 示例：设置字体大小 */
		/* 可以添加其他样式，如颜色、字体权重等 */
	}

	.number-input {
		/* uni-number-box 的样式 */
		margin-left: auto;
		/* 将此元素推至容器的右侧 */
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