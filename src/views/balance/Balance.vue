<script setup lang="ts">

import TabComponent from "../../components/Tab.vue";
import {BalanceModel} from "./model.ts";
import BalanceItem from "../../components/balance-item/BalanceItem.vue";

type BalanceProps = {
  model: BalanceModel
}

defineProps<BalanceProps>()

</script>

<template>
  <v-container class="max-width">
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Balance</h1>
      </v-col>
    </v-row>
    <TabComponent :update-year="model.updateYear" :update-month="model.updateMonth">
      <v-window-item v-for="balance in model.balances.value" :key="balance.month" :value="balance.month">
        <v-container>
          <v-row justify="center" justify-lg="start">
            <v-col cols="12" sm="6" md="6" lg="4" class="card-width"
                   v-for="balanceItem in balance.balanceItems"
                   :key="balanceItem.title">
              <BalanceItem :model="balanceItem"></BalanceItem>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </TabComponent>
  </v-container>
</template>

<style scoped>

.card-width {
  max-width: 400px;
  min-width: 350px;
}


</style>
