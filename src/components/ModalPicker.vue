<template>
    <div :class="[active ? 'active-modal' : 'modal']" @click="$emit('closeModal')">
        <div class="modal-content">
            <div v-for="value in values" class="modal-item"
                :class="{ highlight: touchNoDrag && (value.value === clicked) }" @click="$emit('changeValue', value)"
                :key="value.key" @touchmove="highlightEnd" @touchstart="highlightStart(value)" @touchend="highlightEnd">
                {{ value.text }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps } from 'vue';
const props = defineProps(['allCurrencies', 'active'])

const values = ref([]);
watchEffect(() => {
    if (props.allCurrencies) {
        Object.keys(props.allCurrencies).forEach(key => {
            values.value.push({ text: key.toUpperCase(), value: key })
        })
    }
})



const touchNoDrag = ref(false)
const clicked = ref("");
const showHighlight = ref();

const highlightEnd = () => {
    clearTimeout(showHighlight.value)
    touchNoDrag.value = false
    clicked.value = ""
}

const highlightStart = (item) => {
    showHighlight.value = setTimeout(() => {
        touchNoDrag.value = true
    }, 100)

    clicked.value = item.value
}


</script>

<style scoped>
.modal {
    display: none;
    flex: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    overflow: auto;
    justify-content: center;
}

.modal-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: #fefefe;
    margin: 0 auto;
    z-index: 10;
    padding: 10px 0 10px 0;
    width: 80%;
}

.active-modal {
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    overflow: auto;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.65);
}

.modal-item {
    padding: 16px 12px 16px 12px;
}

.highlight {
    background-color: #f5f5f5;
}
</style>