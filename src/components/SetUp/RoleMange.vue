<template>
	<div>
		<div class="page-title">{{ $route.meta.title }}</div>
		<div class="know-container">
			<data-tables v-loading="loading" :data="RolesData" :table-props="tableProps" align="left" :show-action-bar="false" :custom-filters="customFilters" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新建角色</el-button>
						<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-search" placeholder="搜索角色名称/标识" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<el-table-column prop="display_name" label="角色名称" key="display_name" sortable="custom">
					<template slot-scope="scope">
						<div class="blue cursor" @click="details(scope)"><b>{{scope.row.display_name}}</b></div>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="标识" key="name" sortable="custom">
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
		<el-dialog title="角色详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>角色名称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.display_name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>标识</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
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
				<el-button @click="previewcol = false">取 消</el-button>
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
				//存放弹出框的数据
				colshowlog: {},
			}
		},
		computed: {
			...mapState([
				'RolesData'
			])
		},
		methods: {
			...mapActions([
				'getRoles'
			]),
			deletes(row) {
				this.$confirm('真的要删除此角色吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.loading = true
					const data = await api.deleteRoles(row.id)
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
				if(this.RolesData.length == 0) {
					this.loading = true
				}
				await this.getRoles()
				this.loading = false
			},
			goSeed() {
				this.$router.push({
					name: 'AddRole'
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditRole',
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