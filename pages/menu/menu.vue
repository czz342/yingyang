<template>
  <view class="container">
    <!-- Cafeteria Navigation -->
    <scroll-view scroll-x class="cafeteria-scroll">
      <view 
        class="cafeteria-item" 
        :class="{ active: currentCafeteria === cafeteria.id }" 
        v-for="(cafeteria, index) in cafeterias" 
        :key="index"
        @tap="changeCafeteria(cafeteria.id)"
      >
        <text class="cafeteria-text">{{ cafeteria.name }}</text>
      </view>
    </scroll-view>
    
    <view class="content-container">
      <!-- Nutrition Category Navigation -->
      <scroll-view scroll-y class="category-sidebar">
        <view 
          class="category-item" 
          :class="{ active: currentCategory === category.id }" 
          v-for="(category, index) in nutritionCategories" 
          :key="index"
          @tap="changeCategory(category.id)"
        >
          <text class="category-text">{{ category.name }}</text>
        </view>
      </scroll-view>
      
      <view class="right-content">
        <!-- Cafeteria Recommended Combos -->
        <view class="meal-combos" v-if="showCafeteriaRecommendations">
          <view class="section-header">
            <text class="section-title">{{ currentCafeteriaName }}推荐套餐</text>
          </view>
          <view class="combo-list">
            <view class="combo-item" v-for="(combo, index) in filteredCombos" :key="index">
              <view class="combo-header">
                <text class="combo-name">{{ combo.name }}</text>
                <text class="combo-price">¥{{ combo.totalPrice }}</text>
              </view>
              <view class="combo-desc">{{ combo.description }}</view>
              <view class="combo-nutrition">
                <text class="combo-nutrition-item">总热量: {{ combo.totalCalories }}kcal</text>
                <text class="combo-nutrition-item">蛋白质: {{ combo.totalNutrition.protein }}</text>
                <text class="combo-nutrition-item">碳水: {{ combo.totalNutrition.carbs }}</text>
                <text class="combo-nutrition-item">脂肪: {{ combo.totalNutrition.fat }}</text>
              </view>
              <view class="combo-dishes">
                <view class="combo-dish" v-for="(comboDish, dishIndex) in combo.dishes" :key="dishIndex">
                  <image :src="comboDish.image" mode="aspectFill" class="combo-dish-image"></image>
                  <view class="combo-dish-info">
                    <text class="combo-dish-name">{{ comboDish.name }}</text>
                    <view class="combo-dish-actions">
                      <text class="combo-dish-price">¥{{ comboDish.price }}</text>
                      <view class="combo-dish-btn remove" @tap.stop="removeFromCombo(combo, comboDish)">-</view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="combo-actions">
                <view class="customize-btn" @tap="customizeCombo(combo)">自定义套餐</view>
                <view class="add-combo-btn" @tap="addComboToCart(combo)">加入购物车</view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- Dish List -->
        <view class="dish-list">
          <view class="dish-item" v-for="(dish, index) in filteredDishes" :key="index" @tap="navigateToDish(dish.id)">
            <image :src="dish.image" mode="aspectFill" class="dish-image"></image>
            <view class="dish-info">
              <view class="dish-name-line">
                <text class="dish-name">{{ dish.name }}</text>
              </view>
              <text class="dish-desc">{{ dish.description }}</text>
              <view class="dish-nutrition">
                <text class="nutrition-tag" v-for="(tag, tagIndex) in dish.tags" :key="tagIndex">{{ tag }}</text>
              </view>
              <view class="nutrition-details">
                <text class="nutrition-item">热量: {{ dish.calories }}kcal</text>
                <text class="nutrition-item">蛋白质: {{ dish.nutrition.protein }}</text>
                <text class="nutrition-item">碳水: {{ dish.nutrition.carbs }}</text>
                <text class="nutrition-item">脂肪: {{ dish.nutrition.fat }}</text>
              </view>
              <view class="dish-bottom">
                <view class="price-container">
                  <text class="dish-price">¥{{ dish.price }}</text>
                  <text class="original-price" v-if="dish.originalPrice">¥{{ dish.originalPrice }}</text>
                </view>
                <view class="add-btn" @tap.stop="addToCart(dish)">+</view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- No Results -->
        <view class="no-results" v-if="filteredDishes.length === 0 && !showCafeteriaRecommendations">
          <image src="/static/no-results.png" mode="aspectFit" class="no-results-image"></image>
          <text class="no-results-text">没有找到相关菜品</text>
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
      currentCafeteria: 'all',
      cafeterias: [
        { id: 'all', name: '全部食堂' },
        { id: 'zhongcan', name: '中餐厅' },
        { id: 'xican', name: '西餐厅' },
        { id: 'qingzhen', name: '清真食堂' },
        { id: 'student', name: '学生食堂' }
      ],
      currentCategory: 'all',
      nutritionCategories: [
        { id: 'all', name: '全部' },
        { id: 'recommend', name: '推荐' },
        { id: 'protein', name: '高蛋白' },
        { id: 'lowfat', name: '低脂' },
        { id: 'vitamin', name: '多维生素' },
        { id: 'lowcarb', name: '低碳水' },
        { id: 'staple', name: '主食' },
        { id: 'meat', name: '肉类' },
        { id: 'vegetable', name: '蔬菜' },
        { id: 'soup', name: '汤品' }
      ],
      showCafeteriaRecommendations: false,
      dishes: [
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
          originalPrice: 25,
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
      cafeteriaCombos: {
        zhongcan: [
          {
            id: 1,
            name: "中餐厅增肌套餐",
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
            name: "中餐厅营养均衡套餐",
            description: "荤素搭配，营养均衡",
            dishes: [
              { 
                id: 4, 
                name: '五谷杂粮煲', 
                price: 18, 
                image: '/static/dish4.jpg',
                calories: 390,
                nutrition: { protein: '12g', carbs: '68g', fat: '5g' }
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
            totalPrice: 33,
            totalCalories: 510,
            totalNutrition: { protein: '17g', carbs: '86g', fat: '7g' }
          }
        ],
        xican: [
          {
            id: 3,
            name: "西餐厅减脂套餐",
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
            id: 4,
            name: "西餐厅海鲜套餐",
            description: "富含海洋蛋白质和Omega-3",
            dishes: [
              { 
                id: 6, 
                name: '牛油果三文鱼饭', 
                price: 32, 
                image: '/static/dish6.jpg',
                calories: 520,
                nutrition: { protein: '30g', carbs: '42g', fat: '22g' }
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
            totalPrice: 55,
            totalCalories: 830,
            totalNutrition: { protein: '56g', carbs: '57g', fat: '32g' }
          }
        ],
        qingzhen: [
          {
            id: 5,
            name: "清真食堂经典套餐",
            description: "传统清真美食，营养丰富",
            dishes: [
              { 
                id: 9, 
                name: '清真牛肉拉面', 
                price: 28, 
                image: '/static/dish9.jpg',
                calories: 520,
                nutrition: { protein: '26g', carbs: '68g', fat: '15g' }
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
            totalPrice: 43,
            totalCalories: 640,
            totalNutrition: { protein: '31g', carbs: '86g', fat: '17g' }
          }
        ],
        student: [
          {
            id: 6,
            name: "学生食堂经济套餐",
            description: "价格实惠，营养均衡",
            dishes: [
              { 
                id: 4, 
                name: '五谷杂粮煲', 
                price: 18, 
                image: '/static/dish4.jpg',
                calories: 390,
                nutrition: { protein: '12g', carbs: '68g', fat: '5g' }
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
            totalPrice: 30,
            totalCalories: 570,
            totalNutrition: { protein: '28g', carbs: '76g', fat: '11g' }
          },
          {
            id: 7,
            name: "学生食堂能量套餐",
            description: "高能量，适合运动后恢复",
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
                id: 5, 
                name: '鲜蔬鸡胸肉沙拉', 
                price: 23, 
                image: '/static/dish5.jpg',
                calories: 310,
                nutrition: { protein: '26g', carbs: '15g', fat: '10g' }
              }
            ],
            totalPrice: 49,
            totalCalories: 760,
            totalNutrition: { protein: '54g', carbs: '60g', fat: '22g' }
          }
        ]
      }
    };
  },
  computed: {
    currentCafeteriaName() {
      const cafeteria = this.cafeterias.find(c => c.id === this.currentCafeteria);
      return cafeteria ? cafeteria.name : '';
    },
    filteredDishes() {
      // 先按食堂筛选
      let result = this.dishes;
      
      if (this.currentCafeteria !== 'all') {
        result = this.dishes.filter(dish => dish.cafeteria.includes(this.currentCafeteria));
      }
      
      // 再按营养类别筛选
      if (this.currentCategory !== 'all') {
        result = result.filter(dish => dish.categories.includes(this.currentCategory));
      }
      
      return result;
    },
    filteredCombos() {
      // 当选择"全部"时，返回所有套餐
      if (this.currentCafeteria === 'all') {
        return Object.values(this.cafeteriaCombos).flat();
      }
      
      // 返回当前食堂的套餐
      return this.cafeteriaCombos[this.currentCafeteria] || [];
    }
  },
  onLoad(options) {
    // 如果从其他页面传入了类别参数，则切换到该类别
    if (options && options.category) {
      this.currentCategory = options.category;
    }
    
    // 如果从其他页面传入了食堂参数，则切换到该食堂
    if (options && options.cafeteria) {
      this.changeCafeteria(options.cafeteria);
    }
  },
  methods: {
    changeCafeteria(cafeteriaId) {
      this.currentCafeteria = cafeteriaId;
      
      // 当切换到非"全部"的食堂时，显示套餐推荐
      this.showCafeteriaRecommendations = cafeteriaId !== 'all';
    },
    changeCategory(categoryId) {
      this.currentCategory = categoryId;
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
    addToCart(dish) {
      try {
        // 获取购物车
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
          // Save to store as fallback
          if (this.$store) {
            this.$store.commit('setCart', cart);
          }
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
              // 可以在这里实现自定义的提示，例如修改DOM元素
              uni.$emit('cart-updated', { action: 'add', dish: dish });
            }
          });
        } catch (toastErr) {
          console.warn('Toast error:', toastErr);
          // 已成功添加商品，不影响功能
        }
      } catch (err) {
        console.error('Add to cart failed:', err);
        // 使用不需要登录的报错方法
        console.error('添加失败');
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
    },
    removeFromCombo(combo, dish) {
      // 找到要删除的菜品索引
      const index = combo.dishes.findIndex(item => item.id === dish.id);
      if (index > -1) {
        // 更新套餐总价和营养信息
        combo.totalPrice -= dish.price;
        combo.totalCalories -= dish.calories;
        
        // 更新营养总量
        combo.totalNutrition.protein = this.subtractNutrition(combo.totalNutrition.protein, dish.nutrition.protein);
        combo.totalNutrition.carbs = this.subtractNutrition(combo.totalNutrition.carbs, dish.nutrition.carbs);
        combo.totalNutrition.fat = this.subtractNutrition(combo.totalNutrition.fat, dish.nutrition.fat);
        
        // 从套餐中删除菜品
        combo.dishes.splice(index, 1);
        
        // 通知用户
        uni.$emit('cart-updated', { action: 'remove', message: `已从套餐中移除${dish.name}` });
      }
    },
    subtractNutrition(total, toSubtract) {
      // 从total中减去toSubtract (格式为 "28g")
      const totalNum = parseInt(total);
      const subNum = parseInt(toSubtract);
      const result = Math.max(0, totalNum - subNum);
      return `${result}g`;
    },
    customizeCombo(combo) {
      // 保存当前套餐到缓存，以便在自定义页面中使用
      try {
        uni.setStorageSync('current_combo', combo);
        uni.navigateTo({
          url: '/pages/customize-combo/customize-combo?comboId=' + combo.id,
          fail: (err) => {
            console.error('Navigation failed:', err);
            uni.$emit('cart-updated', { action: 'error', message: '无法打开自定义页面' });
          }
        });
      } catch (e) {
        console.error('Navigate to customize page failed:', e);
      }
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.cafeteria-scroll {
  width: 100%;
  white-space: nowrap;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.cafeteria-item {
  display: inline-block;
  padding: 24rpx 30rpx;
  position: relative;
}

.cafeteria-text {
  font-size: 28rpx;
  color: #333;
}

.cafeteria-item.active .cafeteria-text {
  color: #4CAF50;
  font-weight: bold;
}

.cafeteria-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #4CAF50;
  border-radius: 2rpx;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.category-sidebar {
  width: 180rpx;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1rpx solid #eee;
}

.category-item {
  padding: 30rpx 0;
  text-align: center;
  position: relative;
  border-bottom: 1rpx solid #eee;
}

.category-item.active {
  background-color: #fff;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30%;
  height: 40%;
  width: 6rpx;
  background-color: #4CAF50;
  border-radius: 0 3rpx 3rpx 0;
}

.category-text {
  font-size: 26rpx;
  color: #333;
}

.category-item.active .category-text {
  color: #4CAF50;
  font-weight: bold;
}

.right-content {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.meal-combos {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
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

.combo-list {
  display: flex;
  flex-direction: column;
}

.combo-item {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #eee;
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.combo-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.combo-price {
  font-size: 30rpx;
  color: #ff5000;
  font-weight: bold;
}

.combo-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.combo-nutrition {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 10rpx;
  margin-bottom: 16rpx;
}

.combo-nutrition-item {
  font-size: 22rpx;
  color: #666;
  margin-right: 20rpx;
  margin-bottom: 4rpx;
}

.combo-dishes {
  margin-top: 16rpx;
  border-top: 1rpx solid #eee;
  padding-top: 16rpx;
}

.combo-dish {
  display: flex;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx dashed #eee;
}

.combo-dish:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.combo-dish-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
}

.combo-dish-info {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.combo-dish-name {
  font-size: 26rpx;
  color: #333;
}

.combo-dish-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.combo-dish-price {
  font-size: 26rpx;
  color: #ff5000;
}

.combo-dish-btn {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.combo-dish-btn.remove {
  background-color: #ff5000;
}

.combo-actions {
  display: flex;
  margin-top: 20rpx;
}

.customize-btn, .add-combo-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  border-radius: 35rpx;
  font-size: 26rpx;
}

.customize-btn {
  background-color: #fff;
  color: #4CAF50;
  border: 1rpx solid #4CAF50;
  margin-right: 16rpx;
}

.add-combo-btn {
  background-color: #4CAF50;
  color: #fff;
}

.dish-list {
  display: flex;
  flex-direction: column;
}

.dish-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}

.dish-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.dish-name-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.dish-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.dish-nutrition {
  display: flex;
  flex-wrap: wrap;
  margin: 8rpx 0;
}

.nutrition-tag {
  font-size: 20rpx;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 4rpx 10rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  margin-bottom: 6rpx;
}

.nutrition-details {
  display: flex;
  flex-wrap: wrap;
  margin: 8rpx 0;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 8rpx;
}

.nutrition-item {
  font-size: 20rpx;
  color: #666;
  margin-right: 16rpx;
  margin-bottom: 4rpx;
}

.dish-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price-container {
  display: flex;
  align-items: center;
}

.dish-price {
  font-size: 32rpx;
  color: #ff5000;
  font-weight: bold;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 8rpx;
}

.add-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 46rpx;
  font-size: 36rpx;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;
}

.no-results-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.no-results-text {
  font-size: 28rpx;
  color: #999;
}
</style> 