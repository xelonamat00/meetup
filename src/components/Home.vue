<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn class="btn--primary" @click="response()">test</v-btn>
                <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center text-sm-left">
                <v-btn large router to="/meetup/new" class="info">Orginze Meetup</v-btn>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular 
                indeterminate
                color="primary"
                :width="7"
                :size="70"
                v-if="loading"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-2">
            <v-flex xs12>
                <v-carousel style="cursor: pointer" v-if="!loading">
                    <v-carousel-item
                    v-for="meetup in meetups"
                    :src="meetup.imageUrl"
                    :key="meetup.id"
                    @click="onLoadMeetup(meetup.id)">
                    <div class="title">
                        {{ meetup.title }}
                    </div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout> 
        <v-layout row wrap class="mt-2">
            <v-flex xs12 class="text-xs-center">
                <p>Join our awesome meetup</p>
            </v-flex>
        </v-layout> 
    </v-container>
</template>

<script>
import * as firebase from 'firebase'
    export default{
      data () {
        return {
          tempData: [],
        //   meetups: []
        }
      },
    //   created () {
    //     var rootRef = firebase.database().ref('meetups')
    //     rootRef.once('value').then(snapshot => {
    //       snapshot.forEach(entry => {
    //         console.log(entry.val())
    //         console.log(entry.key)
    //         let smoothie = entry.val()
    //         smoothie.id = entry.key
    //         this.tempData.push(smoothie)
    //       })
    //     })
    //   },
      computed: {
        meetups () {
        //   return this.tempData.slice(0, 5)
            return this.$store.getters.featuredMeetups
        },
        loading () {
            return this.$store.getters.loading
        }
      },
      methods: {
        response() {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.photoURL);
            }
          })
        },
        onLoadMeetup (id) {
          this.$router.push('/meetups/' + id)
        },
      }
    }
</script>


<style scoped>
    .title{
        position: absolute;
        bottom: 50px;
        background-color: rgba(0,0,0,.5);
        left: 50%;
        padding: 20px;
        color: white;
        transform: translate(-50%, 0);
        font-size: 2em;
    }
</style>



