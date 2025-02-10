<template>
    <select class="form-select" :id="id"
    @input="$emit('update:modelValue', $event.target.value)">
        <option v-for="(item, index) in data" 
                :key="index" :value="item.id"
            :selected="modelValue === item.id">
            {{ item.name }}
        </option>
    </select>
</template>

<script setup>
defineProps({
    data: { type: Array, require: true },
    id: { type: String, require: true },
    modelValue: { type: [String, Number] },
})
</script>