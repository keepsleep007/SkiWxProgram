<template>
	<view class="container">
		<view class="bg-wrapper">
			<!--地区 类型，入住时间，发布者性别，重置 -->
			<es-filter-bar :list="list" @change="onChange" @close="onClose" btnBg="#ffffff" ref="buttonPage"></es-filter-bar>
		</view>
	</view>
</template>

<script>
	import esFilterBar from "../../components/es-filter-bar/es-filter-bar";

	export default {
		inject: ['loadData'],
		components: {
			esFilterBar
		},
		data() {
			return {
				list: [],
			}
		},
		created() {
			this.getAreaData();
			this.getRoomType();
			this.getInDate();
			this.getSex();
			this.setReset();
		},
		methods: {
			onChange(filterList) {
				console.log("触发修改", filterList)
				this.loadData("loadParams", filterList);
			},
			onClose(e) {
				// console.log(e)
			},
			getAreaData() {
				let areaTmp = {
					field: 'area',
					type: 'select',
					name: '拼房地区',
					options: [],
					column: 2,
					label: '',
					value: ''
				};
				this.list[0] = areaTmp;
				this.request('/app_api/roomPool/loadRoomAreaData').then(res => {
					// console.log("loadAreaData:", res)
					if (res) {
						let tmp = []
						for (var i = 0; i < res.data.length; i++) {
							tmp[i] = {};
							tmp[i]['label'] = res.data[i].name;
							tmp[i]['value'] = res.data[i].id;
						}
						tmp.unshift({
							value: 'null',
							label: '不限'
						});
						areaTmp.options = tmp;
						this.$refs.buttonPage.initData(this.list);
					}
				});
			},
			getRoomType() {
				let roomType = {
					field: 'roomType',
					type: 'select',
					name: '类型',
					options: [{
						value: 'null',
						label: '不限'
					}, {
						value: '1',
						label: '房找人'
					}, {
						value: '2',
						label: '人找房'
					}],
					label: '',
					value: ''
				};
				this.list[1] = roomType;
			},
			getInDate() {
				let date = {
					field: 'date',
					type: 'calendar',
					name: '入住时间',
					label: '',
					value: ''
				};
				this.list[2] = date;
			},
			getSex() {
				let sex = {
					field: 'sex',
					type: 'select',
					name: '发布者性别',
					options: [{
						value: 'null',
						label: '不限'
					}, {
						value: '0',
						label: '男'
					}, {
						value: '1',
						label: '女'
					}],
					label: '',
					value: ''
				};
				this.list[3] = sex;
			},
			setReset() {
				let date = {
					field: 'date',
					type: 'resetBtn',
					name: '重置',
					label: '',
					value: ''
				};
				this.list[4] = date;
			}
		}
	}
</script>

<style scoped>
	.container {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.bg-wrapper {
		background-color: #f6f8fb;
		width: 750rpx;
		height: 35px;
		display: flex;
		align-items: center;
	}
</style>