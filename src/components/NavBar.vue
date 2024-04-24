<script setup lang="ts">

import {useDisplay} from "vuetify";

const buttons = [
  {name: 'Home'},
  {name: 'Entries'},
  {name: 'Limits'},
  {name: 'Categories'},
]

const display = useDisplay()

</script>

<template>
  <v-app-bar >
    <v-container fluid>
      <v-row align="center">
        <v-col v-if="display.smAndUp.value" cols="2" class="justify-start ">
          <v-app-bar-title class="text-grey-darken-3 text-h5 text-start">Balance</v-app-bar-title>
        </v-col>
        <v-col cols="12" sm="10" md="10" lg="10" class="d-flex justify-center justify-sm-start align-center ga-5">
          <router-link v-for="button in buttons" :key="button.name" :to="{name: button.name}"
                       class="text-decoration-none">
            <div class="ma-2 text-grey-darken-3">
              {{ button.name }}
            </div>
          </router-link>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>

</style>