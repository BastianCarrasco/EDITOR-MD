<script setup>
import { computed, onMounted, ref } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

// URL de tu backend en Railway
const BASE_URL = "https://backend-md-production.up.railway.app"
const isSaving = ref(false)

// Configuración de marked para mejor renderizado
marked.setOptions({
    breaks: true, // Respeta los saltos de línea simples
    gfm: true     // GitHub Flavored Markdown
})

// 1. FUNCIÓN PARA CARGAR EL TEXTO AUTOMÁTICAMENTE
const loadMarkdown = async () => {
    try {
        const response = await fetch(BASE_URL)
        if (response.ok) {
            sharedData.value = await response.text()
        }
    } catch (error) {
        console.error("Error al conectar con Railway:", error)
    }
}

// 2. FUNCIÓN PARA GUARDAR LOS CAMBIOS
const saveMarkdown = async () => {
    if (!sharedData.value) return

    isSaving.value = true
    try {
        const response = await fetch(`${BASE_URL}/api/md`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: sharedData.value })
        })

        if (response.ok) {
            alert("¡Cambios guardados en el servidor!")
        } else {
            alert("Error al guardar en el servidor")
        }
    } catch (error) {
        console.error("Error de red:", error)
        alert("No se pudo conectar para guardar")
    } finally {
        isSaving.value = false
    }
}

onMounted(loadMarkdown)

// Renderizador del Markdown
const output = computed(() => {
    return marked.parse(sharedData.value || '')
})
</script>

<template>
    <div class="nav">
        <div class="links">
            <router-link to="/full" class="link">👁 Ver Pantalla Completa</router-link>
        </div>
        <div class="actions">
            <button @click="saveMarkdown" :disabled="isSaving" class="btn-save">
                {{ isSaving ? 'Guardando...' : '💾 Guardar Cambios' }}
            </button>
        </div>
    </div>

    <div class="editor-layout">
        <!-- Columna Izquierda: Editor -->
        <textarea v-model="sharedData" class="input-area" spellcheck="false"
            placeholder="Escribe aquí tu contenido..."></textarea>

        <!-- Columna Derecha: Previsualización Forzada a Tema Claro -->
        <div class="preview-container">
            <div class="markdown-body" v-html="output"></div>
        </div>
    </div>
</template>

<style scoped>
.nav {
    padding: 10px 20px;
    background: #24292e;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
}

.link {
    color: #58a6ff;
    text-decoration: none;
    font-weight: bold;
}

.btn-save {
    background-color: #238636;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.btn-save:hover:not(:disabled) {
    background-color: #2ea043;
}

.btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.editor-layout {
    display: flex;
    height: calc(100vh - 55px);
}

.input-area {
    flex: 1;
    padding: 25px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 15px;
    line-height: 1.6;
    border: none;
    border-right: 1px solid #d0d7de;
    resize: none;
    outline: none;
    background: #ffffff;
    color: #1f2328;
}

.preview-container {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    background-color: #ffffff;
    /* Fondo blanco para la columna */
}

/* Ajustes de la librería GitHub Markdown */
.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    background-color: #ffffff !important;
    /* Forzamos fondo blanco */
    color: #1f2328 !important;
    /* Forzamos texto oscuro */
    text-align: left;
}

/* Estilo para cuando compartan clases similares */
:deep(.markdown-body h1),
:deep(.markdown-body h2) {
    color: #1f2328;
    border-bottom: 1px solid #d8dee4;
}

:deep(.markdown-body li) {
    color: #1f2328;
}
</style>