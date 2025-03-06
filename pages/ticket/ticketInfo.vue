<template>
	<view>
		<view class="productdata-view">
			<view class="carousel">
				<view class="image-wrapper">
					<image :src="getBaseUrl()+productData.image" class="loaded" mode="aspectFill"></image>
				</view>
			</view>
			<view class="introduce-section">
				<view class="title-view">
					<text>{{productData.title}}</text>
				</view>
				<view class="tag-view">
					<uni-tag v-for="(tag, tagIndex) in productData.tag" :key="tagIndex" :text=tag type="primary" size="small" custom-style="background-color: #ff5a5f; border-color: #ff5a5f; color: #fff;" />
				</view>
				<view class="price-view">
					<text>￥：{{price}}</text>
				</view>
				<button class="share-button" open-type="share">
					<image class="share-icon" src="/static/img/share.png" mode="widthFix"></image>
				</button>
			</view>
			<!-- 日期选择 -->
			<view class="date-view-container">
				<view class="date-header">
					<text>选择日期</text>
				</view>
				<view class="date-cards">
					<view class="date-card" v-for="(date, index) in dates" :key="index" @click="changeDateCard(date)" :style="{ backgroundColor: currDate==date.date ? '#ff5a5f' : '#efeff4' }">
						<text class="date">{{ formatDateToMMDD(date.date) }}</text>
						<text class="weekday">{{ date.weekday }}</text>
						<text class="stockNumber">库存:{{ date.stockNumber }}</text>
					</view>
					<view class="date-card more-dates" @click="toggleSpecDateProduct">
						<text>更多</text>
						<text>日期</text>
					</view>
				</view>
			</view>
			<view class="detail-desc" v-if="shortRichTextFlag">
				<view class="d-header">
					<text>活动简介</text>
				</view>
				<rich-text :nodes="productData.shortRichText"></rich-text>
			</view>
			<view class="detail-desc" v-if="infoRichTextFlag">
				<view class="d-header">
					<text>图文介绍</text>
				</view>
				<rich-text :nodes="productData.infoRichText"></rich-text>
			</view>
			<view class="detail-desc" v-if="priceRichTextFlag">
				<view class="d-header">
					<text>费用说明</text>
				</view>
				<rich-text :nodes="productData.priceRichText"></rich-text>
			</view>
			<view class="detail-desc" v-if="disclaimerRichTextFlag">
				<view class="d-header">
					<text>免责条款</text>
				</view>
				<rich-text :nodes="productData.disclaimerRichText"></rich-text>
			</view>
			<!-- 更多日期，弹窗显示日历-->
			<view class="popup" :class="dateClass" @click="toggleSpecDateProduct">
				<!-- 遮罩层 -->
				<view class="mask"></view>
				<view class="layer attr-content">
					<uni-calendar class="uni-calendar--hook" :date="currDate" :start-date="startDate" :showMonth="true" @change="dateChange" @monthSwitch="monthSwitch" />
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="price-tip">￥</text>
				<text class="price">{{price}}</text>
			</view>
			<text class="submit" @click="subProduct">立即购买</text>
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
				//雪场id
				sonwId: '',
				//商品id
				productId: '',
				// 库存id
				stockId: '',
				// 选择的日期
				currDate: '',
				//商品详情数据
				productData: '',
				//选择日期card中的数据
				dates: [],
				//商品价格
				price: 0,
				//限制开始时间只能是当天
				startDate: this.getDate().fullDate,
				//日历弹窗控制
				dateClass: 'none',
				//内容显示控制
				infoRichTextFlag: false,
				priceRichTextFlag: false,
				shortRichTextFlag: false,
				disclaimerRichTextFlag: false,
			};
		},
		async onLoad(options) {
			console.log('options', options)
			//雪场id
			this.sonwId = options.sonwId
			//商品id
			this.productId = options.productId
			// 库存id
			this.stockId = options.stockId
			// 选择的日期（从分享链接过来的是没有日期的，这时候给个默认的今天日期）
			if (options.stockDate == null) {
				this.currDate = this.getDate().fullDate
			} else {
				this.currDate = options.stockDate
			}
			//初始化 选择日期，默认今天为第一个
			this.dates = await this.getNextFourDatesWithWeekdays(this.currDate)
			//查询商品详情
			this.getProductInfo();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '分享了商品信息，一起看看吧~',
				path: '/pages/ticket/ticketInfo?productId=' + this.productId
			}
		},
		methods: {
			getProductInfo() {
				let requestParam = {};
				requestParam.id = this.productId;
				this.request('/app_api/ticket/getProductInfo', requestParam, 'GET').then(res => {
					console.log("getProductInfo", res)
					if (res) {
						if (res.code == 200) {
							if (res.data.tag != null) {
								res.data.tag = res.data.tag.split('/')
							}
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
							this.productData = res.data;
							//加载免责条款
							this.getDisclaimerRichText(res.data.skiDisclaimerId);
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
								this.productData.disclaimerRichText = res.data.disclaimerRichText;
							}
						}
					}
				});
			},
			//点击立即购买，跳转到订单提交页面
			subProduct() {
				//判断是否有库存，如果库存是0则不进入订单页面
				for (const dateItem of this.dates) {
					if (dateItem.date === this.currDate) {
						if (dateItem.stockNumber === 0) {
							uni.showToast({
								title: '指定日期库存不足',
								icon: 'none',
								duration: 2000
							});
							return;
						}
					}
				}
				//未登录，跳转登录
				if (needLogin()) {
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					}
				}
				uni.navigateTo({
					url: '/pages/ticket/ticketOrder?productId=' + this.productId + '&stockId=' + this.stockId + '&stockDate=' + this.currDate + '&price=' + this.price + '&title=' + this.productData.title + '&sonwId=' + this.sonwId
				});
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
			async dateChange(e) {
				this.dates = await this.getNextFourDatesWithWeekdays(e.fulldate)
				this.currDate = e.fulldate;
			},
			monthSwitch(e) {
				console.log('monthSwitchs 返回:', e)
			},
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
				// console.log('fixImageSrcRestoreUrls处理后的HTML：', newHtml)
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
			},
			async getNextFourDatesWithWeekdays(inputDate) {
				//存储日期数据，用于查询日期库存使用
				let queryDate = [];
				// 将输入的日期字符串转换为 Date 对象
				const date = new Date(inputDate);
				// 创建一个数组来存储日期和星期几的信息
				const dates = [];
				// 定义星期几的名称数组
				const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
				// 初始化一个计数器，用于循环四次（包括当天）
				for (let i = 0; i < 4; i++) {
					// 创建一个新的 Date 对象（避免直接修改原始日期对象）
					const newDate = new Date(date);
					// 增加天数（i 从 0 开始，所以当天不会改变日期）
					newDate.setDate(newDate.getDate() + i);
					// 获取星期几的索引（0 表示星期天，1 表示星期一，依此类推）
					const dayOfWeekIndex = newDate.getDay();
					// 获取星期几的名称
					const dayOfWeek = weekdays[dayOfWeekIndex];
					// 将日期和星期几的信息添加到数组中
					// 这里我们将日期和星期几作为一个对象存储
					dates.push({
						date: newDate.toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
						weekday: dayOfWeek,
						stockNumber: 0,
						priceOld: 0,
						price: 0
					});
					queryDate.push(newDate.toISOString().split('T')[0])
				}
				//查询几个日期的库存量
				let requestParam = {};
				requestParam.id = this.productId;
				requestParam.dates = queryDate.join(',');
				await this.request('/app_api/ticket/getTicketStockNumber', requestParam, 'GET').then(res => {
					// console.log("getTicketStockNumber", res)
					if (res) {
						if (res.code == 200) {
							const stockData = res.data;
							// 遍历 stockData 和 dates 数组，找到匹配项并更新 stockNumber
							dates.forEach(dateItem => {
								const matchingStock = stockData.find(stockItem => stockItem.stockDate === dateItem.date);
								if (matchingStock) {
									dateItem.stockNumber = matchingStock.stockNumber;
									dateItem.priceOld = matchingStock.priceOld;
									dateItem.price = matchingStock.price;
								}
							});
						}
					}
				});
				// console.log(dates)
				this.price = dates[0].price
				// 返回包含当天以及未来三个日期和星期几信息的数组
				return dates;
			},
			changeDateCard(date) {
				// console.log(date)
				this.price = date.price
				this.currDate = date.date;
			},
			formatDateToMMDD(dateStr) {
				// 使用字符串的 slice 方法截取 mm-dd 部分
				return dateStr.slice(5, 10); // 从索引 5 开始（即第六个字符，因为索引从 0 开始），到索引 10（但不包括索引 10）
			},
		},
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.productdata-view {
		height: calc(100vh - 60px);
		/* 减去 .footer 的高度 */
		overflow-y: auto;
	}

	.carousel {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.image-wrapper {
		width: 100%;
		height: 500upx;
		display: flex;
	}

	.image-wrapper image {
		width: 100%;
		height: auto;
		/* 保持宽高比 */
		object-fit: cover;
		/* 确保图片覆盖整个容器，同时保持宽高比 */
	}

	/* 通用样式重置 */
	.introduce-section {
		padding: 20px;
		background-color: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		/* 确保 .share-button 可以相对于此元素定位 */
	}

	/* 标题样式 */
	.title-view {
		margin-bottom: 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	/* 标签样式调整 */
	.tag-view {
		display: flex;
		flex-wrap: nowrap;
		/* 改为 nowrap 以确保标签在同一行显示，直到它们无法再容纳为止 */
		margin-bottom: 15px;
	}

	.uni-tag {
		margin-right: 10px;
	}

	/* 价格样式 */
	.price-view {
		font-size: 16px;
		color: #ff5a5f;
		font-weight: bold;
	}

	.share-button {
		position: absolute;
		top: 10px;
		right: 10px;
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

	.date-view-container {
		display: flex;
		flex-direction: column;
		padding: 10px;
		margin: 10px;
		border-radius: 10px;
		background-color: #fff;
	}

	.date-header {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.date-cards {
		display: flex;
	}

	.date-card {
		display: flex;
		flex-direction: column;
		background: #efeff4;
		border-radius: 5px;
		margin-right: 10px;
		width: 100%;
		text-align: center;
		padding: 10px 0;
	}

	.more-dates {
		margin-right: 0;
	}

	.date,
	.weekday {
		display: block;
		font-size: 14px;
		margin-bottom: 3px;
	}

	.stockNumber {
		font-size: 10px;
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

	.footer {
		position: fixed;
		z-index: 10;
		left: 0;
		bottom: 0;
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