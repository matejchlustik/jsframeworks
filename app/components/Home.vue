<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <FlexboxLayout v-if="location" flexDirection="column" alignItems="center" justifyContent="center">
      <Label :text="'latitude ' + location.latitude" />
      <Label :text="'longitude ' + location.longitude" />
      <Label :text="'horizontal accuracy ' + location.horizontalAccuracy" />
      <Label :text="'vertical accuracy ' + location.verticalAccuracy" />
      <Button @tap="getLocation" text="update" />
      <Label v-if="msg" :text="msg" />
    </FlexboxLayout>
    <FlexboxLayout v-else>
      <Label text="Waiting..." />
    </FlexboxLayout>
  </Page>
</template>

<script>
import * as geolocation from "@nativescript/geolocation";
import { CoreTypes } from "@nativescript/core";
import now from "performance-now";



export default {
  data() {
    return {
      location: null,
      msg:null
    };
  },
  methods: {
    getLocation: async function () {
      await geolocation.enableLocationRequest();
      let before = now();
      let currentLocation = await geolocation.getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 20000,
      });
      let after = now();
      let time = after-before;
      this.msg = time + " miliseconds";
      this.location = currentLocation;
    },
  },
  mounted() {
    this.getLocation();
  },
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
</style>
