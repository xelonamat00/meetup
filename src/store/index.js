import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
// import VuexPersistence from 'vuex-persist'
// import VuexPresistence from 'vuex-persist'

Vue.use(Vuex)

// const vuexLocalStorage = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage
// })

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {imageUrl: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        id: 'sadfjsdfjk3',
        title: 'Komunitas Sepeda Tangerang',
        date: new Date(),
        location: 'Jakarta',
        description: 'Kumpul Kumpul Aja'},

      {imageUrl: 'https://images.pexels.com/photos/398532/pexels-photo-398532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        id: 'sdjfksfjdk3434',
        title: 'Cliff in the morning',
        date: new Date(),
        location: 'Tangerang',
        description: 'ngapain aja'}
    ],
    user: null,
    loading: false,
    error: null
    // currentCreatorId: this.meetup.creatorId
  },
  // plugins: [vuexLocalStorage.plugin],
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.date) {
        meetup.date = payload.date
      }
      if (payload.description) {
        meetup.description = payload.description
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
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
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch(error => {
        commit('setLoading', false)
        console.log(error)
      })
    },
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
      .then((data) => {
        const meetups = []
        const obj = data.val()
        for (let key in obj) {
          meetups.push({
            id: key,
            title: obj[key].title,
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            date: obj[key].date,
            location: obj[key].location,
            creatorId: obj[key].creatorId
          })
        }
        commit('setLoadedMeetups', meetups)
        commit('setLoading', false)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', true)
      })
    },
    // create dummy
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
      })
      // .then(fileData => {
      //   reachout image url, [0] means single upload
      //   imageUrl = fileData.metadata.downloadURLs[0]
      //   store it into database
      //   return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
      // })
      .then(fileData => {
        let imagePath = fileData.metadata.fullPath
        // creating ref to our image file and get the url
        return firebase.storage().ref().child(imagePath).getDownloadURL()
      })
      .then(url => {
        imageUrl = url
        return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
      })
      .then(() => {
        commit('createMeetup', {
          ...meetup,
          imageUrl: imageUrl,
          id: key
        })
      })
      .catch((error) => {
        console.log(error)
      })
      // reachout to firebase and store it
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let registeredMeetups = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          registeredMeetups.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updateUser = {
          id: getters.user.id,
          registeredMeetups: registeredMeetups,
          fbKeys: swappedPairs
        }
        commit('setLoading', false)
        commit('setUser', updateUser)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    autoSignin ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({commit}) {
      commit('clearError')
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
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
