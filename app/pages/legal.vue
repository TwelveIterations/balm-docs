<script setup lang="ts">
const { data: page } = useAsyncData("docs:/legal", () =>
  queryCollection("docs").path("/legal").first(),
);
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageHeader :title="page?.title" :description="page?.description" />

      <UPageBody>
        <ContentRenderer :value="page" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
