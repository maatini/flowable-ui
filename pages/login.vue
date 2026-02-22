<script setup lang="ts">
const { t } = useI18n()
const auth = useAuthStore()

const state = reactive({
  username: '',
  password: '',
  rememberMe: false
})

async function onSubmit() {
  const success = await auth.login(state)
  if (success) {
    navigateTo('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <UCard class="max-w-md w-full space-y-8 ring-1 ring-gray-200 dark:ring-gray-800 shadow-xl">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Flowable Nuxt
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <UForm :state="state" class="mt-8 space-y-6" @submit="onSubmit">
        <UFormGroup :label="t('common.username')" name="username">
          <UInput v-model="state.username" icon="i-heroicons-user" placeholder="admin" autofocus />
        </UFormGroup>

        <UFormGroup :label="t('common.password')" name="password">
          <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" />
        </UFormGroup>

        <div class="flex items-center justify-between">
          <UCheckbox v-model="state.rememberMe" :label="t('common.rememberMe')" />
        </div>

        <UButton
          type="submit"
          block
          :loading="auth.loading"
          size="lg"
          class="font-semibold"
        >
          {{ t('common.login') }}
        </UButton>

        <UAlert
          v-if="auth.error"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="auth.error"
        />
      </UForm>
    </UCard>
  </div>
</template>
