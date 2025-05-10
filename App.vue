<script>
	import CartNotifier from './components/CartNotifier.vue';
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// 初始化一些数据
			this.initAppData();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 初始化应用数据
			initAppData() {
				try {
					// 如果没有初始化过模拟数据，则初始化
					let hasInit = false;
					try {
						hasInit = uni.getStorageSync('has_init_data');
					} catch (e) {
						console.warn('Error getting storage data:', e);
					}
					
					if (!hasInit) {
						// 这里可以初始化一些应用需要的基础数据
						// 比如默认的收货地址、用户信息等
						
						// 标记已初始化
						try {
							uni.setStorageSync('has_init_data', true);
						} catch (e) {
							console.warn('Error setting storage data:', e);
						}
					}
				} catch (err) {
					console.error('初始化数据失败:', err);
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
		font-size: 28rpx;
		line-height: 1.5;
		color: #333;
		background-color: #f5f5f5;
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
	}

	/* 通用样式 */
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.flex-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.text-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.text-primary {
		color: #4CAF50;
	}

	.text-price {
		color: #ff5000;
	}

	.text-grey {
		color: #999;
	}

	.text-bold {
		font-weight: bold;
	}

	.btn-primary {
		background-color: #4CAF50;
		color: #fff;
		border-radius: 8rpx;
		font-size: 28rpx;
		padding: 16rpx 30rpx;
		text-align: center;
	}

	.btn-round {
		border-radius: 100rpx;
	}

	.btn-outline {
		background-color: transparent;
		color: #4CAF50;
		border: 1rpx solid #4CAF50;
	}

	.card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.divider {
		height: 1rpx;
		background-color: #f0f0f0;
		margin: 20rpx 0;
	}
</style>
