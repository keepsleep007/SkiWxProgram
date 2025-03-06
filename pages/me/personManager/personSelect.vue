<template>
	<view class="container">
		<view class="order-info">
			<template v-for="(person, index) in persons">
				<view class="person-view">
					<view class="person-info">
						<text class="person-name">姓名：{{person.userName}}</text>
						<text class="person-phone">手机：{{person.userPhone}}</text>
						<text class="person-idcard">身份证：{{person.userIdcard}}</text>
					</view>
					<view class="edit-icon" @click="toPersonEdit(person.id)">
						<u-icon name="edit-pen-fill" size="25" color="#757575"></u-icon>
					</view>
					<view class="del-icon" @click="delUserInfo(person.id)">
						<u-icon name="trash-fill" size="25" color="#757575"></u-icon>
					</view>
				</view>
			</template>
			<view class="person-view">
				<view class="person-add-view" @click="toPersonAddPage">
					<text class="person-add">+ 新增人员信息</text>
				</view>
			</view>
		</view>
		<!-- 删除联系人提示弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="返回" confirmText="确定" title="提醒" content="确定删除联系人？" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				// 购买数量;
				number: 1,
				//从后台查出来的所有用户信息
				persons: {},
				//订单页面传来的 选择的人员id
				orderSelect: '',
				//打开删除弹窗时，临时保存要删除数据的id
				delId: '',
			}
		},
		onLoad(options) {},
		//每次页面显示，都执行
		onShow() {
			console.log('onShow')
			//从后台查询用户信息列表
			this.getUserContacts();
		},
		methods: {
			toPersonAddPage(product) {
				uni.navigateTo({
					url: '/pages/me/personManager/personAdd'
				});
			},
			toPersonEdit(id) {
				uni.navigateTo({
					url: '/pages/me/personManager/personAdd?id=' + id
				});
			},
			getUserContacts() {
				let requestParam = {};
				requestParam.skiAppUserId = getToken();
				this.request('/app_api/userContacts/getUserContacts', requestParam, 'GET').then(res => {
					console.log(" getUserContacts", res);
					if (res) {
						if (res.code == 200) {
							res.data.forEach(item => {
								if (this.orderSelect.includes(item.id)) {
									item.checkFlag = true
								}
							})
							this.persons = res.data;
						}
					}
				});
			},
			delUserInfo(id) {
				this.delId = id;
				this.msgType = 'info'
				this.$refs.alertDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogConfirm() {
				console.log('点击确认')
				let requestParam = {};
				requestParam.id = this.delId;
				this.request('/app_api/userContacts/delUserInfoApp', requestParam, 'POST').then(res => {
					if (res) {
						console.log("delUserInfoApp", res)
						if (res.code == 200) {
							//删除成功后重新查询所有联系人信息，实现刷新页面
							this.getUserContacts();
							uni.showToast({
								title: '删除成功',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #efeff4;
	}

	.container {
		margin: 10px;
	}

	.order-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px;
		box-sizing: border-box;
		background: #fff;
		margin-bottom: 10px;
		border-radius: 10px;
	}

	.person-view {
		display: flex;
		margin-bottom: 10px;
		width: 100%;
		align-items: center;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
	}

	.edit-icon {
		margin-left: auto;
	}

	.del-icon {
		margin-left: 20px;
	}

	/* .person-add-view 的样式 */
	.person-add-view {
		display: flex;
		/* 使其成为弹性容器，用于居中内部元素 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中，但这里需要.person-view有定义的高度 */
		width: 100%;
		/* 与父容器同宽 */
	}

	/* .person-add 的样式 */
	.person-add {
		border: 2px dashed $base-color;
		/* 虚线边框 */
		padding: 10px 20px;
		/* 内边距 */
		border-radius: 10px;
		/* 圆角边框 */
		background-color: #efeff4;
		/* 背景颜色 */
		width: 100%;
		text-align: center;
		/* 文本水平居中 */
		color: $base-color;
	}
</style>