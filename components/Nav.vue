<script setup>
import { ref } from "vue";
const toggleMenu = ref(false);

function toggleColourMode() {
  const icon = document.getElementById("triangle-icon");
  icon.classList.toggle("rotate-180");
}

function handleGithubLogin() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user`;
  window.location.href = githubAuthUrl;
}
</script>

<template>
  <section class="h-full">
    <header>
      <nav class="flex w-full items-center justify-between border-b border-white/20 bg-black/95 px-7 py-4 text-white">
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
            Devlog
          </a>
        </div>

        <div class="flex gap-7">
          <button class="w-10 text-blue-400 cursor-pointer" @click="handleGithubLogin()">
            <img src="@/static/nav-icons/github.svg" title="Github sign in icon" alt="GitHub sign in icon"
              class="size-5 invert" />
          </button>

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