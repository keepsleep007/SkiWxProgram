<template>
	<view class="page-news">
		<filterBar />
		<scroll-view class="scroll-container" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered" :scroll-into-view="scrollIntoViewId" :refresher-threshold="100" refresher-background="#efeff4" @scrolltolower="loadMore()" @scroll="handleScroll" @refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">
			<!-- 顶部标记，用于列表回到顶部 -->
			<view id="top"></view>
			<uni-list class="uni-list">
				<uni-list-item :border="false" class="uni-list-item" title=" " v-for="roomItem in dataList" :key="roomItem.id" :to="'/pages/me/myRelease/r-room-page-info?id='+roomItem.id">
					<template v-slot:body>
						<view class="media-item">
							<view class="title-view">
								<u-avatar class="avatraImg" :src="roomItem.avatar!=null?getBaseUrl()+roomItem.avatar:'/static/img/login/defaultAvatar.png'" size="40"></u-avatar>
								<text class="info-text nickName">{{roomItem.createBy}}</text>
								<text class="info-text type-tag " style="background-color: #f0f9eb; color:#67c23a; border: 1px solid #67c23a;" v-if="roomItem.type==1">房找人</text>
								<text class="info-text type-tag" style="background-color: #ecf5ff; color:#409eff; border: 1px solid #409eff;" v-if="roomItem.type==2">人找房</text>
							</view>
							<view class="item-view">
								<text class="info-text price-text">￥：{{roomItem.price}}</text>
								<span class="info-title">本人性别：</span>
								<span v-if="roomItem.iSex == 0">男</span>
								<span v-if="roomItem.iSex == 1">女</span>
								<span class="info-title" style="margin-left: 10px;">要求性别：</span>
								<span v-if="roomItem.ySex == 0">男</span>
								<span v-if="roomItem.ySex == 1">女</span>
								<span v-if="roomItem.ySex == 2">不限</span>
								</text>
							</view>
							<view class="item-view">
								<template v-for="(item, index) in areaData">
									<template v-if="roomItem.region.includes(item.id)">
										<text class="info-title" :key="index">拼房地区：</text>
										<text class="info-text">{{item.name}}</text>
									</template>
								</template>
							</view>
							<view class="item-view">
								<template v-for="(item, index) in roomType">
									<template v-if="roomItem.roomType.includes(item.dictValue)">
										<text class="info-title" :key="index">房型：</text>
										<text class="info-text">{{item.dictLabel}}</text>
									</template>
								</template>
							</view>
							<view class="item-view">
								<text class="info-title">详情：</text>
								<text class="info-text" v-if="roomItem.remark !== null">{{ roomItem.remark }}</text>
								<text class="info-text" v-else></text>
							</view>
							<view class="item-view">
								<text class="info-title">入住时间：</text>
								<text class="info-text">{{roomItem.inTime}} ~ {{roomItem.outTime}}</text>
							</view>
							<view class="item-view">
								<text class="bottom-text">发布时间：{{roomItem.createTime}}</text>
							</view>
							<view class="media-item-line" style="position: absolute;"></view>
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
	import filterBar from './r-room-page_filter_bar';
	import {
		getToken
	} from '@/utils/auth';
	export default {
		components: {
			filterBar
		},
		data() {
			return {
				dataList: [],
				roomType: [],
				areaData: [],
				isLoading: false,
				loadingText: '加载中...',
				scrollIntoViewId: '', // 滚动到的目标元素 ID
				triggered: false
			}
		},
		created() {
			this.total = 0;
			this.pullTimer = null;
			this.requestParams = {
				pageNum: 1,
				pageSize: 10,
			};
			this._isWidescreen = false;
			// #ifdef H5
			var mediaQueryOb = uni.createMediaQueryObserver(this)
			mediaQueryOb.observe({
				minWidth: 768
			}, matches => {
				this._isWidescreen = matches;
			});
			// #endif
			// 加载房型数据
			this.request('/app_api/roomPool/load_roomType', '', 'GET').then(res => {
				if (res) {
					this.roomType = res.data;
					// console.log('load_roomType', this.roomType);
				}
			});
			//加载拼房地区数据
			this.request('/app_api/roomPool/loadRoomAreaData', '', 'GET').then(res => {
				if (res) {
					this.areaData = res.data;
					// console.log('loadRoomAreaData', this.areaData);
				}
			});
		},
		provide() {
			return {
				loadData: this.loadData
			};
		},
		methods: {
			loadData(flag, params) {
				// console.log(flag)
				// console.log(params)
				//下拉加载更多
				if (flag == "loadMore") {
					this.requestParams.pageNum = this.requestParams.pageNum + 1;
				}
				//条件筛选
				if (flag == "loadParams") {
					this.requestParams.pageNum = 1;
					if (params[0].value === "null") {
						this.requestParams.region = '';
					} else {
						this.requestParams.region = params[0].value;
					}
					if (params[1].value === "null") {
						this.requestParams.type = '';
					} else {
						this.requestParams.type = params[1].value;
					}
					if (params[2].value === "null") {
						this.requestParams.inTime = '';
					} else {
						this.requestParams.inTime = params[2].value;
					}
					if (params[3].value === "null") {
						this.requestParams.iSex = '';
					} else {
						this.requestParams.iSex = params[3].value;
					}
				}
				//下拉刷新
				if (flag == 'refresh') {
					this.requestParams.pageNum = 1;
				}
				//从【我的】进入
				if (flag == 'my') {
					// 设置token，只查自己创建的数据
					this.requestParams.createBy = getToken();
				}
				this.requestParams.time = new Date().getTime() + '';
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.isNoData = false;
				var startTime = new Date();
				console.log("loadRoomPoolrequestParams:", this.requestParams)
				this.request('/app_api/roomPool/loadRoomPool', this.requestParams, 'GET').then(res => {
					console.log("loadRoomPool:", res.data);
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
			loadMore(e) {
				if (this.dataList.length < this.total) {
					this.loadData("loadMore");
				}
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

	.overlay-text {
		position: absolute;
		/* 绝对定位，使其可以覆盖在其他元素之上 */
		top: 50px;
		/* 根据需要调整位置，这里假设 filterBar 的高度为 50px */
		left: 0;
		right: 0;
		text-align: center;
		/* 居中显示 */
	}

	.scroll-container {
		height: calc(100vh - 78px);
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

	.title-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 5px;
	}

	.avatraImg {
		margin-right: 10px;
	}

	.nickName {
		text-align: center;
		/* 文字水平居中 */
		line-height: normal;
		/* 行高设置为正常，或者根据需要设置一个具体的值 */
		margin-left: 10px;
		color: #999999;
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

	.price-text {
		font-weight: bold;
		color: #ff5a5f;
		margin-right: 10px;
	}

	.bottom-text {
		color: #999999;
		font-size: 12px;
	}

	.type-tag {
		margin-left: auto;
		/* 设置圆角的半径 */
		border-radius: 5px;
		/* 添加内边距 */
		padding: 3px;
		/* 设置文本颜色 */
		color: #000000;
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
</style>