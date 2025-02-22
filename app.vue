<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
</template>

<script setup>
onMounted(async () => {
    try {
        await store.dispatch('auth/getUser');
    } catch (error) {
        console.log(error);
    }
});
</script>