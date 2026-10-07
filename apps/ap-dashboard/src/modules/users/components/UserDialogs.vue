<script setup lang="ts">
  import { watch, ref } from 'vue';
  import { ConfirmDialog, Field, FormDialog } from '@workspace/ui';
  import { error as toastError, success } from '@workspace/core/utils/toast';
  import { usersServices } from '@/modules/users/services';
  import type { UpdateUserPayload, User } from '@/modules/users/types';

  const props = defineProps<{ user: User | null }>();
  const emit = defineEmits<{
    saved: [user: User];
    deleted: [userId: number];
  }>();

  const editOpen = defineModel<boolean>('editOpen', { default: false });
  const deleteOpen = defineModel<boolean>('deleteOpen', { default: false });
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const username = ref('');
  const phone = ref('');
  const isSaving = ref(false);
  const isDeleting = ref(false);

  const populateForm = () => {
    if (!props.user) return;
    firstName.value = props.user.firstName;
    lastName.value = props.user.lastName;
    email.value = props.user.email;
    username.value = props.user.username;
    phone.value = props.user.phone ?? '';
  };

  watch(() => props.user, populateForm, { immediate: true });
  watch(editOpen, (isOpen) => {
    if (isOpen) populateForm();
  });

  const saveUser = async () => {
    if (!props.user) return;

    const payload: UpdateUserPayload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      username: username.value.trim(),
      phone: phone.value.trim(),
    };

    isSaving.value = true;
    try {
      const updatedUser = await usersServices.updateUser(props.user.id, payload);
      emit('saved', { ...props.user, ...updatedUser });
      editOpen.value = false;
      success('User updated successfully.');
    } catch (requestError) {
      toastError(
        requestError instanceof Error ? requestError.message : 'Unable to update this user.'
      );
    } finally {
      isSaving.value = false;
    }
  };

  const deleteUser = async () => {
    if (!props.user) return;

    isDeleting.value = true;
    try {
      await usersServices.deleteUser(props.user.id);
      emit('deleted', props.user.id);
      deleteOpen.value = false;
      success('User deleted successfully.');
    } catch (requestError) {
      toastError(
        requestError instanceof Error ? requestError.message : 'Unable to delete this user.'
      );
    } finally {
      isDeleting.value = false;
    }
  };
</script>

<template>
  <FormDialog
    v-model:open="editOpen"
    title="Edit user"
    description="Update the user's account information."
    submit-label="Save changes"
    :loading="isSaving"
    is-dirty
    test-id="edit-user-dialog"
    @submit="saveUser"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <Field.Text v-model="firstName" label="First name" test-id="user-first-name" required />
      <Field.Text v-model="lastName" label="Last name" test-id="user-last-name" required />
      <Field.Text
        v-model="email"
        type="email"
        label="Email"
        test-id="user-email"
        required
        class="sm:col-span-2"
      />
      <Field.Text v-model="username" label="Username" test-id="user-username" required />
      <Field.Text v-model="phone" label="Phone" test-id="user-phone" />
    </div>
  </FormDialog>

  <ConfirmDialog
    v-model:open="deleteOpen"
    title="Delete user?"
    :description="`This will delete ${user?.firstName ?? 'this user'} from the users list.`"
    icon="hugeicons--delete-02"
    confirm-label="Delete user"
    confirm-variant="danger"
    :loading="isDeleting"
    :auto-close="false"
    test-id="delete-user-dialog"
    @confirm="deleteUser"
  />
</template>
