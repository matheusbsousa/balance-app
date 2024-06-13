<script setup lang="ts">
import {useCurrencyInput} from "vue-currency-input";
import {watch} from "vue";

type CurrencyInputProps = {
  modelValue: number | null,
  label: string
}

const props = defineProps<CurrencyInputProps>();

const {inputRef, formattedValue, setValue} = useCurrencyInput({
  currency: 'BRL',
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: {},
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