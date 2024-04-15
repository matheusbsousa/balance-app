<script setup lang="ts">
</script>

<template>
  <v-app-bar>
    <v-container fluid>
      <v-row align="center">
        <v-col cols="2">
          <v-app-bar-title>Entry</v-app-bar-title>
        </v-col>
        <v-col class="d-flex flex-row">
          <router-link :to="{name: 'Home'}">
            <div class="ma-2">
              Home
            </div>
          </router-link>
          <router-link :to="{name: 'Entries'}">
            <div class="ma-2">
              Entries
            </div>
          </router-link>
          <router-link :to="{name: 'Limits'}">
            <div class="ma-2">
              Limits
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