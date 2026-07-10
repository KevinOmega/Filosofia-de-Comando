<script setup>
import { theme } from '../config/theme.js'
</script>

<template>
  <div class="bg-decor" aria-hidden="true">
    <div
      v-if="theme.backgroundImage"
      class="bg-decor__image"
      :style="{ backgroundImage: `url(${theme.backgroundImage})` }"
    />
    <div class="bg-decor__blob bg-decor__blob--1" />
    <div class="bg-decor__blob bg-decor__blob--2" />
    <div class="bg-decor__blob bg-decor__blob--3" />
    <div class="bg-decor__grid" />
    <div class="bg-decor__noise" />
  </div>
</template>

<style scoped>
.bg-decor {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: radial-gradient(ellipse at top, #171d3d 0%, #0b1020 55%, #07091a 100%);
}

.bg-decor__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.22;
  filter: saturate(1.1);
}

.bg-decor__grid {
  position: absolute;
  inset: -2px;
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(ellipse at 50% 0%, black 10%, transparent 72%);
}

.bg-decor__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  will-change: transform;
}

.bg-decor__blob--1 {
  width: 60vmax;
  height: 60vmax;
  top: -25vmax;
  left: -20vmax;
  background: radial-gradient(circle at 30% 30%, var(--accent-1), transparent 70%);
  animation: float-a 22s ease-in-out infinite;
}

.bg-decor__blob--2 {
  width: 55vmax;
  height: 55vmax;
  bottom: -22vmax;
  right: -18vmax;
  background: radial-gradient(circle at 60% 60%, var(--accent-2), transparent 70%);
  animation: float-b 26s ease-in-out infinite;
}

.bg-decor__blob--3 {
  width: 40vmax;
  height: 40vmax;
  top: 40%;
  left: 55%;
  background: radial-gradient(circle at 50% 50%, var(--accent-3), transparent 70%);
  opacity: 0.35;
  animation: float-c 30s ease-in-out infinite;
}

.bg-decor__noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes float-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(6vmax, 8vmax) scale(1.08); }
}
@keyframes float-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-7vmax, -5vmax) scale(1.1); }
}
@keyframes float-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-5vmax, 6vmax) scale(0.92); }
}

@media (prefers-reduced-motion: reduce) {
  .bg-decor__blob {
    animation: none;
  }
}
</style>
