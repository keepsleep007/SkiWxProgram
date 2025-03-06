<template>
	<view class="tabs">
		<scroll-view enable-flex="true" ref="tabbar1" id="tab-bar" class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view style="flex-direction: column;">
				<view style="flex-direction: row;">
					<view class="uni-tab-item" key="car" id="car" data-current="0" @click="ontabtap">
						<text class="uni-tab-item-title" :class="tabIndex==0 ? 'uni-tab-item-title-active' : ''">拼车</text>
					</view>
					<view class="uni-tab-item" key="room" id="room" data-current="1" @click="ontabtap">
						<text class="uni-tab-item-title" :class="tabIndex==1 ? 'uni-tab-item-title-active' : ''">拼房</text>
					</view>
					<view class="uni-tab-item" key="ticket" id="ticket" data-current="2" @click="ontabtap">
						<text class="uni-tab-item-title" :class="tabIndex==2 ? 'uni-tab-item-title-active' : ''">雪票交易</text>
					</view>
				</view>
				<!-- 蓝色横线 -->
				<view class="scroll-view-indicator">
					<view ref="underline" class="scroll-view-underline" :class="isTap ? 'scroll-view-animation':''" :style="{left: indicatorLineLeft + 'px', width: indicatorLineWidth + 'px'}"></view>
				</view>
			</view>
		</scroll-view>
		<view class="tab-bar-line"></view>
		<swiper class="tab-box" ref="swiper1" :current="tabIndex" :duration="300" @change="onswiperchange" @transition="onswiperscroll" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<carPage class="page-item" nid="0" ref="page0"></carPage>
			</swiper-item>
			<swiper-item class="swiper-item">
				<roomPage class="page-item" nid="1" ref="page1"></roomPage>
			</swiper-item>
			<swiper-item class="swiper-item">
				<ticketPage class="page-item" nid="2" ref="page2"></ticketPage>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import carPage from './r-car-page.vue';
	import roomPage from './r-room-page.vue';
	import ticketPage from './r-ticket-page.vue';

	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	const TAB_PRELOAD_OFFSET = 1;

	export default {
		components: {
			carPage,
			roomPage,
			ticketPage,
		},
		data() {
			return {
				tabList: [{
					name: '拼车',
					id: 0
				}, {
					name: '拼房',
					id: 1
				}, {
					name: '雪票交易',
					id: 2
				}],
				tabIndex: 0,
				cacheTab: [],
				scrollInto: "",
				navigateFlag: false,
				indicatorLineLeft: 0,
				indicatorLineWidth: 0,
				isTap: false
			}
		},
		onLoad(options) {
			console.log('r-club-onLoad-options', options)
			if (options.tabIndex != null) {
				this.tabIndex = options.tabIndex
			}
			this._lastTabIndex = 0;
			this.swiperWidth = 0;
			this.tabbarWidth = 0;
			this.tabListSize = {};
			this._touchTabIndex = 0;

			this.pageList = [];
			for (var i = 0; i < this.tabList.length; i++) {
				let item = this.$refs['page' + i]
				if (Array.isArray(item)) {
					this.pageList.push(item[0])
				} else {
					this.pageList.push(item)
				}
			}
			this.selectorQuery();
		},
		onReady() {
			console.log('r-club-onReady')
		},
		onShow() {
			console.log('r-club-onShow')
			this.switchTab(this.tabIndex);
		},
		methods: {
			ontabtap(e) {
				// console.log("点击触发ontabtap", e);
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.isTap = true;
				var currentSize = this.tabListSize[index];
				this.updateIndicator(currentSize.left, currentSize.width);
				this._touchTabIndex = index;
				this.switchTab(index);
			},
			onswiperchange(e) {
				// 注意：百度小程序会触发2次
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			onswiperscroll(e) {
				// if (this.isTap) {
				// 	return;
				// }
				// var offsetX = e.detail.dx;
				// var preloadIndex = this._lastTabIndex;
				// if (offsetX > TAB_PRELOAD_OFFSET) {
				// 	preloadIndex++;
				// } else if (offsetX < -TAB_PRELOAD_OFFSET) {
				// 	preloadIndex--;
				// }
				// if (preloadIndex === this._lastTabIndex || preloadIndex < 0 || preloadIndex > this.pageList.length - 1) {
				// 	return;
				// }
				// if (this.pageList[preloadIndex].dataList.length === 0) {
				// 	// console.log('滑动中onswiperscroll', e)
				// 	// this.loadTabData(preloadIndex);
				// }
				// var percentage = Math.abs(this.swiperWidth / offsetX);
				// var currentSize = this.tabListSize[this._lastTabIndex];
				// var preloadSize = this.tabListSize[preloadIndex];
				// var lineL = currentSize.left + (preloadSize.left - currentSize.left) / percentage;
				// var lineW = currentSize.width + (preloadSize.width - currentSize.width) / percentage;
				// this.updateIndicator(lineL, lineW);
			},
			animationfinish(e) {
				// console.log("滑动结束animationfinish", e)
				let index = e.detail.current;
				if (this._touchTabIndex === index) {
					this.isTap = false;
				}
				this._lastTabIndex = index;
				// this.switchTab(index);
				this.tabIndex = index;
				this.updateIndicator(this.tabListSize[index].left, this.tabListSize[index].width);
			},
			selectorQuery() {
				uni.createSelectorQuery().in(this).select('.tab-box').fields({
					dataset: true,
					size: true,
				}, (res) => {
					this.swiperWidth = res.width;
				}).exec();
				uni.createSelectorQuery().in(this).selectAll('.uni-tab-item').boundingClientRect((rects) => {
					rects.forEach((rect) => {
						this.tabListSize[rect.dataset.current] = rect;
					})
					this.updateIndicator(this.tabListSize[this.tabIndex].left, this.tabListSize[this.tabIndex].width);
				}).exec();
			},
			updateIndicator(left, width) {
				this.indicatorLineLeft = left;
				this.indicatorLineWidth = width;
			},
			switchTab(index) {
				this.tabIndex = index;
				this.loadTabData(index);
			},
			scrollTabTo(index) {
				const el = this.$refs['tabitem' + index][0];
				let offset = 0;
				if (index > 0) {
					offset = this.tabbarWidth / 2 - this.tabListSize[index].width / 2;
					if (this.tabListSize[index].right < this.tabbarWidth / 2) {
						offset = this.tabListSize[0].width;
					}
				}
				dom.scrollToElement(el, {
					offset: -offset
				});
			},
			loadTabData(index) {
				this.pageList[index].loadData('my');
			},
			clearTabData(index) {
				this.pageList[index].clear();
			},
			refreshData() {
				// console.log('refreshData', this.tabIndex)
				let tmp = [{
					value: 'null'
				}, {
					value: 'null'
				}, {
					value: 'null'
				}, {
					value: 'null'
				}]
				this.pageList[this.tabIndex].loadData("loadParams", tmp);
			},
			/**
			 * 下拉刷新回调函数
			 */
			onPullDownRefresh() {
				this.refreshData();
				uni.stopPullDownRefresh();
			},
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #ffffff;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.tab-bar {
		/* #ifdef APP-PLUS */
		width: 750rpx;
		/* #endif */
		height: 42px;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		display: flex;
	}

	/* #ifndef APP-NVUE */
	.tab-bar ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	/* #endif */

	.scroll-view-indicator {
		position: relative;
		height: 2px;
		background-color: transparent;
	}

	.scroll-view-underline {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		background-color: #007AFF;
	}

	.scroll-view-animation {
		transition-duration: 0.2s;
		transition-property: left;
	}

	.tab-bar-line {
		height: 1px;
		background-color: #cccccc;
	}

	.tab-box {
		flex: 1;
		height: calc(100% - 42px);
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 20px;
		padding-right: 20px;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 15px;
		height: 40px;
		line-height: 40px;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #007AFF;
	}

	.swiper-item {
		flex: 1;
		flex-direction: column;
	}

	.page-item {
		flex: 1;
		flex-direction: row;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
</style>