<template>
  <div class="input-wrapper">
    <label :for="identity" class="label fw-semibold">
      {{ label }} <span class="required">*</span>
      <slot></slot>
    </label>
    
    <!-- Check if the type is textarea -->
    <textarea
      v-if="type === 'textarea'"
      :id="identity"
      :placeholder="placeholder"
      :readonly="readonly === '1'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="$emit('keyInput', $event.target.value)"
      @focus="$emit('totalTimeFocus', $event.target.value)"
      class="form-control break-words whitespace-pre-line"
      rows="8"
    ></textarea>

    <!-- Default input for other types -->
    <input
      v-else
      :class="['form-control', { 'file-input': type == 'file' }]"
      :type="type"
      :id="identity"
      :placeholder="placeholder"
      :readonly="readonly === '1'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="$emit('keyInput', $event.target.value)"
      @focus="$emit('totalTimeFocus', $event.target.value)"
      :multiple="type === 'file'"
    />
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column; /* Atur elemen secara vertikal */
  margin-bottom: 10px;
}

.label {
  margin-bottom: 5px; /* Beri jarak antara label dan input */
  font-size: 14px;
  color: #333;
}

.required {
  color: #cb3a31;
}

.form-control {
  padding: 0.375rem 0.75rem;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  background-color: #fff;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #466543;
  outline: none;
}
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.whitespace-pre-line {
  white-space: pre-line;
}
</style>

<script setup>
defineProps({
  type: { type: String, require: true },
  label: { type: String, require: true },
  identity: { type: String, require: true },
  placeholder: { type: String, require: false },
  readonly: { type: String, require: true, default: "0" },
  isImage: { type: Boolean, require: true, default: false },
  modelValue: { type: [String, Number] },
});
</script>
