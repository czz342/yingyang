<template>
  <view class="container">
    <!-- Empty Cart -->
    <view class="empty-cart" v-if="cartItems.length === 0">
      <image src="/static/empty-cart.png" mode="aspectFit" class="empty-cart-image"></image>
      <text class="empty-cart-text">购物车还是空的</text>
      <view class="go-shopping-btn" @tap="goShopping">去点餐</view>
    </view>
    
    <!-- Cart Items -->
    <view class="cart-content" v-else>
      <view class="cart-header">
        <view class="cart-title">购物车</view>
        <view class="clear-cart" @tap="showClearCartConfirm">清空购物车</view>
      </view>
      
      <view class="cart-items">
        <view class="cart-item" v-for="(item, index) in cartItems" :key="index">
          <view class="item-left">
            <view class="checkbox" @tap="toggleSelect(item)">
              <view class="checkbox-inner" :class="{ selected: item.selected }"></view>
            </view>
          </view>
          
          <image :src="item.image" mode="aspectFill" class="item-image" @tap="navigateToDish(item.id)"></image>
          
          <view class="item-info">
            <text class="item-name" @tap="navigateToDish(item.id)">{{item.name}}</text>
            <text class="item-tags" v-if="item.tags && item.tags.length">{{item.tags.join(' · ')}}</text>
            
            <view class="item-nutrition">
              <text class="nutrition-text">热量: {{item.calories}}kcal</text>
              <text class="nutrition-text">蛋白质: {{item.nutrition.protein}}</text>
            </view>
            
            <view class="item-bottom">
              <text class="item-price">¥{{item.price}}</text>
              
              <view class="quantity-control">
                <view class="quantity-btn minus" @tap="decreaseQuantity(item)">-</view>
                <text class="quantity">{{item.quantity}}</text>
                <view class="quantity-btn plus" @tap="increaseQuantity(item)">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Nutrition Summary -->
      <view class="nutrition-summary" v-if="hasSelectedItems">
        <view class="summary-header">
          <text class="summary-title">营养摄入总量</text>
        </view>
        <view class="nutrition-bars">
          <view class="nutrition-bar">
            <view class="bar-label">
              <text>热量</text>
              <text>{{totalCalories}}kcal</text>
            </view>
            <view class="bar-container">
              <view class="bar-progress" :style="{width: caloriesPercentage + '%', backgroundColor: caloriesWarning ? '#ff5000' : '#4CAF50'}"></view>
            </view>
            <text class="bar-warning" v-if="caloriesWarning">超出推荐值</text>
          </view>
          
          <view class="nutrition-bar">
            <view class="bar-label">
              <text>蛋白质</text>
              <text>{{totalProtein}}</text>
            </view>
            <view class="bar-container">
              <view class="bar-progress" :style="{width: proteinPercentage + '%', backgroundColor: proteinWarning ? '#ff5000' : '#4CAF50'}"></view>
            </view>
            <text class="bar-warning" v-if="proteinWarning">超出推荐值</text>
          </view>
          
          <view class="nutrition-bar">
            <view class="bar-label">
              <text>碳水化合物</text>
              <text>{{totalCarbs}}</text>
            </view>
            <view class="bar-container">
              <view class="bar-progress" :style="{width: carbsPercentage + '%', backgroundColor: carbsWarning ? '#ff5000' : '#4CAF50'}"></view>
            </view>
            <text class="bar-warning" v-if="carbsWarning">超出推荐值</text>
          </view>
          
          <view class="nutrition-bar">
            <view class="bar-label">
              <text>脂肪</text>
              <text>{{totalFat}}</text>
            </view>
            <view class="bar-container">
              <view class="bar-progress" :style="{width: fatPercentage + '%', backgroundColor: fatWarning ? '#ff5000' : '#4CAF50'}"></view>
            </view>
            <text class="bar-warning" v-if="fatWarning">超出推荐值</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Bottom Bar -->
    <view class="bottom-bar" v-if="cartItems.length > 0">
      <view class="select-all" @tap="toggleSelectAll">
        <view class="checkbox">
          <view class="checkbox-inner" :class="{ selected: allSelected }"></view>
        </view>
        <text class="select-all-text">全选</text>
      </view>
      
      <view class="price-info">
        <view class="total-price-line">
          <text class="total-label">合计:</text>
          <text class="total-price">¥{{totalPrice.toFixed(2)}}</text>
        </view>
        <text class="delivery-info">不含配送费</text>
      </view>
      
      <view class="checkout-btn" :class="{ disabled: !hasSelectedItems }" @tap="checkout">
        去结算 ({{selectedCount}})
      </view>
    </view>
    
    <!-- Nutrition Warning Dialog -->
    <view class="warning-dialog" v-if="showWarningDialog">
      <view class="warning-content">
        <view class="warning-header">
          <text class="warning-title">营养摄入提醒</text>
        </view>
        <view class="warning-body">
          <text class="warning-text">您的餐品营养摄入存在以下情况：</text>
          <view class="warning-items">
            <text class="warning-item" v-if="caloriesWarning">热量: 超出推荐值 {{(totalCalories - 700).toFixed(0)}} kcal</text>
            <text class="warning-item" v-if="proteinWarning">蛋白质: 超出推荐值 {{getExcessAmount(totalProtein, '50g')}} </text>
            <text class="warning-item" v-if="carbsWarning">碳水化合物: 超出推荐值 {{getExcessAmount(totalCarbs, '90g')}} </text>
            <text class="warning-item" v-if="fatWarning">脂肪: 超出推荐值 {{getExcessAmount(totalFat, '30g')}} </text>
          </view>
          <text class="warning-suggestion">建议: 您可以调整餐品搭配，以达到更均衡的营养摄入。</text>
        </view>
        <view class="warning-actions">
          <view class="warning-btn cancel" @tap="closeWarningDialog">调整餐品</view>
          <view class="warning-btn confirm" @tap="proceedCheckout">继续结算</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      showWarningDialog: false,
      // 营养参考值（单位：每餐）
      nutritionReference: {
        calories: 700,    // 卡路里(kcal)
        protein: '50g',   // 蛋白质(g) 
        carbs: '90g',     // 碳水化合物(g)
        fat: '30g'        // 脂肪(g)
      },
      proceedToCheckout: false
    };
  },
  computed: {
    allSelected() {
      return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
    },
    hasSelectedItems() {
      return this.cartItems.some(item => item.selected);
    },
    selectedCount() {
      return this.cartItems.reduce((count, item) => {
        return count + (item.selected ? item.quantity : 0);
      }, 0);
    },
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.selected ? item.price * item.quantity : 0);
      }, 0);
    },
    // 营养总量计算
    totalCalories() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.selected ? item.calories * item.quantity : 0);
      }, 0);
    },
    totalProtein() {
      return this.sumNutrient(this.cartItems, 'protein');
    },
    totalCarbs() {
      return this.sumNutrient(this.cartItems, 'carbs');
    },
    totalFat() {
      return this.sumNutrient(this.cartItems, 'fat');
    },
    // 营养百分比计算（相对于参考值）
    caloriesPercentage() {
      return Math.min(100, (this.totalCalories / this.nutritionReference.calories) * 100);
    },
    proteinPercentage() {
      return Math.min(100, (this.getNutrientValue(this.totalProtein) / this.getNutrientValue(this.nutritionReference.protein)) * 100);
    },
    carbsPercentage() {
      return Math.min(100, (this.getNutrientValue(this.totalCarbs) / this.getNutrientValue(this.nutritionReference.carbs)) * 100);
    },
    fatPercentage() {
      return Math.min(100, (this.getNutrientValue(this.totalFat) / this.getNutrientValue(this.nutritionReference.fat)) * 100);
    },
    // 营养超标警告
    caloriesWarning() {
      return this.totalCalories > this.nutritionReference.calories;
    },
    proteinWarning() {
      return this.getNutrientValue(this.totalProtein) > this.getNutrientValue(this.nutritionReference.protein);
    },
    carbsWarning() {
      return this.getNutrientValue(this.totalCarbs) > this.getNutrientValue(this.nutritionReference.carbs);
    },
    fatWarning() {
      return this.getNutrientValue(this.totalFat) > this.getNutrientValue(this.nutritionReference.fat);
    },
    // 是否有任何营养超标警告
    hasNutritionWarnings() {
      return this.caloriesWarning || this.proteinWarning || this.carbsWarning || this.fatWarning;
    }
  },
  onShow() {
    // 每次显示购物车页面时都重新加载数据
    this.loadCartItems();
  },
  methods: {
    // 加载购物车数据
    loadCartItems() {
      try {
        let cart = [];
        try {
          cart = uni.getStorageSync('cart') || [];
        } catch (e) {
          console.warn('Error getting cart from storage:', e);
          // Try to get from store if available
          if (this.$store && this.$store.state.cart) {
            cart = this.$store.state.cart;
          }
        }
        // 为每个商品添加selected属性(默认选中)
        this.cartItems = cart.map(item => ({
          ...item,
          selected: true
        }));
      } catch (err) {
        console.error('Load cart items failed:', err);
        this.cartItems = [];
      }
    },
    
    // 计算营养素总和（如蛋白质、碳水、脂肪）
    sumNutrient(items, nutrientType) {
      const totalValue = items.reduce((total, item) => {
        if (!item.selected) return total;
        
        const nutrientValue = item.nutrition[nutrientType];
        // 提取数值部分（去掉单位如"g"）
        const value = parseInt(nutrientValue);
        return total + (value * item.quantity);
      }, 0);
      
      return `${totalValue}g`;
    },
    
    // 从带单位的营养值（如"28g"）中提取数值部分
    getNutrientValue(nutrientString) {
      return parseInt(nutrientString);
    },
    
    // 计算超出的营养量
    getExcessAmount(actual, reference) {
      const actualValue = this.getNutrientValue(actual);
      const referenceValue = this.getNutrientValue(reference);
      return `${actualValue - referenceValue}g`;
    },
    
    // 导航到菜品详情页
    navigateToDish(id) {
      try {
        uni.navigateTo({
          url: `/pages/dish-detail/dish-detail?id=${id}`,
          fail: (err) => {
            console.error('Navigation failed:', err);
          }
        });
      } catch (e) {
        console.error('Navigation error:', e);
      }
    },
    
    // 去点餐
    goShopping() {
      try {
        uni.switchTab({
          url: '/pages/menu/menu',
          fail: (err) => {
            console.error('Navigation failed:', err);
            // Fallback to navigateTo if switchTab fails
            uni.navigateTo({
              url: '/pages/menu/menu'
            });
          }
        });
      } catch (e) {
        console.error('Navigation error:', e);
      }
    },
    
    // 切换选中状态
    toggleSelect(item) {
      item.selected = !item.selected;
      this.updateCart();
    },
    
    // 切换全选状态
    toggleSelectAll() {
      const targetState = !this.allSelected;
      this.cartItems.forEach(item => {
        item.selected = targetState;
      });
      this.updateCart();
    },
    
    // 增加商品数量
    increaseQuantity(item) {
      item.quantity += 1;
      this.updateCart();
    },
    
    // 减少商品数量
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.updateCart();
      } else {
        // 数量为1时，询问是否要删除
        uni.showModal({
          title: '提示',
          content: '确定要移除这个菜品吗？',
          success: (res) => {
            if (res.confirm) {
              // 确认删除
              const index = this.cartItems.findIndex(i => i.id === item.id);
              if (index > -1) {
                this.cartItems.splice(index, 1);
                this.updateCart();
              }
            }
          }
        });
      }
    },
    
    // 显示清空购物车确认
    showClearCartConfirm() {
      uni.showModal({
        title: '提示',
        content: '确定要清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            this.clearCart();
          }
        }
      });
    },
    
    // 清空购物车
    clearCart() {
      this.cartItems = [];
      try {
        uni.setStorageSync('cart', []);
        // Also update store if available
        if (this.$store) {
          this.$store.commit('clearCart');
        }
      } catch (e) {
        console.warn('Error clearing cart in storage:', e);
        // Update store as fallback
        if (this.$store) {
          this.$store.commit('clearCart');
        }
      }
      uni.showToast({
        title: '购物车已清空',
        icon: 'success'
      });
    },
    
    // 更新购物车数据到本地存储
    updateCart() {
      try {
        // 过滤掉selected属性，因为这是UI状态，不需要持久化
        const cartData = this.cartItems.map(({ selected, ...item }) => item);
        try {
          uni.setStorageSync('cart', cartData);
        } catch (e) {
          console.warn('Error updating cart in storage:', e);
          // Update store as fallback
          if (this.$store) {
            this.$store.commit('setCart', cartData);
          }
        }
      } catch (err) {
        console.error('Update cart failed:', err);
      }
    },
    
    // 结算
    checkout() {
      if (!this.hasSelectedItems) {
        return;
      }
      
      // 检查是否有营养警告
      if (this.hasNutritionWarnings && !this.proceedToCheckout) {
        this.showWarningDialog = true;
        return;
      }
      
      this.proceedCheckout();
    },
    
    // 关闭营养警告对话框
    closeWarningDialog() {
      this.showWarningDialog = false;
      this.proceedToCheckout = false;
    },
    
    // 继续结算（忽略营养警告）
    proceedCheckout() {
      this.showWarningDialog = false;
      this.proceedToCheckout = true;
      
      // 获取选中的商品
      const selectedItems = this.cartItems.filter(item => item.selected);
      
      // 存储订单信息
      uni.setStorageSync('checkout_items', selectedItems);
      uni.setStorageSync('checkout_total', this.totalPrice);
      
      // 存储营养信息
      const nutritionSummary = {
        calories: this.totalCalories,
        protein: this.totalProtein,
        carbs: this.totalCarbs,
        fat: this.totalFat,
        warnings: {
          calories: this.caloriesWarning,
          protein: this.proteinWarning,
          carbs: this.carbsWarning,
          fat: this.fatWarning
        }
      };
      uni.setStorageSync('checkout_nutrition', nutritionSummary);
      
      // 跳转到结算页面
      uni.navigateTo({
        url: '/pages/profile/order',
        success: () => {
          // 模拟支付成功，显示创建订单成功消息
          setTimeout(() => {
            uni.showToast({
              title: '订单创建成功',
              icon: 'success',
              duration: 2000
            });
            
            // 从购物车中移除已结算的商品
            this.cartItems = this.cartItems.filter(item => !item.selected);
            this.updateCart();
          }, 500);
        }
      });
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100rpx;
}

.empty-cart-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 30rpx;
}

.empty-cart-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.go-shopping-btn {
  width: 240rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #4CAF50;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  border-radius: 35rpx;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120rpx;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
}

.cart-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.clear-cart {
  font-size: 26rpx;
  color: #999;
}

.cart-items {
  margin-top: 20rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 2rpx;
}

.item-left {
  margin-right: 20rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-inner {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: transparent;
}

.checkbox-inner.selected {
  background-color: #4CAF50;
}

.item-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.item-tags {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.item-nutrition {
  margin: 8rpx 0;
}

.nutrition-text {
  font-size: 22rpx;
  color: #666;
  margin-right: 16rpx;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-price {
  font-size: 32rpx;
  color: #ff5000;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #333;
}

.quantity {
  width: 60rpx;
  text-align: center;
  font-size: 28rpx;
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
}

.select-all {
  display: flex;
  align-items: center;
}

.select-all-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 16rpx;
}

.price-info {
  flex: 1;
  margin-left: 40rpx;
}

.total-price-line {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  color: #ff5000;
  font-weight: bold;
}

.delivery-info {
  font-size: 22rpx;
  color: #999;
}

.checkout-btn {
  width: 200rpx;
  height: 70rpx;
  background-color: #4CAF50;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  line-height: 70rpx;
  border-radius: 35rpx;
}

.checkout-btn.disabled {
  background-color: #ccc;
}

/* Nutrition Summary Styles */
.nutrition-summary {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
}

.summary-header {
  margin-bottom: 20rpx;
}

.summary-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.nutrition-bars {
  display: flex;
  flex-direction: column;
}

.nutrition-bar {
  margin-bottom: 20rpx;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.bar-container {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.3s;
}

.bar-warning {
  font-size: 22rpx;
  color: #ff5000;
  margin-top: 6rpx;
}

/* Warning Dialog Styles */
.warning-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.warning-content {
  width: 80%;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.warning-header {
  background-color: #4CAF50;
  padding: 20rpx 30rpx;
}

.warning-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.warning-body {
  padding: 30rpx;
}

.warning-text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.warning-items {
  background-color: #fff8f0;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.warning-item {
  font-size: 26rpx;
  color: #ff5000;
  margin-bottom: 10rpx;
  display: block;
}

.warning-suggestion {
  font-size: 26rpx;
  color: #666;
}

.warning-actions {
  display: flex;
  border-top: 1rpx solid #eee;
}

.warning-btn {
  flex: 1;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 30rpx;
}

.warning-btn.cancel {
  color: #666;
  border-right: 1rpx solid #eee;
}

.warning-btn.confirm {
  color: #4CAF50;
  font-weight: bold;
}
</style> 