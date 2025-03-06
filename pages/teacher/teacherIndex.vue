<template>
	<view class="container">
		<scroll-view scroll-y="true">
			<view v-for="(card, index) in data" :key="index" class="card">
				<view class="card-upper">
					<view class="avatar">
						<u-avatar :src="card.headPhoto!=null?getBaseUrl()+card.headPhoto:avatarUrl" size="60"></u-avatar>
					</view>
					<view class="info">
						<view style="display: flex;">
							<text class="nickname">{{ card.nickname }}</text>
							<image class="gender-icon" :src="card.iSex==0?'/static/img/sex/man.png':'/static/img/sex/woman.png'" />
						</view>
						<template v-for="(teacherSystemTag) in teacherSystemTagList">
							<template v-if="card.teacherSystem==teacherSystemTag.dictValue">
								<view :key="teacherSystemTag.dictValue" class="tag-background">
									<text class="tag">{{ teacherSystemTag.dictLabel }} {{ card.teacherLevel }}级</text>
								</view>
							</template>
						</template>
					</view>
					<template v-for="(teachType) in teachTypeList">
						<template v-if="card.teachType==teachType.dictValue">
							<view :key="teachType.dictValue" class="right-tag">
								<text>{{ teachType.dictLabel }}</text>
							</view>
						</template>
					</template>
					<!-- <view class="video-tag" @click="toVideoPage(card.id)">
						<text>教学视频 ▶</text>
					</view> -->
				</view>
				<hr>
				<view class="card-lower">
					<view class="section">
						<text class="section-title">雪龄：</text>
						<view class="tag">
							<text>{{card.skiAge}}年</text>
						</view>
						<text class="section-title">教龄：</text>
						<view class="tag">
							<text>{{card.teachAge}}年</text>
						</view>
					</view>
					<view class="section">
						<text class="section-title">个人简介：</text>
						<text class="section-text">{{ card.introduce }}</text>
					</view>
					<view class="section">
						<text class="section-title">擅长领域：</text>
						<template v-for="(tag) in card.tags">
							<view :key="tag" class="tag">
								<text>{{ tag }}</text>
							</view>
						</template>
					</view>
					<view class="section">
						<text class="section-title">常驻雪场：</text>
						<template v-for="(skiResort) in card.skiResort">
							<view :key="skiResort" class="tag" style="margin-bottom: 5px;">
								<text>{{ skiResort }}</text>
							</view>
						</template>
					</view>
					<scroll-view class="swiper-container" scroll-x="true">
						<template v-for="(priceData, subIndex) in card.teacher_priceList">
							<view :key="subIndex" class="sub-card" @click="handleBook(priceData,card.nickname)">
								<template v-for="(teachMode) in teachModeList">
									<template v-if="priceData.tcMode==teachMode.dictValue">
										<text :key="teachMode.dictValue" class="sub-card-title">{{ teachMode.dictLabel }} {{priceData.tcTime}}小时</text>
									</template>
								</template>
								<text class="sub-card-price">￥{{ priceData.price }}</text>
								<view class="sub-card-button">预定</view>
							</view>
						</template>
					</scroll-view>
				</view>
			</view>
			<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
			<uni-load-more iconType="auto" :status="status" />
		</scroll-view>
		<!-- 蓝色悬浮按钮 -->
		<teacher_fab_button />
		<!-- 预约弹窗 -->
		<view class="popup" :class="makePopup">
			<!-- 遮罩层 -->
			<view class="mask" @click="toggleSpecProduct"></view>
			<view class="layer">
				<view class="closeBtn">
					<u-icon class="icon" name="close-circle-fill" size="25" color="#757575" @click="toggleSpecProduct"></u-icon>
				</view>
				<view class="title-left">
					<text>教练：{{popNickname}}</text>
				</view>
				<view class="title-left">
					<template v-for="(teachMode, index) in teachModeList">
						<template v-if="popTeachMode==teachMode.dictValue">
							<text :key="index">教学模式：{{ teachMode.dictLabel }}</text>
						</template>
					</template>
				</view>
				<view class="title-left">
					<text>教学时长：{{poptcTime}} 小时</text>
				</view>
				<view class="title-left">
					<text>教学价格：￥{{popPrice}}</text>
				</view>
				<view class="datatime"><text>预约日期：</text>
					<uni-datetime-picker v-model="range" type="daterange" :start="start" :end="end" @change="dateChange" />
				</view>
				<view class="title-left">
					<text>合计：{{sumDay}}天 金额：￥{{sumPrice}}</text>
				</view>
				<view class="title-left">
					<text>预约并付款后，客服会主动与您联系确认教学信息与时间，</text>
					<text>受教练个人时间安排影响，实际教学日期可能会有变化，客服会再次与您确认或协调时间，请保持电话畅通。</text>
				</view>
				<view class="subButton" @click="subTeacherOrder(popPriceList)">预定</view>
			</view>
		</view>
		<!-- 从首页推荐中，跳转过来时，展示的预约弹窗，只展示价格信息-->
		<view class="popup" :class="homeToThisMakePopup">
			<!-- 遮罩层 -->
			<view class="mask" @click="homeToggleSpecProduct"></view>
			<view class="layer">
				<view class="closeBtn">
					<u-icon class="icon" name="close-circle-fill" size="25" color="#757575" @click="homeToggleSpecProduct"></u-icon>
				</view>
				<view class="card-upper">
					<view class="avatar">
						<u-avatar :src="homeTeacherData.headPhoto!=null?getBaseUrl()+homeTeacherData.headPhoto:avatarUrl" size="60"></u-avatar>
					</view>
					<view class="info">
						<view style="display: flex;">
							<text class="nickname">{{ homeTeacherData.nickname }}</text>
							<image class="gender-icon" :src="homeTeacherData.iSex==0?'/static/img/sex/man.png':'/static/img/sex/woman.png'" />
						</view>
						<template v-for="(teacherSystemTag, index) in teacherSystemTagList">
							<template v-if="homeTeacherData.teacherSystem==teacherSystemTag.dictValue">
								<view :key="index" class="tag-background">
									<text class="tag">{{ teacherSystemTag.dictLabel }} {{ homeTeacherData.teacherLevel }}级</text>
								</view>
							</template>
						</template>
					</view>
					<template v-for="(teachType, index) in teachTypeList">
						<template v-if="homeTeacherData.teachType==teachType.dictValue">
							<view :key="index" class="right-tag">
								<text>{{ teachType.dictLabel }}</text>
							</view>
						</template>
					</template>
				</view>
				<template v-for="(priceData, subIndex) in homeTeacherData.teacher_priceList">
					<view :key="subIndex" class="sub-card" style="height: 120rpx;" @click="handleBook(priceData,homeTeacherData.nickname)">
						<template v-for="(teachMode, index) in teachModeList">
							<template v-if="priceData.tcMode==teachMode.dictValue">
								<text :key="index" class="sub-card-title">{{ teachMode.dictLabel }} {{priceData.tcTime}}小时</text>
							</template>
						</template>
						<text class="sub-card-price">￥{{ priceData.price }}</text>
						<view class="sub-card-button">预定</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserInfo,
		needLogin,
	} from '@/utils/auth';
	import teacher_fab_button from "./teacher-fab-button";
	export default {
		components: {
			teacher_fab_button
		},
		data() {
			return {
				//分页参数
				pageNum: 1,
				pageSize: 10,
				total: 0,
				status: 'more',
				//头像
				avatarUrl: '/static/img/login/defaultAvatar.png',
				// 数据
				data: [],
				// 教练体系
				teacherSystemTagList: [],
				// 教学类型,单双
				teachTypeList: [],
				// 教学模式
				teachModeList: [],
				// 常驻雪场
				teachResortList: [],
				// 预约弹出层控制
				makePopup: 'none',
				//从首页推荐过来时的弹出层控制
				homeToThisMakePopup: 'none',
				//从首页来的弹出层数据
				homeTeacherData: '',
				// 预约弹窗中展示的数据
				popPriceList: '',
				popTeachMode: '',
				poptcTime: '',
				popPrice: '',
				popNickname: '',
				sumPrice: '',
				sumDay: '',
				//控制时间空间的可选范围
				range: '',
				start: Date.now(),
				end: Date.now() + 10000000000,
			};
		},
		async onLoad() {
			// 加载教练体系
			await this.loadTeacherSystemTag();
			await this.getSnowField();
			// 加载教练数据
			await this.getTeacherList();
		},
		onShow() {
			//每次显示页面，从缓存中获取数据，如果有说明是从首页推荐点击了预定后跳转过来的，没有则是直接进入了此模块
			const homeTeacherData = uni.getStorageSync('teacherData');
			if (homeTeacherData) {
				// 在这里处理获取到的数据  
				console.log('homeTeacherData:', homeTeacherData);
				this.homeTeacherData = homeTeacherData;
				// 处理完数据后，删除本地存储中的缓存  
				uni.removeStorageSync('teacherData');
				// 打开弹窗层
				this.homeToggleSpecProduct();
			}
		},
		methods: {
			async getTeacherList() {
				//没有更多数据，不再继续查询
				if (this.status === 'noMore') {
					console.log('noMore')
					return;
				}
				this.status = 'loading';
				let requestParam = {};
				requestParam.pageNum = this.pageNum;
				requestParam.pageSize = this.pageSize;
				await this.request('/app_api/teacher/getTeacherList', requestParam, 'GET').then(res => {
					console.log("getTeacherList:", res)
					if (res) {
						if (res.code == 200) {
							// 数据
							res.data[0].forEach(item => {
								item.tags = item.tags.split('/');
								item.skiResort = item.skiResort.split(',');
								// 使用for循环来直接修改item.skiResort数组中的元素  
								for (let i = 0; i < item.skiResort.length; i++) {
									let resort = item.skiResort[i];
									for (let j = 0; j < this.teachResortList.length; j++) {
										if (this.teachResortList[j].tid == Number(resort)) {
											// 直接修改item.skiResort数组中的元素  
											item.skiResort[i] = this.teachResortList[j].label;
											// console.log("resort", item.skiResort[i]);
											break; // 如果找到了匹配项，就没有必要继续循环了  
										}
									}
								}
								this.data.push(item);
							})
							//总条数
							this.total = res.data[1];
							//判断当前加载的数据量是否少于数据的总量，如果少，则还有下一页
							if (this.data.length < this.total) {
								this.pageNum = this.pageNum + 1;
								this.status = 'more';
							} else {
								this.status = 'noMore';
							}
						}
					}
				})
			},
			async loadTeacherSystemTag() {
				await this.request('/app_api/teacher/loadTeacherSystemTag', 'GET').then(res => {
					console.log("loadTeacherSystemTag:", res)
					if (res) {
						this.teacherSystemTagList = res.data[0];
						this.teachTypeList = res.data[1];
						this.teachModeList = res.data[2];
					}
				})
			},
			async getSnowField() {
				await this.request('/app_api/snowField/listFieldAll', 'GET').then(res => {
					if (res) {
						this.teachResortList = res.data
					}
				})
			},
			handleBook(priceList, nickname) {
				//未登录，跳转登录
				if (needLogin()) {
					if (getUserInfo() == undefined) {
						uni.navigateTo({
							url: '/pages/me/login-page'
						});
						return;
					}
				}
				// console.log("priceList", priceList)
				this.popPriceList = priceList;
				this.popTeachMode = priceList.tcMode;
				this.poptcTime = priceList.tcTime;
				this.popPrice = priceList.price;
				this.popNickname = nickname;
				this.sumPrice = '';
				this.sumDay = '';
				this.range = '';
				this.toggleSpecProduct();
			},
			// toVideoPage(id) {
			// 	uni.navigateTo({
			// 		url: '/pages/teacher/teacherVideo?id=' + id
			// 	});
			// },
			//打开预约弹窗层
			toggleSpecProduct() {
				//先关闭一次首页弹出层,无论状态如何,防止遮盖
				this.homeToThisMakePopup = 'none';
				if (this.makePopup === 'show') {
					this.makePopup = 'hide';
					setTimeout(() => {
						this.makePopup = 'none';
					}, 250);
				} else if (this.makePopup === 'none') {
					this.makePopup = 'show';
				}
			},
			//打开预约弹窗层
			homeToggleSpecProduct() {
				if (this.homeToThisMakePopup === 'show') {
					this.homeToThisMakePopup = 'hide';
					setTimeout(() => {
						this.homeToThisMakePopup = 'none';
					}, 250);
				} else if (this.homeToThisMakePopup === 'none') {
					this.homeToThisMakePopup = 'show';
				}
			},
			dateChange(e) {
				// console.log(e)
				// 将字符串转换为Date对象  
				const date1 = new Date(e[0]);
				const date2 = new Date(e[1]);
				// 计算时间差（以毫秒为单位）  
				const timeDifference = date2 - date1;
				// 将时间差转换为天数  
				const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
				// 因为两个日期是连续的，所以一共的天数是天数差加1  
				const totalDays = daysDifference + 1;
				// console.log(`两个日期一共包含 ${totalDays} 天`);
				this.sumPrice = this.popPrice * totalDays;
				this.sumDay = totalDays;
			},
			//提交教学订单
			subTeacherOrder(popPriceList) {
				if (this.sumDay === '') {
					uni.showToast({
						title: '请选择预约日期',
						icon: 'none',
					});
					return;
				}
				// console.log("subTeacherOrder", popPriceList)
				// console.log(this.sumPrice)
				// console.log(this.sumDay)
				// console.log(this.range)
				uni.navigateTo({
					url: '/pages/teacher/teacherOrder?priceId=' + popPriceList.id + "&sumPrice=" + this.sumPrice + "&sumDay=" + this.sumDay + "&date=" + this.range
				});
			},
			/**
			 * 下拉刷新回调函数
			 */
			onPullDownRefresh() {
				console.log("onPullDownRefresh")
				//清除数据
				this.data = [];
				//重置分页数据
				this.pageNum = 1;
				this.pageSize = 10;
				this.status = 'more';
				// 加载数据
				this.getTeacherList();
				uni.stopPullDownRefresh();
			},
			/**
			 * 上拉加载回调函数
			 */
			onReachBottom() {
				console.log("onReachBottom")
				// 加载数据
				this.getTeacherList();
			},
		},
	};
</script>

<style lang='scss'>
	page {
		background-color: #efeff4;
	}

	.container {
		padding: 5px;
	}

	.card {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-upper {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 40%;
	}

	.info {
		align-items: center;
		margin-left: 10px;
	}

	.nickname {
		display: block;
		font-size: 16px;
		font-weight: bold;
	}


	.gender-icon {
		width: 20px;
		height: 20px;
		margin-left: 5px;
	}

	.tag-background {
		background-color: #f0f0f0;
		/* padding: 5px; */
		border-radius: 5px;
		margin-top: 5px;
	}

	.right-tag {
		position: absolute;
		top: 0px;
		right: 0px;
		background-color: #ffdedf;
		padding: 5px 10px;
		border-radius: 5px;
		margin-right: 10px;
		font-size: 12px;
		text-align: center;
		/* 文字居中 */
		line-height: normal;
		/* 行高，使文字垂直居中 */
	}

	.video-tag {
		position: absolute;
		top: 30px;
		right: 0px;
		background-color: #ffdedf;
		padding: 5px 10px;
		border-radius: 5px;
		margin-right: 10px;
		font-size: 12px;
		text-align: center;
		/* 文字居中 */
		line-height: normal;
		/* 行高，使文字垂直居中 */
	}

	.card-lower {
		display: flex;
		flex-direction: column;
	}

	.section {
		margin-bottom: 10px;
	}

	.section-title {
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.section-text {
		font-size: 14px;
		color: #333;
	}

	.tag {
		background-color: #f0f0f0;
		padding: 3px 5px;
		border-radius: 3px;
		margin-right: 5px;
		display: inline-block;
	}

	.swiper-container {
		width: 100%;
		height: 120rpx;
		white-space: nowrap;
	}

	.sub-card {
		position: relative;
		display: inline-block;
		margin: 5px;
		padding: 10px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width: 30%;
		height: 90%;
		background-color: #ffdedf;
	}

	.sub-card-title {
		position: absolute;
		font-size: 14px;
		margin-bottom: 5px;
		left: 20rpx;
	}

	.sub-card-price {
		position: absolute;
		font-size: 14px;
		color: #ff5a5f;
		margin-top: 40rpx;
		left: 20rpx;
	}

	.sub-card-button {
		position: absolute;
		left: 130rpx;
		top: 60rpx;
		font-size: 20rpx;
		background-color: #ff5a5f;
		/* 背景色 */
		color: #fff;
		/* 字体颜色 */
		border-radius: 10px;
		/* 圆角 */
		text-align: center;
		/* 文字居中 */
		line-height: normal;
		/* 行高，使文字垂直居中 */
		padding: 3px 5px;
		/* 根据需要添加内边距，以确保文字不会紧贴边框 */
	}

	hr {
		border: 0;
		height: 1px;
		background: #8b8b8b;
		margin: 10px;
		/* 控制分割线上下的间距 */
	}

	/*  弹出层 */
	.popup {
		position: relative;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 50vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.closeBtn {
				display: flex;
				/* 启用Flexbox布局 */
				justify-content: flex-end;
				/* 将子元素对齐到右侧 */
				margin-top: 10rpx;
				margin-right: 20rpx;
			}

			.title-left {
				margin-top: 20rpx;
				margin-left: 50rpx;
				margin-right: 50rpx;
			}

			.datatime {
				margin-top: 20rpx;
				margin-left: 50rpx;
				margin-right: 50rpx;
			}

			.subButton {
				margin-top: 20rpx;
				margin-left: 50rpx;
				margin-right: 50rpx;
				margin-bottom: 20rpx;
				background-color: #ff5a5f;
				/* 背景色 */
				color: #fff;
				/* 字体颜色 */
				border-radius: 15px;
				/* 圆角 */
				text-align: center;
				/* 文字居中 */
				line-height: 35px;
				/* 行高，使文字垂直居中 */
				font-size: 13px;
				/* 字体大小 */
				height: 35px;
			}

		}



		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}
</style>