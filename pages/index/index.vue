<template>
	<view>
		<!-- 搜索框 -->
		<navigator url="../search/search"  hover-class="none">
			<van-search
			  :value="value"
			  shape="round"
			  background="#F96738"
			  placeholder="请输入搜索关键词"
			> 
			</van-search>
		</navigator>
		<!-- 轮播图 -->
		<swiper class="swiper"  :indicator-dots="true" :autoplay="true" :interval="2500" :duration="500" circular="true" indicator-active-color="#DC4D41" 
		indicator-color="white">
			<swiper-item v-for="item in slideshow" :key="item.goods_id">
				<image :src="item.image_src" class="swiper-img"></image>
			</swiper-item>
		</swiper>
		<!-- 导航 -->
		<view class="navigation-bar">
			<view  class="navigation-bar-box" v-for="(item,index) in navigationList" :key="index">
				<image :src="item.image_src" @tap="goNavigation(item,index)"></image>
			</view>
		</view>
		<!-- 楼层 -->
		<view class="floor-list">
			<view class="floor-group" v-for="(item,index) in floorList" :key="index">
				<image :src="item.floor_title.image_src" class="floor-title-image"></image>
				<view  class="floor-image-list">
						<view  v-for="(product,product_index) in item.product_list" :key="product_index"  @click="goGoodsList(product,product_index)"  :class="product_index == 0? 'floor-image-first':'floor-image-box'" >
							<image :src="product.image_src"></image>
						</view>
				</view>
			</view>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>
<script>
	import vantButton from '../../wxcomponents/vant/dist/button/index'
	import vantSearch from '../../wxcomponents/vant/dist/search/index'
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	import './index.css'
	const api = require('../../utils/request.js')
	const time = -1
	export default {
		components:{
			'van-button':vantButton,
			'van-search':vantSearch,
			'van-toast':vanToast
		},
		data() {
			return {
				slideshow:[],//轮播图
				value:'',
				navigationList:[],//分类导航
				floorList:[],//楼层导航
			}
		},
		onLoad() {
			this.loding()
			this.getSwiperImg()
			this.getNavigationList()
			this.getFloorList()
		},
		onPullDownRefresh(){
			//防止频繁下拉
			this.loding()
			clearTimeout(this.time)
			this.time = setTimeout(() => {
				this.getSwiperImg()
				this.getNavigationList()
				this.getFloorList()
				setTimeout(function(){
					uni.stopPullDownRefresh();
					Toast.success('刷新成功');
				},1000)
			},1000)
		},
		methods: {
			//轮播图
			getSwiperImg(){
				api.request('/home/swiperdata','GET').then(res=>{
					if(res.data.meta.status == 200){
						this.slideshow = res.data.message
					}else{
						this.getSwiperImg()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//分类导航
			getNavigationList(){
				api.request('/home/catitems','GET').then(res => {
					if(res.data.meta.status == 200){
						this.navigationList = res.data.message
					}else{
						this.getNavigationList()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//楼层导航
			getFloorList(){
				api.request('/home/floordata','GET').then(res => {
					if(res.data.meta.status == 200){
						this.floorList = res.data.message
					}else{
						this.getFloorList()
					}
				})
			},
			//分类导航跳转
			goNavigation(item,index){
				console.log(item,index)
			},
			//loading
			loding(){
				Toast.loading({
				  message: '加载中',
				  forbidClick: true,
				  duration:1500
				});
			},
			//商品列表页
			goGoodsList(product,product_index){
				console.log(product.navigator_url)
			    var queryWord = product.navigator_url.split('?')[1]
				uni.navigateTo({
					url: '../goods_list/goods_list?'+queryWord,
				});
			}
		}
	}
</script>

<style>
	
</style>
