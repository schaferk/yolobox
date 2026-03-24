<template>
  <img
    class="ascii-logo"
    :src="logoSrc"
    alt="yolobox logo rendered from the block ASCII wordmark"
    decoding="async"
  >
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const logoSrc = computed(() => (
  isDark.value ? '/logo-dark.svg' : '/logo-light.svg'
))
</script>

<style scoped>
.ascii-logo {
  display: block;
  width: min(100%, 58rem);
  max-width: 100%;
  height: auto;
  margin: 0 0 24px;
  object-fit: contain;
}

@media (max-width: 700px) {
  .ascii-logo {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
