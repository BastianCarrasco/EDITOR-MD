<script setup>
import { computed, onMounted, ref } from 'vue'
import { marked } from 'marked'
import { sharedData } from '../store'
import 'github-markdown-css/github-markdown.css'

const BASE_URL = "https://backend-md-production.up.railway.app"
const isSaving = ref(false)
const fileList = ref([])
const currentFileName = ref("")
const newFileTitle = ref("")

marked.setOptions({ breaks: true, gfm: true })

const fetchFiles = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/files`)
        if (response.ok) fileList.value = await response.json()
    } catch (error) { console.error("Error lista:", error) }
}

const createNewFile = async () => {
    if (!newFileTitle.value || !sharedData.value) return alert("Escribe título y contenido")
    isSaving.value = true
    try {
        const response = await fetch(`${BASE_URL}/api/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newFileTitle.value, content: sharedData.value })
        })
        if (response.ok) {
            const result = await response.json()
            currentFileName.value = result.fileName
            newFileTitle.value = ""
            await fetchFiles()
            alert("¡Archivo creado!")
        }
    } catch (e) { alert("Error al crear") }
    finally { isSaving.value = false }
}

const loadFile = async (name) => {
    try {
        const response = await fetch(`${BASE_URL}/api/files/${name}`)
        if (response.ok) {
            sharedData.value = await response.text()
            currentFileName.value = name
        }
    } catch (e) { console.error("Error al cargar") }
}

const updateFile = async () => {
    if (!currentFileName.value) return
    isSaving.value = true
    try {
        await fetch(`${BASE_URL}/api/files/${currentFileName.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: sharedData.value })
        })
        alert("¡Guardado!")
    } catch (e) { alert("Error al actualizar") }
    finally { isSaving.value = false }
}

const deleteFile = async (name) => {
    if (!confirm(`¿Borrar ${name}?`)) return
    try {
        const response = await fetch(`${BASE_URL}/api/files/${name}`, { method: 'DELETE' })
        if (response.ok) {
            if (currentFileName.value === name) {
                sharedData.value = ""; currentFileName.value = ""
            }
            await fetchFiles()
        }
    } catch (e) { alert("Error al borrar") }
}

const resetEditor = () => {
    currentFileName.value = ""; sharedData.value = ""; newFileTitle.value = ""
}

onMounted(fetchFiles)
const output = computed(() => marked.parse(sharedData.value || ''))
</script>

<template>
    <div class="nav">
        <div class="left-nav">
            <button @click="resetEditor" class="btn-new">📄 Nuevo</button>
            <div class="file-info" v-if="currentFileName">
                Editando: <span>{{ currentFileName }}</span>
            </div>
        </div>
        <div class="actions">
            <template v-if="!currentFileName">
                <input v-model="newFileTitle" placeholder="Título..." class="title-input" />
                <button @click="createNewFile" class="btn-create">➕ Crear</button>
            </template>
            <button v-else @click="updateFile" :disabled="isSaving" class="btn-save">
                {{ isSaving ? 'Guardando...' : '💾 Guardar' }}
            </button>
        </div>
    </div>

    <div class="editor-layout">
        <div class="sidebar">
            <h3>Documentos</h3>
            <ul>
                <li v-for="file in fileList" :key="file" :class="{ active: currentFileName === file }">
                    <span class="file-name" @click="loadFile(file)">{{ file }}</span>
                    <button class="btn-delete" @click.stop="deleteFile(file)">🗑️</button>
                </li>
            </ul>
        </div>

        <textarea v-model="sharedData" class="input-area" spellcheck="false" placeholder="# Escribe aquí..."></textarea>

        <div class="preview-container">
            <div class="markdown-body" v-html="output"></div>
        </div>
    </div>
</template>

<style scoped>
/* NAV Y SIDEBAR */
.nav {
    padding: 0 20px;
    background: #24292e;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
}

.left-nav {
    display: flex;
    align-items: center;
}

.btn-new {
    background: transparent;
    color: #58a6ff;
    border: 1px solid #58a6ff;
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 15px;
}

.sidebar {
    width: 220px;
    background: #f6f8fa;
    border-right: 1px solid #d0d7de;
    overflow-y: auto;
}

.sidebar h3 {
    padding: 15px;
    font-size: 13px;
    color: #57606a;
    margin: 0;
    text-transform: uppercase;
}

.sidebar li {
    display: flex;
    justify-content: space-between;
    padding: 8px 15px;
    font-size: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.sidebar li.active {
    background: #0969da;
    color: white;
}

.btn-delete {
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.6;
}

.btn-delete:hover {
    opacity: 1;
}

.title-input {
    background: #1f2328;
    border: 1px solid #444;
    color: white;
    padding: 6px;
    border-radius: 4px;
    margin-right: 10px;
}

.btn-create {
    background: #0969da;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-save {
    background: #238636;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
}

/* EDITOR Y PREVIEW */
.editor-layout {
    display: flex;
    height: calc(100vh - 55px);
}

.input-area {
    flex: 1;
    padding: 25px;
    border: none;
    border-right: 1px solid #d0d7de;
    resize: none;
    outline: none;
    font-size: 15px;
    background: #ffffff;
    color: #1f2328;
}

.preview-container {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    background-color: #ffffff;
}

/* ESTILOS MARKDOWN (FONDO CLARO, CÓDIGO OSCURO) */
.markdown-body {
    background-color: #ffffff !important;
    color: #1f2328 !important;
    text-align: left;
    font-size: 16px;
}

/* Bloques de código (Pre) - Fondo Negro, Letras Blancas */
:deep(.markdown-body pre) {
    background-color: #1b1f23 !important;
    color: #ffffff !important;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;
}

/* Código en línea (inline code) - Fondo grisáceo suave */
:deep(.markdown-body code) {
    background-color: rgba(175, 184, 193, 0.2);
    color: #1f2328;
    padding: 0.2em 0.4em;
    border-radius: 6px;
    font-family: monospace;
}

/* Evitar que el código dentro de pre herede el color oscuro de arriba */
:deep(.markdown-body pre code) {
    background-color: transparent !important;
    color: #e6edf3 !important;
    padding: 0;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2) {
    border-bottom: 1px solid #d8dee4;
}
</style>