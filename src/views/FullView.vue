<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

const output = computed(() => marked.parse(sharedData.value))
</script>

<template>
    <div class="nav">
        <router-link to="/">Volver al Editor</router-link>
    </div>
    <div class="full-container">
        <div class="markdown-body" v-html="output"></div>
    </div>
</template>

<style scoped>
.nav {
    padding: 10px;
    background: #eee;
    text-align: left;
}

.full-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    text-align: left;
}
</style>