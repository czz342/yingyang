<template>
  <view class="container">
    <view class="header">
      <view class="header-left" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-title">自定义套餐</view>
      <view class="header-right"></view>
    </view>
    
    <view class="combo-info">
      <text class="combo-name">{{combo.name}}</text>
      <text class="combo-cafeteria">{{cafeteriaTitle}}</text>
      <text class="combo-desc">{{combo.description}}</text>
    </view>
    
    <!-- Current Dishes -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">当前餐品</text>
      </view>
      <view class="dish-list current-dishes">
        <view class="dish-item" v-for="(dish, index) in combo.dishes" :key="index">
          <image :src="dish.image" mode="aspectFill" class="dish-image"></image>
          <view class="dish-info">
            <text class="dish-name">{{dish.name}}</text>
            <view class="dish-nutrition">
              <text class="nutrition-item">热量: {{dish.calories}}kcal</text>
              <text class="nutrition-item">蛋白质: {{dish.nutrition.protein}}</text>
              <text class="nutrition-item">碳水: {{dish.nutrition.carbs}}</text>
              <text class="nutrition-item">脂肪: {{dish.nutrition.fat}}</text>
            </view>
            <view class="dish-bottom">
              <text class="dish-price">¥{{dish.price}}</text>
              <view class="remove-btn" @tap="removeDish(index)">移除</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Suggested Dishes from same cafeteria -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">{{cafeteriaTitle}}推荐添加</text>
      </view>
      <view class="dish-list suggested-dishes">
        <view v-if="suggestedDishes.length === 0" class="no-dishes">
          <text class="no-dishes-text">当前食堂没有更多可添加的菜品</text>
        </view>
        <view class="dish-item" v-for="(dish, index) in suggestedDishes" :key="index">
          <image :src="dish.image" mode="aspectFill" class="dish-image"></image>
          <view class="dish-info">
            <text class="dish-name">{{dish.name}}</text>
            <view class="dish-nutrition">
              <text class="nutrition-item">热量: {{dish.calories}}kcal</text>
              <text class="nutrition-item">蛋白质: {{dish.nutrition.protein}}</text>
              <text class="nutrition-item">碳水: {{dish.nutrition.carbs}}</text>
              <text class="nutrition-item">脂肪: {{dish.nutrition.fat}}</text>
            </view>
            <view class="dish-tags" v-if="dish.tags && dish.tags.length > 0">
              <text class="tag-item" v-for="(tag, tagIndex) in dish.tags" :key="tagIndex">{{tag}}</text>
            </view>
            <view class="dish-bottom">
              <text class="dish-price">¥{{dish.price}}</text>
              <view class="add-btn" @tap="addDish(dish)">添加</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Nutrition Summary -->
    <view class="nutrition-summary">
      <view class="summary-header">
        <text class="summary-title">营养总量</text>
      </view>
      <view class="nutrition-details">
        <view class="nutrition-row">
          <text class="nutrition-label">总热量:</text>
          <text class="nutrition-value">{{combo.totalCalories}}kcal</text>
        </view>
        <view class="nutrition-row">
          <text class="nutrition-label">蛋白质:</text>
          <text class="nutrition-value">{{combo.totalNutrition.protein}}</text>
        </view>
        <view class="nutrition-row">
          <text class="nutrition-label">碳水化合物:</text>
          <text class="nutrition-value">{{combo.totalNutrition.carbs}}</text>
        </view>
        <view class="nutrition-row">
          <text class="nutrition-label">脂肪:</text>
          <text class="nutrition-value">{{combo.totalNutrition.fat}}</text>
        </view>
      </view>
    </view>
    
    <!-- Bottom Action Bar -->
    <view class="bottom-bar">
      <view class="total-price">
        <text class="price-label">总价:</text>
        <text class="price-value">¥{{combo.totalPrice}}</text>
      </view>
      <view class="action-btns">
        <view class="reset-btn" @tap="resetCombo">重置套餐</view>
        <view class="confirm-btn" @tap="confirmCombo">确认并加入购物车</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      combo: {
        id: 0,
        name: '',
        description: '',
        dishes: [],
        totalPrice: 0,
        totalCalories: 0,
        totalNutrition: { protein: '0g', carbs: '0g', fat: '0g' },
        cafeteria: '' // 添加食堂标识
      },
      originalCombo: null,
      suggestedDishes: [],
      cafeteria: '',
      allDishes: [
        { 
          id: 1, 
          name: '营养三色鸡肉饭', 
          price: 26, 
          image: '/static/dish1.jpg',
          description: '富含蛋白质和维生素的健康套餐',
          tags: ['高蛋白', '低脂肪'],
          cafeteria: ['zhongcan', 'student'],
          categories: ['recommend', 'protein', 'staple'],
          calories: 450,
          nutrition: { protein: '28g', carbs: '45g', fat: '12g' }
        },
        { 
          id: 2, 
          name: '低脂牛肉沙拉', 
          price: 22, 
          image: '/static/dish2.jpg',
          description: '低脂高蛋白，健身人士的首选',
          tags: ['高蛋白', '低脂肪', '生酮友好'],
          cafeteria: ['xican'],
          categories: ['recommend', 'protein', 'lowfat', 'meat'],
          calories: 320,
          nutrition: { protein: '24g', carbs: '18g', fat: '9g' }
        },
        { 
          id: 3, 
          name: '地中海风情饭', 
          price: 28, 
          image: '/static/dish3.jpg',
          description: '地中海风味，富含多种营养素',
          tags: ['多维生素', '均衡营养'],
          cafeteria: ['xican'],
          categories: ['vitamin', 'staple'],
          calories: 480,
          nutrition: { protein: '22g', carbs: '58g', fat: '16g' }
        },
        { 
          id: 4, 
          name: '五谷杂粮煲', 
          price: 18, 
          image: '/static/dish4.jpg',
          description: '五谷杂粮，营养丰富',
          tags: ['粗粮', '膳食纤维'],
          cafeteria: ['zhongcan', 'student', 'qingzhen'],
          categories: ['vitamin', 'lowfat', 'staple'],
          calories: 390,
          nutrition: { protein: '12g', carbs: '68g', fat: '5g' }
        },
        { 
          id: 5, 
          name: '鲜蔬鸡胸肉沙拉', 
          price: 23, 
          image: '/static/dish5.jpg',
          description: '新鲜蔬菜搭配嫩滑鸡胸肉，营养均衡',
          tags: ['高蛋白', '低热量'],
          cafeteria: ['xican', 'student'],
          categories: ['protein', 'lowfat', 'vegetable'],
          calories: 310,
          nutrition: { protein: '26g', carbs: '15g', fat: '10g' }
        },
        { 
          id: 6, 
          name: '牛油果三文鱼饭', 
          price: 32, 
          image: '/static/dish6.jpg',
          description: '富含优质脂肪酸和Omega-3',
          tags: ['OMEGA-3', '健康脂肪'],
          cafeteria: ['xican'],
          categories: ['protein', 'vitamin'],
          calories: 520,
          nutrition: { protein: '30g', carbs: '42g', fat: '22g' }
        },
        { 
          id: 7, 
          name: '蔬菜蒸蛋', 
          price: 12, 
          image: '/static/dish7.jpg',
          description: '鲜嫩蒸蛋搭配各类营养蔬菜',
          tags: ['高蛋白', '低脂肪'],
          cafeteria: ['zhongcan', 'student', 'qingzhen'],
          categories: ['protein', 'lowfat', 'vegetable'],
          calories: 180,
          nutrition: { protein: '16g', carbs: '8g', fat: '6g' }
        },
        { 
          id: 8, 
          name: '健康蔬菜汤', 
          price: 15, 
          image: '/static/dish8.jpg',
          description: '多种蔬菜熬制，清淡可口',
          tags: ['维生素', '低卡路里'],
          cafeteria: ['zhongcan', 'xican', 'student', 'qingzhen'],
          categories: ['vitamin', 'lowfat', 'soup', 'vegetable'],
          calories: 120,
          nutrition: { protein: '5g', carbs: '18g', fat: '2g' }
        },
        { 
          id: 9, 
          name: '清真牛肉拉面', 
          price: 28, 
          image: '/static/dish9.jpg',
          description: '手工拉制面条，搭配清真牛肉',
          tags: ['高蛋白', '主食'],
          cafeteria: ['qingzhen'],
          categories: ['staple', 'meat'],
          calories: 520,
          nutrition: { protein: '26g', carbs: '68g', fat: '15g' }
        },
        { 
          id: 10, 
          name: '羊肉抓饭', 
          price: 32, 
          image: '/static/dish10.jpg',
          description: '新疆风味抓饭，配以鲜嫩羊肉',
          tags: ['高蛋白', '主食'],
          cafeteria: ['qingzhen'],
          categories: ['staple', 'meat'],
          calories: 580,
          nutrition: { protein: '28g', carbs: '72g', fat: '18g' }
        }
      ],
      cafeteriaNames: {
        'zhongcan': '中餐厅',
        'xican': '西餐厅',
        'qingzhen': '清真食堂',
        'student': '学生食堂'
      }
    };
  },
  computed: {
    cafeteriaTitle() {
      return this.cafeteriaNames[this.cafeteria] || '';
    }
  },
  onLoad(options) {
    const comboId = options.comboId;
    this.loadCombo(comboId);
  },
  methods: {
    loadCombo(comboId) {
      try {
        // 从缓存中获取套餐数据
        const comboData = uni.getStorageSync('current_combo');
        if (comboData) {
          this.combo = JSON.parse(JSON.stringify(comboData)); // 深拷贝
          this.originalCombo = JSON.parse(JSON.stringify(comboData)); // 保存原始套餐，用于重置
          
          // 提取套餐所属的食堂
          if (comboData.cafeteria) {
            this.cafeteria = comboData.cafeteria;
          } else {
            // 尝试从ID推断所属食堂
            if (comboId <= 2) {
              this.cafeteria = 'zhongcan';
            } else if (comboId <= 4) {
              this.cafeteria = 'xican';
            } else if (comboId === 5) {
              this.cafeteria = 'qingzhen';
            } else {
              this.cafeteria = 'student';
            }
            this.combo.cafeteria = this.cafeteria;
          }
          
          this.updateSuggestedDishes();
        } else {
          // 如果没有缓存数据，可能是直接进入页面，显示错误提示
          uni.showToast({
            title: '未能找到套餐数据',
            icon: 'none',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 2000);
            }
          });
        }
      } catch (e) {
        console.error('Error loading combo data:', e);
        uni.showToast({
          title: '加载套餐数据失败',
          icon: 'none'
        });
      }
    },
    
    updateSuggestedDishes() {
      // 获取当前套餐中的菜品ID
      const currentDishIds = this.combo.dishes.map(dish => dish.id);
      
      // 根据当前套餐的食堂，筛选可以添加的菜品
      this.suggestedDishes = this.allDishes.filter(dish => 
        dish.cafeteria.includes(this.cafeteria) && !currentDishIds.includes(dish.id)
      );
    },
    
    removeDish(index) {
      // 获取要删除的菜品
      const dish = this.combo.dishes[index];
      
      // 至少保留一个菜品
      if (this.combo.dishes.length <= 1) {
        uni.showToast({
          title: '套餐至少需要保留一个菜品',
          icon: 'none'
        });
        return;
      }
      
      // 从套餐中移除菜品
      this.combo.dishes.splice(index, 1);
      
      // 更新套餐总价和营养信息
      this.updateComboSummary();
      
      // 更新推荐菜品
      this.updateSuggestedDishes();
      
      uni.showToast({
        title: '已移除菜品',
        icon: 'success'
      });
    },
    
    addDish(dish) {
      // 复制菜品对象，避免引用原始对象
      const newDish = JSON.parse(JSON.stringify(dish));
      
      // 添加到套餐
      this.combo.dishes.push(newDish);
      
      // 更新套餐总价和营养信息
      this.updateComboSummary();
      
      // 更新推荐菜品
      this.updateSuggestedDishes();
      
      uni.showToast({
        title: '已添加菜品',
        icon: 'success'
      });
    },
    
    updateComboSummary() {
      // 计算总价
      this.combo.totalPrice = this.combo.dishes.reduce((total, dish) => total + dish.price, 0);
      
      // 计算总卡路里
      this.combo.totalCalories = this.combo.dishes.reduce((total, dish) => total + dish.calories, 0);
      
      // 计算总营养素
      const protein = this.combo.dishes.reduce((total, dish) => {
        const value = parseInt(dish.nutrition.protein);
        return total + value;
      }, 0);
      
      const carbs = this.combo.dishes.reduce((total, dish) => {
        const value = parseInt(dish.nutrition.carbs);
        return total + value;
      }, 0);
      
      const fat = this.combo.dishes.reduce((total, dish) => {
        const value = parseInt(dish.nutrition.fat);
        return total + value;
      }, 0);
      
      this.combo.totalNutrition = {
        protein: `${protein}g`,
        carbs: `${carbs}g`,
        fat: `${fat}g`
      };
    },
    
    resetCombo() {
      // 恢复原始套餐
      if (this.originalCombo) {
        this.combo = JSON.parse(JSON.stringify(this.originalCombo));
        this.updateSuggestedDishes();
        
        uni.showToast({
          title: '已重置套餐',
          icon: 'success'
        });
      }
    },
    
    confirmCombo() {
      try {
        // 获取购物车
        let cart = uni.getStorageSync('cart') || [];
        
        // 添加套餐中的所有菜品
        this.combo.dishes.forEach(dish => {
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
        
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
        
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (e) {
        console.error('Error adding combo to cart:', e);
        uni.showToast({
          title: '添加购物车失败',
          icon: 'none'
        });
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.header-left {
  width: 60rpx;
}

.header-right {
  width: 60rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.combo-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.combo-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.combo-cafeteria {
  font-size: 26rpx;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
  margin-bottom: 16rpx;
}

.combo-desc {
  font-size: 28rpx;
  color: #666;
}

.section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.section-header {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 30rpx;
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
  height: 28rpx;
  width: 6rpx;
  background-color: #4CAF50;
  border-radius: 3rpx;
}

.dish-list {
  padding: 0 30rpx;
}

.dish-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.dish-item:last-child {
  border-bottom: none;
}

.dish-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dish-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.dish-nutrition {
  display: flex;
  flex-wrap: wrap;
  margin: 8rpx 0;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 8rpx;
}

.nutrition-item {
  font-size: 22rpx;
  color: #666;
  margin-right: 16rpx;
  margin-bottom: 4rpx;
}

.dish-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 8rpx 0;
}

.tag-item {
  font-size: 20rpx;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 4rpx 10rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  margin-bottom: 6rpx;
}

.dish-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.dish-price {
  font-size: 30rpx;
  color: #ff5000;
  font-weight: bold;
}

.add-btn, .remove-btn {
  width: 100rpx;
  height: 50rpx;
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.add-btn {
  background-color: #4CAF50;
  color: #fff;
}

.remove-btn {
  background-color: #ff5000;
  color: #fff;
}

.no-dishes {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}

.no-dishes-text {
  font-size: 28rpx;
  color: #999;
}

.nutrition-summary {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.summary-header {
  margin-bottom: 20rpx;
}

.summary-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.nutrition-details {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
}

.nutrition-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.nutrition-row:last-child {
  margin-bottom: 0;
}

.nutrition-label {
  font-size: 26rpx;
  color: #666;
}

.nutrition-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
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

.total-price {
  flex: 1;
}

.price-label {
  font-size: 28rpx;
  color: #333;
}

.price-value {
  font-size: 36rpx;
  color: #ff5000;
  font-weight: bold;
  margin-left: 10rpx;
}

.action-btns {
  display: flex;
}

.reset-btn, .confirm-btn {
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
  text-align: center;
  font-size: 28rpx;
}

.reset-btn {
  width: 150rpx;
  background-color: #f5f5f5;
  color: #666;
  margin-right: 20rpx;
}

.confirm-btn {
  width: 240rpx;
  background-color: #4CAF50;
  color: #fff;
}
</style> 