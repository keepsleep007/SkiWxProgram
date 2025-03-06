<template>
	<view class="list">
		<!-- 基于 uni-list 的页面布局 -->
		<uni-list class="uni-list--waterfall">
			<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
			<uni-list-item :border="false" class="uni-list-item--waterfall" title="" v-for="item in article_data" :key="item.id" :to="'/pages/article/articleInfo?id='+item.id">
				<!-- 通过header插槽定义列表左侧图片 -->
				<template v-slot:header>
					<view class="uni-thumb shop-picture shop-picture-column">
						<image :src="getBaseUrl()+item.coverImage" mode="aspectFill"></image>
					</view>
				</template>
				<!-- 通过body插槽定义商品布局 -->
				<template v-slot:body>
					<view class="shop">
						<view>
							<view class="uni-title">
								<text class="uni-ellipsis-2">{{ item.articleTitle }}</text>
							</view>
						</view>
						<view>
							<view class="shop-price">
								<text class="uni-tag hot-tag">吃喝玩乐</text>
							</view>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
		<uni-load-more iconType="auto" :status="status" />
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				//分页参数
				pageNum: 1,
				pageSize: 10,
				total: 0,
				status: 'more',
				article_data: [],
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				//没有更多数据，不再继续查询
				if (this.status === 'noMore') {
					console.log('noMore')
					return;
				}
				this.status = 'loading';
				let requestParam = {};
				requestParam.articleClass = "1";
				requestParam.pageNum = this.pageNum;
				requestParam.pageSize = this.pageSize;
				// console.log("requestParam", requestParam)
				this.request('/app_api/article/getArticleList', requestParam, 'GET').then(res => {
					if (res) {
						// console.log("getArticleList", res)
						if (res.code == 200) {
							// 数据
							res.data[0].forEach(item => {
								this.article_data.push(item);
							})
							//总条数
							this.total = res.data[1];
							//判断当前加载的数据量是否少于数据的总量，如果少，则还有下一页
							if (this.article_data.length < this.total) {
								this.pageNum = this.pageNum + 1;
								this.status = 'more';
							} else {
								this.status = 'noMore';
							}
						}
					}
				});
			},
		},
		/**
		 * 下拉刷新回调函数
		 */
		onPullDownRefresh() {
			console.log("onPullDownRefresh")
			//清除数据
			this.active_data = [];
			//重置分页数据
			this.pageNum = 1;
			this.pageSize = 10;
			this.status = 'more';
			// 加载数据
			this.loadData();
			uni.stopPullDownRefresh();
		},
		/**
		 * 上拉加载回调函数
		 */
		onReachBottom() {
			console.log("onReachBottom")
			this.loadData();
		},
	};
</script>

<style lang="scss">
	@import '@/common/uni-ui.scss';

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	.tips {
		color: #67c23a;
		font-size: 14px;
		line-height: 40px;
		text-align: center;
		background-color: #f0f9eb;
		height: 0;
		opacity: 0;
		transform: translateY(-100%);
		transition: all 0.3s;
	}

	.tips-ani {
		transform: translateY(0);
		height: 40px;
		opacity: 1;
	}

	.shop {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.shop-picture {
		width: 110px;
		height: 110px;
	}

	.shop-picture-column {
		width: 100%;
		height: 170px;
		margin-bottom: 10px;
	}

	.shop-price {
		margin-top: 5px;
		font-size: 12px;
		color: #ff5a5f;
	}

	.shop-price-text {
		font-size: 16px;
		margin-right: 5px;
	}

	.hot-tag {
		background: #ff5a5f;
		border: none;
		color: #fff;
	}

	.area-tag {
		background: #4e95ff;
		border: none;
		color: #fff;
	}

	.button-box {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		background: #007AFF;
		color: #fff;
	}

	.uni-link {
		flex-shrink: 0;
	}

	.ellipsis {
		display: flex;
		overflow: hidden;
	}

	.uni-ellipsis-1 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uni-ellipsis-2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}


	// 默认加入 scoped ，所以外面加一层提升权重
	.list {
		.uni-list--waterfall {

			/* #ifndef H5 || APP-VUE */
			// 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
			::v-deep .uni-list {
				/* #endif */
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 5px;
				box-sizing: border-box;

				/* #ifdef H5 || APP-VUE */
				// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
				::v-deep

				/* #endif */
				.uni-list-item--waterfall {
					width: 50%;
					box-sizing: border-box;

					.uni-list-item__container {
						display: flex;
						padding: 5px;
						flex-direction: column;
					}

				}

				/* #ifndef H5 || APP-VUE */
			}

			/* #endif */
		}
	}
</style>