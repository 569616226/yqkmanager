<template>
	<div>
		<div class="page-title" style="padding-bottom: 0;">
			<el-row class="editDiagnose-row">
				<el-col :span="16" class="editDiagnose-row-col">
					<p class="editDiagnose-row-col-p1">
						<img src="../../../assets/index-head.png" />
						<span class="editDiagnose-row-col-p1-span">
							<font color="#999999">问题库：</font>
							<span>{{data.name}}</span>
						<i class="iconfont icon-ic_border_color cursor" style="color: rgb(60, 140, 214);" @click="dialogVisible = true"></i>
						</span>
					</p>
					<el-row>
						<el-col :span="6">
							<p class="editDiagnose-row-col-p2">
								<font color="#9d9d9d">编辑人：</font>
								<span>{{data.editer}}</span>
							</p>
						</el-col>
						<el-col :span="12">
							<p class="editDiagnose-row-col-p2">
								<font color="#9d9d9d">最近编辑时间：</font>
								<span>{{data.updated_at}}</span>
							</p>
						</el-col>
					</el-row>
				</el-col>
				<el-col :offset="2" :span="6" class="editDiagnose-row-col">
					<el-button @click="$router.go(-1)">返回列表</el-button>
					<el-button type="primary" @click="$router.push({name: 'DepartsMange', params: {id: $route.params.id}})">管理部门</el-button>
					<el-row>
						<el-col :span="8" class="editDiagnose-row-col-col">
							<p>部门总数</p>
							<span>{{data.plan_depart_counts}}</span>
						</el-col>
						<el-col :span="8" class="editDiagnose-row-col-col">
							<p>问题总数</p>
							<span>{{data.plan_depart_question_counts}}</span>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
			<div v-if="data.plan_departs">
				<el-tabs v-model="EditDiagnose.activeName" @tab-click="handleClick" class="editDiagnose-row-tabs">
					<el-tab-pane v-for="item,index in data.plan_departs.data" :key="index" :label="item.name" :name="item.id"></el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<div class="know-container">
			<data-tables v-loading="loading" :data="dataList" :table-props="tableProps" align="left" :show-action-bar="false" :custom-filters="customFilters" :pagination-def="paginationDef">
				<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
					<el-col :span="24" class="text-align-left">
						<el-button type="primary" @click="goSeed">新增问题</el-button>
						<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-search" placeholder="搜索问题内容" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<el-table-column type="index" label="编号" width="100" sortable="custom">
				</el-table-column>
				<el-table-column prop="name" label="问题内容" min-width="500" key="name" sortable="custom">
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
		<el-dialog title="修改库名称" :visible.sync="dialogVisible" width="50%">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="库名称" prop="name">
					<el-input v-model="ruleForm.name" auto-complete="off" class="width250"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
	    		<el-button @click="dialogVisible = false">取 消</el-button>
	    		<el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
  			</span>
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
				dialogVisible: false,
				loading: false,
				data: [],
				tableProps: {
					border: false, //去掉边框
					stripe: false //去掉斑马纹
				},
				customFilters: [{
					vals: '',
					props: ['name'],
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
				dataList: [],
				ruleForm: {
					name: '',
					id: this.$route.params.id
				},
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}]
				},
			}
		},
		computed: {
			...mapState([
				'EditDiagnose'
			])
		},
		methods: {
			...mapActions([
				'getCompanies'
			]),
			async handleClick(tab, event) {
				this.loading = true
				const data2 = await api.getPlanDepartQuestions(this.EditDiagnose.activeName)
				this.dataList = data2.data
				this.loading = false
			},
			async getData() {
				this.loading = true
				const data = await api.getPlanDeparts(this.$route.params.id)
				this.data = data.data
				if(this.data.plan_departs.data.length > 0) {
					if(this.EditDiagnose.activeName == '') {
						this.EditDiagnose.activeName = this.data.plan_departs.data[0].id
					}
					const data2 = await api.getPlanDepartQuestions(this.EditDiagnose.activeName)
					this.dataList = data2.data
				}
				this.ruleForm.name = this.data.name
				this.loading = false
			},
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.patchPlans()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async patchPlans() {
				const PatchData = {
					plan_data: {
						name: this.ruleForm.name
					},
					id: this.ruleForm.id
				}
				const data = await api.patchPlans(PatchData)
				if(data.status) {
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.dialogVisible = false
					const data_plan = await api.getPlanDeparts(this.$route.params.id)
					this.data = data_plan.data
					this.ruleForm.name = this.data.name
				} else {
					this.$message({
						type: 'info',
						message: data.msg
					})
				}
			},
			goSeed() {
				this.$router.push({
					name: 'AddQuestion',
					params: {
						id: this.EditDiagnose.activeName
					}
				})
			},
			edit(row) {
				this.$router.push({
					name: 'EditQuestion',
					params: {
						id: row.id
					}
				})
			},
			deletes(row) {
				this.$confirm('真的要删除此问题吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					const data = await api.deletePlanDepartQuestions(row.id)
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
		},
		mounted() {
			this.getData()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.editDiagnose-row {
		&-tabs {
			margin-top: 25px;
		}
		&-col {
			& img {
				width: 30px;
				border-radius: 50%;
				vertical-align: middle;
			}
			&-p1 {
				&-span {
					margin-left: 10px;
					vertical-align: middle;
				}
			}
			&-p2 {
				font-size: 14px;
				margin-left: 45px;
				margin-top: 20px;
				font-weight: normal;
			}
			&-col {
				padding-left: 20px;
				margin-top: 20px;
				& p {
					color: rgb(153, 153, 153);
					font-size: 14px;
					font-weight: normal;
				}
				& span {
					font-size: 28px;
					font-weight: normal;
					margin-top: 10px;
					display: block;
				}
			}
		}
	}
	
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
	
	.width250 {
		width: 80%;
	}
</style>
<style>
	.el-tabs__nav-wrap::after {
		background-color: #ffffff;
	}
	
	.el-tabs__header {
		margin-bottom: 0;
	}
</style>