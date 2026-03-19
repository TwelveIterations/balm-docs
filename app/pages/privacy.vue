<script setup lang="ts">
const { data: page } = useAsyncData("docs:/privacy", () =>
  queryCollection("docs").path("/privacy").first(),
);

const { contact } = useAppConfig();
const vars = computed(() => ({
  appName: "Twelve Iterations",
  appAuthor: "Jean Baker Twelve Iterations",
  email: contact.email,
}));
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageHeader :title="page?.title" :description="page?.description" />

      <UPageBody>
        <ContentRenderer :value="page" :data="vars" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
