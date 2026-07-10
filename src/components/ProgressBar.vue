<script setup>
defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
})
</script>

<template>
  <div class="progress" role="progressbar" :aria-valuenow="current" :aria-valuemin="1" :aria-valuemax="total">
    <div class="progress__track">
      <div class="progress__fill" :style="{ width: `${(current / total) * 100}%` }" />
    </div>
    <span class="progress__label">{{ current }} / {{ total }}</span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress__track {
  flex: 1;
  height: 8px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.6);
}

.progress__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-mid);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
