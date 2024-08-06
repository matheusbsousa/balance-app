zA
<script setup lang="ts">


import {BalanceItemModel} from "./Type.ts";

type BalanceItemProps = {
  model: BalanceItemModel
}

defineProps<BalanceItemProps>()

</script>

<template>

  <v-card class="rounded-xl w-100">
    <v-card-title class="bg-blue-darken-3">{{ model.title }}</v-card-title>
    <v-card-subtitle class="bg-blue-accent-1 pa-1">
      R$ {{ model.percentageValue }} ({{ model.percentage }}%)
    </v-card-subtitle>
    <v-card-subtitle :class="model.balanceClass" class="pa-1">
      R$ {{ model.balance }}
    </v-card-subtitle>
    <v-card-text class="card-height overflow-auto">
      <v-row class="font-weight-bold">
        <v-col class="pa-1">Category</v-col>
        <v-col class="pa-1">Limit</v-col>
        <v-col class="pa-1">Spent</v-col>
      </v-row>
      <v-row v-for="category in model.categoryBalances">
        <v-col class="pa-1">
          {{ category.description }}
        </v-col>

        <v-divider vertical></v-divider>

        <v-col class="pa-1">
          R$ {{ category.estimation }}
        </v-col>

        <v-divider vertical></v-divider>

        <v-col class="pa-1" :class="model.isLimitOverextended(category.real, category.estimation) ? 'text-red-darken-3' : ''">
          R$ {{ category.real }}
        </v-col>
      </v-row>

    </v-card-text>
    <v-card-text>
      <v-row class="font-weight-bold">
        <v-col>Total</v-col>
        <v-col>R$ {{ model.total.estimation }}</v-col>
        <v-col>R$ {{ model.total.real }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>

.card-height {
  height: 110px;
}

.bg-no-opacity {
  background-color: rgba(255, 255, 255, 0) !important;
  color: black !important;
}
</style>