<script setup>
import { ref } from "vue";
import { marked } from 'marked';

const releases = ref([]);
const tabs = ['Releases', 'Issues', 'Discussions']
const activeIndex = ref(0)
const buttonRefs = ref([])
const navContainer = ref(null)

async function fetchReleases() {
  releases.value = [];

  // Below code only works for stable but there are plans to fetch issues and discussions in the future, so I've left it in for now.
  const stable = "https://raw.githubusercontent.com/vuejs/core/refs/heads/main/CHANGELOG.md";
  const issues = "https://api.github.com/repos/vuejs/core/issues?state=closed&per_page=5";
  const discussions = "https://api.github.com/repos/vuejs/core/discussions?per_page=5";
  const option = activeIndex.value === 0 ? stable : activeIndex.value === 1 ? issues : discussions;

  const response = await fetch(
    option,
    {
      headers: {
        Accept: activeIndex.value === 0 ? "text/plain" : "application/vnd.github.v3+json"
      }
    }
  );

  if (!response.ok) return;

  const releasesData = parseReleases(await response.text());

  releases.value = releasesData.map((releaseData) => ({
    title: releaseData.version,
    date: releaseData.date,
    categories: releaseData.categories,
    expanded: false
  })).slice(0, -3); // Slicing off the last 3 as they were messy and not formatted
}

function parseReleases(markdown) {
  const releases = [];
  const sections = markdown.split(/^## /m).slice(1);

  for (const section of sections) {
    const lines = section.split('\n');
    const heading = lines[0];
    const body = lines.slice(1).join('\n');

    const versionMatch = heading.match(/\[?([\d.]+(?:-\w+(?:\.\d+)?)?)\]?/);
    const dateMatch = heading.match(/\((\d{4}-\d{2}-\d{2})\)/);
    const subSections = body.split(/^### /m).slice(1);

    const categories = subSections.map(sub => {
      const subLines = sub.split('\n');
      const type = subLines[0].trim();
      const content = subLines.slice(1).join('\n').trim();

      return {
        type: type,
        content: marked(content)
      };
    });

    releases.push({
      version: versionMatch ? versionMatch[1] : 'Unknown',
      date: dateMatch ? dateMatch[1] : 'N/A',
      categories: categories
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

const sliderStyle = computed(() => {
  const activeBtn = buttonRefs.value[activeIndex.value]
  if (!activeBtn || !navContainer.value) return { left: 0, width: 0 }

  const left = activeBtn.offsetLeft
  const width = activeBtn.offsetWidth

  return {
    left: `${left}px`,
    width: `${width}px`
  }
})

onMounted(() => {
  buttonRefs.value = buttonRefs.value.slice(0, tabs.length)
})
fetchReleases();
</script>

<template>
  <section class="h-full">

    <main class="h-full p-10 text-white">
      <section class="mx-auto flex max-w-4xl flex-col">
        <header>
          <h1 class="text-3xl">
            <span class="text-green-400">Vue</span> releases
          </h1>
        </header>

        <nav ref="navContainer" class="relative mt-6 flex w-fit items-center rounded-lg bg-white/10 p-1 md:mt-10"
          aria-label="Release filters">
          <div class="absolute h-[calc(100%-8px)] rounded-md bg-white/20 transition-all duration-300 ease-in-out"
            :style="sliderStyle"></div>

          <button v-for="(tab, index) in tabs" :key="tab" :ref="(el) => (buttonRefs[index] = el)"
            @click="activeIndex = index" :class="[
              'relative z-10 px-4 py-1 text-sm font-medium transition-colors duration-300 whitespace-nowrap',
              activeIndex === index ? 'text-white' : 'text-white/60 hover:text-white'
            ]">
            {{ tab }}
          </button>
        </nav>

        <section class="mt-6 md:mt-10 w-full" aria-label="Release list">
          <div v-if="releases.length === 0" class="text-center text-white" role="status">
            <p>Loading...</p>
          </div>

          <article v-for="(release, index) in releases" :key="release.title"
            class="border-b border-white/20 transition-all duration-500 ease-in-out overflow-hidden"
            :class="release.expanded ? 'max-h-[2000px]' : 'max-h-14'">

            <button
              class="flex w-full cursor-pointer items-center gap-3 px-1 py-4 text-left appearance-none bg-transparent border-none"
              @click="toggleExpanded(index)" :aria-expanded="release.expanded">
              <h2 class="text-base font-bold">{{ release.title }}</h2>
              <span class="text-xs opacity-50" aria-hidden="true">•</span>
              <time :datetime="release.date" class="text-sm opacity-50">{{ formatReleaseDate(release.date) }}</time>

              <div class="flex gap-2">
                <span v-for="cat in release.categories" :key="cat.type" class="border-[2px] rounded-full px-2 py-0.5"
                  :class="{
                    'bg-green-400/20 border-green-400 text-green-400': cat.type === 'Features',
                    'bg-purple-400/20 border-purple-400 text-purple-400': cat.type === 'Bug Fixes',
                    'bg-blue-400/20 border-blue-400 text-blue-400': cat.type === 'Reverts',
                    'bg-yellow-400/20 border-yellow-400 text-yellow-400': cat.type === 'Performance Improvements',
                  }">
                  <strong class="font-bold text-xs block">
                    {{ cat.type }}
                  </strong>
                </span>
              </div>

              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="ml-auto h-4 w-4 transition-transform duration-300" :class="release.expanded ? 'rotate-180' : ''"
                aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            <div class="grid transition-[grid-template-rows] duration-500 ease-in-out"
              :class="release.expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
              <div class="overflow-hidden">
                <div class="sm:px-10 -mt-4 text-sm">
                  <section v-for="cat in release.categories" :key="cat.type" class="my-6">
                    <h3 class="font-bold text-xs tracking-wider uppercase" :class="{
                      'text-green-400': cat.type === 'Features',
                      'text-purple-400': cat.type === 'Bug Fixes',
                      'text-blue-400': cat.type === 'Reverts',
                      'text-yellow-400': cat.type === 'Performance Improvements',
                    }">
                      {{ cat.type }}
                    </h3>
                    <div class="opacity-70 changelog-content" v-html="cat.content" />
                  </section>
                  <p v-if="release.categories.length === 0" class="opacity-50 italic">
                    No specific change categories listed.
                  </p>
                </div>
              </div>
            </div>
          </article>
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