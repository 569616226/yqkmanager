<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container">
			<el-tabs v-model="activeName">
				<el-tab-pane label="订单信息" name="0">
					<order-detail></order-detail>
				</el-tab-pane>
				<el-tab-pane label="方案信息" name="1">
					<plan-detail></plan-detail>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	import { getCookie } from '@/utils'
	import OrderDetail from './EditSelectPlanOrder/OrderDetail'
	import PlanDetail from './EditSelectPlanOrder/PlanDetail'
	export default {
		components: {
			OrderDetail,
			PlanDetail
		},
		data() {
			return {
				activeName: '0',
				
			}
		},
		computed: {
			...mapState([

			])
		},
		methods: {
			...mapActions([

			])
		},
		mounted: function() {
			
		},
		watch: {
			
		}
	}
</script>
<style lang="less" scoped>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	
	.auditDaka {
		&-arrow {
			& .icon-07jiantouxiangzuo {
				vertical-align: middle;
				font-size: 24px;
				color: #444444;
			}
		}
	}
	
	.form_block {
		display: block;
	}
	
	.AddSelectPlan {
		background-color: rgb(245, 247, 250);
		font-size: 14px;
		border-width: 1px;
		color: rgb(152, 160, 176);
		padding: 20px 0;
		text-align: center;
		&-row {
			&-col {
				position: relative;
				&-p {
					& i {
						vertical-align: middle;
					}
					& span {
						vertical-align: middle;
						margin-left: 4px;
					}
				}
				&-icon {
					position: absolute;
					right: 0;
					top: 0;
				}
			}
		}
		&-form {
			&-p {
				margin: 0 3.4rem;
				padding: 15px 0;
				border-bottom: 1px solid rgb(223, 223, 223);
				color: rgb(85, 85, 85);
				font-size: 16px;
				font-weight: bold;
			}
		}
		&-show {
			color: rgb(60, 152, 255);
			background-color: transparent;
			border: 1px solid rgb(60, 152, 255);
			border-radius: 4px;
			font-size: 14px;
			padding: 0 20px;
			margin-top: 15px;
			display: inline-block;
			cursor: pointer;
			& i {
				vertical-align: middle;
				margin-right: 5px;
			}
			& span {
				vertical-align: middle;
			}
		}
	}
</style>
<style scoped>
	.form-input-h {
		width: 400px
	}
	
	.form_p_g {
		font-size: 14px;
		color: #888;
		clear: both
	}
	
	.tree-box {
		margin-top: 10px;
		border: 1px solid #E3E3E3;
		border-radius: 4px;
		max-width: 800px;
		padding: 10px;
		min-height: 220px;
		max-height: 500px;
		overflow-y: scroll;
	}
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		background-color: #FFFFFF;
	}
	/*定义滚动条轨道 内阴影+圆角*/
	
	::-webkit-scrollbar-track {
		border-radius: 10px;
		background-color: #FFFFFF;
	}
	/*定义滑块 内阴影+圆角*/
	
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: rgb(216, 217, 224);
	}
	
	.avatar-uploader {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		display: inline-block;
		line-height: 1
	}
	
	.avatar-uploader:hover {
		border-color: #409EFF
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center
	}
	
	.avatar {
		width: 100px;
		height: 100px;
		display: block
	}
	
	.colrecom_form {
		width: 200px;
		border: 1px solid #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		border-radius: 4px
	}
	
	.colrecom_form_add {
		width: 200px;
		border: 1px dotted #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		text-align: center;
		border-radius: 4px
	}
	
	.colrecom_form_add>.el-icon-plus {
		height: 80px
	}
	
	.colrecom_form>img {
		width: 100%
	}
	
	.colrecom_form>p {
		line-height: normal;
		text-align: center;
		padding: 0 3px;
		word-wrap: normal;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		text-align: justify
	}
	
	.colrecom_form>.el-icon-error {
		color: #ff7043;
		position: absolute;
		top: -7px;
		right: -7px;
		font-size: 18px
	}
	
	.input_search_video {
		width: 50%
	}
	
	.span_search_video {
		color: #888;
		margin-left: 5%
	}
	
	.select_show_video {
		width: 685px;
		margin: 0 auto
	}
	
	.show_page {
		margin-top: 2rem;
		text-align: center
	}
</style>