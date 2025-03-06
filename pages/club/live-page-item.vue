<template>
	<view class="media-item view" @click="click">
		<view class="view" style="position: relative;">
			<u-avatar :src="this.getBaseUrl()+liveItem.avatar" size="30" style="display: inline-block;"></u-avatar>
			<text class="info-text" style="position: absolute;top: 50%; transform: translate(50%,-50%);">{{liveItem.nickname}}</text>
			<text class="info-text info-text-type " style="background-color: #f0f9eb; color:#67c23a; border: 1px solid #67c23a;" v-if="liveItem.type==1">
				车找人
			</text>
			<text class="info-text info-text-type" style="background-color: #ecf5ff; color:#409eff; border: 1px solid #409eff;" v-if="liveItem.type==2">
				人找车
			</text>
		</view>

		<view class="view">
			<text class="media-title media-title-price">￥：{{liveItem.price}}</text>
			<text class="media-title">可拼 {{liveItem.personNum}} 人，</text>
			<text class="media-title">{{liveItem.boardNum}} 雪板，</text>
			<text class="media-title">{{liveItem.packageNum}} 板包</text>
		</view>

		<view class="view">
			<text class="media-title">出发：{{liveItem.goPlace}}</text>
		</view>
		<view class="view">
			<text class="media-title">到达：{{liveItem.endPlace}}</text>
		</view>
		<view class="view">
			<text class="media-title">备注：{{liveItem.remark}}</text>
		</view>

		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text">出发时间：{{liveItem.goTime}}</text>
				<text class="info-text">发布时间：{{liveItem.createTime}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
	</view>
</template>

<script>
	export default {
		props: {
			liveItem: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			click() {
				this.$emit('click');
			},
			close(e) {
				e.stopPropagation();
				this.$emit('close');
			}
		}
	}
</script>

<style scoped>
	.view {
		flex-direction: column;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.list-cell {
		padding: 0 15px;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
		padding: 10px 15px 10px 15px;
	}

	.media-item-line {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 0;
		height: 1px;
		background-color: #ebebeb;
	}

	.media-image-right {
		flex-direction: row;
	}

	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
		lines: 3;
		text-overflow: ellipsis;
		font-size: 12px;
		color: #555555;
	}

	.media-title-price {
		color: red;
		margin-right: 10px;
	}

	.media-title2 {
		flex: 1;
		margin-top: 3px;
		line-height: 20px;
	}

	.image-section {
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0;
		margin-left: 5px;
		width: 112px;
		height: 73px;
	}

	.image-section-left {
		margin-top: 0;
		margin-right: 5px;
		width: 112px;
		height: 73px;
	}

	.image-list1 {
		height: 240px;
	}

	.image-list2 {
		width: 112px;
		height: 73px;
	}

	.image-list3 {
		width: 112px;
		height: 73px;
	}

	.media-info {
		flex-direction: row;
		align-items: center;
	}

	.info-text {
		margin-right: 10px;
		color: #999999;
		font-size: 10px;
	}

	.info-text-type {
		float: right;
		/* 设置圆角的半径 */
		border-radius: 5px;
		/* 添加内边距 */
		padding: 5px;
		/* 设置文本颜色 */
		color: #000000;
	}

	.media-foot {
		margin-top: 2px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.close-view {
		position: relative;
		align-items: center;
		flex-direction: row;
		width: 20px;
		height: 15px;
		line-height: 15px;
		border-width: 1upx;
		border-style: solid;
		border-color: #aaaaaa;
		border-radius: 4px;
		justify-content: center;
		text-align: center;
	}

	.close-l {
		position: absolute;
		width: 9px;
		height: 1px;
		background-color: #aaaaaa;
	}

	.close-h {
		transform: rotate(45deg);
	}

	.close-v {
		transform: rotate(-45deg);
	}
</style>