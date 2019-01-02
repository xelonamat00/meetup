<template>
  <v-container>
    <v-layout justify-center class="mb-4">
      <v-flex xs12 sm10>
        <v-data-table
            :headers="headers"
            :items="meetups"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.title }}</td>
              <td class="text-xs-right">{{ props.item.date | date}}</td>
              <td class="text-xs-right">{{ props.item.location}}</td>
              <td class="text-xs-right">{{ props.item.total }}</td>
            </template>
        </v-data-table>
        <v-btn @click="exportPdf()" round color="primary" dark>
          <v-icon left light>local_printshop</v-icon>
          Cetak
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'
// var jsPDF = require('jspdf');
// require('jspdf-autotable')

  export default {
    created() {
      this.$store.dispatch('loadUsers')
    },
    computed: {
      meetups() {
        return this.$store.getters.loadedMeetups
      }
    },
    methods: {
      loadUsers() {
        firebase.database().ref('users').once('value').then(snapshot => {
        const tempData = []
        const fbKey = this.$store.getters.user.fbKeys
        snapshot.forEach(childSnap => {
          console.log(childSnap.val().registrations)
          tempData.push({
            name: childSnap.val().name,
            email: childSnap.val().email,
            registrations: childSnap.numChildren
          })
          
        })
        console.log(tempData)
      })
      },
      exportPdf() {
        // let pdfName = 'test';
        // var doc = new jsPDF()
        // doc.text("Hello World", 10, 10)
        // doc.save(pdfName + '.pdf')
        const row = []
        this.meetups.forEach(entry => {
          row.push({
            title: entry.title,
            date: moment(entry.date).format('MMMM Do YYYY, h:mm:ss a'),
            location: entry.location,
            total: entry.total
          })
        })
        var columns = [
          {title: "Nama Meetup", dataKey: "title"},
          {title: "Tanggal", dataKey: "date"},
          {title: "Lokasi", dataKey: "location"},
          {title: "Total Anggota", dataKey: "total"}
        ]
        var doc = new jsPDF('p', 'pt')
        doc.autoTable(columns, row)
        doc.save('laporan.pdf')
      }
      },
      data () {
      return {
        headers: [
          {
            text: 'Nama Meetup',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Tanggal', value: 'date' },
          { text: 'Lokasi', value: 'location', sortable: false},
          { text: 'Total Daftar', value: 'total' },
        ]
      }
    }
  }
</script>