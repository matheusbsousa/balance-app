<script setup lang="ts">

import VGrid from "@revolist/vue3-datagrid";

import {ref} from "vue";
import {fetchData} from "../../api/Client.ts";
import {parse} from "date-fns";

interface Data {
  date: string,
  description: string,
  value: string
}

const data = ref<Data[]>([])

addRow()

const columns = [
  {
    prop: "date",
    name: "Date",
  },
  {
    prop: "description",
    name: "Description",
  },
  {
    prop: "value",
    name: "Value",
  }
]

function addRow() {
  for (let i = 0; i < 200; i++) {
    data.value.push({date: '', description: '', value: ''})
  }
}

async function sendEntries() {

  let notEmptyData = data.value.filter((entry) => isDate(entry.date)
      && entry.description.length > 0
      && isNumber(entry.value))
      .map((entry) => {
        return {
          date: parse(entry.date, 'dd/MM/yyyy', new Date().toISOString()),
          description: entry.description,
          value: parseFloat(entry.value).toString()
        }
      })

  if (notEmptyData.length === 0) {
    console.log("No data!")
    return
  }

  try {
    const response = fetchData("/spreadsheet", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notEmptyData)
    })
    console.log(response)

    //remove from the data.value only values included in notEmptyData
    data.value = data.value.filter((entry) => !isDate(entry.date)
        || !(entry.description.length > 0)
        || !isNumber(entry.value))

  } catch (error) {
    console.error(error)
  }
}

function isDate(date: string): boolean {
  ;
  return date.length > 0 && !isNaN(parse(date, 'dd/MM/yyyy', new Date()).getTime())
}

function isNumber(value: string): boolean {
  console.log(value)
  console.log(value.length > 0 && !isNaN(parseFloat(value)))
  return value.length > 0 && !isNaN(parseFloat(value))
}

</script>

<template>
  <v-container class="max-width">
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Spreadsheet</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="sendEntries">Send Entries</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <v-grid
              theme="material"
              class="size"
              :resize="true"
              :colSize="250"
              :range="true"
              :source="data"
              :columns="columns"
              :useClipboard="true"
          >
          </v-grid>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
.size {

  height: 70vh;
}
</style>