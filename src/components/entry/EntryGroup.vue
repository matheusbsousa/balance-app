<script setup lang="ts">

import {currencyFormat, formatDate} from "../../utils/GlobalFunction.ts";
import {useDisplay} from "vuetify";

interface EntryGroup {
  entries: Entry[],
  editEntry: (entry: Entry) => void,
  openDeleteEntryDialog: (entry: Entry) => void,
  type: string,
}

defineProps<EntryGroup>()

const display = useDisplay()


</script>

<template>
  <v-container class="pa-0 mt-4 mb-2">
    <v-row v-if="entries?.length > 0"
           :class="type === 'Income' ?  'bg-green-accent-1' : 'bg-red-lighten-3'"
           class="rounded-xl mb-1">
      <v-col>
        <span class="text-h6">{{ type }}</span>
      </v-col>
    </v-row>
    <v-row v-if="entries?.length > 0"
           class="text-center font-weight-bold">
      <v-col cols="4">
        Description
      </v-col>
      <v-col cols="3">
        Value
      </v-col>
      <v-col cols="3">
        Date
      </v-col>
      <v-col cols="2">
        Actions
      </v-col>
    </v-row>
    <v-row v-for="item in entries" :key="item.id"
           align="center" class="text-center">
      <v-col>
        <v-row>
          <v-col cols="4">
            {{ item.description }}
          </v-col>
          <v-col cols="3">
            {{ currencyFormat(item.value) }}
          </v-col>
          <v-col cols="3">
            {{ formatDate(item.date) }}
          </v-col>
          <v-col cols="2">
            <div v-if="display.mdAndUp.value" class="d-flex justify-center align-center ga-5">
              <v-icon @click="editEntry(item)" color="grey" icon="fa:fas fa-pen"></v-icon>
              <v-icon @click="openDeleteEntryDialog(item)" color="red" icon="fa:fas fa-xmark" size="34"></v-icon>
            </div>
            <v-menu v-else>
              <template class="justify-center align-center" v-slot:activator="{ props }">
                <v-icon v-bind="props" color="grey" icon="fa:fas fa-bars"></v-icon>
              </template>
              <v-list min-width="200" class="pa-0">
                <v-list-item @click="editEntry(item)">
                  <v-row>
                    <v-col cols="5" class="text-center">
                      <v-icon color="grey" icon="fa:fas fa-pen"></v-icon>
                    </v-col>
                    <v-col>
                      <span class="text-h6 text-center">Edit</span>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item @click="openDeleteEntryDialog(item)">
                  <v-row>
                    <v-col cols="5" class="text-center">
                      <v-icon color="red" icon="fa:fas fa-xmark" size="34"></v-icon>
                    </v-col>
                    <v-col>
                      <span class="text-h6 text-center">Remove</span>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>