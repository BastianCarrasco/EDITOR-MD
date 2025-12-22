<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

const output = computed(() => marked.parse(sharedData.value))
</script>

<template>
    <div class="nav">
        <router-link to="/full">Ver Pantalla Completa</router-link>
    </div>
    <div class="editor-layout">
        <textarea v-model="sharedData" class="input-area"></textarea>
        <div class="markdown-body preview-area" v-html="output"></div>
    </div>
</template>

<style scoped>
.nav {
    padding: 10px;
    background: #eee;
    text-align: left;
}

.editor-layout {
    display: flex;
    height: 90vh;
    gap: 10px;
    padding: 10px;
}

.input-area {
    flex: 1;
    padding: 20px;
    font-family: monospace;
    border: 1px solid #ddd;
    resize: none;
}

.preview-area {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    overflow-y: auto;
    text-align: left;
}
</style>