<template>
  <view class="cart-notifier" v-if="showNotification">
    <view class="cart-notification">
      <view class="notification-content">
        <text class="notification-icon">✓</text>
        <text class="notification-text">{{ notificationText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showNotification: false,
      notificationText: '已加入购物车',
      timer: null
    };
  },
  created() {
    // 监听购物车更新事件
    uni.$on('cart-updated', this.handleCartUpdated);
  },
  beforeDestroy() {
    // 移除事件监听
    uni.$off('cart-updated', this.handleCartUpdated);
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    handleCartUpdated(data) {
      this.showNotification = true;
      
      // 根据操作类型设置不同的通知文本
      if (data.action === 'add') {
        this.notificationText = '已加入购物车';
      } else if (data.action === 'remove') {
        this.notificationText = '已从购物车移除';
      } else if (data.action === 'update') {
        this.notificationText = '购物车已更新';
      }
      
      // 设置定时器，2秒后自动隐藏通知
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.showNotification = false;
      }, 2000);
    }
  }
};
</script>

<style>
.cart-notifier {
  position: fixed;
  top: 30%;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  pointer-events: none; /* 防止阻挡点击事件 */
}

.cart-notification {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16rpx 30rpx;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  color: #4CAF50;
  font-size: 36rpx;
  margin-right: 10rpx;
}

.notification-text {
  color: white;
  font-size: 28rpx;
}
</style> 