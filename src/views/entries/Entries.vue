<script setup lang="ts">

import TabComponent from "../../components/Tab.vue";
import {BASE_URL} from "../../utils/Constants.ts";
import {ref, watch} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import CurrencyInput from "../../components/CurrencyInput.vue";
import EntryGroup from "../../components/entry/EntryGroup.vue";
import {currencyFormat} from "../../utils/GlobalFunction.ts";

type Form = {
  id: number | null,
  description: string,
  value: number | null,
  categoryId: number | null,
  isIgnored: boolean,
  date: Date | null
}

const form = ref<Form>({
  id: null,
  description: '',
  value: null,
  categoryId: null,
  date: null,
  isIgnored: false
})

const rules = {
  description: {required},
  value: {required},
  categoryId: {required},
  date: {required},
  isIgnored: {},
  id: {}
}

let v$ = useVuelidate(rules, form)

const showIgnored = ref<boolean>(false)
const year = ref<number>(new Date().getFullYear())
const month = ref<number>(new Date().getMonth() + 1)
const categoryList = ref<Category[]>([])
const filteredCategoryList = ref<Category[]>([])
const categoryValue = ref<string>()
const monthEntryList = ref<MonthEntryList[]>()
const entryToEdit = ref<number>()
const panels = ref<string[]>([])
const dialogShow = ref<boolean>(false)
const deleteEntryDialog = ref<boolean>(false)
const entryDescriptionToDelete = ref<string>()
const entryIdToDelete = ref<number>()

getCategories()
getMonthEntries()

watch(showIgnored, getMonthEntries)

async function getCategories() {
  await fetch(BASE_URL + "/categories")
      .then(response => response.json())
      .then(data => {
        categoryList.value = data
        filteredCategoryList.value = data
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function updateYear(newYear: number) {
  year.value = newYear
  getMonthEntries()
}

function updateMonth(newMonth: number) {
  month.value = newMonth
}

async function getMonthEntries() {
  let url = new URL(BASE_URL + '/month-entries')
  url.searchParams.append('year', year.value.toString())
  url.searchParams.append('showIgnored', showIgnored.value.toString())
  await fetch(url)
      .then(response => response.json())
      .then(data => {
        monthEntryList.value = data

      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function editEntry(entry: Entry) {
  form.value.description = entry.description
  form.value.value = entry.value
  form.value.date = new Date(entry.date)
  form.value.categoryId = categoryList.value!!.find(category => category.name == entry.category.name)!!.id
  form.value.id = entry.id!!
  form.value.isIgnored = entry.isIgnored
  entryToEdit.value = entry.id
  dialogShow.value = true
}

async function updateEntry() {

  await v$.value.$validate()

  if (v$.value.$invalid) {
    return
  }

  await fetch(BASE_URL + `/entries/${form.value.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })
      .then(response => {
        entryToEdit.value = 0
        getMonthEntries()
        onCloseDialog()
      })
      .catch(error => {
        console.error('Error:', error);
      });
}


async function createEntry() {

  await v$.value.$validate()

  if (v$.value.$invalid) {
    return
  }

  await fetch(BASE_URL + `/entries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })
      .then(response => {
        v$.value.$reset()
        getMonthEntries()
        onCloseDialog()
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function deleteEntry() {
  fetch(BASE_URL + `/entries/${entryIdToDelete.value}`, {
    method: 'DELETE'
  })
      .then(response => {
        deleteEntryDialog.value = false
        getMonthEntries()
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function onCloseDialog() {
  v$.value.$reset()
  form.value = {
    description: '',
    value: null,
    categoryId: null,
    date: null,
    id: null,
    isIgnored: false
  }
  dialogShow.value = false

}


function newEntry() {
  dialogShow.value = true
}


function sortList(categorizedEntries: CategorizedEntries[]) {
  return categorizedEntries.sort((a, b) => a.category.localeCompare(b.category))
}

function openDeleteEntryDialog(entry: Entry) {
  deleteEntryDialog.value = true
  entryIdToDelete.value = entry.id
  entryDescriptionToDelete.value = entry.description
}

function onExpand() {
  categoryValue.value = ''
  filteredCategoryList.value = categoryList.value!!
}

function searchCategory() {

  if (categoryValue.value!!.length == 0) {
    filteredCategoryList.value = categoryList.value!!
    return
  }

  filteredCategoryList.value = categoryList.value!!.filter(category => category.name.toLowerCase().includes(categoryValue.value!!.toLowerCase()))

}

</script>

<template>
  <v-container class="max-width">
    <v-row justify="center" class="text-center">
      <v-col cols="12" sm="4" offset-sm="4" md="6" offset-md="3" lg="8" offset-lg="2">
        <h1>Entries</h1>
      </v-col>
      <v-col cols="12" sm="4" md="3" lg="2">
        <v-btn @click="newEntry">Add new entry</v-btn>
      </v-col>
    </v-row>
    <TabComponent :update-year="updateYear" :update-month="updateMonth">
      <v-window-item v-for="monthEntries in monthEntryList" :key="monthEntries.month" :value="monthEntries.month">
        <v-checkbox label="Show Ignored" v-model="showIgnored"></v-checkbox>
        <v-expansion-panels multiple v-model="panels">
          <v-expansion-panel v-for="categorizedEntries in sortList(monthEntries.categorizedEntries)"
                             :key="categorizedEntries.category"
                             elevation="2"
                             class="mt-2 mb-2">
            <v-expansion-panel-title  :color="categorizedEntries.colorHex ? categorizedEntries.colorHex : '#a2a2a2' "  class="rounded-xl justify-center pa-0 " hide-actions>

              <span class="text-h5">{{ categorizedEntries.category }}</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <EntryGroup v-for="entryGroup in [
                  {type: 'Expenses', entries: categorizedEntries.entries.filter(entry => entry.value > 0) },
                  {type: 'Income', entries: categorizedEntries.entries.filter(entry => entry.value <= 0)}
                  ]"
                          :entries="entryGroup.entries"
                          :open-delete-entry-dialog="openDeleteEntryDialog"
                          :edit-entry="editEntry"
                          :type="entryGroup.type"
              >
              </EntryGroup>
              <v-row class="total-border ma-1 rounded-xl text-center">
                <v-col class="font-weight-bold">
                  Total
                </v-col>
                <v-col class="font-weight-bold">
                  {{ currencyFormat(categorizedEntries.total) }}
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>
    </TabComponent>
  </v-container>
  <v-dialog max-width="800" v-model="dialogShow" persistent no-click-animation>
    <v-card>
      <v-card-title v-if="form.id!!" class="text-center">
        Update Entry
      </v-card-title>
      <v-card-title v-else class="text-center">
        Add New Entry
      </v-card-title>
      <v-card-text>
        <v-text-field label="Description"
                      v-model="form.description"
                      @input="v$.description.$touch"
                      @blur="v$.description.$touch"
                      :error-messages="v$.description.$errors.map(e => e.$message).join(' - ')"></v-text-field>
        <CurrencyInput v-model="form.value"
                       @input="v$.value.$touch"
                       @blur="v$.value.$touch"
                       label="Value"
                       :error-messages="v$.value.$errors.map(e => e.$message).join(' - ')"
        ></CurrencyInput>
        <v-select v-model="form.categoryId"
                  :items="filteredCategoryList"
                  :autofocus="false"
                  item-title="name"
                  item-value="id"
                  label="Category"
                  @input="v$.categoryId.$touch"
                  @blur="v$.categoryId.$touch"
                  @click="onExpand"
                  :error-messages="v$.categoryId.$errors.map(e => e.$message).join(' - ')">
          <template v-slot:prepend-item :autofocus="true">
            <v-text-field placeholder="Search" :autofocus="true" v-model="categoryValue"
                          prepend-inner-icon="fa:fas fa-search"
                          @keyup="searchCategory">
            </v-text-field>
          </template>
          <template v-slot:selection>
            {{ categoryList.find(category => category.id == form.categoryId)!!.name }}
          </template>
        </v-select>
        <v-checkbox label="Ignored" v-model="form.isIgnored"></v-checkbox>
        <v-label class="pl-2">Date:</v-label>
        <v-date-picker class="w-100"
                       hide-header v-model="form.date"
                       @input="v$.date.$touch"
                       @blur="v$.date.$touch"
                       :error-messages="v$.date.$errors.map(e => e.$message).join(' - ')"
        ></v-date-picker>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="onCloseDialog">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn v-if="form.id!!" color="blue" @click="updateEntry">Update</v-btn>
        <v-btn v-else color="blue" @click="createEntry">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteEntryDialog" class="w-50" persistent no-click-animation>
    <v-card>
      <v-card-title class="text-center">
        Delete Entry
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="text-center text-h5">
            Are you sure you want to delete this entry: <b>{{ entryDescriptionToDelete }}</b>?
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="() => deleteEntryDialog = false">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn color="blue" @click="deleteEntry">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<style scoped>
.v-expansion-panel-text__wrapper{
  padding: 0 !important;

}
</style>