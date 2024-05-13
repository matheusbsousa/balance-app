<script setup lang="ts">

import {ref} from "vue";
import {BASE_URL} from "../../utils/Constants.ts";
import {useDisplay} from "vuetify";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const categories = ref<Category[]>([])
const display = useDisplay()
const categoryDialogShow = ref(false)
const deleteCategoryDialogShow = ref(false)
const categoryDescriptionToDelete = ref<string>()
const categoryIdToDelete = ref<number>()
const dialogErrorMessage = ref<string>()
const dialogColorPicker = ref<boolean>()


type Form = {
  id: number | null,
  description: string,
  values: string[],
  colorHex: string | null
}

const form = ref<Form>({
  id: null,
  description: '',
  values: [],
  colorHex: '#a2a2a2'
})

const rules = {
  description: {required},
  values: {required},
}

let formV$ = useVuelidate(rules, form)


getCategories()


async function getCategories() {
  await fetch(BASE_URL + '/categories')
      .then(response => response.json())
      .then(data => {
        categories.value = data
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

async function saveCategory() {
  if (formV$.value.$invalid) {
    formV$.value.$touch()
    return
  }
  try {

    const response = await fetch(BASE_URL + '/categories', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.description,
        values: form.value.values,
        colorHex: form.value.colorHex
      })
    })

    if (!response.ok) {
      const data = await response.json()
      dialogErrorMessage.value = data.message
      return
    }

    getCategories()
    categoryDialogShow.value = false

  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateCategory() {
  if (formV$.value.$invalid) {
    formV$.value.$touch()
    return
  }
  await fetch(BASE_URL + '/categories/' + form.value.id, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: form.value.description,
      values: form.value.values,
      colorHex: form.value.colorHex
    })
  })
      .then(() => {
        getCategories()
        categoryDialogShow.value = false
      })
      .catch(error => {
        console.error('Error:', error);
      });
}


function openDeleteCategoryDialog(category: Category) {
  categoryDescriptionToDelete.value = category.name
  categoryIdToDelete.value = category.id
  deleteCategoryDialogShow.value = true
}

function deleteCategory() {
  fetch(BASE_URL + '/categories/' + categoryIdToDelete.value, {
    method: "DELETE",
  })
      .then(() => {
        getCategories()
        deleteCategoryDialogShow.value = false
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function openCategoryDialog(category: Category) {
  formV$.value.$reset()
  form.value.values = []
  form.value.description = ''
  form.value.id = null
  form.value.colorHex = '#a2a2a2'

  if (category.id) {
    form.value.values = category.values
    form.value.description = category.name
    form.value.id = category.id
    form.value.colorHex = category.colorHex
  }
  categoryDialogShow.value = true
}

</script>

<template>
  <v-container fluid class="max-width">
    <v-row justify="center" class="text-center">
      <v-col cols="12" sm="4" offset-sm="4" md="6" offset-md="3" lg="8" offset-lg="2">
        <h1>Categories</h1>
      </v-col>
      <v-col cols="12" sm="4" md="3" lg="2">
        <v-btn @click="openCategoryDialog">New Category</v-btn>
      </v-col>
    </v-row>
    <v-row class="font-weight-bold">
      <v-col cols="2">
        Description
      </v-col>
      <v-col cols="7" class="text-center overflow-hidden">
        Values
      </v-col>
      <v-col cols="1">
        Color
      </v-col>
      <v-col cols="2" class="text-center">
        Actions
      </v-col>
    </v-row>
    <v-row v-for="category in categories" justify="center" align="center">
      <v-col cols="2">
        {{ category.name }}
      </v-col>
      <v-col cols="7" class="overflow-hidden">
        <div class="d-inline-flex ma-1 align-center" v-for="value in category.values">
          <v-chip v-if="category.values.indexOf(value) < 5 ">
            {{ value }}
          </v-chip>
          <span v-if="category.values.indexOf(value) === 5" class="ml-4 text-grey-darken-1">
            +{{ category.values.length - 5 }}
          </span>
        </div>
      </v-col>
      <v-col cols="1">
        <v-icon icon="fa:fas fa-circle" :color="category.colorHex"></v-icon>
      </v-col>
      <v-col cols="2" class="text-center">
        <div v-if="display.mdAndUp.value" class="d-flex justify-center align-center ga-5">
          <v-icon @click="openCategoryDialog(category)" color="grey" icon="fa:fas fa-pen"></v-icon>
          <v-icon @click="openDeleteCategoryDialog(category)" color="red" icon="fa:fas fa-xmark" size="34"></v-icon>
        </div>
        <v-menu v-else>
          <template class="justify-center align-center" v-slot:activator="{ props }">
            <v-icon v-bind="props" color="grey" icon="fa:fas fa-bars"></v-icon>
          </template>
          <v-list min-width="200" class="pa-0">
            <v-list-item @click="openCategoryDialog(category)">
              <v-row>
                <v-col cols="5" class="text-center">
                  <v-icon color="grey" icon="fa:fas fa-pen"></v-icon>
                </v-col>
                <v-col>
                  <span class="text-h6 text-center">Edit</span>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item @click="openDeleteCategoryDialog(category)">
              <v-row>
                <v-col cols="5" class="text-center">
                  <v-icon color="red" icon="fa:fas fa-xmark" size="34"></v-icon>
                </v-col>
                <v-col>
                  <span class="text-h6 text-center">Delete</span>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog max-width="800" v-model="categoryDialogShow" persistent no-click-animation>
    <v-card>
      <v-card-title v-if="form.id!!" class="text-center">
        Update Category
      </v-card-title>
      <v-card-title v-else class="text-center">
        Add New Category
      </v-card-title>
      <v-card-text class="">
        <v-sheet v-if="dialogErrorMessage" class="text-red ma-1 pa-4" rounded elevation="1" border>
          <span class="font-weight-bold">Error: </span>{{ dialogErrorMessage }}
        </v-sheet>
      </v-card-text>
      <v-card-text>
        <v-text-field label="Description"
                      v-model="form.description"
                      @input="formV$.description.$touch"
                      @blur="formV$.description.$touch"
                      :error-messages="formV$.description.$errors.map(e => e.$message).join(' - ')"></v-text-field>

        <v-combobox
            v-model="form.values"
            label="Category values"
            multiple
            chips
            closable-chips
            @input="formV$.values.$touch"
            @blur="formV$.values.$touch"
            :error-messages="formV$.values.$errors.map(e => e.$message).join(' - ')"
        ></v-combobox>
        <v-label class="mr-2">
          Color:
        </v-label>
        <v-icon icon="fa:fas fa-circle" :color="form.colorHex!!" @click="dialogColorPicker = true"></v-icon>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="categoryDialogShow = false">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn v-if="form.id!!" color="blue" @click="updateCategory">Update</v-btn>
        <v-btn v-else color="blue" @click="saveCategory">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogColorPicker" opacity="0" width="300" no-click-animation>
    <div>
      <v-color-picker  v-model="form.colorHex"  width="300"/>
    </div>
  </v-dialog>
  <v-dialog v-model="deleteCategoryDialogShow" class="w-50" persistent no-click-animation>
    <v-card>
      <v-card-title class="text-center">
        Delete Entry
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="text-center text-h5">
            Are you sure you want to delete this category: <b>{{ categoryDescriptionToDelete }}</b>?
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center ga-5">
        <v-btn color="red" @click="deleteCategoryDialogShow = false">Cancel</v-btn>
        <v-divider vertical></v-divider>
        <v-btn color="blue" @click="deleteCategory">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
