<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <FlexboxLayout aligntItems="center" justifyContent="center" flexDirection="column">
      <FlexboxLayout aligntItems="center" justifyContent="center">
        <Button class="take-picture-button" text="Take a picture" @tap="takePicture" />
        <Button class="take-picture-button" text="Save picture" @tap="saveImage" />
        <Button class="take-picture-button" text="Read image" @tap="readImage" />
        <FlexboxLayout>
          <Label v-if="readmsg" :text="readmsg" />
        </FlexboxLayout>
        <FlexboxLayout>
          <Label v-if="writemsg" :text="writemsg" />
        </FlexboxLayout>
      </FlexboxLayout>
      <image v-if="showImage" :src="showImage" />
    </FlexboxLayout>
  </Page>
</template>

<script>
import { requestCameraPermissions } from "@nativescript/camera";
import { encoding, ImageSource, knownFolders, path } from "@nativescript/core";
import { android } from "@nativescript/core/application";
import { requestPermissions } from 'nativescript-permissions';
import now from "performance-now";
const camera = require("@nativescript/camera");

//  hodnota konštanty ACTION_IMAGE_CAPTURE ktorá je štandardný intent pre zapnutie aplikácie kamery =
//  android.media.action.IMAGE_CAPTURE - ACTIVITY TASK MANAGER starts camera app, toto zmeriame v kode pomocou performance.now- hladaj TESTING log

// TENTO LOG JE KED JE KAMERA READY
//2023-02-06 11:29:47.723 25758-25758 CAM_Camera@72419637     com.android.camera                   D  onResume end

//CAM_[PERFORMANCE] / CAM_PerformanceManager loguje všetko

export default {
  data() {
    return {
      image: 0,
      showImage: null,
      readmsg:null,
      writemsg:null
    }
  },
  methods: {
    takePicture: async function () {
      let a = await requestCameraPermissions();
      const asset = await camera.takePicture({ saveToGallery: false });
      this.image = asset;
    },
    saveImage: async function () {
      const source = await ImageSource.fromAsset(this.image);
      const fileName = 'test.jpg';
      const folderPath = knownFolders.documents().path;
      const filePath = path.join(folderPath, fileName);
      const before = now();
      const savedImage = await source.saveToFileAsync(filePath, 'jpg');
      const after = now();
      let time = after-before;
      this.readmsg = time + " miliseconds to save image";
      console.log(savedImage);
      console.log(after - before, " miliseconds to save image")
    },
    readImage: async function () {
    
      const fileName = 'test.jpg';
      const folderPath = knownFolders.documents().path;
      const filePath = path.join(folderPath, fileName);
      const before = now();
      const source = await ImageSource.fromFile(filePath);
      const after = now();
      this.showImage = source;
      let time = after-before;
      this.writemsg = time + " miliseconds to read image";
      console.log(source);
      console.log(after - before, " miliseconds to read image")

    }
  },
  mounted: async function () {
    const perms = await requestPermissions(
      [
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE
      ]
    )
    console.log(perms);
  }
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}

.take-picture-button {
  background-color: #267aff;
  border-radius: 40;
  color: white;
  width: 50%;
}
</style>
