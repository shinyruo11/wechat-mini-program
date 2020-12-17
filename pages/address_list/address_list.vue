<template>
	<view>
		<navigator url="../address_add/address_add">
			<view class="button-add">+添加收货地址</view>
		</navigator>
		<van-empty image="error" description="暂无收货地址" v-if="isEmpty"/>
	</view>
</template>

<script>
	import './address_list.css'
	import vanEmpty from '../../wxcomponents/vant/dist/empty/index'
	export default {
		components:{
			'van-empty':vanEmpty
		},
		data() {
			return {
				addressList:[],
				isEmpty:false
			}
		},
		onShow() {
			let addressList = uni.getStorageSync('address') || []
			if(addressList.length === 0){
				this.isEmpty = true
			}
			console.log(addressList)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
