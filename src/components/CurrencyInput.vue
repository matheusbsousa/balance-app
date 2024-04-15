<script setup lang="ts">
import {useCurrencyInput} from "vue-currency-input";
import {watch} from "vue";

const props = defineProps({ modelValue: Number, label: String });

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: 'BRL',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: {  },
});

watch(
    () => props.modelValue,
    (value) => {
      setValue(value);
    }
);

</script>

<template>
  <v-text-field
      v-model="formattedValue"
      ref="inputRef"
      :label="props.label"
  ></v-text-field>
</template>

<style scoped>

</style>