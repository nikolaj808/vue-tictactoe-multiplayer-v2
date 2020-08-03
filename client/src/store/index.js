import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: io('https://ttt-multiplayer.herokuapp.com/'),
    messages: [],
    users: [],
    game: {},
    availableRooms: [],
    mContainer: {},
    navigated: 0
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
