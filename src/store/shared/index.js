// import * as firebase from 'firebase'
// import VuexPersistence from 'vuex-persist'
// import VuexPresistence from 'vuex-persist'

// const vuexLocalStorage = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage
// })

export default {
  state: {
    loading: false,
    error: null
    // currentCreatorId: this.meetup.creatorId
  },
  // plugins: [vuexLocalStorage.plugin],
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
