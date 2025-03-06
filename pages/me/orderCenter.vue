<template>
	<view class="tabs">
		<view style="flex-direction: column;">
			<view style="flex-direction: row;">
				<view class="uni-tab-item" key="ticket" id="ticket" data-current="0" @click="ontabtap">
					<text class="uni-tab-item-title" :class="tabIndex==0 ? 'uni-tab-item-title-active' : ''">雪票订单</text>
				</view>
				<view class="uni-tab-item" key="active" id="active" data-current="1" @click="ontabtap">
					<text class="uni-tab-item-title" :class="tabIndex==1 ? 'uni-tab-item-title-active' : ''">活动订单</text>
				</view>
				<view class="uni-tab-item" key="teacher" id="teacher" data-current="2" @click="ontabtap">
					<text class="uni-tab-item-title" :class="tabIndex==2 ? 'uni-tab-item-title-active' : ''">教练订单</text>
				</view>
			</view>
			<!-- 蓝色横线 -->
			<view class="scroll-view-indicator">
				<view ref="underline" class="scroll-view-underline" :class="isTap ? 'scroll-view-animation':''" :style="{left: indicatorLineLeft + 'px', width: indicatorLineWidth + 'px'}"></view>
			</view>
		</view>
		<view class="tab-bar-line"></view>
		<swiper class="tab-box" ref="swiper1" :current="tabIndex" :duration="300">
			<swiper-item class="swiper-item">
				<ticketOrderList class="page-item" nid="0" ref="page0"></ticketOrderList>
			</swiper-item>
			<swiper-item class="swiper-item">
				<activeOrderList class="page-item" nid="1" ref="page1"></activeOrderList>
			</swiper-item>
			<swiper-item class="swiper-item">
				<teacherOrderList class="page-item" nid="2" ref="page2"></teacherOrderList>
			</swiper-item>
		</swiper>
		<!-- 是否跳转登录提示弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="暂不登录" confirmText="立即登录" title="登录提示" content="您还未登录,请登录后操作" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getUserInfo,
		needLogin,
	} from '@/utils/auth';
	import ticketOrderList from '../ticket/orderList';
	import activeOrderList from '../active/orderList';
	import teacherOrderList from '../teacher/orderList';
	export default {
		components: {
			ticketOrderList,
			activeOrderList,
			teacherOrderList,
		},
		data() {
			return {
				tabList: [{
					name: '雪票订单',
					id: 0
				}, {
					name: '活动订单',
					id: 1
				}, {
					name: '教练订单',
					id: 2
				}],
				tabIndex: 0,
				indicatorLineLeft: 0,
				indicatorLineWidth: 0,
				isTap: false
			}
		},
		onReady() {},
		onLoad() {},
		onShow() {
			console.log("onShow")
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
			//未登录，跳转登录
			if (needLogin()) {
				if (getUserInfo() == undefined) {
					this.msgType = 'info'
					this.$refs.alertDialog.open()
					return;
				}
			}
			this.switchTab(this.tabIndex);
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.isTap = true;
				var currentSize = this.tabListSize[index];
				this.updateIndicator(currentSize.left, currentSize.width);
				this._touchTabIndex = index;
				this.switchTab(index);
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
				this.pageList[index].loadData();
			},
			refreshData() {
				// console.log('refreshData', this.tabIndex)
				let tmp = [{
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
			dialogClose() {
				console.log('点击关闭')
				uni.switchTab({
					url: '/pages/me/me'
				});
			},
			dialogConfirm() {
				console.log('点击确认')
				uni.navigateTo({
					url: '/pages/me/login-page'
				});
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