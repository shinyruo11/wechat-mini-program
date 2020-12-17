<template>
	<view class="order">
			<view class="address" v-if="addressList.length === 0" url="../address_list/address_list" @tap="getAddress">
				<view class="text">请选择地址</view>
				<image src="../../static/arrow-right-bold.png"></image>
			</view>
			<view class="address"  v-else url="../address_list/address_list" @tap="getAddress">
				<view class="text">
					<view class="province">{{addressList.provinceName}}{{addressList.cityName}}{{addressList.countyName}}</view>
					<view class="detail">{{addressList.detailInfo}}</view>
					<view class="user">{{addressList.userName}}{{addressList.telNumber}}</view>
				</view>
				<image src="../../static/arrow-right-bold.png"></image>
			</view>
		<view class="cart-list" v-if="isoption == false">
			 <view class="cart-group" v-for="item in cartList" :key="item.goods_id">
				 <view class="group-left">
					  <image :src="item.goods_small_logo?item.goods_small_logo:'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'"></image>
				 </view>
				 <view class="group-right">
					 <view class="right-title">{{item.goods_name}}</view>
					 <view class="right-content">
						 <view class="right-price">
							 <text class="price-icon">￥</text>
							 <text class="price-number">{{item.goods_price}}</text>
						 </view> 
						 <view class="right-num">
							 x{{item.num}}
						 </view>
					 </view>
				 </view>
			 </view>
		</view>
		<view class="cart-list" v-if="isoption == true">
			 <view class="cart-group">
				 <view class="group-left">
					  <image :src="cartList.goods_small_logo?cartList.goods_small_logo:'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'"></image>
				 </view>
				 <view class="group-right">
					 <view class="right-title">{{cartList.goods_name}}</view>
					 <view class="right-content">
						 <view class="right-price">
							 <text class="price-icon">￥</text>
							 <text class="price-number">{{cartList.goods_price}}</text>
						 </view> 
						 <view class="right-num">
							 x{{cartList.num}}
						 </view>
					 </view>
				 </view>
			 </view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="order-bottom" v-if="isoption == false">
			<view class="bottom-left">
					 <text class="price-icon">￥</text>
					<text class="price-number">{{totalPrice}}</text>
			</view>
			<view class="bottom-right" @click="submitOrder">
				提交订单({{totalNumber}})
			</view>
		</view>
		<view class="order-bottom" v-if="isoption == true">
			<view class="bottom-left">
					 <text class="price-icon">￥</text>
					<text class="price-number">{{cartList.goods_price}}</text>
			</view>
			<view class="bottom-right" @click="submitOrder">
				提交订单
			</view>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import './order.css'
	const api = require('../../utils/request.js')
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	export default {
		components:{
			'van-toast':vanToast
		},
		data() {
			return {
				cartList: [], //商品数据
				addressList: [], //收货地址
				totalPrice: 0, //总金额
				totalNumber: 0, //总数量
				isoption:false,
			}
		},
		onLoad(option) {
			console.log(option,'optoin')
			if(option.id){
				this.isoption = true
				api.request('/goods/detail','GET',{
					goods_id: option.id
				}).then(res => {
						this.cartList = res.data.message
						console.log(res,this.cartList)
				})
			}else{
				this.isoption=false
			}
		},
		onShow() {
			let addressList = uni.getStorageSync('address') || []
			this.addressList = addressList
			let cart = uni.getStorageSync('cart') 
			cart = cart.filter((v) => v.checked)
			let totalPrice = 0
			let totalNum = 0
			cart.forEach((v, i) => {
			      totalPrice += v.num * v.goods_price
			      totalNum += v.num
			    })
			this.totalNumber = totalNum
			this.totalPrice = totalPrice
			this.cartList = cart
			console.log(this.cartList, '商品')
			console.log(this.addressList, '地址')
		},
		methods: {
			//获取地址
			getAddress(){
				wx.chooseAddress({
				    type: 'wgs84',
				    success: function (res) {
						console.log(res)
						uni.setStorageSync('address',res)
				    }
				});
			},
			//提交订单
			submitOrder(){
				if(this.addressList.length === 0 ){
					Toast.fail('请选择地址');
					var that =this
					setTimeout(function(){
						that.getAddress()
					},1500)
					return
				}
				var userInfo = uni.getStorageSync('userInfo')
				if(userInfo.length === 0){
					uni.switchTab({
						url:'../user/user'
					})
					return
				}
				Toast.loading({
				  message: '请稍等',
				  forbidClick: true,
				  loadingType: 'spinner',
				  duration:1000
				});
				if(this.isoption == false){
					let buyList = this.cartList
					//去除缓存中的购物车数据
					let cart = uni.getStorageSync('cart')
					//判断没有选中的商品更新购物车缓存
					let newCart = cart.filter((v) => !v.checked)
					uni.setStorageSync('cart',newCart)
				}
				setTimeout(function(){
					Toast.success({
						message: '下单成功',
						duration:1000
					});
				},1000)
				setTimeout(function(){
					uni.navigateBack({
						delta:1
					})
				},2000)
			}
		}
	}
</script>

<style>

</style>
