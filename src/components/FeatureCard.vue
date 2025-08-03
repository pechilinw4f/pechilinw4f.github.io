<template>
  <div class="feature">
    <img :src="icon" :alt="`${title} icon`" class="icon" />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<style scoped>
.feature {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  text-align: left;
  transition: transform 0.2s ease;
}

.feature:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.05);
}

.feature h2 {
  font-size: 1.2rem;
  color: #6cace4;
  margin: 10px 0;
}

.feature p {
  font-size: 1rem;
  color: #ccc;
}

.icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  filter: brightness(1.2);
}
</style>
