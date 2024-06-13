<script setup lang="ts">

import {ref, watch} from 'vue';
import {MONTHS, MONTHS_NUMBER, YEARS} from "../utils/Constants.ts";

type TabProps = {
  updateYear?: Function
  updateMonth?: Function
}

const props = defineProps<TabProps>()

const tabMonth = ref<number>(getCurrentMonth())
const tabYear = ref<number>(getCurrentYear())

async function onYearChange() {
  if (props.updateYear === undefined) return
  props.updateYear!!(tabYear.value)
}

async function onMonthChange() {
  if (props.updateMonth === undefined) return
  props.updateMonth(tabMonth.value)
}

function getCurrentMonth() {
  const date = new Date()
  return date.getMonth() + 1
}

function getCurrentYear() {
  return new Date().getFullYear()
}

watch(tabYear, onYearChange)
watch(tabMonth, onMonthChange)

</script>

<template>

  <v-row justify="center" class="text-center">
    <v-col>
      <v-tabs center-active v-model="tabYear" align-tabs="center">
        <v-tab v-for="year in YEARS" :key="year" :value="year">
          {{ year }}
        </v-tab>
      </v-tabs>
      <v-tabs center-active v-model="tabMonth" align-tabs="center">
        <v-tab v-for="tabMonth in MONTHS_NUMBER" :key="tabMonth" :value="tabMonth">
          {{ MONTHS[tabMonth - 1] }}
        </v-tab>
      </v-tabs>
      <v-window v-model="tabYear">
        <v-window-item v-for="year in YEARS" :key="year" :value="year">
        </v-window-item>
      </v-window>
      <v-window v-model="tabMonth">
        <slot></slot>
      </v-window>
    </v-col>
  </v-row>
</template>

<style scoped>
.total-border {
  border: 1px solid lightgray;
}
</style>