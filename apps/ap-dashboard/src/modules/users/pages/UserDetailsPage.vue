<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Button } from '@workspace/ui';
  import { error as toastError } from '@workspace/core/utils/toast';
  import { paths } from '@/router/paths';
  import UserDialogs from '@/modules/users/components/UserDialogs.vue';
  import { usersServices } from '@/modules/users/services';
  import type { User } from '@/modules/users/types';

  const props = defineProps<{ id: string }>();
  const router = useRouter();
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const editOpen = ref(false);
  const deleteOpen = ref(false);

  const loadUser = async () => {
    const id = Number(props.id);
    if (!Number.isInteger(id) || id < 1) {
      toastError('The user ID is invalid.');
      return;
    }

    isLoading.value = true;
    try {
      user.value = await usersServices.getUser(id);
    } catch (requestError) {
      toastError(
        requestError instanceof Error ? requestError.message : 'Unable to load this user.'
      );
    } finally {
      isLoading.value = false;
    }
  };

  const goToUsers = () => {
    void router.push({ name: paths.dashboard.usersList });
  };

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser;
  };

  const removeUser = () => {
    goToUsers();
  };

  watch(() => props.id, loadUser);
  onMounted(loadUser);
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-6">
    <Button
      test-id="back-to-users"
      variant="ghost"
      icon="hugeicons--arrow-left-01"
      @click="goToUsers"
    >
      Back to users
    </Button>

    <div
      v-if="isLoading"
      class="bg-surface-primary border-border-base/50 rounded-xl border p-8 text-center"
      role="status"
    >
      Loading user...
    </div>

    <template v-else-if="user">
      <article class="bg-surface-primary border-border-base/50 overflow-hidden rounded-xl border">
        <div
          class="from-primary-600/15 flex items-center gap-5 bg-gradient-to-r to-transparent p-6"
        >
          <img
            v-if="user.image"
            :src="user.image"
            :alt="`${user.firstName} ${user.lastName}`"
            class="size-20 rounded-full object-cover"
          />
          <div
            v-else
            class="bg-primary-600/15 text-primary-700 flex size-20 items-center justify-center rounded-full text-xl font-semibold"
            aria-hidden="true"
          >
            {{ user.firstName[0] }}{{ user.lastName[0] }}
          </div>
          <div>
            <h1 class="text-text-primary text-2xl font-bold">
              {{ user.firstName }} {{ user.lastName }}
            </h1>
            <p class="text-text-secondary mt-1">{{ user.email }}</p>
          </div>
        </div>

        <dl class="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
          <div>
            <dt class="text-text-tertiary text-sm">User ID</dt>
            <dd class="text-text-primary mt-1 font-medium">#{{ user.id }}</dd>
          </div>
          <div>
            <dt class="text-text-tertiary text-sm">Username</dt>
            <dd class="text-text-primary mt-1 font-medium">{{ user.username }}</dd>
          </div>
          <div>
            <dt class="text-text-tertiary text-sm">Phone</dt>
            <dd class="text-text-primary mt-1 font-medium">{{ user.phone || 'Not provided' }}</dd>
          </div>
          <div>
            <dt class="text-text-tertiary text-sm">Age</dt>
            <dd class="text-text-primary mt-1 font-medium">{{ user.age ?? 'Not provided' }}</dd>
          </div>
          <div>
            <dt class="text-text-tertiary text-sm">Gender</dt>
            <dd class="text-text-primary mt-1 font-medium">{{ user.gender || 'Not provided' }}</dd>
          </div>
          <div>
            <dt class="text-text-tertiary text-sm">Date of birth</dt>
            <dd class="text-text-primary mt-1 font-medium">
              {{ user.birthDate || 'Not provided' }}
            </dd>
          </div>
        </dl>
      </article>

      <div class="border-border-base/50 flex flex-wrap justify-end gap-3 border-t pt-5">
        <Button
          test-id="edit-user"
          variant="outline"
          icon="hugeicons--edit-02"
          @click="editOpen = true"
        >
          Edit user
        </Button>
        <Button
          test-id="delete-user"
          variant="danger"
          icon="hugeicons--delete-02"
          @click="deleteOpen = true"
        >
          Delete user
        </Button>
      </div>

      <UserDialogs
        v-model:edit-open="editOpen"
        v-model:delete-open="deleteOpen"
        :user="user"
        @saved="updateUser"
        @deleted="removeUser"
      />
    </template>

    <div v-else class="bg-surface-primary border-border-base/50 rounded-xl border p-8 text-center">
      <p class="text-text-primary font-medium">User not found.</p>
      <Button test-id="return-to-users" class="mt-4" @click="goToUsers">Return to users</Button>
    </div>
  </section>
</template>
