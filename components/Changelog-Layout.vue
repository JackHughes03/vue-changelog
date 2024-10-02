<template>
    <section class="h-full"> <!-- Div or section tags required by Nuxt to wrap the entire component -->
        <header>
            <nav class="w-full py-4 px-7 text-white bg-black/95 flex justify-between items-center border-b-[1px] border-white/20">
                <a class="flex items-center gap-2" href="#">
                    <NuxtLogo />
                    Vue.js 
                    <span class="text-blue-400">Changelog</span>
                </a>
                
                <a href="https://github.com/JackHughes03/vue-changelog/tree/main" target="_blank" rel="noopener noreferrer" class="text-blue-400 w-10">
                    <img src="@/static/nav-icons/github.png" alt="">
                </a>
            </nav>
        </header>
        
        <main class="bg-black/95 p-10 h-full text-white w-full">
            <section class="flex flex-col mx-auto max-w-4xl w-full">
                <h1 class="text-3xl">
                    <span class="text-blue-400">Vue</span>
                    releases 
                </h1>
                
                <section class="mt-10 w-full">
                    <div v-if="releases.length === 0" class="text-center text-white">
                        Failed to fetch Vue.js releases. Did you set your access token in the .env file?
                    </div>
                    <div v-for="(release, index) in releases" :key="release.title" class="py-4 px-1 flex items-center gap-5 border-b-[1px] border-white/20">
                        
                        <h3>{{ release.title }}</h3>
                        <p class="text-sm opacity-50">{{ formatReleaseDate(release.date) }}</p>
                        <p class="text-sm opacity-70 hidden">{{ release.description }}</p>
                        
                        <svg
                        @click="toggleExpanded(index)" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="expandicon h-4 w-4 transition-transform duration-200 ml-auto cursor-pointer"
                        >
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </div>
            </section>
        </section>
    </main>
</section>
</template>

<script setup>
import { ref } from 'vue';

const GITHUB_TOKEN = process.env.TOKEN;
const releases = ref([]);
const expanded = ref([]);

const fetchReleases = async () => {
    const apiUrl = "https://api.github.com/repos/vuejs/core/releases";
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const releasesData = await response.json();
        releases.value = releasesData.map((releaseData) => ({
            title: releaseData.name,
            description: releaseData.body,
            date: releaseData.published_at,
        }));
    } catch (error) {
        console.error("Failed to fetch Vue.js releases:", error);
    }
};
const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};


const toggleExpanded = (index) => {
    const expandIcon = document.querySelectorAll('.expandicon')[index];
    
    expandIcon.classList.toggle('rotate-180');
    expanded.value[index] = !expanded.value[index];
};

fetchReleases();

</script>