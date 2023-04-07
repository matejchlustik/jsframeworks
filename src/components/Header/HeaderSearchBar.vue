<template>
  <div class="container">
    <div class="containerSearchBar">
      <ion-icon :icon="search"></ion-icon>
      <ion-input class="custom" v-model="searchQuery"></ion-input>
      <ion-icon :icon="close" @click="clearInput"></ion-icon>
    </div>
  </div>
</template>

<script setup>
import { IonIcon, IonInput } from "@ionic/vue";
import { search, close } from "ionicons/icons";
import { searchQuery } from "../../store";

const clearInput = () => {
  searchQuery.value = "";
};
</script>

<style scoped>
.container {
  display: flex;
  flex: 3.5;
  box-sizing: border-box;
  margin: 0 6px 0 6px;
}

.containerSearchBar {
  display: flex;
  flex: 1;
  flex-direction: row;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 4px;
  align-items: center;
}

ion-icon {
  font-size: 20px;
  flex: 1;
}

ion-input.custom {
  --padding-bottom: 6px;
  --padding-end: 6px;
  --padding-start: 6px;
  --padding-top: 6px;
  flex: 6;
  font-size: 16px;
}
</style>