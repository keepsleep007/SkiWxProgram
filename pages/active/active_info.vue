<template>
	<view>
		<view class="carousel">
			<swiper class="image-swiper" indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image :src="getBaseUrl()+item.src" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{data.activityTitle}}</text>
			<view class="price-box">
				<template v-for="(activityTagitem, index) in activityTagList">
					<template v-if="data.activityTag==activityTagitem.dictValue">
						<text :key="index" class="coupon-tip">{{activityTagitem.dictLabel}}</text>
					</template>
				</template>
			</view>
			<button class="share-button" open-type="share">
				<image class="share-icon" src="/static/img/share.png" mode="widthFix"></image>
			</button>
		</view>

		<view class="bot-row">
			<text>销量: {{data.saleNumber}}</text>
			<!-- <text>库存: 4690</text> -->
			<!-- <text>浏览量: 768</text> -->
		</view>

		<view class="c-list">
			<view class="c-row b-b">
				<!-- <text class="tit">购买类型</text> -->
				<view class="con">
					<view class="s-row" v-for="(item,index) in productList" :key="index">
						<rich-text :nodes="item.productName"></rich-text>
						<button :class="{'s-btn':true,'s-btn-color':item.s_btn_color}" @click="item.s_btn_color!=true?productBtn(item.id):''">￥{{item.price}}</button>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc" v-if="shortRichTextFlag">
			<view class="d-header">
				<text>简介</text>
			</view>
			<rich-text :nodes="data.shortRichText"></rich-text>
		</view>
		<view class="detail-desc" v-if="infoRichTextFlag">
			<view class="d-header">
				<text>图文介绍</text>
			</view>
			<rich-text :nodes="data.infoRichText"></rich-text>
		</view>
		<view class="detail-desc" v-if="shortRichTextFlag">
			<view class="d-header">
				<text>费用说明</text>
			</view>
			<rich-text :nodes="data.priceRichText"></rich-text>
		</view>
		<view class="detail-desc" v-if="disclaimerRichTextFlag">
			<view class="d-header">
				<text>免责条款</text>
			</view>
			<rich-text :nodes="data.disclaimerRichText"></rich-text>
		</view>

		<!-- 日期库存，购买弹窗 -->
		<view class="popup spec" :class="dateClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpecDateProduct">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<uni-calendar class="uni-calendar--hook" :selected="dateSelected" :date="currDate" :showMonth="true" @change="dateChange" @monthSwitch="monthSwitch" />
				<button class="btn" @click="subProduct(dateSelectedId,1)">立即购买</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getUserInfo,
		needLogin,
	} from '@/utils/auth';
	export default {
		components: {},
		data() {
			return {
				activeId: '',
				imgList: [],
				data: {},
				activityTagList: [],
				infoRichTextFlag: false,
				priceRichTextFlag: false,
				shortRichTextFlag: false,
				disclaimerRichTextFlag: false,
				productList: [],
				dateClass: 'none',
				dateSelected: [],
				// 记录打卡的哪个产品的日期选择弹窗
				dateSelectedId: '',
				// 记录选择的日期
				currDate: this.getDate().fullDate
			};
		},
		async onLoad(options) {
			//接收传值,id
			let id = options.id;
			if (id) {
				// console.log("onLoad_id", id)
				//根据id加载详细数据
				this.getDataInfo(id);
				this.getActivityTag();
				this.activeId = id;
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享了活动信息，一起看看吧~',
				path: '/pages/active/active_info?id=' + this.activeId
			}
		},
		methods: {
			getDataInfo(id) {
				let requestParam = {};
				requestParam.id = id;
				this.request('/app_api/activity/getActivityInfo', requestParam, 'GET').then(res => {
					console.log("getActivityInfo", res)
					if (res) {
						if (res.code == 200) {
							//处理轮播图
							let bannerImageArr = res.data.bannerImage.split(',');
							let tmp = []
							for (var i = 0; i < bannerImageArr.length; i++) {
								tmp[i] = {};
								tmp[i]['src'] = bannerImageArr[i];
							}
							this.imgList = tmp;
							//处理富文本中的图片，补全url链接
							if (res.data.shortRichText) {
								res.data.shortRichText = this.fixImageSrcInHtml(res.data.shortRichText, this.getBaseUrl());
								//后台富文本编辑器内容为空时始终会保留2个标签，导致没有内容时title依然显示，这里做下处理
								if (res.data.shortRichText === '<p><br></p>') {
									this.shortRichTextFlag = false;
								} else {
									this.shortRichTextFlag = true;
								}
							}
							if (res.data.infoRichText) {
								res.data.infoRichText = this.fixImageSrcInHtml(res.data.infoRichText, this.getBaseUrl());
								//后台富文本编辑器内容为空时始终会保留2个标签，导致没有内容时title依然显示，这里做下处理
								if (res.data.infoRichText === '<p><br></p>') {
									this.infoRichTextFlag = false;
								} else {
									this.infoRichTextFlag = true;
								}
							}
							if (res.data.priceRichText) {
								res.data.priceRichText = this.fixImageSrcInHtml(res.data.priceRichText, this.getBaseUrl())
								//后台富文本编辑器内容为空时始终会保留2个标签，导致没有内容时title依然显示，这里做下处理
								if (res.data.priceRichText === '<p><br></p>') {
									this.priceRichTextFlag = false;
								} else {
									this.priceRichTextFlag = true;
								}
							}
							this.data = res.data;
							//加载免责条款
							this.getDisclaimerRichText(res.data.skiDisclaimerId);
							//查询活动的商品信息
							this.getActiveProduct(res.data.id)
						}
					}
				});
			},
			getActivityTag() {
				this.request('/app_api/activity/loadActivityTag', 'GET').then(res => {
					// console.log("res:", res.data)
					if (res) {
						this.activityTagList = res.data;
					}
				})
			},
			//使用活动-产品关联id查询所有产品
			getActiveProduct(id) {
				let requestParam = {};
				requestParam.id = id;
				this.request('/app_api/activity/getActiveProduct', requestParam, 'GET').then(res => {
					console.log("getActiveProduct", res)
					if (res) {
						if (res.code == 200) {
							for (var i = 0; i < res.data.length; i++) {
								//判断总量库存是否有库存，如果库存为0，按钮置为灰色
								if (res.data[i].stockType == 0) {
									if (res.data[i].stockNumber == 0) {
										res.data[i].s_btn_color = true;
									}
								}
							}
							this.productList = res.data;
						}
					}
				});
			},
			getDisclaimerRichText(skiDisclaimerId) {
				let requestParam = {};
				requestParam.skiDisclaimerId = skiDisclaimerId;
				this.request('/app_api/activity/getDisclaimer', requestParam, 'GET').then(res => {
					console.log("getDisclaimer", res)
					if (res) {
						if (res.code == 200) {
							if (res.data) {
								//处理富文本中的图片，补全url链接
								if (res.data.disclaimerRichText) {
									res.data.disclaimerRichText = this.fixImageSrcInHtml(res.data.disclaimerRichText, this.getBaseUrl());
									this.disclaimerRichTextFlag = true;
								}
								this.data.disclaimerRichText = res.data.disclaimerRichText;
							}
						}
					}
				});
			},
			//点击购买按钮
			productBtn(id) {
				//未登录，跳转登录
				if (needLogin()) {
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					}
				}
				// console.log(id);
				//查询单个产品的详细数据
				let requestParam = {};
				requestParam.id = id;
				this.request('/app_api/activity/getProductInfo', requestParam, 'GET').then(res => {
					// console.log("getProductInfo", res)
					if (res) {
						if (res.code == 200) {
							//总量库存
							if (res.data.stockType == 0) {
								this.subProduct(id, 0)
							}
							//日期库存，继续查询，日期库存数据
							else if (res.data.stockType == 1) {
								let requestParam = {};
								requestParam.skiActivityProductId = res.data.id;
								this.request('/app_api/activity/getDataProductInfo', requestParam, 'GET').then(res => {
									// console.log("getDataProductInfo", res)
									if (res) {
										if (res.code == 200) {
											let tmp = []
											for (var i = 0; i < res.data.length; i++) {
												tmp[i] = {};
												tmp[i]['date'] = res.data[i].stockDate;
												tmp[i]['info'] = "库存：" + res.data[i].stockNumber;
											}
											this.dateSelected = tmp;
											this.dateSelectedId = id;
											// 打开弹窗层
											this.toggleSpecDateProduct();
										}
									}
								});
							}
						}
					}
				});
			},
			//点击立即购买，跳转到订单提交页面
			subProduct(id, stockType) {
				// console.log("subProduct", id)
				if (stockType == 0) {
					// console.log("stockType", 0);
					uni.navigateTo({
						url: '/pages/active/active_Order?id=' + id + "&activeId=" + this.activeId + "&stockType=" + stockType + "&coverImage=" + this.data.coverImage
					});
				} else if (stockType == 1) {
					// console.log("stockType", 1);
					// console.log("currDate", this.currDate);
					uni.navigateTo({
						url: '/pages/active/active_Order?id=' + id + "&activeId=" + this.activeId + "&stockType=" + stockType + "&currDate=" + this.currDate + "&coverImage=" + this.data.coverImage
					});
				}
			},
			//日期库存弹窗开关
			toggleSpecDateProduct() {
				if (this.dateClass === 'show') {
					this.dateClass = 'hide';
					setTimeout(() => {
						this.dateClass = 'none';
					}, 250);
				} else if (this.dateClass === 'none') {
					this.dateClass = 'show';
				}
			},
			dateChange(e) {
				console.log('change 返回:', e)
				this.currDate = e.fulldate;
			},
			monthSwitch(e) {
				console.log('monthSwitchs 返回:', e)
			},
			//选择规格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})

			},
			//分享
			shareFunc() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				this.favorite = !this.favorite;
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			stopPrevent() {},
			// 用于修改HTML中的图片src  
			fixImageSrcInHtml(htmlText, baseUrl) {
				if (!htmlText) {
					console.error('HTML文本不能为空');
					return;
				}
				// 使用正则表达式匹配所有的URL
				const urlPattern = /src="([^"]+)"/g;
				let match;
				const restoredUrls = [];
				while ((match = urlPattern.exec(htmlText)) !== null) {
					const url = match[1];
					if (url.startsWith('/profile')) {
						restoredUrls.push(baseUrl + url);
					} else {
						restoredUrls.push(url); // 如果没有/profile，返回原URL
					}
				}
				// 替换处理后的HTML中的URL
				let newHtml = htmlText;
				restoredUrls.forEach((newUrl, index) => {
					const originalUrl = urlPattern.exec(htmlText)[1];
					newHtml = newHtml.replace(originalUrl, newUrl);
				});
				console.log('fixImageSrcRestoreUrls处理后的HTML：', newHtml)
				return newHtml;
			},
			getDate() {
				const dd = new Date()
				const y = dd.getFullYear()
				const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return {
					fullDate: y + '-' + m + '-' + d,
					year: y,
					month: m,
					date: d,
					day: dd.getDay()
				}
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.s-btn {
		height: 50upx;
		line-height: 50upx;
		border-radius: 100upx;
		background: #ff5a5f;
		font-size: $font-base - 2upx;
		color: #fff;
		margin-right: 0px;
	}

	.s-btn-color {
		background: #ccc;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}


	.carousel {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.image-swiper {
		width: 100%;
		height: 500upx;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}

	.image-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

	}


	.introduce-section {
		display: flex;
		flex-direction: row;
		/* 虽然这是 Flexbox 的默认行布局，但明确指定可以避免混淆 */
		align-items: center;
		/* 垂直居中对齐子元素 */
		background: #fff;
		padding: 20px 30px;
		/* 假设您使用的是 px，如果是在小程序中请保持 upx */
		justify-content: space-between;
		/* 让子元素在主轴（这里是水平方向）上分布，但这不是必需的，取决于您的具体布局需求 */
		/* 如果不需要 space-between，可以移除这行，或者根据需要使用 flex-start, flex-end, center 等 */
	}

	.title {
		font-size: 32upx;
		/* 使用 px 或保持 upx */
		color: #000;
		/* 替换为实际的暗色字体颜色值 */
		width: 450rpx;
	}

	.price-box {
		/* display: flex; 如果 price-box 内部没有其他需要 flex 布局的子元素，这行可以移除 */
		align-items: baseline;
		/* 如果 price-box 内部有文本和图标等需要对齐的元素，这行保留 */
		/* height 可以移除，Flexbox 会根据内容自动调整高度 */
		font-size: 26px;
		/* 替换为实际的主色值 */
		margin-left: auto;
		/* 这会让 price-box 推到其父容器的最右边 */
		margin-right: 10rpx;
	}

	.coupon-tip {
		align-items: center;
		padding: 4upx 10upx;
		background: #ff5a5f;
		font-size: $font-sm;
		color: #fff;
		border-radius: 6upx;
		line-height: 1;
		transform: translateY(-4upx);
	}

	.share-button {
		background-color: transparent;
		/* 移除背景色 */
		padding: 0;
		/* 移除内边距 */
		margin: 0;
		/* 移除外边距 */
		width: 20px;
		height: 30px;
	}

	.share-button::after {
		border: 0;
	}

	.share-icon {
		width: 100%;
		/* 图标宽度与按钮宽度相同 */
		height: auto;
		/* 保持图标比例 */
	}

	.bot-row {
		background: #fff;
		padding-left: 30px;
		height: 25px;
		font-size: $font-sm;
		color: $font-color-light;
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		margin-top: 10px;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.s-row {
			display: flex;
			align-items: center;
			padding: 10upx 30upx;
			position: relative;
			height: 90upx;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}


	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		margin-left: 16upx;
		margin-right: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}
</style>