<script setup lang="ts">
definePageMeta({ 
  title: 'Admin - Identity Management',
  middleware: ['auth'] 
})

const { data: users } = await useAsyncData('idm-users', () => $fetch('/api/flowable/idm/users'))
const { data: groups } = await useAsyncData('idm-groups', () => $fetch('/api/flowable/idm/groups'))

const userColumns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' }
]
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Users List -->
      <UCard class="xl:col-span-2 ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Users</h3>
            <UButton icon="i-heroicons-user-plus" size="xs">Add User</UButton>
          </div>
        </template>
        <UTable :rows="users?.data || []" :columns="userColumns" />
      </UCard>

      <!-- Groups List -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Groups</h3>
            <UButton icon="i-heroicons-plus" size="xs">Create Group</UButton>
          </div>
        </template>
        <UTable :rows="groups?.data || []" :columns="[{key: 'name', label: 'Name'}, {key: 'type', label: 'Type'}]" />
      </UCard>
    </div>
  </div>
</template>
