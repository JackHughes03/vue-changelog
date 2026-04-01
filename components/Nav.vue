<script setup>
import { ref } from "vue";
import Fuse from 'fuse.js';

const toggleMenu = ref(false);
const activeIndex = ref(0)
const tabs = ['Releases', 'Issues', 'Discussions']
const buttonRefs = ref([])
const navContainer = ref(null)

function toggleColourMode() {
  const icon = document.getElementById("triangle-icon");
  icon.classList.toggle("rotate-180");
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

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`You searched for: "${searchQuery.value}"`);

    searchQuery.value = '';
  }
};
</script>

<template>
  <section class="h-full">
    <header>
      <nav
        class="flex w-full items-center justify-between border-b fixed z-100 backdrop-blur-sm border-white/20 px-7 py-4 text-white">

        <a class="flex items-center gap-1" href="#">
          <img class="w-6" src="@/static/nav-icons/vue.png" alt="" />
          Vue
          <span class="text-green-400">Changelog</span>
          <hr class="border-[1px] rounded-full h-4 text-white/50 ml-4">
        </a>

        <div class="w-full ml-10 text-sm flex gap-4">
          <a href="/" class="text-white/50 hover:text-white transition-colors duration-200">
            Home
          </a>
          <a href="/devlog" class="text-white/50 hover:text-white transition-colors duration-200">
            Commits
          </a>
        </div>

        <div class="items-center mr-4 right-0 flex">
          <div class="items-center hidden sm:flex">
            <svg class="w-4 h-4 absolute ml-2 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input
              class="bg-white/10 text-sm p-1 rounded-sm text-white pl-8 pr-2 outline-none focus:ring-1 focus:ring-white/20"
              type="text" placeholder="Search" v-model="searchQuery" @keyup.enter="handleSearch">
          </div>

          <div class="flex items-center justify-center cursor-pointer">
            <img class="invert w-9" src="@/public/nav-icons/search.png" alt="">
            <input class="bg-white/10 w-0 text-sm rounded-sm text-white outline-none focus:ring-1 focus:ring-white/20"
              type="text" placeholder="Search" v-model="searchQuery" @keyup.enter="handleSearch">
          </div>
        </div>

        <div class="flex gap-4">
          <a class="w-10 text-blue-400 cursor-pointer" href="https://github.com/JackHughes03/vue-changelog"
            target="_blank">
            <img src="@/static/nav-icons/github.svg" title="Github sign in icon" alt="GitHub sign in icon"
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
          class="top-[60px] backdrop-blur-xs z-101 right-0 h-36 rounded-bl-xl border border-t-0 border-r-0 fixed border-white/20 text-white">
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
  </section>
</template>

<style>
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