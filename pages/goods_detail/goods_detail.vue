<template>
	<view class="goods-detail">
		<!-- 轮播图 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2500" :duration="500" circular="true"
		 indicator-active-color="#DC4D41" indicator-color="white" v-if="goods_detail.pics.length > 0">
			<swiper-item v-for="item in goods_detail.pics" :key="item.pics_id">
				<image :src="item.pics_mid_url" class="swiper-img"></image>
			</swiper-item>
		</swiper>
		<image v-else src="https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg" width="100%"></image>
		<view class="detail-title">
			<view class="title-price">
				<view class="price-left">
					<text class="price-icon">￥</text>
					<text class="price-number">{{goods_detail.goods_price}}</text>
				</view>
				<view class="price-right">
					<image src="../../static/collect.png" @tap="collect(goods_detail)" v-if="isCollect == false"></image>
					<image src="../../static/collect-active.png" @tap="collect(goods_detail)" v-if="isCollect == true"></image>
				</view>
			</view>
			<view class="title-name">{{goods_detail.goods_name}}</view>
		</view>
		<view class="divider"></view>
		<van-divider contentPosition="center">详情</van-divider>
		<view class="specification">
			<view class="specification-title">规格参数</view>
			<van-cell-group>
				<van-cell v-for="item in goods_detail.attrs" :key="item.attr_id" :title="item.attr_name" :value="item.attr_vals" />
			</van-cell-group>
			<view class="rich-text">
				<rich-text :nodes="goods_detail.goods_introduce"></rich-text>
			</view>
			<image :src="item.pics_mid_url" v-for="item in goods_detail.pics" :key="item.pics_id" class="specification-image"></image>
		</view>
		<van-toast id="van-toast" />
		<view class="goods-action"></view>
		<van-goods-action>
			<van-goods-action-icon icon="chat-o" text="客服" />
			<navigator url="../cart/cart" open-type="switchTab">
				<van-goods-action-icon icon="cart-o" text="购物车" :info="cartList_length"/>
			</navigator>
			<van-goods-action-button text="加入购物车" type="warning"  @tap="addCart"/>
			<van-goods-action-button text="立即购买" @tap="goOrder"/>
		</van-goods-action>
	</view>
</template>

<script>
	import './goods_detail.css'
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	import vanDivider from '../../wxcomponents/vant/dist/divider/index'
	import vanCell from '../../wxcomponents/vant/dist/cell/index'
	import vanCellGroup from '../../wxcomponents/vant/dist/cell-group/index'
	import vanGoodsAction from '../../wxcomponents/vant/dist/goods-action/index'
	import vanGoodsActionIcon from '../../wxcomponents/vant/dist/goods-action-icon/index'
	import vanGoodsActionButton from '../../wxcomponents/vant/dist/goods-action-button/index'
	const api = require('../../utils/request.js')
	export default {
		components: {
			'van-toast': vanToast,
			'van-divider': vanDivider,
			'van-cell': vanCell,
			'van-cell-group': vanCellGroup,
			'van-goods-action': vanGoodsAction,
			'van-goods-action-icon': vanGoodsActionIcon,
			'van-goods-action-button': vanGoodsActionButton
		},
		data() {
			return {
				goods_detail: [],
				isCollect: false,//是否收藏
				cartList:[],//购物车
				cartList_length:''
			}
		},
		onLoad(option) {
			console.log(option)
			Toast.loading({
				message: '加载中',
				forbidClick: true,
				duration: 1000
			});
			this.cartList = uni.getStorageSync('cart') || []
			this.cartList_length = this.cartList.length
			let goods_id = option.goods_id
			this.getGoodsDetail(goods_id)
		},
		watch:{
			cartList:{
				  handler(val, oldVal){
				        this.cartList = val
				 },
			}
		},
		methods: {
			getGoodsDetail(goods_id) {
				api.request('/goods/detail', 'GET', {
					goods_id: goods_id
				}).then(res => {
					res.data.message.goods_introduce=res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
					this.goods_detail = res.data.message
					let collect = uni.getStorageSync('collect') || []
					let isCollect = collect.some((v) => v.goods_id === this.goods_detail.goods_id)
					this.isCollect = isCollect
				}).catch(err => {
					console.log(err)
				})
			},
			//收藏
			collect(goods_detail) {
				console.log(goods_detail)
				//商品是否收藏
				let collect = uni.getStorageSync('collect') || []
				let index = collect.findIndex((v) => v.goods_id === this.goods_detail.goods_id)
				if (this.isCollect == false) {
					collect.push(this.goods_detail)
					this.isCollect = true
					Toast.success({
						message: '收藏成功',
						forbidClick: true,
					})
				} else {
					collect.splice(index, 1)
					this.isCollect = false
					Toast.success({
						message: '已取消',
						forbidClick: true,
					})
				}
				uni.setStorageSync('collect', collect)
			},
			//加入购物车
			addCart(){
				//查询缓存中的购物车信息
				let cart = uni.getStorageSync('cart') || [] 
				//商品是否在购物车
				 let index = cart.findIndex((v) => {
				      return v.goods_id === this.goods_detail.goods_id
				    })
				//如果为-1 则购物车里没有该商品
				if(index === -1){
					this.goods_detail.num = 1
					this.goods_detail.checked = true
					cart.push(this.goods_detail) 
				}else{
					cart[index].num++
				}
				//存入缓存
				uni.setStorageSync('cart',cart)
				Toast.success({
					message:'已加入购物车',
					forbidClick:true
				})
				this.cartList = uni.getStorageSync('cart')
				this.cartList_length = this.cartList.length
			},
			//下单
			goOrder(){
				console.log(this.goods_detail)
				uni.navigateTo({
					url:'../order/order?id='+this.goods_detail.goods_id
				})
			}
		}
	}
</script>

<style>

</style>
