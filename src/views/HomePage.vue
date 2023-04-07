<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Blank</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="container" v-if="location">
                <p>latitude: {{ location.coords.latitude }}</p>
                <p>longitude: {{ location.coords.longitude }}</p>
                <p>accuracy: {{ location.coords.accuracy }}</p>
                <button @click="printCurrentPosition">Update</button>
            </div>
            <!-- <div id="container" v-else-if="permission === 'denied'">
                <p>Permission denied</p>
            </div>
            <div id="container" v-else>
                <p>Waiting...</p>
            </div> -->
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, } from "@ionic/vue";
import { Geolocation } from '@capacitor/geolocation';
import now from "performance-now"
import { onMounted, ref } from "vue";
import {Logger} from "@aparajita/capacitor-logger";

const logger = new Logger("CAPACITOR LOG");

const permission = ref(false)
const location = ref(false);

const printCurrentPosition = async () => {
    let status = await Geolocation.requestPermissions();
    permission.value = status.location;
    if (permission.value !== 'granted') {
        return;
    }
    let beforeModule = now();
    let before = performance.now();
    const coordinates = await Geolocation.getCurrentPosition(
        {
            enableHighAccuracy: true
        }
    );
    let after = performance.now();
    let afterModule = now();
    let time = after - before;
    let log = time + " miliseconds";
    logger.info(log);
    console.log(after - before, " miliseconds")
    console.log(afterModule - beforeModule, " Module miliseconds")
    location.value = coordinates;
};

onMounted(() => {
    printCurrentPosition()
})

</script>

<style scoped>
#container {
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

#container strong {
    font-size: 20px;
    line-height: 26px;
}

#container p {
    font-size: 16px;
    line-height: 22px;

    color: #8c8c8c;

    margin: 0;
}

#container a {
    text-decoration: none;
}
</style>
