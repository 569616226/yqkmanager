<template>
	<div>
		<div class="page-title">{{ $route.meta.title }}</div>
		<div class="know-container">
			<data-tables v-loading="loading" :data="OrdersData" :table-props="tableProps" align="left" :show-action-bar="false" :custom-filters="customFilters" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新建订单</el-button>
						<el-select v-model="customFilters[1].vals" placeholder="订单状态" class="class_select_width">
							<el-option label="订单状态" value=""></el-option>
							<div v-for="status in allstatus">
								<el-option :label="status.name" :value="status.value"></el-option>
							</div>
						</el-select>
						<el-select v-model="customFilters[2].vals" placeholder="选择公司" class="class_select_width">
							<el-option label="选择公司" value=""></el-option>
							<div v-for="status in CompaniesData">
								<el-option :label="status.name" :value="status.name"></el-option>
							</div>
						</el-select>
						<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-search" placeholder="搜索订单名称/客户名称" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<el-table-column prop="name" label="订单名称" key="name" sortable="custom">
					<template slot-scope="scope">
						<div class="blue cursor" @click="details(scope)"><b>{{scope.row.name}}</b></div>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" key="status" sortable="custom">
					<template slot-scope="scope">
						<div v-if="scope.row.status == '未开始'" class="red">{{scope.row.status}}</div>
						<div v-if="scope.row.status == '进行中'" class="yellow">{{scope.row.status}}</div>
						<div v-if="scope.row.status == '已完成'" class="green">{{scope.row.status}}</div>
						<div v-if="scope.row.status == '已冻结'" class="bluei">{{scope.row.status}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="company_name" label="客户名称" key="company_name" sortable="custom">
					<template slot-scope="scope">
						{{scope.row.company_name}}
					</template>
				</el-table-column>
				<el-table-column prop="start_at" label="服务开始时间" key="start_at" sortable="custom">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="operation_box">
							<span v-if="scope.row.status != '已完成'" @click="edit(scope.row)">编辑</span>
							<span v-if="scope.row.status == '未开始'" @click="frozen(scope.row)">启动</span>
							<span v-if="scope.row.status == '未开始'" @click="deletes(scope.row)">删除</span>
							<span v-if="scope.row.status == '进行中'" @click="DongJie(scope.row)">冻结</span>
							<span v-if="scope.row.status == '已冻结'" @click="DongJie(scope.row)">解冻</span>
						</div>
					</template>
				</el-table-column>
			</data-tables>
		</div>
		<el-dialog title="订单详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>订单名称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单编号</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.order_number}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单状态</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.status}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>客户名称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.company_name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>服务开始时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.start_at}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>生成报告时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.report_create_at}}</p>
					</div>
				</div>
				<!--<div class="cl-row">
					<div class="cl-td">
						<p>项目审核人</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.company_name}}</p>
					</div>
				</div>-->
				<div class="cl-row">
					<div class="cl-td">
						<p>关联方案库</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.plan_name}}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol = false">取 消</el-button>
				<el-button type="primary" @click="edit(colshowlog)" v-if="colshowlog.status != '已完成'">编 辑</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	export default {
		components: {

		},
		data() {
			return {
				loading: false,
				tableProps: {
					border: false, //去掉边框
					stripe: false //去掉斑马纹
				},
				customFilters: [{
					vals: '',
					props: ['company_name', 'name'],
				}, {
					vals: [],
					props: ['status']
				}, {
					vals: [],
					props: ['company_name']
				}, {
					vals: []
				}, {
					vals: []
				}],
				allstatus: [{
					name: '未开始',
					value: '未开始'
				}, {
					name: '进行中',
					value: '进行中'
				}, {
					name: '已完成',
					value: '已完成'
				}],
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				dialogVisible: false,
				save_id: null,
				previewcol: false,
				//存放弹出框的数据
				colshowlog: {},
			}
		},
		computed: {
			...mapState([
				'OrdersData',
				'CompaniesData'
			])
		},
		methods: {
			...mapActions([
				'getOrders',
				'getCompanies'
			]),
			deletes(row) {
				this.$confirm('真的要删除此订单吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					const data = await api.deleteOrders(row.id)
					if(data.status) {
						this.$message({
							message: data.msg,
							type: 'success'
						})
					} else {
						this.$message.error(data.msg)
					}
					this.getData()
					this.loading = false
				}).catch(() => {

				})
			},
			DongJie(row) {
				let check_frozen = ''
				if(row.status == '进行中') {
					check_frozen = '冻结'
				} else if (row.status == '已冻结') {
					check_frozen = '解冻'
				}
				this.$confirm(`真的要${check_frozen}此订单吗？`, `${check_frozen}`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					let data = ''
					if(row.status == '进行中') {
						data = await api.getOrderDongJie(row.id)
					} else if (row.status == '已冻结') {
						data = await api.getOrderJieDong(row.id)
					}
					if(data.status) {
						this.$message({
							message: data.msg,
							type: 'success'
						})
					} else {
						this.$message.error(data.msg)
					}
					this.getData()
					this.loading = false
				}).catch(() => {

				})
			},
			frozen(row) {
				this.$confirm(`真的要启动此订单吗？`, '启动', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					const data = await api.patchOrdersStart(row.id)
					if(data.status) {
						this.$message({
							message: data.msg,
							type: 'success'
						})
					} else {
						this.$message.error(data.msg)
					}
					this.getData()
					this.loading = false
				}).catch(() => {

				})
			},
			details(scope) {
				this.colshowlog = scope.row
				this.previewcol = true;
			},
			async getData() {
				if(this.OrdersData.length == 0) {
					this.loading = true
				}
				await this.getOrders()
				await this.getCompanies()
				this.loading = false
			},
			goSeed() {
				this.$router.push({
					name: 'SelectPlan'
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditSelectPlanOrder',
					params: {
						id: row.id
					}
				})
			}
		},
		mounted() {
			this.getData()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.AddGroup {
		color: rgb(60, 152, 255);
		font-size: 14px;
		margin-top: 10px;
		cursor: pointer;
		&-div {
			margin-top: 10px;
			&-input {
				width: 40%;
			}
			&-add {
				color: rgb(60, 152, 255);
				font-size: 14px;
				margin-top: 10px;
				cursor: pointer;
				margin-left: 15px;
			}
		}
	}
	
	.class_input_width {
		width: 350px;
	}
	
	.operation_box span {
		cursor: pointer;
		color: #8E9EBB;
		margin-right: 10px;
	}
</style>