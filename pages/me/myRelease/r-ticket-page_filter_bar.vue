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
		props: {
			snowField: {
				type: Array,
				default: function(e) {
					return {}
				}
			},
			ticketType: {
				type: Array,
				default: function(e) {
					return {}
				}
			},
		},
		data() {
			return {
				list: []
			}
		},
		watch: {
			// 监听父组件传递来的 parentData
			snowField(newVal, oldVal) {
				// console.log("snowField", newVal)
				let tmp = []
				for (var i = 0; i < newVal.length; i++) {
					if (newVal[i].pid != '0') {
						let t = {};
						t['label'] = newVal[i].label;
						t['value'] = newVal[i].id;
						tmp.push(t);
					}
				}
				tmp.unshift({
					value: 'null',
					label: '不限'
				});
				this.list[0].options = tmp;
				this.$refs.buttonPage.initData(this.list);
			},
			ticketType(newVal, oldVal) {
				// console.log("ticketType", newVal)
				let tmp = []
				for (var i = 0; i < newVal.length; i++) {
					if (newVal[i].pid != '0') {
						let t = {};
						t['label'] = newVal[i].dictLabel;
						t['value'] = newVal[i].dictValue;
						tmp.push(t);
					}
				}
				tmp.unshift({
					value: 'null',
					label: '不限'
				});
				this.list[3].options = tmp;
				this.$refs.buttonPage.initData(this.list);
			}
		},
		created() {
			this.getAreaData();
			this.getType();
			this.getInDate();
			this.getTicketType();
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
					name: '使用雪场',
					options: [],
					column: 2,
					label: '',
					value: 'null'
				};
				this.list[0] = areaTmp;
			},
			getType() {
				let type = {
					field: 'type',
					type: 'select',
					name: '类型',
					options: [{
						value: 'null',
						label: '不限'
					}, {
						value: '1',
						label: '转卖'
					}, {
						value: '2',
						label: '求购'
					}],
					label: '',
					value: 'null'
				};
				this.list[1] = type;
			},
			getInDate() {
				let date = {
					field: 'date',
					type: 'calendar',
					name: '使用时间',
					label: '',
					value: 'null'
				};
				this.list[2] = date;
			},
			getTicketType() {
				let type = {
					field: 'snowType',
					type: 'select',
					name: '雪票时段',
					options: [],
					label: '',
					value: 'null'
				};
				this.list[3] = type;
			},
			setReset() {
				let date = {
					field: 'date',
					type: 'resetBtn',
					name: '重置',
					label: '',
					value: 'null'
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