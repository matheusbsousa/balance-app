<script setup lang="ts">

import NavBar from "./components/NavBar.vue";
</script>

<template>
  <v-app class="justify-center">
    <NavBar/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style>

.max-width {
  max-width: 1200px !important;
}

</style>


