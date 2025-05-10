<template>
  <view class="container">
    <!-- User Profile Header -->
    <view class="user-header">
      <view class="user-info">
        <image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
        <view class="info-box">
          <text class="username">用户123456</text>
          <view class="member-badge">
            <image class="member-icon" src="/static/member-icon.png"></image>
            <text class="member-text">营养会员</text>
          </view>
        </view>
      </view>
      
      <!-- Nutrition Stats -->
      <view class="stats-box">
        <view class="stat-item">
          <text class="stat-value">237</text>
          <text class="stat-label">卡路里记录</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">26</text>
          <text class="stat-label">订单数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">15</text>
          <text class="stat-label">优惠券</text>
        </view>
      </view>
    </view>
    
    <!-- Nutrition Analysis -->
    <view class="card nutrition-analysis">
      <view class="card-header">
        <text class="card-title">营养分析</text>
        <text class="card-action" @tap="navigateToAnalysis">查看详情</text>
      </view>
      <view class="nutrition-chart">
        <view class="chart-item" v-for="(item, index) in nutritionData" :key="index">
          <view class="chart-bar">
            <view class="chart-bar-inner" :style="{ width: item.percentage + '%', backgroundColor: item.color }"></view>
          </view>
          <view class="chart-info">
            <text class="chart-label">{{item.label}}</text>
            <text class="chart-value">{{item.value}}{{item.unit}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Orders -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">我的订单</text>
        <text class="card-action" @tap="navigateToOrders">查看全部</text>
      </view>
      <view class="order-options">
        <view class="order-option" @tap="navigateToOrders('unpaid')">
          <image class="option-icon" src="/static/unpaid-icon.png"></image>
          <text class="option-text">待付款</text>
          <view class="badge" v-if="orderCounts.unpaid > 0">{{orderCounts.unpaid}}</view>
        </view>
        <view class="order-option" @tap="navigateToOrders('undelivered')">
          <image class="option-icon" src="/static/undelivered-icon.png"></image>
          <text class="option-text">待配送</text>
          <view class="badge" v-if="orderCounts.undelivered > 0">{{orderCounts.undelivered}}</view>
        </view>
        <view class="order-option" @tap="navigateToOrders('delivered')">
          <image class="option-icon" src="/static/delivered-icon.png"></image>
          <text class="option-text">已配送</text>
        </view>
        <view class="order-option" @tap="navigateToOrders('completed')">
          <image class="option-icon" src="/static/completed-icon.png"></image>
          <text class="option-text">已完成</text>
        </view>
      </view>
    </view>
    
    <!-- Services -->
    <view class="menu-list">
      <view class="menu-item" @tap="navigateToNutritionPlan">
        <view class="menu-item-left">
          <image class="menu-icon" src="/static/nutrition-plan-icon.png"></image>
          <text class="menu-text">我的营养方案</text>
        </view>
        <image class="arrow-icon" src="/static/arrow-right.png"></image>
      </view>
      
      <view class="menu-item" @tap="navigateToCoupon">
        <view class="menu-item-left">
          <image class="menu-icon" src="/static/coupon-icon.png"></image>
          <text class="menu-text">优惠券</text>
        </view>
        <view class="menu-right">
          <text class="menu-value">15张可用</text>
          <image class="arrow-icon" src="/static/arrow-right.png"></image>
        </view>
      </view>
      
      <view class="menu-item" @tap="navigateToAddress">
        <view class="menu-item-left">
          <image class="menu-icon" src="/static/address-icon.png"></image>
          <text class="menu-text">收货地址</text>
        </view>
        <image class="arrow-icon" src="/static/arrow-right.png"></image>
      </view>
      
      <view class="menu-item" @tap="navigateToFeedback">
        <view class="menu-item-left">
          <image class="menu-icon" src="/static/feedback-icon.png"></image>
          <text class="menu-text">意见反馈</text>
        </view>
        <image class="arrow-icon" src="/static/arrow-right.png"></image>
      </view>
      
      <view class="menu-item" @tap="navigateToSettings">
        <view class="menu-item-left">
          <image class="menu-icon" src="/static/settings-icon.png"></image>
          <text class="menu-text">设置</text>
        </view>
        <image class="arrow-icon" src="/static/arrow-right.png"></image>
      </view>
    </view>
    
    <!-- Version Info -->
    <text class="version-info">营养食堂 v1.0.0</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      nutritionData: [
        { label: '蛋白质', value: 78, unit: 'g', percentage: 78, color: '#4CAF50' },
        { label: '碳水化合物', value: 132, unit: 'g', percentage: 55, color: '#2196F3' },
        { label: '脂肪', value: 42, unit: 'g', percentage: 42, color: '#FF9800' },
        { label: '纤维素', value: 18, unit: 'g', percentage: 60, color: '#9C27B0' }
      ],
      orderCounts: {
        unpaid: 1,
        undelivered: 2,
        delivered: 0,
        completed: 0
      }
    };
  },
  methods: {
    // 营养分析页面
    navigateToAnalysis() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 订单页面
    navigateToOrders(status) {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 营养方案页面
    navigateToNutritionPlan() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 优惠券页面
    navigateToCoupon() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 地址管理页面
    navigateToAddress() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 意见反馈页面
    navigateToFeedback() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    
    // 设置页面
    navigateToSettings() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    }
  }
};
</script>

<style>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.user-header {
  background-color: #4CAF50;
  padding: 40rpx 30rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.info-box {
  margin-left: 30rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.member-badge {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  padding: 4rpx 16rpx;
  display: inline-flex;
}

.member-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 8rpx;
}

.member-text {
  font-size: 22rpx;
}

.stats-box {
  display: flex;
  justify-content: space-around;
  margin-top: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  margin-top: 6rpx;
  opacity: 0.8;
}

.card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.card-action {
  font-size: 24rpx;
  color: #999;
}

.nutrition-chart {
  margin-top: 20rpx;
}

.chart-item {
  margin-bottom: 20rpx;
}

.chart-info {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.chart-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}

.chart-bar-inner {
  height: 100%;
  border-radius: 8rpx;
}

.order-options {
  display: flex;
  justify-content: space-between;
}

.order-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.option-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.option-text {
  font-size: 24rpx;
  color: #666;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff5000;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-list {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
}

.menu-right {
  display: flex;
  align-items: center;
}

.menu-value {
  font-size: 24rpx;
  color: #999;
  margin-right: 10rpx;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

.version-info {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 60rpx;
}
</style> 