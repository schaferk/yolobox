<template>
  <pre class="ascii-logo" aria-hidden="true">██╗   ██╗ ██████╗ ██╗      ██████╗ ██████╗  ██████╗ ██╗  ██╗
╚██╗ ██╔╝██╔═══██╗██║     ██╔═══██╗██╔══██╗██╔═══██╗╚██╗██╔╝
 ╚████╔╝ ██║   ██║██║     ██║   ██║██████╔╝██║   ██║ ╚███╔╝
  ╚██╔╝  ██║   ██║██║     ██║   ██║██╔══██╗██║   ██║ ██╔██╗
   ██║   ╚██████╔╝███████╗╚██████╔╝██████╔╝╚██████╔╝██╔╝ ██╗
   ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝</pre>
</template>

<style scoped>
.ascii-logo {
  font-family: var(--vp-font-family-mono);
  font-size: clamp(0.35rem, 1.15vw, 0.85rem);
  line-height: 1.2;
  color: var(--yolo-orange);
  margin: 0 0 24px;
  white-space: pre;
  text-align: left;
  display: inline-block;
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.25);
  animation: ascii-glow 4s ease-in-out infinite alternate;
  background: none;
}

@keyframes ascii-glow {
  0% { text-shadow: 0 0 20px rgba(255, 107, 0, 0.2); }
  100% { text-shadow: 0 0 40px rgba(255, 107, 0, 0.4); }
}

@media (max-width: 700px) {
  .ascii-logo {
    display: none;
  }
}
</style>
