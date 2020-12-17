<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "/wxcomponents/vant/dist/common/index.wxss";
	.container{
		width: 690rpx;
		padding: 0 30rpx;
	}
	.search{
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		z-index: 5;
	}
	/* 微信样式 */
	/* #ifdef APP-PLUS ||MP-WEIXIN */
	checkbox .wx-checkbox-input {
	  border-radius: 50% !important;
	  color: #ffffff !important;
	}
	
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	  color: #fff;
	  background:red;
	}
	
	
	/* #endif */
</style>
