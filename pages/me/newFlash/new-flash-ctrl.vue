<template>
	<view class="page-news">
		<scroll-view class="scroll-container" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered" :scroll-into-view="scrollIntoViewId" :refresher-threshold="100" refresher-background="#efeff4"
			@scrolltolower="loadMore()" @scroll="handleScroll" @refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">
			<!-- 顶部标记，用于列表回到顶部 -->
			<view id="top"></view>
			<uni-list class="uni-list">
				<uni-list-item :border="false" class="uni-list-item" title=" " v-for="newsFlashItem in dataList" :key="newsFlashItem.id">
					<template v-slot:body>
						<view class="media-item">
							<view class="item-view">
								<text class="info-text" v-if="newsFlashItem.messageText !== null">{{ newsFlashItem.messageText }}</text>
								<text class="info-text" v-else></text>
							</view>
							<view class="item-view">
								<text class="bottom-text">发布时间：{{newsFlashItem.createTime}}</text>
							</view>
							<view class="btn-item-view">
								<view>上架状态：</view>
								<switch style="transform:scale(0.9)" :checked="newsFlashItem.status==1?true:false" @change="statusChange(newsFlashItem)" />
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<view class="loading-more" v-if="isLoading">
				<text class="loading-more-text">{{loadingText}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		components: {},
		data() {
			return {
				dataList: [],
				isLoading: false,
				loadingText: '加载中...',
				scrollIntoViewId: '', // 滚动到的目标元素 ID
				triggered: false,
				notice: '',
			}
		},
		created() {
			this.total = 0;
			this.requestParams = {
				pageNum: 1,
				pageSize: 10,
			};
			this._isWidescreen = false;
			var mediaQueryOb = uni.createMediaQueryObserver(this)
			mediaQueryOb.observe({
				minWidth: 768
			}, matches => {
				this._isWidescreen = matches;
			})
			this.getNotice()
		},
		provide() {
			return {
				loadData: this.loadData
			};
		},
		onLoad(options) {
			this.loadData()
		},
		methods: {
			async loadData(flag, params) {
				// console.log(flag)
				// console.log(params)
				//下拉加载更多
				if (flag == "loadMore") {
					this.requestParams.pageNum = this.requestParams.pageNum + 1;
				}
				//条件筛选
				if (flag == "loadParams") {
					this.requestParams.pageNum = 1;
				}
				//下拉刷新
				if (flag == 'refresh') {
					this.requestParams.pageNum = 1;
				}
				this.requestParams.time = new Date().getTime() + '';
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.isNoData = false;
				var startTime = new Date();
				// console.log("requestParams:", this.requestParams)
				await this.request('/app_api/newsFlash/loadNewsFlash', this.requestParams, 'GET').then(res => {
					console.log("loadNewsFlash:", res)
					if (res) {
						if (flag == "loadMore") {
							this.dataList = this.dataList.concat(res.data[0]);
						} else {
							//下拉刷新的收不能使用回到顶部，如果使用，这里会和下拉刷新后的回弹一起生效，导致页面回弹过多
							if (flag != 'refresh') {
								//设置列表回到顶部
								this.scrollIntoViewId = 'top'; // 设置目标元素 ID 为 "top"
								this.$nextTick(() => {
									this.scrollIntoViewId = ''; // 确保滚动位置立即更新
								});
							}
							//数据
							this.dataList = res.data[0];
							//总条数
							this.total = res.data[1];
						}
						this.isLoading = false;
					}
				});
			},
			async statusChange(newsFlashItem) {
				// console.log("statusChange", newsFlashItem)
				let params = {}
				params.id = newsFlashItem.id
				if (newsFlashItem.status == 1) {
					params.status = '0'
				}
				if (newsFlashItem.status == 0) {
					params.status = '1'
				}
				await this.request('/app_api/newsFlash/statusChange', params, 'GET').then(res => {
					// console.log("statusChange:", res)
					if (res.data == 1) {
						newsFlashItem.status = params.status
					}
				});
			},
			loadMore(e) {
				if (this.dataList.length < this.total) {
					this.loadData("loadMore");
				}
			},
			getNotice() {
				this.request('/app_api/newsFlash/getNotice', '', 'GET').then(res => {
					console.log("getNotice:", res)
					if (res) {
						this.notice = res.msg
					}
				});
			},
			handleScroll(e) {},
			onPulling(e) {},
			async onRefresh() {
				if (this._freshing) {
					return;
				}
				this._freshing = true;
				this.triggered = true;
				await this.loadData('refresh');
				this.triggered = false;
				this._freshing = false;
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			onAbort() {}
		}
	}
</script>

<style scoped>
	.page-news {
		position: relative;
		/* 确保子元素可以相对定位 */
		background-color: #efeff4;
	}


	.scroll-container {
		height: calc(100vh);
		/* 减去 filterBar 的高度 */
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		/* 优化滚动性能 */
	}

	.uni-list-item {
		border-bottom: 1px solid #ebebeb;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
	}

	.item-view {
		margin-bottom: 2px;
	}

	.info-title {
		font-size: 14px;
		font-weight: bold;
	}

	.info-text {
		font-size: 14px;
	}

	.bottom-text {
		color: #999999;
		font-size: 12px;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}

	.btn-item-view {
		display: flex;
		flex-wrap: nowrap;
		/* 确保子视图不换行 */
		align-items: center;
		/* 垂直居中 */
		justify-content: flex-end;
	}
</style>