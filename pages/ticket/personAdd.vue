<template>
	<view class="container">
		<view class="order-info">
			<!-- 姓名 -->
			<view class="person-info-item">
				<view class="person-info-label">
					<text>姓名</text>
				</view>
				<view class="person-input-wrapper">
					<uni-easyinput placeholder="请输入姓名" v-model="person.name" />
				</view>
			</view>
			<!-- 手机 -->
			<view class="person-info-item">
				<view class="person-info-label">
					<text>手机</text>
				</view>
				<view class="person-input-wrapper">
					<uni-easyinput placeholder="请输入手机" v-model="person.phone" type="number" />
				</view>
			</view>
			<!-- 身份证 -->
			<view class="person-info-item">
				<view class="person-info-label">
					<text>身份证</text>
				</view>
				<view class="person-input-wrapper">
					<uni-easyinput placeholder="请输入身份证" v-model="person.idcard" type="idcard" />
				</view>
			</view>
		</view>
		<button v-if="addBtn" class="button" type="primary" @click="savePersonInfo">保存信息</button>
		<button v-if="updateBtn" class="button" type="primary" @click="updatePersonInfo(person.id)">更新信息</button>
	</view>
</template>

<script>
	import {
		getToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				addBtn: false,
				updateBtn: false,
				person: {
					name: '',
					phone: '',
					idcard: ''
				}
			}
		},
		onLoad(options) {
			console.log('options', options)
			//如果有id则从后台查出当前联系人的详细信息，没有值就是新增联系人
			if (options.id != null) {
				this.getUserInfo(options.id);
			} else {
				this.addBtn = true;
			}
		},
		methods: {
			//提交订单
			savePersonInfo(ref) {
				// 在保存之前进行校验
				if (this.validatePersonInfo()) {
					let requestParam = {};
					requestParam.skiAppUserId = getToken();
					requestParam.userName = this.person.name;
					requestParam.userPhone = this.person.phone;
					requestParam.userIdcard = this.person.idcard;
					this.request('/app_api/userContacts/addUserContacts', requestParam, 'POST').then(res => {
						console.log("addUserContacts:", res)
						if (res) {
							if (res.code == 200) {
								this.addBtn = false;
								uni.showToast({
									title: '新增成功', // 或者您想要显示的其他信息
									icon: 'success', // 可以选择 'success', 'none', 'loading', 'error' 等
									duration: 3000 // 显示3秒（3000毫秒）
								});
							}
							if (res.code == 500) {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 3000
								});
							}
						}
					});
				}
			},
			getUserInfo(id) {
				let requestParam = {};
				requestParam.skiAppUserId = getToken();
				requestParam.id = id;
				this.request('/app_api/userContacts/getUserInfoApp', requestParam, 'GET').then(res => {
					console.log(" getUserInfoApp", res);
					if (res) {
						if (res.code == 200) {
							this.person.id = res.data.id;
							this.person.name = res.data.userName;
							this.person.phone = res.data.userPhone;
							this.person.idcard = res.data.userIdcard;
							this.updateBtn = true;
						}
					}
				});
			},
			updatePersonInfo(id) {
				// 在保存之前进行校验
				if (this.validatePersonInfo()) {
					let requestParam = {};
					requestParam.id = id;
					requestParam.userName = this.person.name;
					requestParam.userPhone = this.person.phone;
					requestParam.userIdcard = this.person.idcard;
					this.request('/app_api/userContacts/updateUserInfoApp', requestParam, 'POST').then(res => {
						console.log("updateUserInfoApp:", res)
						if (res) {
							if (res.code == 200) {
								this.updateBtn = false;
								uni.showToast({
									title: '更新成功', // 或者您想要显示的其他信息
									icon: 'success', // 可以选择 'success', 'none', 'loading', 'error' 等
									duration: 3000 // 显示3秒（3000毫秒）
								});
							}
						}
					});
				}
			},
			validatePersonInfo() {
				// 校验姓名
				if (!this.person.name) {
					uni.showToast({
						title: '姓名不能为空',
						icon: 'none'
					});
					return false;
				}
				// 校验手机
				const phoneRegex = /^1[3-9]\d{9}$/; // 简单的数字校验
				if (!this.person.phone || !phoneRegex.test(this.person.phone)) {
					uni.showToast({
						title: '请输入有效的手机号码',
						icon: 'none'
					});
					return false;
				}
				// 校验身份证（简单的非空校验，如果需要更复杂的校验，可以添加额外的逻辑）
				// 注意：这里只是检查是否为空和长度是否符合基本要求（15位或18位）
				const idcardRegex = /^(\d{15}|\d{17}[\dX])$/;
				if (!this.person.idcard || !idcardRegex.test(this.person.idcard)) {
					uni.showToast({
						title: '请输入有效的身份证号码',
						icon: 'none'
					});
					return false;
				}
				// 如果所有校验都通过，返回 true
				return true;
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

	.person-info-item {
		display: flex;
		margin-bottom: 10px;
		width: 100%;
		align-items: center;
	}

	.person-info-label {
		width: 20%; // 根据需要调整标题的宽度
		padding-right: 10px; // 可选：为标题和输入框之间添加一些间距
	}

	.person-input-wrapper {
		width: 80%; // 根据需要调整输入框的宽度，确保总和接近或等于100%
	}

	.person-input {
		padding: 5px;
		border-radius: 5px;
		box-sizing: border-box;
		// 边框样式可以根据需要添加
	}
</style>