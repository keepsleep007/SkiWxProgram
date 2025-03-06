<template>
	<view>
		<view class="header">
			<view class="bg">
				<view class="box">
					<view class="box-hd">
						<view v-if="islogin" @click="toUserEdit">
							<view class="avator">
								<img :src="userinfo.avatar">
							</view>
							<view class="phone-number">昵称：{{userinfo.nickname || '未设置昵称'}}</view>
						</view>
						<view v-else @click="login">
							<view class="avator">
								<img :src="avatarUrl">
							</view>
							<view class="phone-number">点击登录</view>
						</view>
					</view>
					<view class="box-bd">
						<view class="item" @click="clickItem(5)">
							<u-icon class="icon" name="coupon-fill" size="25" color="#000000"></u-icon>
							<view class="text">雪票订单</view>
						</view>
						<view class="item" @click="clickItem(1)">
							<u-icon class="icon" name="bag-fill" size="25" color="#000000"></u-icon>
							<view class="text">活动订单</view>
						</view>
						<view class="item" @click="clickItem(2)">
							<u-icon class="icon" name="integral-fill" size="25" color="#000000"></u-icon>
							<view class="text">教练订单</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<!-- <view class="li" @click="clickItem(1)">
					<u-icon class="icon" name="coupon-fill" size="25" color="#757575"></u-icon>
					<view class="text">活动订单</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#757575"></u-icon>
				</view>
				<view class="li" @click="clickItem(2)">
					<u-icon class="icon" name="integral-fill" size="25" color="#757575"></u-icon>
					<view class="text">教练订单</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#757575"></u-icon>
				</view>-->
				<view class="li" @click="clickItem(6)">
					<u-icon class="icon" name="file-text-fill" size="25" color="#000000"></u-icon>
					<view class="text">所有订单</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li" @click="clickItem(0)">
					<u-icon class="icon" name="grid-fill" size="25" color="#000000"></u-icon>
					<view class="text">我的发布</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li " @click="clickItem(3)">
					<u-icon class="icon" name="plus-people-fill" size="25" color="#000000"></u-icon>
					<view class="text">教练入驻</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li " @click="clickItem(7)">
					<u-icon class="icon" name="account-fill" size="25" color="#000000"></u-icon>
					<view class="text">我的联系人</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li">
					<u-icon class="icon" name="server-man" size="25" color="#000000"></u-icon>
					<button class="feedbackBtn" open-type="contact">联系客服</button>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li" @click="clickItem(4)">
					<u-icon class="icon" name="info-circle-fill" size="25" color="#000000"></u-icon>
					<view class="text">关于我们</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li">
					<u-icon class="icon" name="email-fill" size="25" color="#000000"></u-icon>
					<button class="feedbackBtn" open-type="feedback">意见反馈</button>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li noborder" @click="loginOut">
					<u-icon class="icon" name="minus-circle-fill" size="25" color="#000000"></u-icon>
					<view class="text">注销登录</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
				<view class="li noborder" v-if="newFlashFlag" @click="clickItem(8)">
					<u-icon class="icon" name="checkmark-circle-fill" size="25" color="#000000"></u-icon>
					<view class="text">快讯审核</view>
					<u-icon class="icon" name="arrow-right" size="20" color="#000000"></u-icon>
				</view>
			</view>
		</view>
		<view class="copyright">
			<text>— Club —</text>
		</view>
	</view>
</template>

<script>
	import {
		setUserInfo,
		getUserInfo,
		setToken,
		getToken,
		removeUserInfo,
		removeToken
	} from '@/utils/auth';
	export default {
		data() {
			return {
				avatarUrl: '/static/img/login/defaultAvatar.png',
				userinfo: {},
				islogin: false,
				newFlashFlag: false,
			}
		},
		onShow() {
			if (getUserInfo() != undefined) {
				this.islogin = true
			}
			this.userinfo = getUserInfo() || {};
			console.log("userinfo", this.userinfo)
			this.userinfo.avatar = this.getBaseUrl() + this.userinfo.avatar
			// 如果登录用户是管理员，可以看到快讯审核菜单
			if (this.userinfo.openid === 'osF6j7aV35DFihzBYfLBqVhz-asM') {
				this.newFlashFlag = true;
			}
		},
		methods: {
			login() {
				uni.navigateTo({
					url: '/pages/me/login-page'
				});
			},
			myNotice() {
				uni.navigateTo({
					url: './mynotice/mynotice'
				})
			},
			loginOut() {
				uni.showModal({
					title: '注销登录提示',
					content: '确定要注销登录吗？',
					cancelText: "取消", // 取消按钮的文字
					confirmText: "确认", // 确认按钮的文字
					confirmColor: '#f55850',
					success: (res) => {
						if (res.confirm) {
							console.log('comfirm') //点击确定之后执行的代码
							uni.$u.toast("注销登录成功，欢迎再来")
							removeUserInfo()
							removeToken()
							this.islogin = false
						} else {
							console.log('cancel') //点击取消之后执行的代码
						}
					}
				})
			},
			clickItem(index) {
				//我的发布
				if (index == 0) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/me/myRelease/r-club?tabIndex=0'
					});
				}
				//活动订单
				if (index == 1) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/active/orderList?state=0'
					});
				}
				//教练订单
				if (index == 2) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/teacher/orderList?state=0'
					});
				}
				//教练入驻
				if (index == 3) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/teacher/teacherAdd'
					});
				}
				//关于我们
				if (index == 4) {
					uni.navigateTo({
						url: '/pages/me/about'
					});
				}
				//雪票订单
				if (index == 5) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/ticket/orderList?state=0'
					});
				}
				//所有订单（订单中心，微信小程序必要有，否则审核不过）
				if (index == 6) {
					//未登录，跳转登录
					// if (getUserInfo() == undefined) {
					// 	uni.navigateTo({
					// 		url: '/pages/me/login-page'
					// 	});
					// 	return;
					// };
					uni.navigateTo({
						url: '/pages/me/orderCenter'
					});
				}
				//我的联系人
				if (index == 7) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/me/personManager/personSelect'
					});
				}
				//快讯审核
				if (index == 8) {
					//未登录，跳转登录
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					};
					uni.navigateTo({
						url: '/pages/me/newFlash/new-flash-ctrl'
					});
				}
			},
			toUserEdit() {
				uni.navigateTo({
					url: '/pages/me/userinfo'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #efeff4;
		font-size: 28rpx;
	}

	.header {
		background: #fff;
		height: 610rpx;
		padding-bottom: 600rpx;

		.bg {
			width: 100%;
			height: 490rpx;
			padding-top: 260rpx;
			background: linear-gradient(to bottom, rgb(1, 94, 234), rgb(0, 192, 250), rgb(255, 255, 255));
		}
	}

	.box {
		width: 650rpx;
		height: 300rpx;
		border-radius: 20rpx;
		margin: 0 auto;
		background: #fff;
		box-shadow: 0 5rpx 20rpx 0rpx rgba(0, 0, 150, .2);

		.box-hd {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: center;
			margin-top: 15rpx;

			.avator {

				width: 160rpx;
				height: 160rpx;
				background: #fff;
				border: 5rpx solid #f1f1f1;
				border-radius: 50%;
				margin: 0 auto;
				margin-top: -80rpx;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.phone-number {
				width: 100%;
				text-align: center;
				margin: 20rpx auto;
				color: #000000;
			}
		}

		.box-bd {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;

			.item {
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #f1f1f1;
				margin: 15rpx 0;

				&:last-child {
					border: none;
				}

				.icon {
					width: 60rpx;
					height: 60rpx;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					width: 100%;
					text-align: center;
					margin-top: 10rpx;
				}
			}
		}
	}

	.list-content {
		background: #fff;
	}

	.list {
		width: 100%;
		border-bottom: 15rpx solid #f1f1f1;
		background: #fff;

		&:last-child {
			border: none;
		}

		.li {
			width: 92%;
			height: 100rpx;
			padding: 0px 4%;
			border-bottom: 1px solid #f3f3f3;
			display: flex;
			align-items: center;
			margin: 0rpx auto;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50rpx;
				height: 50rpx;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.text {
				padding-left: 20rpx;
				width: 100%;
				color: #000000;
			}

			.to {
				flex-shrink: 0;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.copyright {
		margin: 20rpx auto;
		width: 80%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #9E9E9E;
		font-size: 26rpx;
	}

	.feedbackBtn {
		padding-left: 20rpx;
		width: 100%;
		color: #000000;
		background-color: #fff;
		text-align: left;
		font-size: 28rpx;
	}

	.feedbackBtn::after {
		border: 0;
	}
</style>