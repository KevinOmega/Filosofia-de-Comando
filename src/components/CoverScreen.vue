<script setup>
import { theme } from '../config/theme.js'

defineEmits(['start'])
</script>

<template>
  <div class="cover">
    <div class="cover__media" v-if="theme.coverImage">
      <img :src="theme.coverImage" alt="" @error="$event.target.style.display = 'none'" />
      <div class="cover__media-fade" />
    </div>

    <div class="cover__content glass">
      <img
        v-if="theme.logoImage"
        :src="theme.logoImage"
        alt="Logo"
        class="cover__logo"
        @error="$event.target.style.display = 'none'"
      />
      <span class="cover__eyebrow">Encuesta académica</span>
      <h1 class="cover__title">{{ theme.title }}</h1>
      <p class="cover__description">{{ theme.description }}</p>

      <button class="cover__cta" type="button" @click="$emit('start')">
        {{ theme.startButtonLabel }}
        <span class="cover__cta-arrow">→</span>
      </button>

      <div class="cover__footnote">
        <span>🔒 Respuestas confidenciales</span>
        <span>⏱️ ~5 minutos</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px 16px calc(32px + var(--safe-bottom));
}

.cover__media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.cover__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover__media-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 16, 32, 0.2) 0%, rgba(11, 16, 32, 0.55) 55%, var(--bg-0) 92%);
}

.cover__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 560px;
  border-radius: var(--radius-lg);
  padding: 36px 28px calc(28px + var(--safe-bottom) / 2);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cover__logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  margin-bottom: 16px;
}

.cover__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-2);
  margin-bottom: 10px;
}

.cover__title {
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 10px;
  background: linear-gradient(120deg, #ffffff 30%, var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cover__description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-mid);
  margin: 0 0 28px;
}

.cover__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  border: none;
  border-radius: 99px;
  background: linear-gradient(120deg, var(--accent-1), var(--accent-2));
  color: white;
  font-size: 1.02rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  justify-content: center;
}

.cover__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(124, 58, 237, 0.5);
}

.cover__cta:active {
  transform: translateY(0) scale(0.98);
}

.cover__cta-arrow {
  transition: transform 0.2s ease;
}

.cover__cta:hover .cover__cta-arrow {
  transform: translateX(4px);
}

.cover__footnote {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  font-size: 0.8rem;
  color: var(--text-low);
  flex-wrap: wrap;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 700px) {
  .cover {
    align-items: center;
  }
}
</style>
