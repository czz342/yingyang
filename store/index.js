import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    user: null,
    hasInit: false
  },
  mutations: {
    setCart(state, cart) {
      state.cart = cart
    },
    addToCart(state, dish) {
      const index = state.cart.findIndex(item => item.id === dish.id)
      if (index > -1) {
        // 已存在，数量+1
        state.cart[index].quantity += 1
      } else {
        // 不存在，添加到购物车
        state.cart.push({
          ...dish,
          quantity: 1
        })
      }
    },
    removeFromCart(state, id) {
      const index = state.cart.findIndex(item => item.id === id)
      if (index > -1) {
        state.cart.splice(index, 1)
      }
    },
    updateCartItemQuantity(state, { id, quantity }) {
      const index = state.cart.findIndex(item => item.id === id)
      if (index > -1) {
        state.cart[index].quantity = quantity
      }
    },
    clearCart(state) {
      state.cart = []
    },
    setUser(state, user) {
      state.user = user
    },
    setInitStatus(state, status) {
      state.hasInit = status
    }
  },
  actions: {
    tryInitializeCart({ commit }) {
      try {
        const cart = uni.getStorageSync('cart')
        if (cart) {
          commit('setCart', cart)
        }
      } catch (e) {
        console.warn('Failed to load cart from storage:', e)
      }
    },
    syncCartToStorage({ state }) {
      try {
        uni.setStorageSync('cart', state.cart)
      } catch (e) {
        console.warn('Failed to save cart to storage:', e)
      }
    }
  },
  getters: {
    cartTotal(state) {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    cartItemCount(state) {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    },
    userIsLoggedIn(state) {
      return !!state.user
    }
  }
}) 