<script setup lang="ts">
definePageMeta({ 
  title: 'Admin - Identity Management'
})

const { data: users } = await useAsyncData('idm-users', () => $fetch('/api/flowable/idm/users'))
const { data: groups } = await useAsyncData('idm-groups', () => $fetch('/api/flowable/idm/groups'))

const userColumns = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'firstName', accessorKey: 'firstName', header: 'First Name' },
  { id: 'lastName', accessorKey: 'lastName', header: 'Last Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' }
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
        <UTable :data="(users as any)?.data || []" :columns="userColumns as any" />
      </UCard>

      <!-- Groups List -->
      <UCard class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Groups</h3>
            <UButton icon="i-heroicons-plus" size="xs">Create Group</UButton>
          </div>
        </template>
        <UTable :data="(groups as any)?.data || []" :columns="[{id: 'name', accessorKey: 'name', header: 'Name'}, {id: 'type', accessorKey: 'type', header: 'Type'}] as any" />
      </UCard>
    </div>
  </div>
</template>
