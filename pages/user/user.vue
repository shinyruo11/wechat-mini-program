<template>
	<view class="user">
		<view class="head">
			<view class="user-info" v-if="userInfo.avatarUrl">
				<image :src="userInfo.avatarUrl"></image>
				<view class="user-name">
					{{userInfo.nickName}}
				</view>
			</view>
			<view class="user-info" v-else>
				<image src="../../static/white.png"></image>
				<view class="user-name">
					<button open-type="getUserInfo" @getuserinfo="login" class="login-button">请登录</button>
				</view>
			</view>
		</view>
			<view class="goods-class">
				<view class="class-group">
					<image src="../../static/allorder.png"></image>
					<view>全部订单</view>
				</view>
				<view class="class-group">
					<image src="../../static/nopay.png"></image>
					<view>待支付</view>
				</view>
				<view class="class-group">
					<image src="../../static/deliver.png"></image>
					<view>已发货</view>
				</view>
				<view class="class-group">
					<image src="../../static/nodeliver.png"></image>
					<view>待发货</view>
				</view>
			</view>
				<van-toast id="van-toast" />
	</view>
</template>

<script>
	import './user.css'
	const api = require('../../utils/request.js')
	import vanToast from '../../wxcomponents/vant/dist/toast/index'
	import Toast from '../../wxcomponents/vant/dist/toast/toast'
	export default {
		components:{
			'van-toast':vanToast
		},
		data() {
			return {
				userInfo:[],//用户信息
			}
		},
		onLoad() {
		
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo') || []
			this.userInfo = userInfo
		},
		methods: {
			login(e){
				console.log(e)
				Toast.loading({
				  message: '登陆中',
				  forbidClick: true,
				  duration:1500
				});
				this.userInfo = e.detail.userInfo
				Toast.success('登录成功')
				uni.setStorageSync('userInfo',this.userInfo)
			}
		}
	}
</script>

<style>

</style>
