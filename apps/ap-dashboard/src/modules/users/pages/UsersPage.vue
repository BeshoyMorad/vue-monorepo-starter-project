<script setup lang="ts">
  import { h, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { ColumnDef } from '@tanstack/vue-table';
  import { Button, Field, FormDialog } from '@workspace/ui';
  import { error as toastError, success } from '@workspace/core/utils/toast';
  import ApiDataTable from '@/modules/users/components/ApiDataTable.vue';
  import UserDialogs from '@/modules/users/components/UserDialogs.vue';
  import { usersServices } from '@/modules/users/services';
  import { paths } from '@/router/paths';
  import type { ApiDataTableHandle, CreateUserPayload, User } from '@/modules/users/types';

  const router = useRouter();
  const tableRef = ref<ApiDataTableHandle<User> | null>(null);
  const selectedUser = ref<User | null>(null);
  const editOpen = ref(false);
  const deleteOpen = ref(false);
  const createOpen = ref(false);
  const isCreating = ref(false);
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const username = ref('');
  const phone = ref('');

  const openEdit = (user: User) => {
    selectedUser.value = user;
    editOpen.value = true;
  };

  const openDelete = (user: User) => {
    selectedUser.value = user;
    deleteOpen.value = true;
  };

  const resetCreateForm = () => {
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    username.value = '';
    phone.value = '';
  };

  const createUser = async () => {
    const payload: CreateUserPayload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      phone: phone.value.trim(),
    };

    isCreating.value = true;
    try {
      const user = await usersServices.createUser(payload);
      tableRef.value?.addRow(user);
      createOpen.value = false;
      resetCreateForm();
      success('User created successfully.');
    } catch (requestError) {
      toastError(requestError instanceof Error ? requestError.message : 'Unable to create user.');
    } finally {
      isCreating.value = false;
    }
  };

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      cell: ({ row }) => h('span', { class: 'text-text-secondary' }, `#${row.original.id}`),
    },
    {
      accessorKey: 'firstName',
      header: 'Name',
      enableSorting: true,
      cell: ({ row }) =>
        h('span', { class: 'font-medium' }, `${row.original.firstName} ${row.original.lastName}`),
    },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    { accessorKey: 'username', header: 'Username', enableSorting: true },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) =>
        h('div', { class: 'flex items-center justify-end gap-1' }, [
          h(Button, {
            testId: `view-user-${row.original.id}`,
            variant: 'ghost',
            size: 'icon',
            icon: 'hugeicons--eye',
            'aria-label': `View ${row.original.firstName}`,
            onClick: () =>
              void router.push({
                name: paths.dashboard.userDetails,
                params: { id: row.original.id },
              }),
          }),
          h(Button, {
            testId: `edit-user-${row.original.id}`,
            variant: 'ghost',
            size: 'icon',
            icon: 'hugeicons--edit-02',
            'aria-label': `Edit ${row.original.firstName}`,
            onClick: () => openEdit(row.original),
          }),
          h(Button, {
            testId: `delete-user-${row.original.id}`,
            variant: 'ghost',
            size: 'icon',
            icon: 'hugeicons--delete-02',
            class: 'text-error-600',
            'aria-label': `Delete ${row.original.firstName}`,
            onClick: () => openDelete(row.original),
          }),
        ]),
    },
  ];

  const updateUser = (user: User) => {
    tableRef.value?.upsertRow(user);
    selectedUser.value = user;
  };

  const removeUser = (userId: number) => {
    tableRef.value?.removeRow(userId);
    selectedUser.value = null;
  };
</script>

<template>
  <section class="mx-auto w-full max-w-7xl space-y-6">
    <header class="space-y-1">
      <h1 class="text-text-primary text-3xl font-bold tracking-tight">Users</h1>
      <p class="text-text-secondary text-sm">Browse and manage user accounts.</p>
    </header>

    <div class="bg-surface-primary border-border-base/50 rounded-xl border p-4">
      <!-- @vue-generic {User} -->
      <ApiDataTable
        ref="tableRef"
        :columns="columns"
        :fetch-data="usersServices.getUsers"
        :add-action="{
          text: 'Add user',
          icon: 'hugeicons--user-add-01',
          testId: 'add-user',
          onClick: () => {
            createOpen = true;
            return undefined;
          },
        }"
        search-placeholder="Search users..."
        test-id="users-table"
      />
    </div>

    <FormDialog
      v-model:open="createOpen"
      title="Add user"
      description="Enter the new user's account information."
      submit-label="Create user"
      :loading="isCreating"
      :is-dirty="Boolean(firstName.trim() && lastName.trim() && email.trim() && username.trim())"
      test-id="create-user-dialog"
      @submit="createUser"
      @cancel="resetCreateForm"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <Field.Text v-model="firstName" label="First name" test-id="new-user-first-name" required />
        <Field.Text v-model="lastName" label="Last name" test-id="new-user-last-name" required />
        <Field.Text
          v-model="email"
          type="email"
          label="Email"
          test-id="new-user-email"
          required
          class="sm:col-span-2"
        />
        <Field.Text v-model="username" label="Username" test-id="new-user-username" required />
        <Field.Text v-model="phone" label="Phone" test-id="new-user-phone" />
      </div>
    </FormDialog>

    <UserDialogs
      v-if="selectedUser"
      v-model:edit-open="editOpen"
      v-model:delete-open="deleteOpen"
      :user="selectedUser"
      @saved="updateUser"
      @deleted="removeUser"
    />
  </section>
</template>
