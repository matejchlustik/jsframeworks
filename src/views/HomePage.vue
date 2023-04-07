<template>
  <ion-page>
    <CustomHeader @showModal="showModal" />
    <ion-content :fullscreen="true">
      <ModalPicker
        :allCurrencies="allCurrencies"
        :active="active"
        @closeModal="closeModal"
        @changeValue="changeValue"
      />
      <div class="container">
        <div v-if="searchQuery">
          <div
            class="item-container"
            v-for="item in searchData"
            :key="item.short"
          >
            <span class="item-short">{{ item.short.toUpperCase() }}</span>
            <span class="item">{{ item.currency }}</span>
            <span class="item">{{ item.exchangeRate }}</span>
          </div>
        </div>
        <div v-else>
          <div class="item-container" v-for="item in data" :key="item.short">
            <span class="item-short">{{ item.short.toUpperCase() }}</span>
            <span class="item">{{ item.currency }}</span>
            <span class="item">{{ item.exchangeRate }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed, ref, onMounted, onUpdated, nextTick } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import CustomHeader from "../components/Header/CustomHeader.vue";
import ModalPicker from "../components/ModalPicker.vue";

import { activeCurrency, searchQuery } from "../store";
import useFetch from "../composables/useFetch";

const url = computed(
  () =>
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${activeCurrency.value}.json`
);

const {
  data: allExchangeRates,
  pending: allExchangeRatesPending,
  error: allExchangeRatesError,
} = useFetch(url);
const {
  data: allCurrencies,
  pending: allCurrenciesPending,
  error: allCurrenciesError,
} = useFetch(
  `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
);

const active = ref(false);
const showModal = () => {
  active.value = true;
};

const closeModal = () => {
  active.value = false;
};

const changeValue = (item) => {
  activeCurrency.value = item.value;
  closeModal();
};

const data = computed(() => {
  if (
    allCurrencies.value &&
    allExchangeRates.value &&
    allExchangeRates.value[activeCurrency.value]
  ) {
    const temp = {};
    Object.entries(allCurrencies.value).forEach((currency) => {
      temp[currency[0]] = { currency: currency[1] };
      temp[currency[0]].short = currency[0];
    });
    Object.entries(allExchangeRates.value[activeCurrency.value]).forEach(
      (exchangeRate) => {
        temp[exchangeRate[0]].exchangeRate = exchangeRate[1];
      }
    );
    return Object.values(temp);
  }
  return null;
});

const searchData = computed(() => {
  if (!searchQuery.value) {
    return data.value;
  } else if (data.value && searchQuery.value) {
    const results = data.value.filter((element) => {
      return (
        element.currency
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        element.short.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
    if (results.length === 0) {
      return null;
    }
    return results;
  }
  return null;
});


onUpdated(() => {
  console.log("updated");
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.item-container {
  display: flex;
  flex-direction: row;
  padding: 18px;
  align-items: center;
}

.item {
  margin-left: 12px;
  flex: 1;
  font-size: 16px;
}

.item-short {
  margin-right: 10px;
  flex: 0.5;
  font-size: 16px;
}
</style>
