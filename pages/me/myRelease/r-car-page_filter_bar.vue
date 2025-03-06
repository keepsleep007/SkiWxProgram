<template>
	<view class="container">
		<view class="bg-wrapper">
			<es-filter-bar :list="list" @change="onChange" @close="onClose" btnBg="#ffffff" ref="buttonPage"></es-filter-bar>
		</view>
	</view>
</template>

<script>
	import esFilterBar from "../../../components/es-filter-bar/es-filter-bar";

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
			this.getCarType();
			this.getGoOrEnd();
			this.getDate();
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
					name: '出发地区',
					options: [],
					column: 2,
					label: '',
					value: 'null'
				};
				this.list[0] = areaTmp;
				this.request('/app_api/carPool/loadAreaData').then(res => {
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
			getCarType() {
				let carType = {
					field: 'carType',
					type: 'select',
					name: '类型',
					options: [{
						value: 'null',
						label: '不限'
					}, {
						value: '1',
						label: '车找人'
					}, {
						value: '2',
						label: '人找车'
					}],
					label: '',
					value: ''
				};
				this.list[1] = carType;
			},
			getGoOrEnd() {
				let goOrEnd = {
					field: 'goOrEnd',
					type: 'select',
					name: '出发/返回',
					options: [{
							value: 'null',
							label: '不限'
						},
						{
							value: '1',
							label: '去雪场'
						}, {
							value: '2',
							label: '雪场返回'
						}
					],
					label: '',
					value: ''
				};
				this.list[2] = goOrEnd;
			},
			getDate() {
				let date = {
					field: 'date',
					type: 'calendar',
					name: '出发时间',
					label: '',
					value: ''
				};
				this.list[3] = date;
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