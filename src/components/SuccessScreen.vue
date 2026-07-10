<script setup>
import { theme } from '../config/theme.js'

defineProps({
  status: { type: String, default: 'success' }, // 'success' | 'error'
})

defineEmits(['retry'])
</script>

<template>
  <div class="success">
    <div class="success__content glass">
      <template v-if="status === 'success'">
        <div class="success__icon success__icon--ok">✓</div>
        <img
          v-if="theme.successImage"
          :src="theme.successImage"
          alt=""
          class="success__image"
          @error="$event.target.style.display = 'none'"
        />
        <h1 class="success__title">{{ theme.thanksTitle }}</h1>
        <p class="success__message">{{ theme.thanksMessage }}</p>
      </template>

      <template v-else>
        <div class="success__icon success__icon--error">!</div>
        <h1 class="success__title">No pudimos enviar tus respuestas</h1>
        <p class="success__message">
          Verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, contacta a quien te
          compartió esta encuesta.
        </p>
        <button class="success__retry" type="button" @click="$emit('retry')">Reintentar envío</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.success {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.success__content {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius-lg);
  padding: 40px 28px;
  text-align: center;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.success__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
}

.success__icon--ok {
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
}

.success__icon--error {
  background: linear-gradient(120deg, #f97316, var(--accent-3));
  box-shadow: 0 10px 30px rgba(244, 114, 182, 0.35);
}

.success__image {
  width: 100%;
  max-width: 260px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  object-fit: cover;
}

.success__title {
  font-size: clamp(1.4rem, 5vw, 1.9rem);
  font-weight: 800;
  margin: 0 0 12px;
}

.success__message {
  color: var(--text-mid);
  line-height: 1.6;
  margin: 0;
}

.success__retry {
  margin-top: 24px;
  padding: 14px 26px;
  border: none;
  border-radius: 99px;
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  color: white;
  font-weight: 700;
  cursor: pointer;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
