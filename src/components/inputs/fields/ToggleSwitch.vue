<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <span class="text-[12px] font-medium text-text-secondary">{{ label }}</span>
    <button
      type="button"
      class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-in-out"
      :class="modelValue ? 'bg-text-secondary' : 'bg-input-border'"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="pointer-events-none inline-block h-3.5 w-3.5 mt-[3px] transform rounded-full bg-white shadow transition duration-150 ease-in-out"
        :class="modelValue ? 'translate-x-[17px]' : 'translate-x-[3px]'"
      />
    </button>
  </div>
</template>
