<script setup lang="ts">

import {useDisplay} from "vuetify";
import {BASE_URL} from "../utils/Constants.ts";
import {router} from "../config/Router.ts";


const buttons = [
  {name: 'Home'},
  {name: 'Entries'},
  {name: 'Spreadsheet'},
  {name: 'Limits'},
  {name: 'Categories'},
]

const display = useDisplay()

async function syncData() {
  try {
    await fetch(BASE_URL + '/sync-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    router.go(0)
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <v-app-bar >
    <v-container fluid>
      <v-row align="center">
        <v-col v-if="display.smAndUp.value" cols="3" md="2" lg="2" class="justify-start ">
          <v-app-bar-title class="text-grey-darken-3 text-h5 text-start">Balance</v-app-bar-title>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="9" class="d-flex justify-center justify-sm-start align-center ga-5">
          <router-link v-for="button in buttons" :key="button.name" :to="{name: button.name}"
                       class="text-decoration-none">
            <div class="ma-2 text-grey-darken-3">
              {{ button.name }}
            </div>
          </router-link>
        </v-col>
        <v-col v-if="display.smAndUp.value" cols="1" class="text-right">
        <v-icon @click="syncData" icon="fa:fas fa-sync" class="mr-4 text-grey-darken-3"></v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>

</style>