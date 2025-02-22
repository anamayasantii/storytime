<template>
  <client-only>
    <ckeditor
      v-if="editorLoaded"
      :editor="editor"
      v-model="content"
      :config="editorConfig"
      @input="updateContent"
    >
    </ckeditor>
  </client-only>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
const editor = ref(null);
const editorLoaded = ref(false);
const content = ref(props.modelValue);

const editorConfig = {
  placeholder: "Enter a content here",
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    // 'bulletedList', 'numberedList', 'blockQuote', '|',
    "undo",
    "redo",
    "|",
    // 'alignment', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
    // 'indent', 'outdent'
  ],
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
};

const updateContent = (event) => {
  emit("update:modelValue", event);
};

// Watch perubahan modelValue dari parent
watch(
  () => props.modelValue,
  (newValue) => {
    content.value = newValue;
  }
);

onMounted(async () => {
  try {
    const { default: ClassicEditor } = await import(
      "@ckeditor/ckeditor5-build-classic"
    );
    editor.value = ClassicEditor;
    editorLoaded.value = true;
  } catch (error) {
    console.error("Error loading CKEditor:", error);
  }
});
</script>
