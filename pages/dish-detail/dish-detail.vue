<template>
  <view class="container">
    <!-- Dish Image -->
    <image :src="dish.image" mode="aspectFill" class="dish-image"></image>
    
    <!-- Dish Info -->
    <view class="dish-info">
      <view class="dish-name-row">
        <text class="dish-name">{{dish.name}}</text>
        <view class="sales-badge">
          <text class="sales-text">月售 {{dish.sales}}+</text>
        </view>
      </view>
      
      <view class="dish-tags">
        <text class="dish-tag" v-for="(tag, index) in dish.tags" :key="index">{{tag}}</text>
      </view>
      
      <view class="price-row">
        <text class="price">¥{{dish.price}}</text>
        <text class="original-price" v-if="dish.originalPrice">¥{{dish.originalPrice}}</text>
      </view>
    </view>
    
    <!-- Nutrition Information -->
    <view class="section">
      <view class="section-title">营养信息</view>
      <view class="nutrition-info">
        <view class="nutrition-item">
          <view class="nutrition-value">{{dish.calories}}</view>
          <view class="nutrition-label">卡路里(kcal)</view>
        </view>
        <view class="nutrition-item">
          <view class="nutrition-value">{{dish.nutrition.protein}}</view>
          <view class="nutrition-label">蛋白质</view>
        </view>
        <view class="nutrition-item">
          <view class="nutrition-value">{{dish.nutrition.carbs}}</view>
          <view class="nutrition-label">碳水化合物</view>
        </view>
        <view class="nutrition-item">
          <view class="nutrition-value">{{dish.nutrition.fat}}</view>
          <view class="nutrition-label">脂肪</view>
        </view>
      </view>
    </view>
    
    <!-- Description -->
    <view class="section">
      <view class="section-title">菜品介绍</view>
      <text class="dish-description">{{dish.longDescription || dish.description}}</text>
    </view>
    
    <!-- Ingredients -->
    <view class="section" v-if="dish.ingredients && dish.ingredients.length > 0">
      <view class="section-title">食材列表</view>
      <view class="ingredients-list">
        <view class="ingredient-item" v-for="(ingredient, index) in dish.ingredients" :key="index">
          <text class="ingredient-name">{{ingredient.name}}</text>
          <text class="ingredient-amount">{{ingredient.amount}}</text>
        </view>
      </view>
    </view>
    
    <!-- Recommendations -->
    <view class="section">
      <view class="section-title">相关推荐</view>
      <scroll-view scroll-x class="recommendations">
        <view 
          class="recommendation-item" 
          v-for="(item, index) in recommendations" 
          :key="index" 
          @tap="navigateToDish(item.id)"
        >
          <image :src="item.image" mode="aspectFill" class="recommendation-image"></image>
          <text class="recommendation-name">{{item.name}}</text>
          <text class="recommendation-price">¥{{item.price}}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- Bottom Action Bar -->
    <view class="action-bar">
      <view class="cart-status" @tap="navigateToCart">
        <view class="cart-icon-container">
          <image src="/static/cart-icon.png" class="cart-icon"></image>
          <view class="cart-badge" v-if="cartCount > 0">{{cartCount}}</view>
        </view>
        <text class="cart-text">购物车</text>
      </view>
      
      <view class="action-buttons">
        <view class="add-to-cart-btn" @tap="addToCart">加入购物车</view>
        <view class="buy-now-btn" @tap="buyNow">立即购买</view>
      </view>
    </view>
    
    <!-- Cart Notifier -->
    <cart-notifier></cart-notifier>
  </view>
</template>

<script>
import CartNotifier from '@/components/CartNotifier.vue';

export default {
  components: {
    CartNotifier
  },
  data() {
    return {
      id: 0,
      dish: {
        id: 0,
        name: '',
        price: 0,
        image: '',
        description: '',
        longDescription: '',
        sales: 0,
        tags: [],
        calories: 0,
        nutrition: { protein: '0g', carbs: '0g', fat: '0g' },
        ingredients: []
      },
      recommendations: [],
      cartCount: 0,
      allDishes: [
        { 
          id: 1, 
          name: '营养三色鸡肉饭', 
          price: 26, 
          image: '/static/dish1.jpg',
          description: '富含蛋白质和维生素的健康套餐',
          longDescription: '精选嫩滑鸡胸肉，配以三色蔬菜，提供完整的蛋白质与维生素。采用低油烹饪工艺，减少不必要的脂肪摄入，保留食材的原汁原味。是健身增肌、减脂塑形的理想选择。',
          sales: 328,
          tags: ['高蛋白', '低脂肪'],
          calories: 450,
          nutrition: { protein: '28g', carbs: '45g', fat: '12g' },
          ingredients: [
            { name: '鸡胸肉', amount: '120g' },
            { name: '糙米', amount: '80g' },
            { name: '西兰花', amount: '50g' },
            { name: '胡萝卜', amount: '30g' },
            { name: '玉米粒', amount: '30g' }
          ]
        },
        { 
          id: 2, 
          name: '低脂牛肉沙拉', 
          price: 22, 
          originalPrice: 25,
          image: '/static/dish2.jpg',
          description: '低脂高蛋白，健身人士的首选',
          longDescription: '选用98%去脂的牛肉，搭配新鲜蔬菜，清爽可口。特制的低卡沙拉酱，提升口感的同时不增加过多热量。富含优质蛋白，适合健身后补充蛋白质，促进肌肉恢复。',
          sales: 216,
          tags: ['高蛋白', '低脂肪', '生酮友好'],
          calories: 320,
          nutrition: { protein: '24g', carbs: '18g', fat: '9g' },
          ingredients: [
            { name: '牛肉', amount: '100g' },
            { name: '生菜', amount: '80g' },
            { name: '圣女果', amount: '50g' },
            { name: '牛油果', amount: '30g' },
            { name: '低脂沙拉酱', amount: '15g' }
          ]
        },
        { 
          id: 3, 
          name: '地中海风情饭', 
          price: 28, 
          image: '/static/dish3.jpg',
          description: '地中海风味，富含多种营养素',
          longDescription: '参照地中海饮食模式，融合橄榄油、番茄、鱼肉等多种营养元素。富含欧米伽3脂肪酸，有益心脑血管健康。多种维生素和抗氧化物质，帮助延缓衰老，提升免疫力。',
          sales: 198,
          tags: ['多维生素', '均衡营养'],
          calories: 480,
          nutrition: { protein: '22g', carbs: '58g', fat: '16g' },
          ingredients: [
            { name: '糙米', amount: '100g' },
            { name: '三文鱼', amount: '80g' },
            { name: '番茄', amount: '60g' },
            { name: '橄榄油', amount: '10ml' },
            { name: '柠檬汁', amount: '5ml' }
          ]
        },
        { 
          id: 4, 
          name: '五谷杂粮煲', 
          price: 18, 
          image: '/static/dish4.jpg',
          description: '五谷杂粮，营养丰富',
          longDescription: '精选五种杂粮，慢炖烹饪，保留谷物的天然营养。富含膳食纤维，促进肠道蠕动，有助于排毒养颜。B族维生素含量丰富，提高身体能量代谢，减少疲劳感。',
          sales: 156,
          tags: ['粗粮', '膳食纤维'],
          calories: 390,
          nutrition: { protein: '12g', carbs: '68g', fat: '5g' },
          ingredients: [
            { name: '燕麦', amount: '30g' },
            { name: '小米', amount: '30g' },
            { name: '糙米', amount: '30g' },
            { name: '红豆', amount: '20g' },
            { name: '黑豆', amount: '20g' }
          ]
        },
        { 
          id: 5, 
          name: '鲜蔬鸡胸肉沙拉', 
          price: 23, 
          image: '/static/dish5.jpg',
          description: '新鲜蔬菜搭配嫩滑鸡胸肉，营养均衡',
          longDescription: '采用水煮鸡胸肉，减少油脂的同时保持肉质鲜嫩。新鲜蔬菜富含多种维生素和矿物质，补充身体所需的微量元素。沙拉搭配自制酸奶酱，减少卡路里的同时增添风味。',
          sales: 186,
          tags: ['高蛋白', '低热量'],
          calories: 310,
          nutrition: { protein: '26g', carbs: '15g', fat: '10g' },
          ingredients: [
            { name: '鸡胸肉', amount: '120g' },
            { name: '生菜', amount: '80g' },
            { name: '黄瓜', amount: '50g' },
            { name: '红薯', amount: '50g' },
            { name: '酸奶酱', amount: '15g' }
          ]
        },
        { 
          id: 6, 
          name: '牛油果三文鱼饭', 
          price: 32, 
          image: '/static/dish6.jpg',
          description: '富含优质脂肪酸和Omega-3',
          longDescription: '精选优质三文鱼和新鲜牛油果，富含Omega-3脂肪酸和不饱和脂肪酸。对心脑血管健康有益，提高好胆固醇水平。搭配糙米增加膳食纤维，促进消化吸收，平衡血糖水平。',
          sales: 142,
          tags: ['OMEGA-3', '健康脂肪'],
          calories: 520,
          nutrition: { protein: '30g', carbs: '42g', fat: '22g' },
          ingredients: [
            { name: '三文鱼', amount: '100g' },
            { name: '牛油果', amount: '1/2个' },
            { name: '糙米', amount: '80g' },
            { name: '紫甘蓝', amount: '30g' },
            { name: '柠檬汁', amount: '5ml' }
          ]
        }
      ]
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = parseInt(options.id);
      this.loadDishData();
      this.updateCartCount();
    }
  },
  methods: {
    // 加载菜品数据
    loadDishData() {
      // 根据ID查找菜品
      const dish = this.allDishes.find(item => item.id === this.id);
      
      if (dish) {
        this.dish = dish;
        // 加载推荐菜品（排除当前菜品）
        this.recommendations = this.allDishes
          .filter(item => item.id !== this.id)
          .slice(0, 4);
      } else {
        // 找不到菜品时显示提示
        uni.showToast({
          title: '菜品不存在',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    
    // 更新购物车数量
    updateCartCount() {
      const cart = uni.getStorageSync('cart') || [];
      this.cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    // 添加到购物车
    addToCart() {
      try {
        // 获取购物车
        let cart = uni.getStorageSync('cart') || [];
        
        // 检查菜品是否已在购物车中
        const index = cart.findIndex(item => item.id === this.dish.id);
        
        if (index > -1) {
          // 已存在，数量+1
          cart[index].quantity += 1;
        } else {
          // 不存在，添加到购物车
          cart.push({
            ...this.dish,
            quantity: 1
          });
        }
        
        // 保存购物车
        uni.setStorageSync('cart', cart);
        
        // 更新购物车数量
        this.updateCartCount();
        
        // 提示用户 - 避免使用需要认证的 API
        try {
          // 先尝试使用showToast
          uni.showToast({
            title: '已加入购物车',
            icon: 'success',
            mask: false,
            fail: (err) => {
              // 如果showToast失败，使用替代方案
              console.warn('ShowToast failed, using alternative notification');
              // 使用自定义通知组件
              uni.$emit('cart-updated', { action: 'add', dish: this.dish });
            }
          });
        } catch (toastErr) {
          console.warn('Toast error:', toastErr);
          // 使用自定义通知组件
          uni.$emit('cart-updated', { action: 'add', dish: this.dish });
        }
      } catch (err) {
        console.error('Add to cart failed:', err);
        // 错误通知，不使用需要认证的API
        uni.$emit('cart-updated', { action: 'error', message: '添加失败' });
      }
    },
    
    // 立即购买
    buyNow() {
      // 添加到购物车
      this.addToCart();
      
      // 跳转到购物车页面
      uni.switchTab({
        url: '/pages/cart/cart'
      });
    },
    
    // 跳转到其他菜品详情
    navigateToDish(id) {
      uni.redirectTo({
        url: `/pages/dish-detail/dish-detail?id=${id}`
      });
    },
    
    // 跳转到购物车页面
    navigateToCart() {
      uni.switchTab({
        url: '/pages/cart/cart'
      });
    }
  }
};
</script>

<style>
.container {
  padding-bottom: 100rpx; /* 为底部操作栏预留空间 */
}

.dish-image {
  width: 100%;
  height: 500rpx;
}

.dish-info {
  padding: 30rpx;
  background-color: #fff;
}

.dish-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.sales-badge {
  background-color: #f8f8f8;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.sales-text {
  font-size: 22rpx;
  color: #999;
}

.dish-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 16rpx 0;
}

.dish-tag {
  font-size: 22rpx;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 16rpx;
  margin-bottom: 10rpx;
}

.price-row {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
}

.price {
  font-size: 40rpx;
  color: #ff5000;
  font-weight: bold;
}

.original-price {
  font-size: 28rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 16rpx;
}

.section {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6rpx;
  width: 8rpx;
  height: 32rpx;
  background-color: #4CAF50;
  border-radius: 4rpx;
}

.nutrition-info {
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
}

.nutrition-item {
  text-align: center;
  flex: 1;
}

.nutrition-value {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.nutrition-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.dish-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.ingredients-list {
  margin-top: 10rpx;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-name {
  font-size: 28rpx;
  color: #333;
}

.ingredient-amount {
  font-size: 28rpx;
  color: #999;
}

.recommendations {
  white-space: nowrap;
  margin-top: 10rpx;
}

.recommendation-item {
  display: inline-block;
  width: 200rpx;
  margin-right: 20rpx;
}

.recommendation-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.recommendation-name {
  font-size: 26rpx;
  color: #333;
  margin-top: 10rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommendation-price {
  font-size: 26rpx;
  color: #ff5000;
  margin-top: 6rpx;
}

.action-bar {
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

.cart-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
}

.cart-icon-container {
  position: relative;
}

.cart-icon {
  width: 50rpx;
  height: 50rpx;
}

.cart-badge {
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

.cart-text {
  font-size: 22rpx;
  color: #666;
  margin-top: 4rpx;
}

.action-buttons {
  flex: 1;
  display: flex;
}

.add-to-cart-btn, .buy-now-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  font-size: 28rpx;
  border-radius: 35rpx;
}

.add-to-cart-btn {
  background-color: #FFF2E8;
  color: #ff5000;
  margin-right: 20rpx;
}

.buy-now-btn {
  background-color: #4CAF50;
  color: #fff;
}
</style> 