<script setup lang="ts">

import TabComponent from "../../components/TabComponent.vue";
import {ref} from "vue";
import {between, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {BASE_URL} from "../../utils/Constants.ts";


type Form = {
  id: number | null,
  description: '',
  percentage: number | null,
  categories: number[] | null,
  monthLimitId: number | null
}

const form = ref<Form>({
  id: null,
  description: '',
  percentage: null,
  categories: null,
  monthLimitId: null
})

const rules = {
  description: {required},
  percentage: {required, between: between(0, 100)},
  categories: {required}
}

let v$ = useVuelidate(rules, form)

const year = ref<number>(new Date().getFullYear())
const month = ref<number>(new Date().getMonth() + 1)
const categoryList = ref<Category[]>()
const monthLimitList = ref<MonthLimit[]>()
const dialogShow = ref<boolean>(false)
const deleteLimitDialog = ref<boolean>(false)
const limitIdToDelete = ref<number>()
const limitDescriptionToDelete = ref<string>()

getCategories()
getMonthLimits()

async function getCategories() {
  await fetch(BASE_URL + "/categories")
      .then(response => response.json())
      .then(data => {
        categoryList.value = data
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

async function getMonthLimits() {
  let url = new URL(BASE_URL + "/month-limits")
  url.searchParams.append('year', year.value.toString())

  await fetch(url)
      .then(response => response.json())
      .then(data => {
        monthLimitList.value = data
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function updateYear(newYear: number) {
  year.value = newYear
  getMonthLimits()
}

function updateMonth(newMonth: number) {
  month.value = newMonth
}

function calcUsedLimit(monthLimit: any): number {
  return monthLimit.limits.reduce((acc: number, limit: any) => {
    return acc + limit.percentage
  }, 0)
}

function addLimit() {
  form.value = {
    id: null,
    description: '',
    percentage: null,
    categories: null,
    monthLimitId: null
  }
  dialogShow.value = true
}

function editLimit(limit: any) {
  form.value = {
    id: limit.id,
    description: limit.description,
    percentage: limit.percentage,
    categories: limit.categories.map((category: Category) => category.id),
    monthLimitId: limit.monthLimitId
  }
  dialogShow.value = true
}

function deleteLimit() {
  fetch(BASE_URL + `/limits/${limitIdToDelete.value}`, {
    method: 'DELETE'
  })
      .then(response => {
        deleteLimitDialog.value = false
        getMonthLimits()
      }).catch(error => {
    console.error('Error:', error);
  });
}

async function createLimit() {

  await v$.value.$validate()

  if (v$.value.$invalid) {
    console.log('Invalid form')
    return
  }

  let monthLimitId = monthLimitList.value!!.find((monthLimit: MonthLimit) => monthLimit.month === month.value)?.id

  await fetch(BASE_URL + "/limits", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: form.value.description,
      percentage: form.value.percentage,
      categoryIds: form.value.categories,
      monthLimitId: monthLimitId,
      month: monthLimitId ? null : month.value,
      year: monthLimitId ? null : year.value

    })
  })
      .then(response => response.json())
      .then(data => {
        getMonthLimits()
        onCloseDialog()
      })
      .catch(error => {
        console.error('Error:', error);
      });

}

async function updateLimit() {

  await v$.value.$validate()

  if (v$.value.$invalid) {
    console.log('Invalid form')
    return
  }

  let monthLimitId = monthLimitList.value!!.find((monthLimit: MonthLimit) => monthLimit.month === month.value)?.id

  await fetch(BASE_URL + `/limits/${form.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: form.value.description,
      percentage: form.value.percentage,
      categoryIds: form.value.categories,
      monthLimitId: monthLimitId,
    })
  })
      .then(response => response.json())
      .then(data => {
        getMonthLimits()
        onCloseDialog()
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function openDeleteLimitDialog(limit: any) {
  deleteLimitDialog.value = true
  limitIdToDelete.value = limit.id
  limitDescriptionToDelete.value = limit.description
}

function onCloseDialog() {
  dialogShow.value = false
  v$.value.$reset()
}


</script>

<template>
  <v-container class="max-width">
    <v-row justify="center" class="text-center">
      <v-col>
        <h1>Limits</h1>
      </v-col>
    </v-row>
    <TabComponent :update-year="updateYear" :update-month="updateMonth">
      <v-window-item v-for="monthLimit in monthLimitList" :key="monthLimit.month" :value="monthLimit.month">
        <v-row class="mt-2">
          <v-col class="text-start">
            <span class="text-h5">Used Limit: {{ calcUsedLimit(monthLimit).toFixed(2) }}%</span>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col class="text-start">
            <span class="text-h5">Remaining Limit: {{ (100 - calcUsedLimit(monthLimit)).toFixed(2) }}% </span>
          </v-col>
        </v-row>

        <v-row v-if="monthLimit.limits.length > 0" class="mt-2">
          <v-col class="font-weight-bold" cols="2">Description</v-col>
          <v-col class="font-weight-bold" cols="2">Percentage</v-col>
          <v-col class="font-weight-bold" cols="6">Categories</v-col>
          <v-col class="font-weight-bold" cols="2">Actions</v-col>
        </v-row>
        <v-row align="center" v-for="limit in monthLimit.limits" :key="limit.description">
          <v-col cols="2">{{ limit.description }}</v-col>
          <v-col cols="2">{{ limit.percentage }}%</v-col>
          <v-col cols="6" class="d-flex align-center ga-3">
            <div v-for="category in limit.categories">
              <v-chip v-if="limit.categories!!.indexOf(category) < 3">
                {{ category.name }}
              </v-chip>
              <span v-if="limit.categories!!.indexOf(category) === 3"
                    class="text-grey"> {{ limit.categories!!.length - 3 }}+</span>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-center align-center ga-4">
            <v-icon @click="editLimit(limit)" color="grey" icon="fa:fas fa-pen"></v-icon>
            <v-icon @click="openDeleteLimitDialog(limit)" color="red" size="35" icon="fa:fas fa-xmark"></v-icon>
          </v-col>
        </v-row>
      </v-window-item>
    </TabComponent>
    <v-row justify="center" class="mt-6">
      <v-icon @click="addLimit" color="green" size="35" icon="fa:fas fa-circle-plus"></v-icon>
    </v-row>
  </v-container>

  <v-dialog class="w-50" v-model="dialogShow" persistent no-click-animation>
    <v-card>
      <v-card-title v-if="form.id!!" class="text-center text-h4 mt-4  ">
        Update Limit
      </v-card-title>
      <v-card-title v-else class="text-center text-h4 mt-4 ">
        Add New Limit
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="form.description"
                          @input="v$.description.$touch"
                          @blur="v$.description.$touch"
                          :error-messages="v$.description.$errors.map(e => e.$message).join(' - ')"
                          label="Description"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field type="number"
                v-model="form.percentage"
                          @input="v$.percentage.$touch"
                          @blur="v$.percentage.$touch"
                          :error-messages="v$.percentage.$errors.map(e => e.$message).join(' - ')"
                          label="Percentage"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="form.categories" :items="categoryList" multiple chips closable-chips label="Categories"
                      item-title="name" item-value="id"
                      @input="v$.categories.$touch"
                      @blur="v$.categories.$touch"
                      :error-messages="v$.categories.$errors.map(e => e.$message).join(' - ')"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="onCloseDialog">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn v-if="form.id!!" color="blue" @click="updateLimit">Update</v-btn>
        <v-btn v-else color="blue" @click="createLimit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteLimitDialog" class="w-50" persistent no-click-animation>
    <v-card>
      <v-card-title class="text-center">
        Delete Limit
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="text-center text-h5">
            Are you sure you want to delete this limit: <b>{{ limitDescriptionToDelete }}</b>?
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="() => deleteLimitDialog = false">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn color="blue" @click="deleteLimit">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>