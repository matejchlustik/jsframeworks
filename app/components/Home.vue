<template>
  <Page>
    <ActionBar>
      <FlexboxLayout height="50">
        <FlexboxLayout width="60%" class="search-bar-container">
          <FlexboxLayout class="icon-container">
            <Label text.decode="&#xf2f5;" class="ionicon search-bar-icon" />
          </FlexboxLayout>
          <FlexboxLayout width="70%" class="box" backgroundColor="yellow">
            <TextField class="text-input" v-model="store.searchQuery" />
          </FlexboxLayout>
          <FlexboxLayout @tap="clearInput" :class="[store.searchQuery ? 'visible' : 'non-visible']"
            class="icon-container">
            <Label text.decode="&#xf2d7;" class="ionicon search-bar-icon" />
          </FlexboxLayout>
        </FlexboxLayout>
        <FlexboxLayout width="33%" @tap="showPicker" class="picker-container">
          <Label :text="store.activeCurrency.toUpperCase()" class="picker-text" />
          <Label text.decode="&#xf35f;" class="ionicon picker-icon" />
        </FlexboxLayout>
      </FlexboxLayout>
    </ActionBar>
    <AbsoluteLayout>
      <FlexboxLayout top="0" left="0" width="100%" height="100%" flexDirection="column">
        <ListView v-if="store.searchQuery" for="item in searchData" separatorColor="transparent"
          backgroundColor="#ffffff">
          <v-template>
            <FlexboxLayout alignItems="center">
              <Label :text="item.short.toUpperCase()" class="item-short" whiteSpace="normal" />
              <Label :text="item.currency" class="item" textWrap="true" />
              <Label :text="item.exchangeRate" class="item" whiteSpace="normal" />
            </FlexboxLayout>
          </v-template>
        </ListView>
        <ListView v-if="data" for="item in data" separatorColor="transparent" backgroundColor="#ffffff">
          <v-template>
            <FlexboxLayout alignItems="center">
              <Label :text="item.short.toUpperCase()" class="item-short" whiteSpace="normal" />
              <Label :text="item.currency" class="item" textWrap="true" />
              <Label :text="item.exchangeRate" class="item" whiteSpace="normal" />
            </FlexboxLayout>
          </v-template>
        </ListView>
      </FlexboxLayout>
      <FlexboxLayout v-if="pickerActive" top="0" left="0" width="100%" height="100%" backgroundColor="#000000A5"
        justifyContent="center" @tap="closePicker">
        <ListView for="value in pickerData" @itemTap="onItemTap" separatorColor="transparent" backgroundColor="#ffffff"
          width="80%">
          <v-template>
            <Label :text="value.value.toUpperCase()" class="font" />
          </v-template>
        </ListView>
      </FlexboxLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
import { store } from "../store";
import { nextTick } from "vue";
export default {
  data() {
    return {
      allExchangeRates: null,
      allCurrencies: null,
      pickerActive: false,
      store,
    };
  },
  computed: {
    searchData() {
      if (!this.store.searchQuery) {
        return this.data;
      } else if (this.data && this.store.searchQuery) {
        const results = this.data.filter((element) => {
          return (
            element.currency
              .toLowerCase()
              .includes(this.store.searchQuery.toLowerCase()) ||
            element.short
              .toLowerCase()
              .includes(this.store.searchQuery.toLowerCase())
          );
        });
        if (results.length === 0) {
          return null;
        }
        return results;
      }
      return null;
    },
    data() {
      if (
        this.allCurrencies &&
        this.allExchangeRates &&
        this.allExchangeRates[this.store.activeCurrency]
      ) {
        const temp = {};
        Object.entries(this.allCurrencies).forEach((currency) => {
          temp[currency[0]] = { currency: currency[1] };
          temp[currency[0]].short = currency[0];
        });
        Object.entries(
          this.allExchangeRates[this.store.activeCurrency]
        ).forEach((exchangeRate) => {
          temp[exchangeRate[0]].exchangeRate = exchangeRate[1];
        });
        nextTick(() => {
          console.log("updated data");
        });
        return Object.values(temp);
      }
      nextTick(() => {
        console.log("updated first");
      });
      return null;
    },
    pickerData() {
      const values = [];
      if (this.allCurrencies) {
        Object.keys(this.allCurrencies).forEach((key) => {
          values.push({ text: key.toUpperCase(), value: key });
        });
      }
      nextTick(() => {
        console.log("updated picker");
      });
      return values;
    },
  },
  methods: {
    fetchExchangeRates: async function () {

      try {
        const res = await fetch(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${this.store.activeCurrency}.json`
        );
        if (!res.ok) {
          throw Error("Could not fetch the data");
        }
        this.allExchangeRates = await res.json();

        // pending.value = false;
      } catch (err) {
        console.log(err);
        // error.value = err.message;
        // pending.value = false;
      }
    },
    fetchAllCurrencies: async function () {
      try {
        const res = await fetch(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
        );
        if (!res.ok) {
          throw Error("Could not fetch the data");
        }
        this.allCurrencies = await res.json();

        //pending.value = false;
      } catch (err) {
        console.log(err);
        // error.value = err.message;
        // pending.value = false;
      }
    },
    showPicker() {
      this.pickerActive = true;
    },
    closePicker() {
      this.pickerActive = false;
    },
    onItemTap(item) {
      this.store.activeCurrency = item.item.value;
      this.closePicker();
    },
    clearInput() {
      this.store.searchQuery = "";
    },
  },
  mounted() {
    this.fetchExchangeRates();
    this.fetchAllCurrencies();
  },
  watch: {
    "store.activeCurrency"() {
      this.fetchExchangeRates();
    },
  },
  updated() {
    console.log("updated");
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles

.item {
  padding: 14px;
  font-size: 16px;
  width: 40%;
  margin-left: 10px;
}

.item-short {
  padding: 10px;
  font-size: 16px;
  width: 20%;
}

.item-container {
  padding: 18px;
  align-items: center;
  margin: 4px 18px 4px 18px;
}

.picker-text {
  font-size: 15px;
}

.picker-container {
  justify-content: space-between;
  align-items: center;
  padding-right: 2px;
  box-sizing: border-box;
}

.search-bar-container {
  box-sizing: border-box;
  margin: 16px 20px 16px 0px;
  border-width: 2px;
  border-color: #cccccc;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.picker-icon {
  color: #747474;
  font-size: 24px;
}

.search-bar-icon {
  font-size: 20px;
  box-sizing: border-box;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 4px;
}

.text-input {
  border-bottom-width: 1;
  border-bottom-color: transparent;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  overflow: scroll;
  flex: 1;
  padding: 8px;
  margin: 0;
}

.font {
  font-size: 16px;
}

.icon-container {
  width: 15%;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.box {
  box-sizing: border-box;
}

.visible {
  opacity: 1;
}

.non-visible {
  opacity: 0;
}
</style>
