<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container">
			<data-tables v-loading="loading" :data="data" :table-props="tableProps" align="left" :show-action-bar="false" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新建部门</el-button>
					</el-col>
				</el-row>
				<el-table-column prop="name" label="部门名称" min-width="500" key="name" sortable="custom">
					<template slot-scope="scope">
						<div class="blue"><b>{{scope.row.name}}</b></div>
					</template>
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
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				data: []
			}
		},
		computed: {
			...mapState([
				'CompaniesData'
			])
		},
		methods: {
			...mapActions([
				'getCompanies'
			]),
			deletes(row) {
				this.$confirm('真的要删除此部门吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.loading = true
					const data = await api.deletePlanDeparts(row.id)
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
			async getData() {
				if(this.CompaniesData.length == 0) {
					this.loading = true
				}
				const data = await api.getPlanDepartsList(this.$route.params.id)
				this.data = data.data
				this.loading = false
			},
			goSeed() {
				this.$router.push({
					name: 'AddDeparts',
					params: {
						id: this.$route.params.id
					}
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditDeparts',
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