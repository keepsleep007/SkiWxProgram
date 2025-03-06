<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex == index}" @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.time}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text v-if="item.state===9" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
						</view>
						<view v-if="item.goodsList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex" @click="toOrderInfo(item)">
							<image class="goods-img" :src="getBaseUrl()+goodsItem.coverImage" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.title}}</text>
								<text class="attr-box">{{goodsItem.attr}} x {{goodsItem.number}}</text>
							</view>
						</view>
						<view class="price-box">
							<text class="orderNo">订单号：{{item.orderNo}}</text>
							<text v-if="item.payStatus==='0'">未支付</text>
							<text v-if="item.payStatus==='1'">已支付</text>
							<text v-if="item.payStatus==='3'">已支付(有退款)</text>
							<text v-if="item.payStatus==='2'">已退款</text>
							<text class="price" v-if="item.payStatus!=='0'">{{item.payMoney}}</text>
							<text class="price" v-if="item.payStatus==='0'">{{item.wantPayMoney}}</text>
						</view>
						<view class="action-box" v-if="item.orderStatus === '3'">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom" @click="toPay(item.id)">立即支付</button>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 取消订单提示弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="返回" confirmText="确定" title="提醒" content="确定取消订单吗？" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	import empty from "./empty";
	export default {
		components: {
			empty
		},
		data() {
			return {
				//分页参数
				pageNum: 1,
				pageSize: 10,
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待服务',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已完成',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '已关闭',
						loadingType: 'more',
						orderList: []
					}
				],
				//临时存储关闭的订单信息
				closeItem: {},
				//服务器时间
				serverTime: 0,
			};
		},
		async onLoad(options) {
			// console.log("options", options)
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			if (options.state == 0) {
				this.loadData()
			}
		},
		methods: {
			//获取订单列表
			async loadData(source) {
				await this.getServerTime();
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				//切换标签页，重新查询标签页数据
				if (source === 'tabChange') {
					//切换标签页后要从分页第一条开始查
					this.pageNum = 1;
					//修改状态
					navItem.loadingType = 'more';
					//清空数据
					navItem.orderList = [];
				}
				if (navItem.loadingType === 'noMore') {
					//没有更多数据了
					console.log("没有更多数据了");
					return;
				}
				//loading 的状态 修改为加载中
				navItem.loadingType = 'loading';
				//从后台加载数据
				let orderArr = await this.loadDataForBackground(this.tabCurrentIndex, this.pageNum, this.pageSize);
				console.log("orderArr", orderArr);
				let orderList = orderArr[0];
				orderList.forEach(item => {
					navItem.orderList.push(item);
				})
				//loaded字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				//当前页面已经加载出的数据量 >= 总数据量说明加载完了
				if (navItem.orderList.length >= orderArr[1]) {
					console.log("count", navItem.orderList.length);
					console.log("SUM", orderArr[1]);
					//修改加载状态为 没有更多数据
					navItem.loadingType = 'noMore';
				} else {
					//还有更多数据，修改加载状态为 上拉加载更多
					navItem.loadingType = 'more';
					this.pageNum = this.pageNum + 1;
				}
			},
			//链接后台获取数据
			async loadDataForBackground(tabCurrentIndex, pageNum, pageSize) {
				let requestParam = {};
				requestParam.pageNum = pageNum;
				requestParam.pageSize = pageSize;
				requestParam.createBy = getToken();
				if (tabCurrentIndex == 0) {
					console.log("全部")
				}
				if (tabCurrentIndex == 1) {
					console.log("待付款")
					requestParam.orderStatus = 3;
				}
				if (tabCurrentIndex == 2) {
					console.log("待服务")
					requestParam.orderStatus = 2;
				}
				if (tabCurrentIndex == 3) {
					console.log("已完成")
					requestParam.orderStatus = 1;
				}
				if (tabCurrentIndex == 4) {
					console.log("已关闭")
					requestParam.orderStatus = 0;
				}
				let tmp = [];
				//存放最终要返回的数据
				let arr = [];
				console.log("requestParam", requestParam)
				await this.request('/app_api/activity/getMyActivityOrder', requestParam, 'GET').then(res => {
					if (res) {
						console.log("getMyActivityOrder", res)
						if (res.code == 200) {
							let data = res.data[0];
							for (var i = 0; i < data.length; i++) {
								let goodsList = [];
								goodsList[0] = {};
								goodsList[0]['title'] = data[i].activityTitle;
								goodsList[0]['price'] = data[i].payMoney;
								goodsList[0]['number'] = data[i].saleNumber;
								goodsList[0]['coverImage'] = data[i].coverImage;
								goodsList[0]['attr'] = data[i].productName;
								goodsList[0]['stockType'] = data[i].stockType;
								tmp[i] = {};
								tmp[i]['goodsList'] = goodsList;
								tmp[i]['state'] = data[i].orderStatus;
								if (data[i].orderStatus == 0) {
									tmp[i]['stateTip'] = '已关闭';
									tmp[i]['stateTipColor'] = '#909399';
								}
								if (data[i].orderStatus == 1) {
									tmp[i]['stateTip'] = '已完成';
									tmp[i]['stateTipColor'] = '#fa436a';
								}
								if (data[i].orderStatus == 2) {
									tmp[i]['stateTip'] = '待服务';
									tmp[i]['stateTipColor'] = '#fa436a';
								}
								if (data[i].orderStatus == 3) {
									tmp[i]['stateTip'] = '待付款';
									tmp[i]['stateTipColor'] = '#fa436a';
									//判断待支付订单的时间是否已经超过10分钟未支付，超过的执行关闭订单操作
									let createTime = new Date(data[i].createTime).getTime() / 1000;
									let orderDuration = 10 * 60; // 10分钟，单位为秒
									let endTime = createTime + orderDuration;
									console.log("serverTime", this.serverTime)
									console.log("endTime", endTime)
									if (this.serverTime > endTime) {
										console.log("订单超时未支付")
										data[i].orderStatus = 0
										tmp[i]['stateTip'] = '已关闭';
										tmp[i]['stateTipColor'] = '#909399';
									}
								}
								tmp[i]['time'] = data[i].createTime;
								tmp[i]['orderNo'] = data[i].orderNo;
								tmp[i]['orderStatus'] = data[i].orderStatus;
								tmp[i]['payStatus'] = data[i].payStatus;
								tmp[i]['id'] = data[i].id;
								tmp[i]['payMoney'] = data[i].payMoney;
								tmp[i]['wantPayMoney'] = data[i].wantPayMoney;
							}
							//当前类别下数据总条数
							arr[1] = res.data[1];
						}
						if (res.code == 500) {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000
							});
						}
					}
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					});
				})
				// 订单数据
				arr[0] = tmp;
				return arr;
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item) {
				this.closeItem = item;
				this.msgType = 'info'
				this.$refs.alertDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogConfirm() {
				let item = this.closeItem;
				console.log('点击确认')
				let requestParam = {};
				requestParam.id = item.id;
				this.request('/app_api/activity/cancelActivityOrder', requestParam, 'POST').then(res => {
					if (res) {
						console.log("cancelActivityOrder", res)
						if (res.code == 200) {
							if (res.data == 1) {
								item.orderStatus = '0'
								item.stateTip = '已关闭';
								item.stateTipColor = '#909399';
								uni.showToast({
									title: '取消成功',
									icon: 'none',
									duration: 2000
								});
							}
						}
					}
				});
			},
			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待发货';
						break;
					case 9:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			toOrderInfo(item) {
				console.log("toOrderInfo", item)
				uni.navigateTo({
					url: '/pages/active/orderListInfo?id=' + item.id
				});
			},
			toPay(orderId) {
				//订单创建成功，进入支付页面
				uni.navigateTo({
					url: '/pages/active/pay?orderId=' + orderId + '&type=0'
				})
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
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.orderNo {
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		padding: 10upx 12upx;
		flex: 1;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding-right: 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>