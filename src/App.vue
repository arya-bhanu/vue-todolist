<script setup lang="ts"></script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="css">
main {
  margin: 0 auto;
}
@media (min-width: 768px) {
  body main {
    max-width: 60vw;
    width: 100%;
  }
}
</style>
