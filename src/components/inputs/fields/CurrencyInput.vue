<script setup lang="ts">
import { ref } from 'vue'
import InfoTip from './InfoTip.vue'

const props = defineProps<{
  modelValue: number
  label: string
  tooltip?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const focused = ref(false)

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^0-9.\-]/g, '')
  const num = parseFloat(raw)
  if (!isNaN(num)) emit('update:modelValue', num)
}

function displayVal(): string {
  if (focused.value) return props.modelValue.toString()
  return props.modelValue.toLocaleString('en-US')
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <label class="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">{{ label }}</label>
      <InfoTip v-if="tooltip" :text="tooltip" />
    </div>
    <div class="relative">
      <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none">$</span>
      <input
        type="text"
        class="input-field pl-6"
        :value="displayVal()"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
  </div>
</template>
