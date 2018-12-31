import * as firebase from 'firebase'
// import VuexPersistence from 'vuex-persist'
// import VuexPresistence from 'vuex-persist'

// const vuexLocalStorage = new VuexPersistence({
//   key: 'vuex',
//   storage: window.localStorage
// })

export default {
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
    ]
    // currentCreatorId: this.meetup.creatorId
  },
  // plugins: [vuexLocalStorage.plugin],
  mutations: {
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
    }
  },
  actions: {
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
    }
  }
}
