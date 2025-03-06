<template>
	<view class="page-news">
		<filterBar />
		<scroll-view class="scroll-container" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered" :scroll-into-view="scrollIntoViewId" :refresher-threshold="100" refresher-background="#efeff4" @scrolltolower="loadMore()" @scroll="handleScroll" @refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">
			<!-- 顶部标记，用于列表回到顶部 -->
			<view id="top"></view>
			<uni-list class="uni-list">
				<uni-list-item :border="false" class="uni-list-item" title=" " v-for="carItem in dataList" :key="carItem.id" :to="'/pages/me/myRelease/r-car-page-info?id='+carItem.id">
					<template v-slot:body>
						<view class="media-item">
							<view class="title-view">
								<u-avatar class="avatraImg" :src="carItem.avatar!=null?getBaseUrl()+carItem.avatar:'/static/img/login/defaultAvatar.png'" size="40"></u-avatar>
								<text class="info-text nickName">{{carItem.createBy}}</text>
								<text class="info-text type-tag" style="background-color: #f0f9eb; color:#67c23a; border: 1px solid #67c23a;" v-if="carItem.type==1">车找人</text>
								<text class="info-text type-tag" style="background-color: #ecf5ff; color:#409eff; border: 1px solid #409eff;" v-if="carItem.type==2">人找车</text>
							</view>
							<view class="item-view">
								<text class="info-text price-text">￥：{{carItem.price}}</text>
								<text class="info-title">可拼：</text>
								<text class="info-text">{{carItem.personNum}}人，</text>
								<text class="info-text">{{carItem.boardNum}} 雪板，</text>
								<text class="info-text">{{carItem.packageNum}} 板包</text>
							</view>
							<view class="item-view">
								<text class="info-title">出发：</text>
								<text class="info-text">{{carItem.goArea}}，{{carItem.goPlace}}</text>
							</view>
							<view class="item-view">
								<text class="info-title">到达：</text>
								<text class="info-text">{{carItem.endPlace}}</text>
							</view>
							<view class="item-view">
								<text class="info-title">详情：</text>
								<text class="info-text" v-if="carItem.remark !== null">{{ carItem.remark }}</text>
								<text class="info-text" v-else></text>
							</view>
							<view class="item-view">
								<text class="info-title">出发时间：</text>
								<text class="info-text">{{carItem.goTime}}</text>
							</view>
							<view class="item-view">
								<text class="bottom-text">发布时间：{{carItem.createTime}}</text>
								<!-- <text class="info-text edit-btn" style="background-color: #ecf5ff; color:#409eff; border: 1px solid #409eff;">111</text> -->
								<!-- <text class="info-text del-btn" style="background-color: #ecf5ff; color:#409eff; border: 1px solid #409eff;">删除</text> -->
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
	import filterBar from './r-car-page_filter_bar';
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
				isLoading: false,
				snowField: [],
				loadingText: '加载中...',
				scrollIntoViewId: '', // 滚动到的目标元素 ID
				triggered: false,
			}
		},
		created() {
			this.total = 0;
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
			})
			// #endif
			this.getAreaData();
		},
		provide() {
			return {
				loadData: this.loadData
			};
		},
		onLoad(options) {},
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
					if (params[0].value === "null") {
						this.requestParams.goArea = '';
					} else {
						this.requestParams.goArea = params[0].value;
					}
					if (params[1].value === "null") {
						this.requestParams.type = '';
					} else {
						this.requestParams.type = params[1].value;
					}
					if (params[2].value === "null") {
						this.requestParams.goType = '';
					} else {
						this.requestParams.goType = params[2].value;
					}
					if (params[3].value === "null") {
						this.requestParams.goTime = '';
					} else {
						this.requestParams.goTime = params[3].value;
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
				console.log("requestParams:", this.requestParams)
				await this.request('/app_api/carPool/loadCarPool', this.requestParams, 'GET').then(res => {
					console.log("loadCarPool:", res)
					if (res) {
						if (flag == "loadMore") {
							this.codeToName(res.data[0]);
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
							this.codeToName(res.data[0]);
							this.dataList = res.data[0];
							//总条数
							this.total = res.data[1];
						}
						this.isLoading = false;
						// console.log("loadCarPool", this.dataList)
					}
				});
			},
			delBtn() {
				//提示是否确定删除
				//调用后台删除
				let requestParam = {};
				requestParam.id = this.id;
				this.request('/app_api/carPool/delCarPoolInfo', requestParam, 'GET').then(res => {
					if (res) {
						console.log("delCarPoolInfo", res)
						if (res.code == 200) {
							uni.showToast({
								title: '删除成功',
								icon: 'success',
								duration: 2000
							});
							//修改this.total 总条数，
							//从页面删除数据
						}
					}
				});
			},
			loadMore(e) {
				if (this.dataList.length < this.total) {
					this.loadData("loadMore");
				}
			},
			getAreaData() {
				this.request('/app_api/carPool/loadAreaData').then(res => {
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['text'] = res.data[i].name;
							tmp[i]['value'] = res.data[i].id;
						}
						this.snowField = tmp;
					}
				});
			},
			codeToName(value) {
				for (let r in value) {
					let tmp_a
					for (let u in this.snowField) {
						if (this.snowField[u].value == value[r].goArea) {
							tmp_a = this.snowField[u].text
							break;
						}
					}
					value[r].goArea = tmp_a
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

	.edit-btn {
		margin-left: 130px;
		/* 设置圆角的半径 */
		border-radius: 5px;
		/* 添加内边距 */
		padding: 3px;
	}

	.del-btn {
		margin-left: 10px;
		/* 设置圆角的半径 */
		border-radius: 5px;
		/* 添加内边距 */
		padding: 3px;
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