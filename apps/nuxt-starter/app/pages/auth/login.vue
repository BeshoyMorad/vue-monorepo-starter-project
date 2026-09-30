<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.auth.login,
    layout: 'auth',
    middleware: 'guest',
    title: 'Sign In',
    auth: false,
  });
</script>

<template>
  <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
    <h1 class="mb-4 text-2xl font-bold">Login</h1>
  </div>
</template>
