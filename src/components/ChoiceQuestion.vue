<script setup>
const props = defineProps({
  question: { type: Object, required: true },
  number: { type: Number, default: null },
  modelValue: { type: [Number, String, null], default: null },
})

const emit = defineEmits(['update:modelValue'])

function select(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="choice-question">
    <div class="choice-question__meta">
      <span class="badge">{{ question.dimension }}</span>
      <span class="badge badge--ghost">{{ question.indicator }}</span>
    </div>

    <div class="choice-question__question">
      <span v-if="number" class="choice-question__number">{{ number }}</span>
      <h2 class="choice-question__text">{{ question.text }}</h2>
    </div>

    <div class="choice-question__options">
      <button
        v-for="opt in question.options"
        :key="opt.value"
        type="button"
        class="option"
        :class="{ 'option--active': modelValue === opt.value }"
        @click="select(opt.value)"
      >
        <span class="option__radio">
          <span class="option__radio-dot" />
        </span>
        <span class="option__label">{{ opt.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.choice-question {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.choice-question__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  color: white;
}

.badge--ghost {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-mid);
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.choice-question__question {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.choice-question__number {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  box-shadow: 0 8px 22px rgba(124, 58, 237, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.choice-question__text {
  font-size: clamp(1.15rem, 4vw, 1.5rem);
  line-height: 1.4;
  font-weight: 700;
  margin: 0;
  color: var(--text-hi);
  text-align: justify;
  text-justify: inter-word;
  hyphens: auto;
}

.choice-question__options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-hi);
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  -webkit-tap-highlight-color: transparent;
}

.option:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.option:active {
  transform: translateY(0) scale(0.99);
}

.option--active {
  background: linear-gradient(120deg, rgba(124, 58, 237, 0.28), rgba(6, 182, 212, 0.2));
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 8px 26px rgba(124, 58, 237, 0.25);
}

.option__radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--text-low);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.18s ease;
}

.option--active .option__radio {
  border-color: var(--accent-2);
}

.option__radio-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  transform: scale(0);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.option--active .option__radio-dot {
  transform: scale(1);
}

.option__label {
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.35;
}

@media (min-width: 700px) {
  .choice-question__options {
    gap: 12px;
  }
  .option {
    padding: 18px 20px;
  }
}
</style>
