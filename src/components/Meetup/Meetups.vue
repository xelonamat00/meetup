<template>
    <v-container>
        <v-layout raw wrap v-for="meetup in meetups" :key="meetup.id" class="mb-2">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card class="info" >
                    <v-container fluid>
                        <v-layout>
                            <v-flex xs5 sm4 md3>
                                <v-card-media
                                :src="meetup.imageUrl"
                                height=""
                                contain>
                                </v-card-media>
                            </v-flex>
                            <v-flex xs12 sm6 md9>
                                <v-card-title primary-title>
                                    <h2 class="white--text">{{ meetup.title }}</h2>
                                    <div>{{ meetup.date | date}}</div>
                                    <div>Listen to your favorite artists and albums whenever and wherever, online and offline.</div>
                                </v-card-title>
                                <v-card-actions>
                                    <v-btn flat :to="'/meetups/' + meetup.id">
                                    <v-icon left light>arrow_forward</v-icon>
                                    View Meetup
                                    </v-btn>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default{
      computed: {
        meetups () {
          return this.$store.getters.loadedMeetups
        }
      },
    //   filters: {
    //       date(value){
    //         const date = new Date(value)
    //         return date.toLocaleDateString(['en-US'], {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
    //       }
    //   }
    }
</script>
