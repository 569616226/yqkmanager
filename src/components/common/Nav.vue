<template>
	<div style="height: 93.7vh;">
		<ul class="navBox" ref="menus">

			<li class="navPrimary" v-for="menu,index in menus">
				<span class="linka da_bg" :class="{active:menu.id == $route.meta.cid}" @click="MenuParent(index, menu.url)">
					<i :class="menu.icon"></i>
					{{ menu.description }}
					<i v-if="menu.children" :class="menu.is_show ? 'el-icon-arrow-down linka-icon-dow' : 'el-icon-arrow-down linka-icon-dow transformRight'"></i>
				</span>
				<ul class="navSecond" v-show="menu.is_show">
					<li v-for="child in menu.children" @click="$router.push({name: child.url})">
						<span class="linka zi_font" :class="{active:child.id == $route.meta.cid}">{{ child.description }}</span>
					</li>
				</ul>
			</li>

		</ul>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	export default {
		name: 'Nav',
		data() {
			return {
				activeMenu: '',
				// name用于高亮设置，url用于跳转
				menus: [{
					id: 1,
					name: 'Home',
					url: 'Home',
					description: '主页',
					icon: 'iconfont icon-home',
					is_show: true
				}, {
					id: 2,
					name: 'Mange',
					url: 'OrderMange',
					description: '管理',
					icon: 'iconfont icon-ic_assignment',
					is_show: true,
					children: [{
						id: 3,
						name: 'OrderMange',
						url: 'OrderMange',
						description: '订单管理',
						icon: '',
					}, {
						id: 4,
						name: 'DiagnoseMange',
						url: 'DiagnoseMange',
						description: '诊断标准管理',
						icon: '',
					}, {
						id: 5,
						name: 'CustomerMange',
						url: 'CustomerMange',
						description: '客户管理',
						icon: '',
					}, {
						id: 12,
						name: 'CustomerContactMange',
						url: 'CustomerContactMange',
						description: '客户联系人管理',
						icon: '',
					}]
				}, {
					id: 6,
					name: 'SetUp',
					url: 'PermissionsMange',
					description: '设置',
					icon: 'iconfont icon-settings',
					is_show: true,
					children: [{
						id: 7,
						name: 'PermissionsMange',
						url: 'PermissionsMange',
						description: '权限管理',
						icon: '',
					}, {
						id: 8,
						name: 'RoleMange',
						url: 'RoleMange',
						description: '角色管理',
						icon: '',
					}, {
						id: 9,
						name: 'UsersMange',
						url: 'UsersMange',
						description: '账号管理',
						icon: '',
					}, {
						id: 10,
						name: 'PubnuMange',
						url: 'PubnuMange',
						description: '公众号管理',
						icon: '',
					}, {
						id: 11,
						name: 'SysOperationLog',
						url: 'SysOperationLog',
						description: '系统操作日志',
						icon: '',
					}]
				}]
			}
		},
		computed: {
			...mapState([
				'MenusData'
			])
		},
		methods: {
			...mapActions([
				'getMenus'
			]),
			async getData() {
				if(this.MenusData.length == 0) {
					this.loading = true
				}
				await this.getMenus()
				this.loading = false
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			MenuParent(index, url) {
				if(url == 'Home'){
					this.$router.push({name: url})
				}else{
					this.menus[index].is_show = !this.menus[index].is_show
				}
			}
		},
		mounted() {
			//this.getData()
		},
		watch: {

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.el-menu-vertical-demo {
		border-right: none;
	}
	.transformRight{
		transform: rotate(-90deg);
	}
	
	.navBox {
		text-align: left;
		width: 230px;
		color: rgb(165, 172, 179);
		height: 93.7vh;
	}
	
	.navPrimary {}
	
	.navPrimary i {
		margin-right: 10px;
		color: #9A9A9A;
		vertical-align: middle;
		transition: transform .3s,-webkit-transform .3s;
	}
	
	.da_bg {
		background-color: rgb(3, 27, 55);
		font-size: 14px;
	}
	
	.zi_font {
		font-size: 13px;
		padding-left: 56px !important;
	}
	
	.navSecond li {
		margin-top: .6rem;
	}
	
	.linka {
		cursor: pointer;
		height: 56px;
		display: block;
		padding: 0 20px;
		line-height: 56px;
		&-icon-dow {
			float: right;
			margin-top: 22px;
		}
	}
	
	.linka:hover {}
	
	.linka.active,
	.linka.active i {
		background: rgb(0, 140, 244);
		color: #ffffff;
	}
</style>