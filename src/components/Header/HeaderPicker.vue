<template>
    <div class="picker">
        <p>{{ activeCurrency.toUpperCase() }}</p>
        <ion-icon :icon="caretDownSharp"></ion-icon>
    </div>

</template>

<script setup>
import { IonIcon } from '@ionic/vue'
import { caretDownSharp } from 'ionicons/icons'

import { activeCurrency } from '../../store';

</script>

<style scoped>
.picker {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 2;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 8px;
}

.picker p {
    margin: 0
}

ion-icon {
    color: #747474
}
</style>