<template>
	<div>
		<div class="page-title">
			<i class="iconfont icon-arrow-left cursor" @click="$router.go(-1)"></i> {{ $route.meta.title }}
		</div>
		<div class="know-container">
			<div class="margin-top-lg">
				<p class="title">请根据实际情况选择方案</p>
				<div class="chooseBox">
					<div class="choose" @click="$router.push({name: 'AddSelectPlan'})">
						<div class="choose_main">
							<i class="iconfont icon-ic_assignment_turned_in"></i>
							<p class="tips">选择现有方案</p>
						</div>
						<div class="choose_footer">
							选择现有的方案，进行订单创建；适用于快速创建订单！
						</div>
					</div>
					<div class="choose" @click="$router.push({name: 'AddSelectPlanOrder'})">
						<div class="choose_main">
							<i class="iconfont icon-ic_assignment"></i>
							<p class="tips">新建方案</p>
						</div>
						<div class="choose_footer">
							根据现有的方案库进行自定义修改；适用于对诊断标准有自定义要求！
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	import { getCookie } from '@/utils'
	export default {
		data() {
			return {

			}
		},
		computed: {

		},
		methods: {

		},
		mounted: function() {

		},
		watch: {

		}
	}
</script>
<style lang="less" scoped>
	.auditDaka {
		&-arrow {
			& .icon-07jiantouxiangzuo {
				vertical-align: middle;
				font-size: 24px;
				color: #444444;
			}
		}
	}
	
	.title {
		color: #3595FF;
		font-size: 24px;
		text-align: center;
		line-height: 35px;
		font-weight: bold;
	}
	
	.titleSmall {
		margin-top: 10px;
		font-size: 14px;
		text-align: center;
		line-height: 20px;
	}
	
	.chooseBox {
		text-align: center
	}
	
	.choose {
		cursor: pointer;
		display: inline-block;
		padding: 10px;
		color: #616166;
		background: #F4F6F8;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 60px;
		margin-bottom: 100px;
		border-radius: 4px;
	}
	
	.choose i {
		font-size: 100px;
		color: #8E8E94
	}
	
	.tips {
		font-size: 16px
	}
	
	.choose_main {
		padding: 40px 80px
	}
	
	.choose_footer {
		border-top: 1px solid #DFE0E1;
		padding: 20px;
		font-size: 13px;
		line-height: 24px;
		max-width: 260px
	}
	
	.choose:hover {
		background: #3595FF;
		color: #FFF
	}
	
	.choose:hover i {
		color: #FFF
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
		width: 800px;
		padding: 10px;
		min-height: 220px
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