<template>
  <view class="container">
    <view class="header">
      <view class="header-title">订单确认</view>
    </view>
    
    <!-- Delivery Address -->
    <view class="address-card" @tap="chooseAddress">
      <view class="address-info" v-if="address">
        <view class="address-top">
          <text class="user-name">{{address.name}}</text>
          <text class="user-phone">{{address.phone}}</text>
        </view>
        <view class="address-detail">
          <text class="address-tag" v-if="address.tag">{{address.tag}}</text>
          <text class="address-text">{{address.province}}{{address.city}}{{address.district}}{{address.detail}}</text>
        </view>
      </view>
      <view class="no-address" v-else>
        <text class="no-address-text">请选择收货地址</text>
      </view>
      <image class="address-arrow" src="/static/arrow-right.png"></image>
    </view>
    
    <!-- Delivery Time -->
    <view class="time-card">
      <view class="time-header">配送时间</view>
      <view class="time-picker">
        <picker mode="multiSelector" :range="timeRange" @change="timeChange">
          <view class="picker-text">
            <text>{{selectedTime[0]}} {{selectedTime[1]}}</text>
            <image class="time-arrow" src="/static/arrow-right.png"></image>
          </view>
        </picker>
      </view>
    </view>
    
    <!-- Order Items -->
    <view class="order-card">
      <view class="store-info">
        <image class="store-logo" src="/static/store-logo.png"></image>
        <text class="store-name">营养食堂 - 健康分店</text>
      </view>
      
      <view class="divider"></view>
      
      <view class="order-items">
        <view class="order-item" v-for="(item, index) in orderItems" :key="index">
          <image :src="item.image" mode="aspectFill" class="item-image"></image>
          <view class="item-info">
            <text class="item-name">{{item.name}}</text>
            <view class="item-bottom">
              <text class="item-price">¥{{item.price}}</text>
              <text class="item-quantity">x{{item.quantity}}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="fee-item">
        <text class="fee-label">配送费</text>
        <text class="fee-value">¥{{deliveryFee.toFixed(2)}}</text>
      </view>
      
      <view class="remark">
        <text class="remark-label">备注</text>
        <input class="remark-input" placeholder="可以告诉我们您的特殊需求" v-model="remark" />
      </view>
    </view>
    
    <!-- Payment Method -->
    <view class="payment-card">
      <view class="payment-header">支付方式</view>
      <view class="payment-options">
        <view 
          class="payment-option" 
          v-for="(method, index) in paymentMethods" 
          :key="index"
          @tap="selectPayment(method.id)"
          :class="{ active: selectedPayment === method.id }"
        >
          <image :src="method.icon" class="payment-icon"></image>
          <text class="payment-name">{{method.name}}</text>
          <view class="payment-select" v-if="selectedPayment === method.id">
            <view class="select-dot"></view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Bottom Bar -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">实付款:</text>
        <text class="total-price">¥{{(totalPrice + deliveryFee).toFixed(2)}}</text>
      </view>
      <view class="submit-btn" @tap="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      address: {
        name: '张三',
        phone: '138****1234',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区8栋5楼',
        tag: '公司'
      },
      timeRange: [
        ['今天', '明天'],
        ['11:30-12:00', '12:00-12:30', '12:30-13:00', '17:30-18:00', '18:00-18:30', '18:30-19:00']
      ],
      selectedTime: ['今天', '12:00-12:30'],
      orderItems: [],
      totalPrice: 0,
      deliveryFee: 3.00,
      remark: '',
      paymentMethods: [
        { id: 'wxpay', name: '微信支付', icon: '/static/wxpay-icon.png' },
        { id: 'alipay', name: '支付宝', icon: '/static/alipay-icon.png' },
        { id: 'unionpay', name: '银联支付', icon: '/static/unionpay-icon.png' }
      ],
      selectedPayment: 'wxpay'
    };
  },
  onLoad() {
    // 加载结算商品
    const checkoutItems = uni.getStorageSync('checkout_items') || [];
    const checkoutTotal = uni.getStorageSync('checkout_total') || 0;
    
    this.orderItems = checkoutItems;
    this.totalPrice = checkoutTotal;
  },
  methods: {
    // 选择地址
    chooseAddress() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 时间选择
    timeChange(e) {
      const values = e.detail.value;
      this.selectedTime = [
        this.timeRange[0][values[0]],
        this.timeRange[1][values[1]]
      ];
    },
    
    // 选择支付方式
    selectPayment(id) {
      this.selectedPayment = id;
    },
    
    // 提交订单
    submitOrder() {
      // 检查地址
      if (!this.address) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        });
        return;
      }
      
      // 模拟下单成功
      uni.showLoading({
        title: '正在下单'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 清空购物车中已结算的商品
        const cart = uni.getStorageSync('cart') || [];
        const orderItemIds = this.orderItems.map(item => item.id);
        const newCart = cart.filter(item => !orderItemIds.includes(item.id));
        uni.setStorageSync('cart', newCart);
        
        // 清空结算数据
        uni.removeStorageSync('checkout_items');
        uni.removeStorageSync('checkout_total');
        
        // 跳转到支付页（这里模拟支付成功）
        uni.showToast({
          title: '下单成功',
          icon: 'success'
        });
        
        // 返回首页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/home'
          });
        }, 1500);
      }, 1000);
    }
  }
};
</script>

<style>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx; /* 为底部栏留出空间 */
}

.header {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.address-card {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.address-info {
  flex: 1;
}

.address-top {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.user-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.user-phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  display: flex;
  align-items: center;
}

.address-tag {
  font-size: 22rpx;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}

.address-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.no-address {
  flex: 1;
}

.no-address-text {
  font-size: 28rpx;
  color: #999;
}

.address-arrow {
  width: 32rpx;
  height: 32rpx;
}

.time-card, .order-card, .payment-card {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 30rpx;
}

.time-header, .payment-header {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.time-picker {
  margin-top: 10rpx;
}

.picker-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.time-arrow {
  width: 32rpx;
  height: 32rpx;
}

.store-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.store-logo {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 20rpx;
}

.store-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.divider {
  height: 1rpx;
  background-color: #f0f0f0;
  margin: 20rpx 0;
}

.order-items {
  margin-bottom: 20rpx;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 28rpx;
  color: #ff5000;
  font-weight: bold;
}

.item-quantity {
  font-size: 26rpx;
  color: #999;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
}

.fee-label {
  font-size: 28rpx;
  color: #333;
}

.fee-value {
  font-size: 28rpx;
  color: #ff5000;
}

.remark {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
}

.remark-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.remark-input {
  flex: 1;
  font-size: 28rpx;
  height: 60rpx;
}

.payment-options {
  margin-top: 20rpx;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.payment-option:last-child {
  border-bottom: none;
}

.payment-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.payment-name {
  font-size: 28rpx;
  color: #333;
}

.payment-select {
  position: absolute;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #4CAF50;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.price-info {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.price-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  color: #ff5000;
  font-weight: bold;
  margin-left: 10rpx;
}

.submit-btn {
  width: 240rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #4CAF50;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  border-radius: 35rpx;
}
</style> 