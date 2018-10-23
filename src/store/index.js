import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {imageUrl: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        id: 1,
        title: 'Komunitas Sepeda Tangerang',
        date: new Date(),
        location: 'Jakarta',
        description: 'Kumpul Kumpul Aja'},

      {imageUrl: 'https://images.pexels.com/photos/398532/pexels-photo-398532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        id: 2,
        title: 'Cliff in the morning',
        date: new Date(),
        location: 'Tangerang',
        description: 'ngapain aja'}
    ],
    user: {
      id: 'dfsdf324',
      registeredMeetups: ['kjsdfkjsdfk3']
    }
  },
  mutations: {
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    }
  },
  actions: {
    // create dummy
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 3
      }
      // reachout to firebase and store it
      commit('createMeetup', meetup)
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          // return parseInt(meetup.id) === parseInt(meetupId)
          return parseInt(meetup.id) === parseInt(meetupId)
        })
      }
    }
  }
})
