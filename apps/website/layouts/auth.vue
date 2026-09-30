<!-- Layout for guest pages (login, register, OTP…). Usage: definePageMeta({ layout: 'auth' }) -->
<template>
  <div class="bg-bg-surface-default text-text-default flex min-h-screen font-sans">
    <main class="flex flex-1 items-center justify-center p-4">
      <slot />
    </main>
  </div>
</template>
