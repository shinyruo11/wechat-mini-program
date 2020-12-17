<template>
	<view>
		<view class="head">
			<!-- 搜索框 -->
			<input :value="value" :placeholder='placeholder' placeholder-class="placeholder-class" selection-start="20" @change="onChange" @input="onChange" @click="clickInput" class="input"/>
			<navigator class="cancel" open-type="navigateBack">取消</navigator>
		</view>
		<!-- 历史搜索 -->
		<view v-if="isHistory" class="history">
			<view class="history-title">
				<view class="title-left">历史搜索</view>
				<image src="../../static/delete-logo.png" @tap="clearHistory"></image>
			</view>
			<view class="history-group">
				<view v-for="(item,index) in history_search" :key='index' class="group-name">
					{{item}}
				</view>
			</view>
		</view>
		<!-- 搜索列表 -->
		<view class="list" v-if="isSearchList">
			<view class="list-group" v-for="item in search_list" :key="item.goods_id" @tap="goDetail(item)">
				{{item.goods_name}}
			</view>
		</view>
		<!-- 搜索为空提示 -->
		<van-empty image="search" class="search" description="暂无商品" v-if="isEmpty"/>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import './search.css'
	import vanEmpty from '../../wxcomponents/vant/dist/empty/index'
	import vanDialog from '../../wxcomponents/vant/dist/dialog/index'
	import Dialog from '../../wxcomponents/vant/dist/dialog/dialog'
	const api = require('../../utils/request.js')
	const time = -1 //定时器
	export default {
		components:{
			'van-empty':vanEmpty,
			'van-dialog':vanDialog,
			// Dialog
		},
		data() {
			return {
				value:'',
				placeholder:'请输入关键词搜索',
				search_list:[],//商品列表
				isSearchList:false,
				isEmpty:false,//搜索为空
				isHistory:false,//历史搜索
				history_search:[],
				query:'',
			}
		},
		onShow() {
			var history = uni.getStorageSync('history_search')
			if(history != ''){
				this.history_search = history
				this.isHistory = true
			}
			console.log(this.history_search)
		},
		methods: {
			//输入事件
			onChange(event){
				console.log(event)
				let query = event.detail.value.trim() //去除多余空格
				if(query == '' && this.history_search.length > 0){
					this.search_list = []
					this.isHistory=true
					return 
				}
				//防抖
				clearTimeout(this.time)
				this.time = setTimeout(() => {
					this.query = query
					this.getSearchList(query)
				},'1000')
			},
			//点击事件
			clickInput(){
				this.placeholder = ''
				this.isEmpty = false
				this.isHistory = false
			},
			//获取商品
			getSearchList(query){
				api.request('/goods/qsearch','GET',{
					query:query
				}).then(res => {
					this.isHistory = false
					console.log(res)
						if(res.data.message != null && res.data.message != ''){
							this.isSearchList = true
							this.isEmpty = false
							this.search_list = res.data.message
							return
						}
						this.isEmpty = true
						this.isSearchList = false
						console.log(this.search_list)
				})
			},
			//删除搜索历史
			clearHistory(){
				Dialog.confirm({
				  title: '',
				  message: '是否删除历史搜索',
				}).then(() => {
				    // on confirm
					this.history_search = []
					this.isHistory = false
					uni.removeStorage({
						key:'history_search',
					})
				  }).catch(() => {
				    // on cancel
				  });
			},
			//商品详情页
			goDetail(item){
				console.log(item)
				console.log((this.history_search))
				var i = this.history_search.indexOf(this.query)
				console.log(i)
				if(i == -1){
					this.history_search.push(this.query)
					uni.setStorage({
						key:'history_search',
						data:this.history_search
					})
				}
			}
		}
	}
</script>

<style>

</style>
