<template>
	<view>
		<scroll-view scroll-y="true">
			<template v-for="(card,dataIndex) in sourceData">
				<uni-card :key="dataIndex" :title=card.label extra=" " v-if="card.children!=undefined">
					<view v-for="(children, index) in card.children" :key="index" class="card" @click="toTicketListPage(children.id)">
						<!-- 图片 -->
						<image class="card-image" :src="getBaseUrl()+children.logoImage" mode="aspectFit"></image>
						<!-- 右边内容 -->
						<view class="card-right">
							<!-- 标题 -->
							<view class="card-title">{{ children.label }}</view>
							<!-- 简介 -->
							<view class="card-description">{{ children.description }}</view>
						</view>
					</view>
				</uni-card>
			</template>
		</scroll-view>
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
				sourceData: [],
			};
		},
		async onLoad() {
			// 加载教练数据
			await this.getTeacherList();
		},
		onShow() {},
		methods: {
			async getTeacherList() {
				let requestParam = {};
				await this.request('/app_api/ticket/ticketSnowField', requestParam, 'GET').then(res => {
					console.log("ticketSnowField:", res)
					if (res) {
						if (res.code == 200) {
							this.sourceData = this.handleTree(res.data, "id", "pid")
						}
					}
				})
			},
			toTicketListPage(id) {
				uni.navigateTo({
					url: '/pages/ticket/ticketList?id=' + id
				});
			},
			handleTree(data, id, parentId, children) {
				let config = {
					id: id || 'id',
					parentId: parentId || 'parentId',
					childrenList: children || 'children'
				};

				var childrenListMap = {};
				var nodeIds = {};
				var tree = [];

				for (let d of data) {
					let parentId = d[config.parentId];
					if (childrenListMap[parentId] == null) {
						childrenListMap[parentId] = [];
					}
					nodeIds[d[config.id]] = d;
					childrenListMap[parentId].push(d);
				}

				for (let d of data) {
					let parentId = d[config.parentId];
					if (nodeIds[parentId] == null) {
						tree.push(d);
					}
				}

				for (let t of tree) {
					adaptToChildrenList(t);
				}

				function adaptToChildrenList(o) {
					if (childrenListMap[o[config.id]] !== null) {
						o[config.childrenList] = childrenListMap[o[config.id]];
					}
					if (o[config.childrenList]) {
						for (let c of o[config.childrenList]) {
							adaptToChildrenList(c);
						}
					}
				}
				return tree;
			},
		},
	};
</script>

<style lang='scss'>
	page {
		background-color: #efeff4;
	}

	.card {
		display: flex;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow:
			2px 2px 4px rgba(0, 0, 0, 0.1),
			-2px -2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		width: 100px;
		/* 根据需要调整宽度 */
		height: 100px;
		/* 根据需要调整高度 */
		margin-right: 10px;
		/* 图片与右边内容的间距 */
		border-radius: 10px;
	}

	.card-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* 垂直方向上的间距分布 */
		height: 100px;
		/* 与图片高度相同，确保布局整齐 */
		padding: 5px;
	}

	.card-title {
		font-size: 17px;
		/* font-weight: bold; */
		color: #000000;
	}

	.card-description {
		font-size: 14px;
		color: #555;
	}

	.uni-card__header-content-title {
		font-size: 17px !important;
		color: #000000 !important;
	}
</style>