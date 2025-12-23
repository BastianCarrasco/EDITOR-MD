<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

// Configuración de marcado
marked.setOptions({
    breaks: true,
    gfm: true
})

const output = computed(() => marked.parse(sharedData.value || ''))

// Función para descargar el contenido como archivo .md
const downloadMarkdown = () => {
    const content = sharedData.value || '';
    if (!content) return;

    // Crear el blob con el contenido de texto
    const blob = new Blob([content], { type: 'text/markdown' });

    // Crear un enlace temporal
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Configurar nombre del archivo (puedes dinamizarlo si quieres)
    link.href = url;
    link.download = `documento-${Date.now()}.md`;

    // Simular clic y limpiar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
</script>

<template>
    <div class="page-wrapper">
        <div class="nav">
            <router-link to="/" class="back-link">← Volver al Editor</router-link>
            <button @click="downloadMarkdown" class="download-btn">
                Descargar .md
            </button>
        </div>

        <div class="full-container">
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.back-link {
    color: #0969da;
    text-decoration: none;
    font-weight: 500;
}

.download-btn {
    background-color: #2da44e;
    color: white;
    border: 1px solid rgba(27, 31, 36, 0.15);
    padding: 5px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.download-btn:hover {
    background-color: #2c974b;
}

.full-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
}

.markdown-body {
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #ffffff !important;
    color: #1f2328 !important;
    text-align: left;
}

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
    /* background-color: #afb8c133; */
    border-radius: 6px;
    padding: 0.2em 0.4em;
}
</style>