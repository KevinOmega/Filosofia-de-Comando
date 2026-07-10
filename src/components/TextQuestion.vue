<script setup>
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { type: String, default: '' },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="text-question">
    <div class="text-question__icon">{{ field.icon }}</div>
    <h2 class="text-question__label">{{ field.label }}</h2>

    <input
      class="text-question__input"
      :class="{ 'text-question__input--error': error }"
      :type="field.type"
      :placeholder="field.placeholder"
      :autocomplete="field.autocomplete"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      autofocus
    />
    <p v-if="error" class="text-question__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.text-question {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.text-question__icon {
  font-size: 2.4rem;
  line-height: 1;
}

.text-question__label {
  font-size: clamp(1.2rem, 4.5vw, 1.6rem);
  font-weight: 700;
  margin: 0;
  color: var(--text-hi);
}

.text-question__input {
  width: 100%;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-hi);
  font-size: 1.05rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.text-question__input::placeholder {
  color: var(--text-low);
}

.text-question__input:focus {
  border-color: var(--accent-2);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.18);
}

.text-question__input--error {
  border-color: var(--accent-3);
}

.text-question__error {
  margin: 0;
  color: var(--accent-3);
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
