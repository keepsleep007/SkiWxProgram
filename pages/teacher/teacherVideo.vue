<template>
	<view class="container">
		<!-- 自定义表单校验 -->
		<uni-forms ref="teacherInfoForm" :rules="rules" :model="formData">
			<uni-card title="视频" extra=" ">
				<view>
					<uni-forms-item label="滑行">
						<video :src="formData.skiVideoShow.url" controls show-fullscreen-btn style="width: 100%;height: 200px;"></video>
					</uni-forms-item>
					<uni-forms-item label="教学">
						<video :src="formData.teacherVideoShow.url" controls show-fullscreen-btn style="width: 100%;height: 200px;"></video>
					</uni-forms-item>
				</view>
			</uni-card>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//表单数据
				formData: {
					skiVideo: '',
					teacherVideo: '',
					skiVideoShow: [],
					teacherVideoShow: [],
				},
			}
		},
		async onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			//加载自己的教练数据
			await this.getData(option.id);
			uni.hideLoading();
		},
		methods: {
			async getData(id) {
				console.log(id)
				let query = {};
				query.id = id;
				await this.request('/app_api/teacher/getTeacherVideo', query, 'GET').then(res => {
					console.log("getTeacherVideo", res)
					if (res) {
						if (res.code == 200) {
							//滑行视频
							res.data.skiVideoShow = {
								"name": "滑行视频",
								"extname": "mp4",
								"url": this.getBaseUrl() + res.data.skiVideo
							}
							// 教学视频
							res.data.teacherVideoShow = {
								"name": "教学视频",
								"extname": "mp4",
								"url": this.getBaseUrl() + res.data.teacherVideo
							}
							this.formData = res.data;
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.container {
		overflow: hidden;
	}

	// 强行覆盖掉overflow属性,当uni-data-select放入uni-card中时，如果uni-card的高度不够高，就会出现选项展示不全的问题,覆盖就能解决，哈哈哈
	.uni-card {
		overflow: visible !important;
	}

	.title {
		/* 标题样式，这里仅用于示例 */
		text-align: center;
		/* 水平居中 */
		margin-bottom: 10px;
		/* 与网格布局内容之间的间距 */
		/* 如果需要，还可以添加其他样式，如字体大小、颜色等 */
	}
</style>