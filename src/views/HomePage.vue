<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <button class="take-photo-button" @click="takePicture">
          Take photo
        </button>
        <button class="take-photo-button" @click="savePicture">
          Save Photo
        </button>
        <button class="take-photo-button" @click="readPicture">
          Read Photo
        </button>
      </div>
      <div class="container" v-if="showImage">
        <img :src="showImage" style="width:100px;height:100px" alt="" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem"
import { ref, onMounted } from "vue";
import now from "performance-now";
import {Logger} from "@aparajita/capacitor-logger";

const logger = new Logger("CAPACITOR LOG");

const permission = ref();
const image = ref();
const showImage = ref();
//  hodnota konštanty ACTION_IMAGE_CAPTURE ktorá je štandardný intent pre zapnutie aplikácie kamery =
//  android.media.action.IMAGE_CAPTURE - ACTIVITY TASK MANAGER starts camera app, toto zmeriame v kode pomocou performance.now- hladaj TESTING log

// TENTO LOG JE KED JE KAMERA READY
//2023-02-06 11:29:47.723 25758-25758 CAM_Camera@72419637     com.android.camera                   D  onResume end

//CAM_[PERFORMANCE] / CAM_PerformanceManager loguje všetko

//VYFOTI A ULOZI DO GALERIE 
const takePicture = async () => {
  console.log(performance.now(), "TESTING");
  const takenImage = await Camera.getPhoto({
    quality: 100,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
  });
  image.value = takenImage;
};

const savePicture = async () => {
  const before = now();
  const savedFile = await Filesystem.writeFile({
    path: "test.jpeg",
    data: image.value.base64String,
    directory: Directory.Data,
  });
  const after = now();
  const time = after-before;
  const msg = time + " miliseconds to save image";
  logger.info(msg);
  console.log(after - before, " miliseconds to save image");
}


const readPicture = async () => {
  const before = now();
  const loadedFile = await Filesystem.readFile({
    path: "test.jpeg",
    directory: Directory.Data,
  });
  const after = now();
  const time = after-before;
  const msg = time + " miliseconds to read image";
  logger.info(msg);
  showImage.value = "data:image/jpeg;base64, " + loadedFile.data;
  console.log(after - before, " miliseconds to load image");
}


onMounted(async () => {
  permission.value = await Filesystem.checkPermissions()
  if (permission.value !== 'granted') {
    permission.value = await Filesystem.requestPermissions()
  }
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

.take-photo-button {
  background-color: #267aff;
  padding: 10px;
  border-radius: 10px;
  color: white;
}
</style>
