<script setup>
const props = defineProps({
  fields: { type: Array, required: true },
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue'])

function onInput(field, event) {
  const input = event.target
  const raw = input.value
  const value = field.type === 'email' ? raw : raw.toUpperCase()
  if (value !== raw) {
    const caret = input.selectionStart
    input.value = value
    input.setSelectionRange(caret, caret)
  }
  emit('update:modelValue', { ...props.modelValue, [field.id]: value })
}
</script>

<template>
  <div class="personal-data">
    <h2 class="personal-data__title">Tus datos</h2>

    <div class="personal-data__field" v-for="field in fields" :key="field.id">
      <label class="personal-data__label" :for="field.id">
        <span class="personal-data__icon">{{ field.icon }}</span>
        {{ field.label }}
      </label>
      <input
        :id="field.id"
        class="personal-data__input"
        :class="{ 'personal-data__input--error': errors[field.id] }"
        :type="field.type"
        :placeholder="field.placeholder"
        :autocomplete="field.autocomplete"
        :value="modelValue[field.id]"
        @input="onInput(field, $event)"
      />
      <p v-if="errors[field.id]" class="personal-data__error">{{ errors[field.id] }}</p>
    </div>
  </div>
</template>

<style scoped>
.personal-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.personal-data__title {
  font-size: clamp(1.2rem, 4.5vw, 1.6rem);
  font-weight: 700;
  margin: 0;
  color: var(--text-hi);
}

.personal-data__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.personal-data__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-mid);
}

.personal-data__icon {
  font-size: 1.2rem;
  line-height: 1;
}

.personal-data__input {
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

.personal-data__input::placeholder {
  color: var(--text-low);
}

.personal-data__input:focus {
  border-color: var(--accent-2);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.18);
}

.personal-data__input--error {
  border-color: var(--accent-3);
}

.personal-data__error {
  margin: 0;
  color: var(--accent-3);
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
