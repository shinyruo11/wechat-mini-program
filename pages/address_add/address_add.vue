<template>
	<view>
		<van-cell-group>
		  <van-field
		    :value="username"
		    required
			clearable
		    label="收货人"
		    placeholder="请填写收货人姓名"
		  />
		  <van-field
		    :value="password"
			type="digit"
			clearable
			maxlength="11"
		    label="手机号码"
		    placeholder="请输入手机号码"
		    required
		  />
		  <van-field
		    :value="password"
		    label="所在地区"
		    placeholder="省市区县"
		    required
			readonly
			@tap="chooseAddress"
		  />
		</van-cell-group>
		<van-popup :show="show"  position="bottom" custom-style="height: 60%;">
			<!-- <van-area :area-list="areaList"  value="" @change="onChange"  @cancel="onClose" @confirm="onConfirm"/> -->
			<van-area :area-list="list" @confirm="confirm" />
		</van-popup>
	</view>
</template>

<script>
	import './address_add.css'
	import vanField from '../../wxcomponents/vant/dist/field/index'
	import vanPopup from '../../wxcomponents/vant/dist/popup/index'
	import vanArea from '../../wxcomponents/vant/dist/area/index'
	import address from '../../utils/address.js'
	export default {
		components:{
			'van-field':vanField,
			'van-popup':vanPopup,
			'van-area':vanArea
		},
		data() {
			return {
				show:false,
				areaList:{
					 
					  },
				value:'110011'	,
				  list:{
					  province_list: {
					     110000: '北京市',
					     120000: '天津市'
					   },
					   city_list: {
					     110100: '北京市',
					     110200: '县',
					     120100: '天津市',
					     120200: '县'
					   },
					   county_list: {
					     110101: '东城区',
					     110102: '西城区',
					     110105: '朝阳区',
					     110106: '丰台区',
					     120101: '和平区',
					     120102: '河东区',
					     120103: '河西区',
					     120104: '南开区',
					     120105: '河北区',
					   }
				  }
			}
		},
		onShow() {
			console.log(address)
			this.areaList = address
			console.log(this.areaList)
			console.log(typeof(this.areaList))
		},
		methods: {
			getlocation(){
				wx.chooseAddress({
				    type: 'wgs84',
				    success: function (res) {
						console.log(res)
						uni.setStorageSync('address',res)
				    }
				});
			},
			//选择省市区
			chooseAddress(){
				console.log('ii')
				this.show = true
			},
			//关闭省市区
			onClose(){
				this.show = false
			},
			//确认
			confirm(event){
				console.log('okko',event)
			},
			onChange(event){
				 console.log(event)
			},
		}
	}
</script>

<style>

</style>

 