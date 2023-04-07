<template>
    <ion-header :translucent="true">
        <ion-toolbar>
            <div class="header-outer">
                <div class="header-inner">
                    <HeaderSearchBar />
                    <HeaderPicker @click="$emit('showModal')" />
                </div>
            </div>
        </ion-toolbar>
    </ion-header>
</template>

<script setup>
import { IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import { watchEffect } from 'vue';
import HeaderPicker from './HeaderPicker.vue';
import HeaderSearchBar from './HeaderSearchBar.vue';

</script>

<style scoped>
.header-outer {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    height: 60px;
    align-items: center;
    border-bottom-width: 0.5;
}

.header-inner {
    display: flex;
    height: 70%;
    flex-direction: row;
    flex: 1;
    padding: 4px;
}
</style>