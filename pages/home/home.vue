<template>
  <view class="container">
    <!-- Banner -->
    <view class="banner">
      <swiper class="banner-swiper" indicator-dots autoplay interval="3000" duration="500">
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.image" mode="aspectFill" class="banner-image"></image>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- Today's Recommended -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日推荐</text>
        <text class="section-more" @tap="navigateToMenu">查看更多</text>
      </view>
      <scroll-view scroll-x class="dish-scroll">
        <view class="dish-card" v-for="(dish, index) in recommended" :key="index" @tap="navigateToDish(dish.id)">
          <image :src="dish.image" mode="aspectFill" class="dish-image"></image>
          <view class="dish-info">
            <text class="dish-name">{{dish.name}}</text>
            <view class="dish-nutrition">
              <text class="nutrition-item">蛋白质: {{dish.nutrition.protein}}</text>
              <text class="nutrition-item">碳水: {{dish.nutrition.carbs}}</text>
            </view>
            <view class="dish-bottom">
              <text class="dish-price">¥{{dish.price}}</text>
              <view class="add-btn" @tap.stop="addToCart(dish)">+</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- Meal Combos -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">营养套餐推荐</text>
        <text class="section-more" @tap="navigateToMenu">更多套餐</text>
      </view>
      <scroll-view scroll-x class="combo-scroll">
        <view class="combo-card" v-for="(combo, index) in mealCombos" :key="index">
          <view class="combo-header">
            <text class="combo-name">{{combo.name}}</text>
            <text class="combo-price">¥{{combo.totalPrice}}</text>
          </view>
          <view class="combo-desc">{{combo.description}}</view>
          <view class="combo-dishes">
            <image 
              v-for="(dish, dishIndex) in combo.dishes.slice(0, 2)" 
              :key="dishIndex" 
              :src="dish.image" 
              mode="aspectFill" 
              class="combo-dish-image">
            </image>
          </view>
          <view class="combo-nutrition">
            <text class="combo-nutrition-item">总热量: {{combo.totalCalories}}kcal</text>
            <text class="combo-nutrition-item">蛋白质: {{combo.totalNutrition.protein}}</text>
          </view>
          <view class="combo-action-btn" @tap.stop="addComboToCart(combo)">
            加入购物车
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- Personalized Recipe -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">营养食谱</text>
        <text class="section-more" @tap="navigateToMenu">更多菜品</text>
      </view>
      <view class="nutrition-cards">
        <view class="nutrition-card" v-for="(category, index) in nutritionCategories" :key="index" @tap="filterByCategory(category.id)">
          <image :src="category.image" mode="aspectFill" class="category-image"></image>
          <text class="category-name">{{category.name}}</text>
        </view>
      </view>
    </view>
    
    <!-- Popular Dishes -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门菜品</text>
      </view>
      <view class="popular-dishes">
        <view class="dish-item" v-for="(dish, index) in popularDishes" :key="index" @tap="navigateToDish(dish.id)">
          <image :src="dish.image" mode="aspectFill" class="dish-item-image"></image>
          <view class="dish-item-info">
            <text class="dish-item-name">{{dish.name}}</text>
            <text class="dish-item-desc">{{dish.description}}</text>
            <view class="dish-item-nutrition">
              <text class="dish-nutrition-item">热量: {{dish.calories}}kcal</text>
              <text class="dish-nutrition-item">蛋白质: {{dish.nutrition.protein}}</text>
            </view>
            <view class="dish-item-bottom">
              <text class="dish-item-price">¥{{dish.price}}</text>
              <view class="add-btn" @tap.stop="addToCart(dish)">+</view>
            </view>
          </view>
        </view>
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
      banners: [
        { image: '/static/banner1.jpg' },
        { image: '/static/banner2.jpg' },
        { image: '/static/banner3.jpg' }
      ],
      recommended: [
        { 
          id: 1, 
          name: '营养三色鸡肉饭', 
          price: 26, 
          image: '/static/dish1.jpg',
          description: '富含蛋白质和维生素的健康套餐',
          calories: 450,
          nutrition: { protein: '28g', carbs: '45g', fat: '12g' }
        },
        { 
          id: 2, 
          name: '低脂牛肉沙拉', 
          price: 22, 
          image: '/static/dish2.jpg',
          description: '低脂高蛋白，健身人士的首选',
          calories: 320,
          nutrition: { protein: '24g', carbs: '18g', fat: '9g' }
        },
        { 
          id: 3, 
          name: '地中海风情饭', 
          price: 28, 
          image: '/static/dish3.jpg',
          description: '地中海风味，富含多种营养素',
          calories: 480,
          nutrition: { protein: '22g', carbs: '58g', fat: '16g' }
        },
        { 
          id: 4, 
          name: '五谷杂粮煲', 
          price: 18, 
          image: '/static/dish4.jpg',
          description: '五谷杂粮，营养丰富',
          calories: 390,
          nutrition: { protein: '12g', carbs: '68g', fat: '5g' }
        }
      ],
      mealCombos: [
        {
          id: 1,
          name: "增肌套餐",
          description: "高蛋白、适量碳水，适合健身增肌人群",
          dishes: [
            { 
              id: 1, 
              name: '营养三色鸡肉饭', 
              price: 26, 
              image: '/static/dish1.jpg',
              calories: 450,
              nutrition: { protein: '28g', carbs: '45g', fat: '12g' }
            },
            { 
              id: 7, 
              name: '蔬菜蒸蛋', 
              price: 12, 
              image: '/static/dish7.jpg',
              calories: 180,
              nutrition: { protein: '16g', carbs: '8g', fat: '6g' }
            }
          ],
          totalPrice: 38,
          totalCalories: 630,
          totalNutrition: { protein: '44g', carbs: '53g', fat: '18g' }
        },
        {
          id: 2,
          name: "减脂套餐",
          description: "低脂低碳水，富含蛋白质，适合减脂人群",
          dishes: [
            { 
              id: 2, 
              name: '低脂牛肉沙拉', 
              price: 22, 
              image: '/static/dish2.jpg',
              calories: 320,
              nutrition: { protein: '24g', carbs: '18g', fat: '9g' }
            },
            { 
              id: 8, 
              name: '健康蔬菜汤', 
              price: 15, 
              image: '/static/dish8.jpg',
              calories: 120,
              nutrition: { protein: '5g', carbs: '18g', fat: '2g' }
            }
          ],
          totalPrice: 37,
          totalCalories: 440,
          totalNutrition: { protein: '29g', carbs: '36g', fat: '11g' }
        },
        {
          id: 3,
          name: "均衡营养套餐",
          description: "全面均衡的营养搭配，适合大众人群",
          dishes: [
            { 
              id: 3, 
              name: '地中海风情饭', 
              price: 28, 
              image: '/static/dish3.jpg',
              calories: 480,
              nutrition: { protein: '22g', carbs: '58g', fat: '16g' }
            },
            { 
              id: 5, 
              name: '鲜蔬鸡胸肉沙拉', 
              price: 23, 
              image: '/static/dish5.jpg',
              calories: 310,
              nutrition: { protein: '26g', carbs: '15g', fat: '10g' }
            }
          ],
          totalPrice: 51,
          totalCalories: 790,
          totalNutrition: { protein: '48g', carbs: '73g', fat: '26g' }
        }
      ],
      nutritionCategories: [
        { id: 'protein', name: '高蛋白', image: '/static/category1.jpg' },
        { id: 'lowfat', name: '低脂', image: '/static/category2.jpg' },
        { id: 'vitamin', name: '多维生素', image: '/static/category3.jpg' },
        { id: 'lowcarb', name: '低碳水', image: '/static/category4.jpg' }
      ],
      popularDishes: [
        { 
          id: 5, 
          name: '鲜蔬鸡胸肉沙拉', 
          price: 23, 
          image: '/static/dish5.jpg',
          description: '新鲜蔬菜搭配嫩滑鸡胸肉，营养均衡',
          calories: 310,
          nutrition: { protein: '26g', carbs: '15g', fat: '10g' }
        },
        { 
          id: 6, 
          name: '牛油果三文鱼饭', 
          price: 32, 
          image: '/static/dish6.jpg',
          description: '富含优质脂肪酸和Omega-3',
          calories: 520,
          nutrition: { protein: '30g', carbs: '42g', fat: '22g' }
        }
      ]
    };
  },
  onLoad() {
    // 可以在这里加载数据
  },
  methods: {
    navigateToMenu() {
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
    filterByCategory(categoryId) {
      try {
        uni.switchTab({
          url: `/pages/menu/menu?category=${categoryId}`,
          fail: (err) => {
            console.error('Navigation failed:', err);
            // Fallback to navigateTo if switchTab fails
            uni.navigateTo({
              url: `/pages/menu/menu?category=${categoryId}`
            });
          }
        });
      } catch (e) {
        console.error('Navigation error:', e);
      }
    },
    addToCart(dish) {
      try {
        // 获取购物车
        let cart = [];
        try {
          cart = uni.getStorageSync('cart') || [];
        } catch (e) {
          console.warn('Error getting cart from storage:', e);
        }
        
        // 检查菜品是否已在购物车中
        const index = cart.findIndex(item => item.id === dish.id);
        
        if (index > -1) {
          // 已存在，数量+1
          cart[index].quantity += 1;
        } else {
          // 不存在，添加到购物车
          cart.push({
            ...dish,
            quantity: 1
          });
        }
        
        // 保存购物车
        try {
          uni.setStorageSync('cart', cart);
        } catch (e) {
          console.warn('Error saving cart to storage:', e);
          // Fallback to use memory storage
          this.$store?.commit('setCart', cart); // If using Vuex
        }
        
        // 提示用户 - 避免使用需要认证的 API
        try {
          // 先尝试使用不需要登录的API
          uni.showToast({
            title: '已加入购物车',
            icon: 'success',
            mask: false,
            fail: (err) => {
              // 如果showToast失败，使用替代方案
              console.warn('ShowToast failed, using alternative notification');
              // 使用自定义通知组件
              uni.$emit('cart-updated', { action: 'add', dish: dish });
            }
          });
        } catch (toastErr) {
          console.warn('Toast error:', toastErr);
          // 使用自定义通知组件
          uni.$emit('cart-updated', { action: 'add', dish: dish });
        }
      } catch (err) {
        console.error('Add to cart failed:', err);
        // 使用不需要登录的报错方法
        uni.$emit('cart-updated', { action: 'error', message: '添加失败' });
      }
    },
    addComboToCart(combo) {
      try {
        // 获取购物车
        let cart = uni.getStorageSync('cart') || [];
        
        // 添加套餐中的所有菜品
        combo.dishes.forEach(dish => {
          const index = cart.findIndex(item => item.id === dish.id);
          
          if (index > -1) {
            // 已存在，数量+1
            cart[index].quantity += 1;
          } else {
            // 不存在，添加到购物车
            cart.push({
              ...dish,
              quantity: 1
            });
          }
        });
        
        // 保存购物车
        uni.setStorageSync('cart', cart);
        
        // 提示用户
        try {
          uni.showToast({
            title: '套餐已加入购物车',
            icon: 'success',
            mask: false,
            fail: (err) => {
              uni.$emit('cart-updated', { action: 'add', message: '套餐已加入购物车' });
            }
          });
        } catch (toastErr) {
          uni.$emit('cart-updated', { action: 'add', message: '套餐已加入购物车' });
        }
      } catch (err) {
        console.error('Add combo to cart failed:', err);
        uni.$emit('cart-updated', { action: 'error', message: '添加失败' });
      }
    }
  }
};
</script>

<style>
.container {
  padding-bottom: 30rpx;
}

.banner {
  width: 100%;
  height: 350rpx;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.section {
  padding: 20rpx 30rpx;
  margin-top: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-left: 16rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6rpx;
  height: 32rpx;
  width: 6rpx;
  background-color: #4CAF50;
  border-radius: 3rpx;
}

.section-more {
  font-size: 26rpx;
  color: #666;
}

.dish-scroll {
  width: 100%;
  white-space: nowrap;
}

.dish-card {
  display: inline-block;
  width: 280rpx;
  margin-right: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 100%;
  height: 180rpx;
}

.dish-info {
  padding: 16rpx;
}

.dish-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-nutrition {
  display: flex;
  flex-direction: column;
  margin: 6rpx 0;
}

.nutrition-item {
  font-size: 20rpx;
  color: #666;
  margin-top: 4rpx;
}

.dish-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.dish-price {
  font-size: 30rpx;
  color: #ff5000;
  font-weight: bold;
}

.add-btn {
  width: 40rpx;
  height: 40rpx;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 36rpx;
  font-size: 30rpx;
}

/* Combo Styles */
.combo-scroll {
  width: 100%;
  white-space: nowrap;
}

.combo-card {
  display: inline-block;
  width: 350rpx;
  margin-right: 20rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 16rpx;
  border: 1rpx solid #eee;
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.combo-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.combo-price {
  font-size: 28rpx;
  color: #ff5000;
  font-weight: bold;
}

.combo-desc {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 10rpx;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 64rpx;
}

.combo-dishes {
  display: flex;
  margin-bottom: 10rpx;
}

.combo-dish-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
}

.combo-nutrition {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 8rpx;
  margin-bottom: 10rpx;
}

.combo-nutrition-item {
  font-size: 20rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.combo-action-btn {
  background-color: #4CAF50;
  color: #fff;
  font-size: 24rpx;
  text-align: center;
  border-radius: 30rpx;
  padding: 8rpx 0;
}

.nutrition-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.nutrition-card {
  width: 48%;
  height: 160rpx;
  margin-bottom: 20rpx;
  position: relative;
  border-radius: 10rpx;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
}

.category-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8rpx 0;
  text-align: center;
  font-size: 28rpx;
}

.popular-dishes {
  margin-top: 10rpx;
}

.dish-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.dish-item-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}

.dish-item-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-item-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.dish-item-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.dish-item-nutrition {
  display: flex;
  flex-direction: column;
  margin: 8rpx 0;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 8rpx;
}

.dish-nutrition-item {
  font-size: 20rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.dish-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-item-price {
  font-size: 32rpx;
  color: #ff5000;
  font-weight: bold;
}
</style> 