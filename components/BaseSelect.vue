<template>
  <select
    class="form-select"
    :id="id"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <!-- Opsi default hanya jika modelValue kosong -->
    <option value="" disabled :selected="!modelValue">Select a category</option>

    <!-- Opsi kategori dari props -->
    <option v-for="(item, index) in data" :key="index" :value="item.id">
      {{ item.name }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  data: { type: Array, required: true },
  id: { type: String, required: true },
  modelValue: { type: [String, Number] },
});
</script>
