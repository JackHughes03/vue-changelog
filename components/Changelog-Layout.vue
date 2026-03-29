<script setup>
import { ref } from "vue";
import { marked } from 'marked';

const releases = ref([]);
const toggleMenu = ref(false);

async function fetchReleases() {
  releases.value = [];

  const response = await fetch(
    "https://raw.githubusercontent.com/vuejs/core/refs/heads/main/CHANGELOG.md"
  );

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return;
  }

  const releasesData = parseReleases(await response.text());

  releases.value = releasesData.map((releaseData) => ({
    title: releaseData.version,
    description: releaseData.releaseContent,
    date: releaseData.date,
    expanded: false
  }));
}

function parseReleases(markdown) {
  const releases = [];
  const sections = markdown.split(/^## /m).slice(1);

  for (const section of sections) {
    const lines = section.split('\n');
    const heading = lines[0];

    const versionMatch = heading.match(/\[?([\d.]+(?:-\w+(?:\.\d+)?)?)\]?/);
    const dateMatch = heading.match(/\((\d{4}-\d{2}-\d{2})\)/);

    releases.push({
      version: versionMatch ? versionMatch[1] : 'Unknown',
      date: dateMatch ? dateMatch[1] : 'N/A',
      releaseContent: marked(lines.slice(1).join('\n').trim())
    });
  }

  return releases;
}

function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
}

function toggleExpanded(index) {
  releases.value[index].expanded = !releases.value[index].expanded;
}

function toggleColourMode() {
  const icon = document.getElementById("triangle-icon");
  icon.classList.toggle("rotate-180");
}

fetchReleases();
</script>

<template>
  <section class="h-full">
    <header>
      <nav class="flex w-full items-center justify-between border-b border-white/20 bg-black/95 px-7 py-4 text-white">
        <a class="flex items-center gap-1" href="#">
          <img class="w-6" src="@/static/nav-icons/vue.png" alt="" />
          Vue
          <span class="text-green-400">Changelog</span>
        </a>

        <!-- <div class="w-full ml-20">
          <a href="">Changelog</a>
        </div> -->

        <div class="flex gap-7">
          <a href="https://github.com/JackHughes03/vue-changelog" target="_blank" rel="noopener noreferrer"
            class="w-10 text-blue-400">
            <img src="@/static/nav-icons/github.svg" title="Github repository link" alt="GitHub repository link"
              class="size-5 invert" />
          </a>

          <button @click="toggleColourMode(); toggleMenu = !toggleMenu;"
            class="flex cursor-pointer items-center justify-center">
            <svg width="24" height="24" stroke="currentColor" stroke-width="2"
              class="absolute mr-10 size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="triangle-icon"
              class="h-4 w-4 cursor-pointer opacity-60 transition-transform duration-200">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </div>
      </nav>

      <Transition>
        <div v-if="toggleMenu"
          class="top-[56px] absolute right-0 h-36 rounded-bl-xl border border-t-0 border-r-0 border-white/20 bg-black text-white">
          <h3 class="border-b border-white/20 px-8 py-1 text-sm">Theme</h3>
          <div class="flex flex-col p-3 gap-2 text-center">
            <button v-for="theme in ['Dark', 'Light', 'System']" :key="theme"
              class="rounded px-2 py-0.5 text-sm opacity-50 duration-200 hover:bg-white/10 hover:opacity-100">
              {{ theme }}
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <main class="h-full p-10 text-white">
      <section class="mx-auto flex max-w-4xl flex-col">
        <h1 class="text-3xl">
          <span class="text-green-400">Vue</span> releases
        </h1>

        <section class="relative mt-6 flex w-fit items-center rounded-lg bg-white/10 p-1 md:mt-10">
          <button class="relative z-10 px-4 py-1.5 text-sm font-medium text-white whitespace-nowrap">
            Stable
          </button>
        </section>

        <section class="mt-6 md:mt-10 w-full">
          <div v-if="releases.length === 0" class="text-center text-white">
            <p>Loading...</p>
          </div>

          <div v-for="(release, index) in releases" :key="release.title"
            class="border-b border-white/20 transition-all duration-500 ease-in-out overflow-hidden"
            :class="release.expanded ? 'max-h-[2000px]' : 'max-h-14'">

            <div class="flex w-full cursor-pointer items-center gap-3 px-1 py-4" @click="toggleExpanded(index)">
              <h3>{{ release.title }}</h3>
              <span class="text-xs opacity-50">•</span>
              <p class="text-sm opacity-50">{{ formatReleaseDate(release.date) }}</p>

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="ml-auto h-4 w-4 transition-transform duration-300" :class="release.expanded ? 'rotate-180' : ''">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>

            <div class="grid transition-[grid-template-rows] duration-500 ease-in-out"
              :class="release.expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
              <div class="overflow-hidden">
                <div class="px-10 pb-4 text-sm opacity-70 changelog-content" v-html="release.description" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  </section>
</template>

<style>
:root {
  background-color: rgb(0, 0, 0, 0.95);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  height: 0;
  opacity: 0;
}

.changelog-content ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.changelog-content a {
  color: #4ade80;
  text-decoration: underline;
}
</style>