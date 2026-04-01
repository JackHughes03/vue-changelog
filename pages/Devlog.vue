<script setup>
import { ref, onMounted } from 'vue';

const commits = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchCommits = async () => {
  try {
    const res = await fetch('https://api.github.com/repos/JackHughes03/vue-changelog/commits?sha=main');
    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();

    commits.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCommits);
</script>

<template>
  <Nav />

  <div class="p-10">
    <header>
      <h1 class="text-3xl text-white">
        <span class="text-green-400">Dev</span> log
      </h1>
    </header>

    <div v-if="loading" class="text-gray-500 italic">Fetching commits...</div>

    <div v-else-if="error" class="text-red-500 italic">Failed to load: {{ error }}</div>

    <ul v-else-if="commits.length > 0">
      <li v-for="c in commits" :key="c.sha">
        <hr class="border-white/20 w-full rounded-full my-4">
        <div class="font-bold text-white">
          {{ c.commit?.message.split('\n')[0] }}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          By {{ c.commit?.author?.name }} on {{ new Date(c.commit?.author?.date).toLocaleDateString() }}
        </div>

        <a class="text-green-400/80 cursor-pointer underline text-sm" :href="c.html_url" target="_blank" rel="noopener noreferrer">
          #{{ c.sha.slice(0, 7) }}
        </a>
      </li>
    </ul>

    <div v-else class="text-gray-400">No commits found in this branch.</div>

  </div>
</template>