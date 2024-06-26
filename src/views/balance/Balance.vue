<script setup lang="ts">

import {ref} from "vue";
import TabComponent from "../../components/Tab.vue";
import {BASE_URL} from "../../utils/Constants.ts";


const year = ref<number>(new Date().getFullYear())
const month = ref<number>(new Date().getMonth() + 1)
const monthBalanceList = ref<MonthBalance[]>()

getBalance()

function currencyFormat(value: number) {
  return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

function updateYear(newYear: number) {
  year.value = newYear
  getBalance()
}

function updateMonth(newMonth: number) {
  month.value = newMonth
}



async function getBalance() {
  let url = new URL(BASE_URL + '/balances')
  url.searchParams.append('year', year.value.toString())
  await fetch(url)
      .then(response => response.json())
      .then(data => {
        monthBalanceList.value = data
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

</script>

<template>
  <v-container class="max-width">
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Balance</h1>
      </v-col>
    </v-row>
    <TabComponent :update-year="updateYear" :update-month="updateMonth">
      <v-window-item v-for="monthBalance in monthBalanceList" :key="monthBalance.month" :value="monthBalance.month">
        <v-container>
<!--          <v-row justify="start">-->
<!--            <v-col>-->
<!--              <v-card elevation="0">-->
<!--                <v-card-title>General Balance</v-card-title>-->
<!--                <v-card-subtitle class="bg-green-darken-2 pa-1 ma-2 rounded-xl">-->
<!--                  <v-row align="center" justify="center">-->
<!--                    <v-col>Income:</v-col>-->
<!--                    <v-col>{{ currencyFormat(0) }}</v-col>-->
<!--                  </v-row>-->
<!--                </v-card-subtitle>-->
<!--                <v-card-subtitle class="bg-red-darken-2 pa-1 ma-2 rounded-xl">-->
<!--                  <v-row align="center" justify="center">-->
<!--                    <v-col>Expanses:</v-col>-->
<!--                    <v-col>{{ currencyFormat(0) }}</v-col>-->
<!--                  </v-row>-->
<!--                </v-card-subtitle>-->
<!--                <v-card-subtitle class="pa-1 bg-no-opacity font-weight-bold ma-2">-->
<!--                  <v-row align="center" justify="center">-->
<!--                    <v-col>Total:</v-col>-->
<!--                    <v-col>{{ currencyFormat(0) }}</v-col>-->
<!--                  </v-row>-->
<!--                </v-card-subtitle>-->
<!--              </v-card>-->
<!--            </v-col>-->
<!--          </v-row>-->
          <v-row justify="center" justify-lg="start">
            <v-col cols="12" sm="6" md="6" lg="4" class="card-width" v-for="balance in monthBalance.balances"
                   :key="balance.description">
              <v-card class="rounded-xl w-100">
                <v-card-title class="bg-blue-darken-3">{{ balance.description }}</v-card-title>
                <v-card-subtitle class="bg-blue-accent-1 pa-1"> {{ currencyFormat(balance.limitValue * -1) }}
                  ({{ balance.percentage }}%)
                </v-card-subtitle>
                <v-card-subtitle
                    :class="(balance.limitValue * -1) - balance.total > 0 ? 'bg-green-darken-2' : 'bg-red-darken-3'"
                    class="pa-1"> {{ currencyFormat((balance.limitValue * -1) - balance.total) }}
                </v-card-subtitle>
                <v-card-text class="card-height overflow-auto">
                  <v-row class="font-weight-bold">
                    <v-col class="pa-1">Category</v-col>
                    <v-col class="pa-1">Limit</v-col>
                    <v-col class="pa-1">Spent</v-col>
                  </v-row>
                  <v-row v-for="category in balance.categories">
                    <v-col class="pa-1">{{ category.description }}</v-col>
                    <v-divider vertical></v-divider>
                    <v-col class="pa-1">{{ currencyFormat(category.limit) }}</v-col>
                    <v-divider vertical></v-divider>
                    <v-col class="pa-1" :class="category.limit !== 0.0 && category.value > category.limit ? 'text-red-darken-3' : ''">
                      {{ currencyFormat(category.value) }}
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text>
                  <v-row class="font-weight-bold">
                    <v-col>Total</v-col>
                    <v-col>{{ currencyFormat(balance.limitTotal) }}</v-col>
                    <v-col>{{ currencyFormat(balance.total) }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
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

.card-height {
  height: 110px;
}

.bg-no-opacity {
  background-color: rgba(255, 255, 255, 0) !important;
  color: black !important;
}
</style>
