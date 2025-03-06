<template>
	<view class="list">
		<!-- 基于 uni-list 的页面布局 -->
		<uni-list class="uni-list--waterfall">
			<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
			<uni-list-item :border="false" class="uni-list-item--waterfall" title="" v-for="item in active_data" :key="item.id" :to="'/pages/snowfield/fieldInfo?id='+item.id">
				<!-- 通过header插槽定义列表左侧图片 -->
				<template v-slot:header>
					<view class="uni-thumb shop-picture shop-picture-column">
						<image :src="getBaseUrl()+item.coverImage" mode="aspectFill"></image>
					</view>
				</template>
				<!-- 通过body插槽定义商品布局 -->
				<template v-slot:body>
					<view class="shop">
						<view class="uni-title">
							<text class="uni-ellipsis-2">【{{ item.areaName }}】{{item.label}}
							</text>
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
				pid: '',
				active_data: [],
			};
		},
		onLoad(option) {
			console.log("id", option.id); //打印出上个页面传递的参数。
			this.pid = option.id;
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
				requestParam.pageNum = this.pageNum;
				requestParam.pageSize = this.pageSize;
				requestParam.pid = this.pid;
				// console.log("requestParam", requestParam)
				this.request('/app_api/snowField/listField', requestParam, 'GET').then(res => {
					if (res) {
						// console.log("listField", res)
						if (res.code == 200) {
							// 数据
							res.data[0].forEach(item => {
								this.active_data.push(item);
							})
							//总条数
							this.total = res.data[1];
							//判断当前加载的数据量是否少于数据的总量，如果少，则还有下一页
							if (this.active_data.length < this.total) {
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
			background-color: #efeff4;

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
					width: 100%;
					box-sizing: border-box;
					margin: 10px;
					padding: 5px;
					border-radius: 10px;
					background-color: #fff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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