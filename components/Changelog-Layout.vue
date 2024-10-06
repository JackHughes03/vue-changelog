<script setup>
import { ref } from "vue";

const runtimeConfig = useRuntimeConfig();
const GITHUB_TOKEN = runtimeConfig.public.TOKEN;
const releases = ref([]);
const expanded = ref([]);
const activeTab = ref("Non-stable");
const toggleMenu = ref(false);

const releaseFetchers = {
  "Non-stable": () => fetchReleases("Non-stable"),
  Stable: () => fetchReleases("Stable"),
  "Pre-releases": () => fetchReleases("Pre-releases")
};

function handleClick(selectedTab) {
  activeTab.value = selectedTab;
  releaseFetchers[selectedTab]();
}
async function fetchReleases(releaseType) {
  releases.value = [];

  const apiUrl =
    releaseType === "Stable"
      ? "https://raw.githubusercontent.com/vuejs/core/main/CHANGELOG.md"
      : "https://api.github.com/repos/vuejs/core/releases";

  const response = await fetch(apiUrl, {
    headers:
      releaseType !== "Stable"
        ? {
          Authorization: `token ${GITHUB_TOKEN}`
        }
        : {}
  });

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return;
  }

  const releasesData =
    releaseType === "Stable"
      ? parseReleases(await response.text())
      : (await response.json()).filter(
        (release) => releaseType !== "Pre-releases" || release.prerelease
      );

  releases.value = releasesData.map((releaseData) => ({
    title: releaseData.version || releaseData.name,
    description: releaseData.releaseContent || releaseData.body,
    date: releaseData.date || releaseData.published_at || "N/A"
  }));

  if (releaseType === "Stable") {
    const last10Chars = releases.value[0].description.slice(-12);

    releases.value[0].published_at = last10Chars;
  }
}

function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const formattingOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };
  return date.toLocaleDateString(undefined, formattingOptions);
}

function toggleExpanded(index) {
  const expandIcon = document.querySelectorAll(".expandicon")[index];
  const description = document.querySelectorAll(".description")[index];

  expandIcon.classList.toggle("rotate-180");
  expanded.value[index] = !expanded.value[index];

  description.classList.toggle("hidden");
}

function parseReleases(data) {
  const releaseRegex = /^##\s+(\[?v?\d+\.\d+\.\d+\]?)(.*?)\n(?=##|\n*$)/gms;
  const releases = [];
  let match;

  while ((match = releaseRegex.exec(data)) !== null) {
    const version = match[1].trim();
    const releaseContent = match[2].trim();
    releases.push({ version, releaseContent });
  }

  for (let i = 0; i < releases.length; i++) {
    releases[i].version = releases[i].version.replace(/\[|\]/g, "");
    releases[i].version = "v" + releases[i].version;
  }

  console.log("Parsed releases: ", releases);
  return releases;
}

function toggleColourMode() {
  const icon = document.getElementById("triangle-icon");

  icon.classList.toggle("rotate-180");
}

fetchReleases("Non-stable");
</script>

<template>
  <section class="h-full">
    <header>
      <nav
        class="flex w-full items-center justify-between border-b-[1px] border-white/20 bg-black/95 px-7 py-4 text-white">
        <a class="flex items-center gap-2" href="#">
          <img class="w-6" src="@/static/nav-icons/vue.png" alt="" />
          Vue
          <span class="text-green-400">Changelog</span>
        </a>

        <div class="flex gap-7">
          <a href="https://github.com/JackHughes03/vue-changelog" target="_blank" rel="noopener noreferrer"
            class="w-10 text-blue-400">
            <img src="@/static/nav-icons/github.svg" title="Github repository link" alt="GitHub repository link"
              class="size-5 invert" />
          </a>

          <button @click="
            toggleColourMode();
          toggleMenu = !toggleMenu;
          " class="flex cursor-pointer items-center justify-center">
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
          class="top-13 absolute right-0 h-36 rounded-b border-[1px] border-t-0 border-white/10 bg-white/5 text-white">
          <h3 class="border-b-[1px] border-white/20 px-8 py-1 text-sm">
            Theme
          </h3>

          <div class="flex flex-col p-3 text-center">
            <button v-for="index in ['Dark', 'Light', 'System']" :key="index"
              class="rounded px-2 py-1 text-sm opacity-50 duration-200 hover:bg-white/10 hover:opacity-100">
              {{ index }}
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <main class="h-full p-10 text-white">
      <section class="mx-auto flex max-w-4xl flex-col">
        <h1 class="text-3xl">
          <span class="text-green-400">Vue</span>
          releases
        </h1>

        <section
          class="mt-10 inline-flex w-80 items-center justify-center gap-2 rounded bg-white/10 py-1 text-center text-sm text-white/60">

          <button v-for="index in ['Non-stable', 'Stable', 'Pre-releases']" :key="index"
            :class="{ 'active-tab': activeTab === index }" class="rounded px-4 py-1.5 duration-200"
            @click="handleClick(index)">
            {{ index }}
          </button>
        </section>

        <section class="mt-10 w-full">
          <div v-if="releases.length === 0" class="text-center text-white">
            <p class="loading-message">Loading...</p>
          </div>
          <div v-for="(release, index) in releases" :key="release.title" class="border-b-[1px] border-white/20">

            <div class="flex w-full cursor-pointer items-center gap-3 px-1 py-4 duration-200"
              @click="toggleExpanded(index);">
              <h3 class="cursor-text">{{ release.title }}</h3>
              <span class="text-xs opacity-50">•</span>
              <p class="cursor-text text-sm opacity-50">
                {{ formatReleaseDate(release.date) }}
              </p>

              <svg @click="toggleExpanded(index);" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"
                class="expandicon ml-auto h-4 w-4 cursor-pointer transition-transform duration-200">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>

            <p class="description hidden cursor-text px-10 pb-4 text-sm opacity-70">
              {{ release.description }}
            </p>
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

.active-tab {
  background-color: rgb(0, 0, 0, 0.65);
  color: white;
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
</style>
