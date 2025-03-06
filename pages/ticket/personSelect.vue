<template>
	<view class="container">
		<view class="order-info">
			<checkbox-group @change="checkboxChange" style="width: 100%;">
				<template v-for="(person, index) in persons">
					<view class="person-view">
						<checkbox class="check-box-c" :value="person.id" :checked="person.checkFlag" />
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
			</checkbox-group>
			<view class="person-view">
				<view class="person-add-view" @click="toPersonAddPage">
					<text class="person-add">+ 新增人员信息</text>
				</view>
			</view>
		</view>
		<button class="button" type="primary" @click="sub">确定</button>
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
			}
		},
		onLoad(options) {
			console.log('onLoad', options)
			//订单页面传来的 选择的人员id
			this.orderSelect = options.id
			//订单页面传来的购买数量，此页面要控制选择的人不能大于购买的数量
			this.number = options.number
		},
		//每次页面显示，都执行
		onShow() {
			console.log('onShow')
			//从后台查询用户信息列表
			this.getUserContacts();
		},
		methods: {
			checkboxChange(e) {
				console.log('checkboxChange', e)
				this.persons.forEach(person => {
					//每个的选中状态都设置为false，然后根据选中的id列表，再逐个设置未true。否则会出现删除失效问题
					person.checkFlag = false
					e.detail.value.forEach(selectId => {
						if (selectId === person.id) {
							person.checkFlag = true
						}
					})
					//页面勾选发生变化后同步修改 orderSelect中的数据，在从人员新增页面返回本页面时要重新查询所有用户信息，并重新勾选，需要依赖此数据
					this.orderSelect = e.detail.value.join(',')
				})
			},
			toPersonAddPage(product) {
				uni.navigateTo({
					url: '/pages/ticket/personAdd'
				});
			},
			toPersonEdit(id) {
				uni.navigateTo({
					url: '/pages/ticket/personAdd?id=' + id
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
			//将数据保存到缓存，订单页面从缓存中获取选择的用户数据
			sub() {
				let selectedPersons = [];
				this.persons.forEach(person => {
					if (person.checkFlag) {
						selectedPersons.push(person)
					}
				})
				//判断选择人数是否大于购票数量
				if (selectedPersons.length > this.number) {
					uni.showToast({
						title: '购票数量为：' + this.number + '，选择人数不能大于购票数量',
						icon: 'none',
						duration: 2000
					});
					return
				}
				// 将数据保存到本地存储
				uni.setStorageSync('selectedPersons', selectedPersons);
				// 返回上一个页面
				uni.navigateBack();
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

	.check-box-c {
		margin-top: 15px;
		margin-left: 10px;
	}

	// .radio::before,
	// checkbox::before {
	// 	margin-top: -18px !important
	// }
</style>