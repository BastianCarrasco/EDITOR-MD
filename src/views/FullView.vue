<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

// Configuración de marcado para consistencia con el editor
marked.setOptions({
    breaks: true,
    gfm: true
})

const output = computed(() => marked.parse(sharedData.value || ''))
</script>

<template>
    <div class="page-wrapper">
        <div class="nav">
            <router-link to="/" class="back-link">← Volver al Editor</router-link>
        </div>

        <div class="full-container">
            <!-- Forzamos los estilos de GitHub con colores oscuros legibles -->
            <div class="markdown-body" v-html="output"></div>
        </div>
    </div>
</template>

<style scoped>
.page-wrapper {
    min-height: 100vh;
    background-color: #ffffff;
}

.nav {
    padding: 15px 30px;
    background: #f6f8fa;
    border-bottom: 1px solid #d0d7de;
    text-align: left;
}

.back-link {
    color: #0969da;
    text-decoration: none;
    font-weight: 500;
}

.back-link:hover {
    text-decoration: underline;
}

.full-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
}

/* Ajustes de la librería GitHub Markdown para evitar conflictos de modo oscuro */
.markdown-body {
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #ffffff !important;
    color: #1f2328 !important;
    /* Texto oscuro de GitHub */
    text-align: left;
}

/* Aplicar estilos a elementos inyectados vía v-html */
:deep(.markdown-body h1),
:deep(.markdown-body h2) {
    border-bottom: 1px solid #d8dee4;
    color: #1f2328;
}

:deep(.markdown-body p),
:deep(.markdown-body li) {
    line-height: 1.6;
}

:deep(.markdown-body code) {
    background-color: #afb8c133;
    border-radius: 6px;
    padding: 0.2em 0.4em;
}
</style>