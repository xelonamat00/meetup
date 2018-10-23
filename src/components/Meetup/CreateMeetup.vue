<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h3 class="primary--text">Craete New Meetup</h3>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12>
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="title"
                            label="Title"
                            id="title"
                            v-model="title"
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="location"
                            label="Location"
                            id="location"
                            v-model="location"
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="imageUrl"
                            label="Image URL"
                            id="image-url"
                            v-model="imageUrl"
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageUrl" height="150">
                        </v-flex>
                    </v-layout>
                     <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="description"
                            label="Description"
                            id="description"
                            v-model="description"
                            multi-line
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="mb-2">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-date-picker v-model="date"></v-date-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-time-picker v-model="time"></v-time-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn class="primary"
                            :disabled="!formIsValid"
                            type="submit">Create Meetup</v-btn>
                            {{ submitableDateTime }}
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment'

    export default{
      data () {
        return {
          title: '',
          location: '',
          imageUrl: '',
          description: '',
          date: new Date(),
          time: new Date()
        }
      },
      created: function() {
          const dateTime = moment()
          this.date = dateTime.format('YYYY-MM-DD')
          this.time = dateTime.format('HH:mm')
      },
      computed: {
        formIsValid () {
          return this.title !== '' &&
            this.location !== '' &&
            this.imageUrl !== '' &&
            this.description !== ''
        },
        submitableDateTime () {
          const date = new Date(this.date)
          if (typeof this.time === 'string') {
            let hours = this.time.match(/^(\d+)/)[1]
            const minutes = this.time.match(/:(\d+)/)[1]
            date.setHours(hours)
            date.setMinutes(minutes)
          } else {
            date.setHours(this.time.getHours())
            date.setMinutes(this.time.getMinutes())
          }
          console.log(date)
          return date
        }
      },
      methods: {
        onCreateMeetup () {
          if (!this.formIsValid) {
            return
          }
          const meetupData = {
            title: this.title,
            location: this.location,
            imageUrl: this.imageUrl,
            description: this.description,
            date: this.submitableDateTime
          }
          this.$store.dispatch('createMeetup', meetupData)
          this.$router.push('/meetups')
        }
      }
    }
</script>
