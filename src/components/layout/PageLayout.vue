<script setup lang="ts">
</script>

<template>
  <div class="max-w-[1440px] mx-auto px-5 lg:px-8 py-5">
    <div class="flex flex-col lg:flex-row gap-5">
      <aside class="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
        <slot name="inputs" />
      </aside>
      <main class="flex-1 min-w-0">
        <slot name="results" />
      </main>
    </div>
  </div>
</template>
