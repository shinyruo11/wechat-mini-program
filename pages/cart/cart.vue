<template>
	<view class="cart">
		<view class="cart-list" v-if="cartList.length>0">
			<checkbox-group  @change="onChange" >
			<view class="cart-group" v-for="item in cartList" :key="item.goods_id">
				<checkbox  :value="item.goods_id" @tap='change(item)'  :checked="item.checked" color="red" style="display: flex;align-items: center;transform:scale(0.8)"></checkbox>
				<view class="group-left">
					<image :src="item.goods_big_logo ? item.goods_big_logo : 'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg' "></image>
				</view>
				<view class="group-right">
				<view class="group-name">{{item.goods_name}}</view>
				<view class="group-price">
					<text class="price-icon">￥</text>
					<text class="price-number">{{item.goods_price}}</text>
					<view class="number">
						<view @click="subNumber(item)"  >-</view>
						<view class="num">{{item.num}}</view>
						<view @click="addNumber(item)">+</view>
					</view>
				</view>
				</view>
			</view>
			</checkbox-group>
		</view>
		<view style="height: 110rpx;"></view>
		<view class="sumbit-order" v-if="isShow">
			<checkbox-group  @click="AllCheck">
					<checkbox :checked="isAllChecked"  color="red" style="display: flex;align-items: center;"></checkbox>
				</checkbox-group>
				<view class="text">
				<text class="all">合计:</text>
				<text class="price-icon">￥</text>
				<text class="price-number">{{totalPrice}}</text>
				</view>
				<view class="button" @tap="goOrder">去结算({{totalNum}})</view>
		</view>
		<!-- 搜索为空提示 -->
		<van-empty image="search" class="search" description="购物车空空的" v-if="isEmpty"/>
			<van-toast id="van-toast" />
			<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import './cart.css'
	const api = require('../../utils/request.js')
	import vanEmpty from '../../wxcomponents/vant/dist/empty/index'
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	import vanButton from '../../wxcomponents/vant/dist/button/index'
	import Dialog from '../../wxcomponents/vant/dist/dialog/dialog'
	import vanDialog from '../../wxcomponents/vant/dist/dialog/index'
	export default {
		components:{
			'van-empty':vanEmpty,
			'van-toast':vanToast,
			'van-button':vanButton,
			'van-dialog':vanDialog 
		},
		data() {
			return {
				cartList:[],//购物车商品
				isEmpty:false,
				isAllChecked:false,
				isShow:false,
				totalPrice:0,
				totalNum:0
			}
		},
		onLoad() {
			Toast.loading({
			  message: '加载中',
			  forbidClick: true,
			  duration:1500
			});
		},
		onShow() {
			this.isEmpty = false
			let cartList = uni.getStorageSync('cart') || []
			this.cartList = cartList
			if(this.cartList.length > 0){
				this.isShow = true
			}else{
				this.isEmpty = true
			}
			
			this.setCart(this.cartList)
			console.log(cartList)
		},
		watch:{
		
		},
		methods: {
			//复选框改变事件
			onChange(e){
				console.log(e)
				if(e.detail.value.length < this.cartList.length){
					this.isAllChecked = false
				}else{
					this.isAllChecked = true
				}
			},
			//点击商品选中/取消选中
			change(item){
				console.log(item,'ee')
				let goods_id = item.goods_id
				let cartList = this.cartList
				let index = cartList.findIndex((v) => v.goods_id === goods_id )
				cartList[index].checked = !cartList[index].checked
				this.setCart(cartList)
			},
			//购物车状态
			setCart(cartList){
				if(cartList.length <= 0){
					this.isShow = false
					this.isEmpty = true
				}
				let allChecked = true
				let totalPrice = 0
				let totalNum = 0
				cartList.forEach((v,i) => {
					if(v.checked){
						totalPrice += v.num * v.goods_price
						totalNum += v.num
					}else{
						allChecked=false
					}
				})
				 allChecked = cartList.length !== 0 ? allChecked : false
				 this.isAllChecked=allChecked
				this.totalPrice = totalPrice
				this.totalNum = totalNum
				uni.setStorageSync('cart',cartList)
			},
			//减少
			subNumber(item){
				console.log(item)
				let cart = this.cartList
				let id = item.goods_id
				const index = cart.findIndex((v) => v.goods_id === id)
				if(item.num === 1){
					Dialog.confirm({
					  title: '温馨提示',
					  message: '商品将从购物车删除',
					})
					  .then(() => {
					    // on confirm
						cart.splice(index, 1)
						this.setCart(cart)
					  })
					  .catch(() => {
					  });
				}else{
					cart[index].num -= 1
					this.setCart(cart)
				}
			},
			//增加
			addNumber(item){
				console.log(item)
				let cart = this.cartList
				let id = item.goods_id
				const index = cart.findIndex((v) => v.goods_id === id)
				cart[index].num += 1
				this.setCart(cart)
			},
			//点击全选
			AllCheck(){
				let cart = this.cartList
				let isAllChecked = this.isAllChecked
				isAllChecked = !isAllChecked
				cart.forEach((v) => (v.checked = isAllChecked))
				this.cartList = cart
				this.isAllChecked = isAllChecked
				this.setCart(cart)
			},
			//结算
			goOrder(){
				if(this.totalNum === 0 ){
					Toast.fail({
					  message: '请选择商品',
					  forbidClick: true,
					});
				}else{
					uni.navigateTo({
						url:'../order/order'
					})
				}
			}
		}
	}
</script>

<style>

</style>
