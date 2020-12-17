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
		<view class="serach-list">
			<navigator :url="'../goods_detail/goods_detail?goods_id='+item.goods_id" class="serach-group" v-for="item in search_list" :key="item.cat_id">
				<view class="group-left">
					<image :src="item.goods_big_logo ? item.goods_big_logo:'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'"></image>
				</view>
				<view class="group-right">
					<view class="right-name">{{item.goods_name}}</view>
					<view class="right-price">
						<text class="price-icon">￥</text>
						<text class="price-number">{{item.goods_price}}</text>
					</view>
					<view class="right-number">剩余{{item.goods_number}}件</view>
					<view class="divider"></view>
				</view>
			</navigator>
		</view>
			<uni-load-more :status="status"></uni-load-more>
			<van-toast id="van-toast"/>
	</view>
</template>

<script>
	const page = 1
	import vantSearch from '../../wxcomponents/vant/dist/search/index'
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	import './goods_list.css'
	const api = require('../../utils/request.js')
	export default {
		components:{
			'van-search':vantSearch,
			'van-toast':vanToast,
		},
		data() {
			return {
				value:'',
				search_list:[],//商品
				// 接口参数
				 QueryParams: {
				   query: '',
				   cid: '',
				   pagenum: 1,
				   pagesize: 15,
				 },
			}
		},
		methods: {
			goSearch(){
				
			},
			//商品数据
			getSearchList(){
				api.request('/goods/search','GET',this.QueryParams).then(res => {
					if(res.data.meta.status == 200){
						this.search_list = res.data.message.goods
						uni.stopPullDownRefresh();	//数据加载完成,刷新结束
						uni.hideNavigationBarLoading();	//数据读取完毕,刷新停止
						console.log(this.search_list)
					}else{
						this.getSearchList()
					}
				})
			},
			loding(){
				Toast.loading({
				  message: '加载中',
				  forbidClick: true,
				  duration:1000
				});
			},
			getMoreSearchList(){
				this.loding()
				api.request('/goods/search','GET',this.QueryParams).then(res => {
					console.log(res)
					if(res.data.message.goods.length < 1){
						Toast.fail('没有更多数据');
						return
					}
					this.search_list = this.search_list.concat(res.data.message.goods)
				})
			}
		},
		onLoad(option) {
			console.log(option)
			this.loding()
			this.QueryParams.query = option.query || ''
			this.QueryParams.cid = option.cid || ''
			this.getSearchList()
		},
		onReachBottom(){
			this.QueryParams.pagenum++
			this.getMoreSearchList()
		}
	}
</script>

<style>

</style>
