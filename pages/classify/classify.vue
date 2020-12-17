<template>
	<view>
		<!-- 搜索框 -->
		<navigator url="../search/search"  hover-class="none">
		<van-search
		  :value="value"
		  placeholder="请输入搜索关键词"
		  @tap="goSearch()"
		  class="search"
		> 
		</van-search>
		</navigator>
		<view style="height: 108rpx;"></view>
		<view class="classify">
		<scroll-view scroll-y="true" class="sidebar-left">
			<van-sidebar :active-key="activeKey">
				<van-sidebar-item v-for="item in classifyList" :key="item.cat_id" :title="item.cat_name" @tap="changeLeft(item)" />
			</van-sidebar>
		</scroll-view>
		<scroll-view scroll-y="true" class="sidebar-right">
			<view class="sidebar-right-group" v-for="item in rightList" :key='item.cat_id'>
				<view v-if="item.children">
					<view class="group-title">{{item.cat_name}}</view>
					<view class="group-list">
						<view v-for="childrenItem in item.children" :key="childrenItem.cat_id" class="group-box" @click="goGoodsList(childrenItem)">
							<image :src="childrenItem.cat_icon" class="group-list-image"></image>
							<view>{{childrenItem.cat_name}}</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="group-title">{{item.cat_name}}</view>
					<view class="group-list">
						<view class="group-box">
							<image :src="item.cat_icon" class="group-list-image"></image>
								<view>{{item.cat_name}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<van-toast id="van-toast" />
		</view>
	</view>
</template>

<script>
	const api = require('../../utils/request.js')
	import './classify.css'
	import vanSidebar from '../../wxcomponents/vant/dist/sidebar/index'
	import vanSidebarItem from '../../wxcomponents/vant/dist/sidebar-item/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import vantSearch from '../../wxcomponents/vant/dist/search/index'
	export default {
		components: {
			'van-sidebar': vanSidebar,
			'van-SidebarItem': vanSidebarItem,
			'van-toast':vanToast,
			'van-search':vantSearch
		},
		data() {
			return {
				classifyList: [],
				activeKey: 0,
				rightList: [],
			}
		},
		methods: {
			//分类数据
			getClassifyList() {
				api.request('/categories', 'GET').then(res => {
					console.log(res)
					if (res.data.meta.status == '200') {
						this.classifyList = res.data.message
						this.rightList = res.data.message[0].children
						console.log(this.rightList)
					} else {
						this.getClassifyList()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//切换分类
			changeLeft(item) {
				console.log(item.children)
				this.rightList = item.children
				uni.pageScrollTo({
					scrollTop: 0
				})
			},
			goGoodsList(childrenItem){
				console.log(childrenItem)
				uni.navigateTo({
					url: '../goods_list/goods_list?cid='+childrenItem.cat_id,
				});
			},
			goSearch(){
				
			}
		},
		onLoad() {
			Toast.loading({
			  message: '加载中...',
			  forbidClick: true,
			  duration:1500
			});
			this.getClassifyList()
		}
	}
</script>

<style>

</style>
