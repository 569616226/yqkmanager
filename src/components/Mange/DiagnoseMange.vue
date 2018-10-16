<template>
	<div v-loading="loading">
		<div class="page-title">{{ $route.meta.title }}</div>
		<div class="know-container">
			<el-table :data="PlanDepartIndexData" :table-props="tableProps" align="left" :show-action-bar="false">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<h3>方案内容库</h3>
					</el-col>
				</el-row>
				<el-table-column prop="name" label="库名称" key="name" sortable="custom">
					<template slot-scope="scope">
						<div class="blue cursor" @click="details(scope)"><b>{{scope.row.name}}</b></div>
					</template>
				</el-table-column>
				<el-table-column prop="editer" label="编辑人" key="editer" sortable="custom">
				</el-table-column>
				<el-table-column prop="updated_at" label="最近编辑时间" key="updated_at" sortable="custom">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="operation_box">
							<span @click="edit(scope.row)">编辑</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="know-container">
			<data-tables :data="PlansData" :table-props="tableProps" align="left" :show-action-bar="false" :custom-filters="customFilters" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新增方案</el-button>
						<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-search" placeholder="搜索方案名称" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<el-table-column prop="name" label="方案名称" key="name" sortable="custom">
					<template slot-scope="scope">
						<div class="blue cursor" @click="details_plan(scope)"><b>{{scope.row.name}}</b></div>
					</template>
				</el-table-column>
				<el-table-column prop="editer" label="创建人" key="editer" sortable="custom">
				</el-table-column>
				<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="operation_box">
							<span @click="edit(scope.row)">编辑</span>
							<span @click="deletes(scope.row)">删除</span>
						</div>
					</template>
				</el-table-column>
			</data-tables>
		</div>
		<el-dialog title="方案详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>方案名称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>编辑人</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.editer}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>编辑时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.updated_at}}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol = false">取 消</el-button>
				<el-button type="primary" @click="edit(colshowlog)">编 辑</el-button>
			</div>
		</el-dialog>
		<el-dialog title="方案详情" :visible.sync="previewcol2" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>方案名称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>创建人</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.editer}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>创建时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.created_at}}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol2 = false">取 消</el-button>
				<el-button type="primary" @click="edit(colshowlog)">编 辑</el-button>
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
				is_parentData: [],
				loading: false,
				tableProps: {
					border: false, //去掉边框
					stripe: false //去掉斑马纹
				},
				customFilters: [{
					vals: '',
					props: ['display_name', 'name'],
				}, {
					vals: []
				}, {
					vals: []
				}, {
					vals: []
				}, {
					vals: []
				}],
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				dialogVisible: false,
				save_id: null,
				previewcol: false,
				previewcol2: false,
				//存放弹出框的数据
				colshowlog: {},
			}
		},
		computed: {
			...mapState([
				'PlansData',
				'PlanDepartIndexData'
			])
		},
		methods: {
			...mapActions([
				'getPlans',
				'getPlanDepartIndex'
			]),
			deletes(row) {
				this.$confirm('真的要删除此方案吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.loading = true
					const data = await api.deletePlans(row.id)
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
			details_plan(scope) {
				this.colshowlog = scope.row
				this.previewcol2 = true;
			},
			async getData() {
				if(this.PlansData.length == 0) {
					this.loading = true
				}
				await this.getPlans()
				await this.getPlanDepartIndex()
				this.loading = false
			},
			goSeed() {
				this.$router.push({
					name: 'AddDiagnose'
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditDiagnose',
					params: {
						id: row.id
					}
				})
			},
			DaoRu() {
				api.putUploadParentPlanExcel('6666666666666666666666')
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