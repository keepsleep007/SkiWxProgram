<template>
	<view>
		<!-- 雪场名称 -->
		<view class="title-view">
			<text class="title">{{sonwData.label}}</text>
		</view>
		<!-- 日期选择 -->
		<view class="date-view-container">
			<view class="date-header">
				<text>选择日期</text>
			</view>
			<view class="date-cards">
				<view class="date-card" v-for="(date, index) in dates" :key="index" @click="changeDateCard(date.date)" :style="{ backgroundColor: currDate==date.date ? '#ff5a5f' : '#efeff4' }">
					<text class="date">{{ formatDateToMMDD(date.date) }}</text>
					<text class="weekday">{{ date.weekday }}</text>
				</view>
				<view class="date-card more-dates" @click="toggleSpecDateProduct">
					<text>更多</text>
					<text>日期</text>
				</view>
			</view>
		</view>
		<!-- 商品信息列表 -->
		<scroll-view scroll-y="true" class="product-list-scroll-view">
			<view class="product-item" v-for="(product, index) in products" :key="index" @click="toTicketInfo(product)">
				<!-- 图片 -->
				<image class="product-image" :src="getBaseUrl()+product.image" mode="aspectFit"></image>
				<!-- 商品信息 -->
				<view class="product-info">
					<!-- 商品名称 -->
					<view class="product-title">{{product.title}}</view>
					<!-- 商品标签 -->
					<view class="product-tags">
						<view class="tag-container" v-for="(tag, tagIndex) in product.tag" :key="tagIndex">
							<uni-tag :text=tag type="primary" size="small" custom-style="background-color: #ff5a5f; border-color: #ff5a5f; color: #fff;" />
						</view>
					</view>
					<!-- 价格区域 -->
					<view class="price-section">
						<!-- 商品原价（带删除线） -->
						<text class="original-price">原价：￥{{product.priceOld==null?0:product.priceOld}} </text>
						<!-- 商品价格（红色） -->
						<text class="discounted-price" style="color: red;">￥{{product.price}}</text>
						<!-- 库存数量 -->
						<text class="product-stockNumber">库存：{{product.stockNumber==null?0:product.stockNumber}} </text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 更多日期，弹窗显示日历-->
		<view class="popup" :class="dateClass" @click="toggleSpecDateProduct">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content">
				<uni-calendar class="uni-calendar--hook" :date="currDate" :start-date="startDate" :showMonth="true" @change="dateChange" @monthSwitch="monthSwitch" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dateClass: 'none',
				// 记录选择的日期
				currDate: this.getDate().fullDate,
				//限制开始时间只能是当天
				startDate: this.getDate().fullDate,
				//雪场id
				sonwId: '',
				//雪场数据
				sonwData: {},
				//选择日期card中的数据
				dates: [],
				products: []
			};
		},
		async onLoad(options) {
			//接收传值,雪场id
			this.sonwId = options.id;
			//根据id加载详细数据，雪场信息数据
			this.getFieldInfo(this.sonwId);
			//初始化 选择日期，默认今天为第一个
			this.dates = this.getNextFourDatesWithWeekdays(this.getDate().fullDate)
			//初始化，默认查今天的商品数据
			this.getTicketList(this.sonwId, this.getDate().fullDate);
		},
		methods: {
			getFieldInfo(id) {
				let requestParam = {};
				requestParam.id = id;
				this.request('/app_api/snowField/getFieldInfo', requestParam, 'GET').then(res => {
					if (res) {
						if (res.code == 200) {
							this.sonwData = res.data;
						}
					}
				});
			},
			getTicketList(id, date) {
				let requestParam = {};
				//雪场id
				requestParam.snowFieldId = id;
				//库存日期
				requestParam.stockDate = date;
				this.request('/app_api/ticket/getTicketAndProductList', requestParam, 'GET').then(res => {
					console.log("getTicketAndProductList", res)
					if (res) {
						if (res.code == 200) {
							res.data.forEach(item => {
								if (item.tag != null) {
									item.tag = item.tag.split('/')
								}
							})
							this.products = res.data;
						}
					}
				});
			},
			//日期弹窗开关
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
				this.dates = this.getNextFourDatesWithWeekdays(e.fulldate)
				this.currDate = e.fulldate;
				//查询商品数据
				this.getTicketList(this.sonwId, this.currDate);
			},
			monthSwitch(e) {
				console.log('monthSwitchs 返回:', e)
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
			getNextFourDatesWithWeekdays(inputDate) {
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
						weekday: dayOfWeek
					});
				}
				// 返回包含当天以及未来三个日期和星期几信息的数组
				return dates;
			},
			formatDateToMMDD(dateStr) {
				// 使用字符串的 slice 方法截取 mm-dd 部分
				return dateStr.slice(5, 10); // 从索引 5 开始（即第六个字符，因为索引从 0 开始），到索引 10（但不包括索引 10）
			},
			changeDateCard(date) {
				this.currDate = date;
				//查询商品数据
				this.getTicketList(this.sonwId, this.currDate);
			},
			toTicketInfo(product) {
				uni.navigateTo({
					url: '/pages/ticket/ticketInfo?productId=' + product.productId + '&stockId=' + product.stockId + '&stockDate=' + this.currDate + '&sonwId=' + this.sonwId
				});
			},
		},
	}
</script>

<style lang='scss'>
	page {
		background: #efeff4;
	}

	/* 标题简介 */
	.title-view {
		background: #fff;
		padding: 20upx 30upx;
	}

	.title {
		font-size: 32upx;
		color: $font-color-dark;
		height: 50upx;
		line-height: 50upx;
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
		margin-bottom: 5px;
	}

	/* 商品列表滚动视图样式 */
	.product-list-scroll-view {
		height: calc(100vh - 240px);
		/* 减去头部的高度 */
		width: auto;
		display: flex;
		flex-direction: column;
		/* padding: 10px; */
		margin: 10px;
		border-radius: 10px;
		background-color: #efeff4;
	}

	/* 商品条目样式 */
	.product-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10px;
		/* 根据需要设置间距 */
		background-color: #ffffff;
		border-radius: 10px;
		padding: 10px;
	}

	/* 商品图片样式 */
	.product-image {
		width: 200rpx;
		/* 或者其他合适的宽度 */
		height: 200rpx;
		/* 或者其他合适的高度 */
		margin-right: 10px;
		/* 图片与商品信息的间距 */
		border-radius: 10px;
	}

	/* 商品信息样式 */
	.product-info {
		flex-grow: 1;
		/* 让.product-info填充剩余的空间 */
		height: 100px;
	}

	/* 商品名称样式 */
	.product-title {
		width: 460rpx;
		font-size: 16px;
		/* 或者其他合适的字体大小 */
		font-weight: bold;
		/* 标题可以加粗 */
	}

	/* 商品标签样式 */
	.product-tags {
		display: flex;
		/* 使用flexbox布局 */
		flex-wrap: wrap;
		/* 允许换行（但在这个场景下我们实际上不希望换行，所以后面会处理） */
		margin-top: 5px;
		/* 与商品名称的间距 */
	}

	/* 单个标签的容器样式，用于控制标签之间的间距 */
	.tag-container {
		margin-right: 5px;
		/* 标签之间的间距 */
	}

	.tag-text {
		background-color: #f0f0f0;
		/* 背景色 */
		padding: 2px 5px;
		/* 内边距 */
		margin-right: 5px;
		/* 标签之间的间距 */
		border-radius: 3px;
		/* 圆角 */
	}

	/* 价格区域样式 */
	.price-section {
		position: relative;
		/* 以便绝对定位价格 */
		height: 60px;
	}

	/* 商品原价样式 */
	.original-price {
		text-decoration: line-through;
		/* 删除线 */
		font-size: 12px;
		/* 字体小一点 */
		position: absolute;
		/* 绝对定位 */
		bottom: 30px;
		/* 右下角 */
		right: 0px;
		/* 右下角 */
		color: #999;
		/* 灰色 */
	}

	/* 商品价格样式 */
	.discounted-price {
		font-size: 16px;
		/* 字体正常 */
		position: absolute;
		/* 绝对定位 */
		bottom: 12px;
		/* 右下角 */
		right: 0px;
		/* 右下角，但会覆盖原价，可能需要调整位置 */
		color: red;
		/* 红色 */
	}

	.product-stockNumber {
		font-size: 12px;
		/* 字体小一点 */
		position: absolute;
		/* 绝对定位 */
		bottom: 0px;
		/* 右下角 */
		right: 0px;
		/* 右下角 */
		color: #999;
		/* 灰色 */
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