import Vue from 'vue'
import Vuex from 'vuex'

import meetup from './Meetup'
import user from './User'
import shared from './shared'
import profile from './profile'
// import VuexPersistence from 'vuex-persist'
// import VuexPresistence from 'vuex-persist'

Vue.use(Vuex)

// const vuexLocalStorage = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage
// })

export const store = new Vuex.Store({
  modules: {
    meetup: meetup,
    user: user,
    shared: shared,
    profile: profile
  }
})
