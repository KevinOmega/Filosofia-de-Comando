<script setup>
import { computed, reactive, ref } from 'vue'
import { personalFields, normalizedQuestions } from '../data/questions.js'
import { theme } from '../config/theme.js'
import { submitToGoogleSheets } from '../services/googleSheets.js'
import ProgressBar from '../components/ProgressBar.vue'
import ChoiceQuestion from '../components/ChoiceQuestion.vue'
import TextQuestion from '../components/TextQuestion.vue'
import CoverScreen from '../components/CoverScreen.vue'
import SuccessScreen from '../components/SuccessScreen.vue'

// Cada paso del wizard es o un campo de texto (datos personales) o una
// pregunta de selección múltiple. Se arma dinámicamente desde src/data/questions.js
const steps = [
  ...personalFields.map((field) => ({ kind: 'text', field })),
  ...normalizedQuestions.map((question) => ({ kind: 'choice', question })),
]

const phase = ref('cover') // 'cover' | 'form' | 'submitting' | 'success' | 'error'
const stepIndex = ref(0)
const direction = ref(1)
const answers = reactive({})
const errors = reactive({})

const currentStep = computed(() => steps[stepIndex.value])
const isFirstStep = computed(() => stepIndex.value === 0)
const isLastStep = computed(() => stepIndex.value === steps.length - 1)
const stepKey = (step) => (step.kind === 'text' ? step.field.id : step.question.id)

// Numeración visible de la pregunta (1..N), independiente de los pasos de
// datos personales, para que coincida con la numeración del instrumento original.
const currentQuestionNumber = computed(() => {
  const step = currentStep.value
  if (step.kind !== 'choice') return null
  return normalizedQuestions.findIndex((q) => q.id === step.question.id) + 1
})

function currentAnswer() {
  return answers[stepKey(currentStep.value)]
}

function validateCurrentStep() {
  const step = currentStep.value
  const key = stepKey(step)
  errors[key] = ''

  if (step.kind === 'text') {
    const value = (answers[key] || '').trim()
    if (step.field.required && !value) {
      errors[key] = 'Este campo es obligatorio.'
      return false
    }
    if (step.field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[key] = 'Ingresa un correo electrónico válido.'
      return false
    }
    return true
  }

  if (step.question.required && (answers[key] === undefined || answers[key] === null)) {
    errors[key] = 'Selecciona una opción para continuar.'
    return false
  }
  return true
}

async function goNext() {
  if (!validateCurrentStep()) return

  if (isLastStep.value) {
    await submit()
    return
  }

  direction.value = 1
  stepIndex.value += 1
}

function goPrev() {
  if (isFirstStep.value) return
  direction.value = -1
  stepIndex.value -= 1
}

function startSurvey() {
  phase.value = 'form'
}

async function submit() {
  phase.value = 'submitting'
  const payload = { fecha_envio: new Date().toISOString() }
  steps.forEach((step) => {
    const key = stepKey(step)
    if (step.kind === 'choice') {
      const value = answers[key]
      const option = step.question.options.find((o) => o.value === value)
      payload[key] = value ?? ''
      payload[`${key}_texto`] = option ? option.label : ''
    } else {
      payload[key] = answers[key] || ''
    }
  })

  try {
    await submitToGoogleSheets(payload)
    phase.value = 'success'
  } catch (err) {
    console.error('Error al enviar la encuesta:', err)
    phase.value = 'error'
  }
}

function retry() {
  phase.value = 'form'
}

function onEnterKey(event) {
  if (event.target.tagName === 'INPUT') {
    goNext()
  }
}
</script>

<template>
  <CoverScreen v-if="phase === 'cover'" @start="startSurvey" />

  <SuccessScreen v-else-if="phase === 'success'" status="success" />
  <SuccessScreen v-else-if="phase === 'error'" status="error" @retry="retry" />

  <div v-else class="wizard">
    <header class="wizard__header">
      <button
        class="wizard__back"
        type="button"
        :disabled="isFirstStep"
        aria-label="Pregunta anterior"
        @click="goPrev"
      >
        ←
      </button>
      <ProgressBar :current="stepIndex + 1" :total="steps.length" />
    </header>

    <main class="wizard__main">
      <Transition :name="direction > 0 ? 'step' : 'step-back'" mode="out-in">
        <div class="wizard__card glass" :key="stepKey(currentStep)">
          <TextQuestion
            v-if="currentStep.kind === 'text'"
            :field="currentStep.field"
            v-model="answers[stepKey(currentStep)]"
            :error="errors[stepKey(currentStep)]"
            @keyup.enter="onEnterKey"
          />
          <ChoiceQuestion
            v-else
            :question="currentStep.question"
            :number="currentQuestionNumber"
            v-model="answers[stepKey(currentStep)]"
          />
          <p v-if="currentStep.kind === 'choice' && errors[stepKey(currentStep)]" class="wizard__error">
            {{ errors[stepKey(currentStep)] }}
          </p>
        </div>
      </Transition>
    </main>

    <footer class="wizard__footer">
      <button
        v-if="phase === 'submitting'"
        class="wizard__next wizard__next--loading"
        type="button"
        disabled
      >
        <span class="spinner" /> Enviando...
      </button>
      <button v-else class="wizard__next" type="button" @click="goNext">
        {{ isLastStep ? 'Enviar encuesta' : 'Siguiente' }}
        <span v-if="!isLastStep">→</span>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.wizard {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: calc(16px + var(--safe-top)) 16px 0;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.wizard__header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 18px;
}

.wizard__back {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-hi);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wizard__back:disabled {
  opacity: 0.3;
  cursor: default;
}

.wizard__back:not(:disabled):active {
  transform: scale(0.92);
}

.wizard__main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 0 24px;
}

.wizard__card {
  width: 100%;
  border-radius: var(--radius-lg);
  padding: 28px 22px;
  box-shadow: var(--shadow-soft);
}

.wizard__error {
  margin: 14px 0 0;
  color: var(--accent-3);
  font-size: 0.85rem;
  font-weight: 600;
}

.wizard__footer {
  position: sticky;
  bottom: 0;
  padding: 14px 0 calc(20px + var(--safe-bottom));
  background: linear-gradient(180deg, transparent, var(--bg-0) 32%);
}

.wizard__next {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 17px 24px;
  border: none;
  border-radius: 99px;
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.wizard__next:hover {
  transform: translateY(-2px);
}

.wizard__next:active {
  transform: translateY(0) scale(0.98);
}

.wizard__next--loading {
  opacity: 0.75;
  cursor: wait;
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* forward */
.step-enter-active,
.step-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.36s cubic-bezier(0.22, 1, 0.36, 1), transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}
.step-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.step-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (min-width: 700px) {
  .wizard__card {
    padding: 44px 40px;
  }
}
</style>
