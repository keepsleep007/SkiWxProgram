<template>
	<view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" @fabClick="fabClick" />
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
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				is_color_type: false,
				content: [{
						iconPath: '/static/img/fab/car.png',
						selectedIconPath: '/static/img/fab/car.png',
						text: '拼车',
						active: true
					},
					{
						iconPath: '/static/img/fab/room.png',
						selectedIconPath: '/static/img/fab/room.png',
						text: '拼房',
						active: true
					},
					{
						iconPath: '/static/img/fab/ticket.png',
						selectedIconPath: '/static/img/fab/ticket.png',
						text: '雪票',
						active: true
					}
				]
			}
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		methods: {
			trigger(e) {
				console.log("trigger", e)
				console.log(getUserInfo())
				//未登录，跳转登录
				if (needLogin()) {
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					}
				}
				if (e.index == 0) {
					uni.navigateTo({
						url: '/pages/club/car-page-add'
					});
				}
				if (e.index == 1) {
					uni.navigateTo({
						url: '/pages/club/room-page-add'
					});
				}
				if (e.index == 2) {
					uni.navigateTo({
						url: '/pages/club/ticket-page-add'
					});
				}
				// this.content[e.index].active = !e.item.active
				// uni.showModal({
				// 	title: '提示',
				// 	content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定')
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消')
				// 		}
				// 	}
				// })
			},
			fabClick() {
				// uni.showToast({
				// 	title: '点击了悬浮按钮',
				// 	icon: 'none'
				// })
			},
			switchBtn(hor, ver) {
				if (hor === 0) {
					this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal'
					this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平'
				} else {
					this.horizontal = hor
					this.vertical = ver
				}
				this.$forceUpdate()
			},
			switchColor() {
				this.is_color_type = !this.is_color_type
				if (this.is_color_type) {
					this.pattern.iconColor = '#aaa'
					this.pattern.buttonColor = '#fff'
				} else {
					this.pattern.iconColor = '#fff'
					this.pattern.buttonColor = '#007AFF'
				}
			}
		}
	}
</script>


<style lang="scss">
	.warp {
		padding: 10px;
	}

	.button {
		margin-bottom: 10px;
	}
</style>