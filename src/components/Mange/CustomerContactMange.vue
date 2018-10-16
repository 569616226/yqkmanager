<template>
	<div>
		<div class="page-title">{{ $route.meta.title }}</div>
		<div class="know-container">
			<data-tables v-loading="loading" :data="ClientsData" :table-props="tableProps" align="left" :show-action-bar="false" :custom-filters="customFilters" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新建联系人</el-button>
						<el-select v-model="customFilters[1].vals" placeholder="微信绑定" class="class_select_width">
							<el-option label="微信绑定" value=""></el-option>
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
						<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-search" placeholder="搜索姓名/手机号" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<el-table-column prop="username" label="姓名" key="username" sortable="custom">
					<template slot-scope="scope">
						<div class="blue cursor" @click="details(scope)"><b>{{scope.row.username}}</b></div>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号" key="phone" sortable="custom">
				</el-table-column>
				<el-table-column prop="is_wechat_verfiy" label="微信绑定" key="is_wechat_verfiy" sortable="custom">
					<template slot-scope="scope">
						<div class="red" v-if="scope.row.is_wechat_verfiy == '未绑定'">{{scope.row.is_wechat_verfiy}}</div>
						<div class="green" v-else>{{scope.row.is_wechat_verfiy}}</div>
					</template>
				</el-table-column>
				<!--<el-table-column prop="roles" label="角色" key="roles" sortable="custom">
					<template slot-scope="scope">
						<div v-if="scope.row.roles.data.length > 0">
							{{scope.row.roles.data[0].name}}
						</div>
					</template>
				</el-table-column>-->
				<el-table-column prop="companies_name" label="所属企业" key="companies_name" sortable="custom">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="operation_box">
							<span @click="edit(scope.row)">编辑</span>
							<span v-if="!scope.row.is_frozen" @click="frozen(scope.row)">冻结</span>
							<span v-else @click="frozen(scope.row)">解冻</span>
							<span @click="deletes(scope.row)">删除</span>
						</div>
					</template>
				</el-table-column>
			</data-tables>
		</div>
		<el-dialog title="客户联系人详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>联系人姓名</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.username}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>手机号</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.phone}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>微信绑定</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.is_wechat_verfiy}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>绑定时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.wechat_verfiy_time}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>微信昵称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.wechat_name}}</p>
					</div>
				</div>
				<!--<div class="cl-row">
					<div class="cl-td">
						<p>角色</p>
					</div>
					<div class="cl-td" v-if="colshowlog.roles">
						<div v-if="colshowlog.roles.data.length > 0">
							<p>{{colshowlog.roles.data[0].name}}</p>
						</div>
					</div>
				</div>-->
				<div class="cl-row">
					<div class="cl-td">
						<p>所属企业</p>
					</div>
					<div class="cl-td">
						<div v-if="colshowlog.companies">
							<span v-for="item,index in colshowlog.companies.data" :key="index">{{item.name}}、</span>
						</div>
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
					props: ['username', 'name'],
				}, {
					vals: '',
					props: ['is_wechat_verfiy']
				}, {
					vals: [],
				}, {
					vals: []
				}, {
					vals: []
				}],
				allstatus: [{
					name: '未绑定',
					value: '未绑定'
				}, {
					name: '已绑定',
					value: '已绑定'
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
				'ClientsData',
				'CompaniesData'
			])
		},
		methods: {
			...mapActions([
				'getClients',
				'getCompanies'
			]),
			deletes(row) {
				this.$confirm('真的要删除此账号吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					const data = await api.deleteAdmins(row.id)
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
				let check_frozen = ''
				if(!row.is_frozen) {
					check_frozen = '冻结'
				} else {
					check_frozen = '解冻'
				}
				this.$confirm(`真的要${check_frozen}此账号吗？`, `${check_frozen}`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					let data = ''
					if(!row.is_frozen) {
						data = await api.putFrozenAdmins(row.id)
					} else {
						data = await api.putRefrozenAdmins(row.id)
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
			details(scope) {
				this.colshowlog = scope.row
				this.previewcol = true;
			},
			async getData() {
				if(this.ClientsData.length == 0) {
					this.loading = true
				}
				await this.getClients()
				await this.getCompanies()
				this.loading = false
			},
			goSeed() {
				this.$router.push({
					name: 'AddCustomerContact'
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditCustomerContact',
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