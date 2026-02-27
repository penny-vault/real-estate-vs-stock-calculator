<script setup lang="ts">
import InfoTip from './InfoTip.vue'

defineProps<{
  modelValue: number
  label: string
  tooltip?: string
  step?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^0-9.\-]/g, '')
  const num = parseFloat(raw)
  if (!isNaN(num)) emit('update:modelValue', num)
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <label class="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">{{ label }}</label>
      <InfoTip v-if="tooltip" :text="tooltip" />
    </div>
    <div class="relative">
      <input
        type="text"
        class="input-field pr-6"
        :value="modelValue"
        @input="onInput"
      />
      <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none">%</span>
    </div>
  </div>
</template>
