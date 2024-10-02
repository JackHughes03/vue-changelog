<template>
  <section class="h-full">
    <header>
      <nav
        class="flex w-full items-center justify-between border-b-[1px] border-white/20 bg-black/95 px-7 py-4 text-white"
      >
        <a class="flex items-center gap-2" href="#">
          Vue.js
          <span class="text-green-400">Changelog</span>
        </a>

        <a
          href="https://github.com/JackHughes03/vue-changelog/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          class="w-10 text-blue-400"
        >
          <img
            src="@/public/nav-icons/github.svg"
            alt="GitHub"
            class="size-5 invert"
          />
        </a>
      </nav>
    </header>

    <main class="h-full w-full bg-black/95 p-10 text-white">
      <section class="mx-auto flex w-full max-w-4xl flex-col">
        <h1 class="text-3xl">
          <span class="text-green-400">Vue</span>
          releases
        </h1>

        <section class="mt-10 w-full">
          <div v-if="releases.length === 0" class="text-center text-white">
            Failed to fetch Vue.js releases. Did you set your access token in
            the .env file?
          </div>
          <div
            v-for="(release, index) in releases"
            :key="release.title"
            class="flex items-center gap-5 border-b-[1px] border-white/20 px-1 py-4"
          >
            <h3>{{ release.title }}</h3>
            <p class="text-sm opacity-50">
              {{ formatReleaseDate(release.date) }}
            </p>
            <p class="hidden text-sm opacity-70">{{ release.description }}</p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="expandicon ml-auto h-4 w-4 cursor-pointer transition-transform duration-200"
              @click="toggleExpanded(index)"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </section>
      </section>
    </main>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const GITHUB_TOKEN = process.env.TOKEN
const releases = ref([])
const expanded = ref([])

async function fetchReleases() {
  const apiUrl = 'https://api.github.com/repos/vuejs/core/releases'

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const releasesData = await response.json()
    releases.value = releasesData.map((releaseData) => ({
      title: releaseData.name,
      description: releaseData.body,
      date: releaseData.published_at,
    }))
  } catch (error) {
    console.error('Failed to fetch Vue.js releases:', error)
  }
}

function formatReleaseDate(dateString) {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

function toggleExpanded(index) {
  const expandIcon = document.querySelectorAll('.expandicon')[index]

  expandIcon.classList.toggle('rotate-180')
  expanded.value[index] = !expanded.value[index]
}

fetchReleases()
</script>
