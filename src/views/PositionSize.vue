<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-text color="secondary">
        <h2>Position Size Calculator</h2>
      </ion-text>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-lg="6">
            <ion-card>
              <ion-card-content>
                <ion-list>
                  <!-- Direction Toggle -->
                  <ion-item>
                    <ion-label>Position Direction</ion-label>
                    <div class="direction-toggle" slot="end">
                      <ion-button
                          :fill="isLong ? 'solid' : 'outline'"
                          color="success"
                          size="small"
                          @click="isLong = true"
                      >
                        Long
                      </ion-button>
                      <ion-button
                          :fill="!isLong ? 'solid' : 'outline'"
                          color="danger"
                          size="small"
                          @click="isLong = false"
                      >
                        Short
                      </ion-button>
                    </div>
                  </ion-item>

                  <!-- Account Size -->
                  <ion-item>
                    <ion-label position="stacked">Account Size ($)</ion-label>
                    <ion-input
                        v-model="accountSize"
                        type="number"
                        placeholder="10000"
                        @ionInput="calculatePositionSize"
                    />
                  </ion-item>

                  <!-- Risk Percentage -->
                  <ion-item>
                    <ion-label position="stacked">Risk (%)</ion-label>
                    <ion-input
                        v-model="riskPercentage"
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        @ionInput="calculatePositionSize"
                    />
                  </ion-item>

                  <!-- Risk Percentage Chips -->
                  <div class="chips-container">
                    <ion-chip
                        v-for="preset in riskPresets"
                        :key="preset"
                        @click="setRiskPercentage(preset)"
                    >
                      <ion-label>{{ preset }}%</ion-label>
                    </ion-chip>
                  </div>

                  <!-- Security Factor -->
                  <ion-item>
                    <ion-label position="stacked">Security Factor (0.1 - 1)</ion-label>
                    <ion-input
                        v-model="securityFactor"
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="1"
                        placeholder="1.0"
                        @ionInput="calculatePositionSize"
                    />
                  </ion-item>

                  <!-- Entry Price -->
                  <ion-item>
                    <ion-label position="stacked">Entry Price ($)</ion-label>
                    <ion-input
                        v-model="entryPrice"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        @ionInput="calculatePositionSize"
                    />
                  </ion-item>

                  <!-- Stop Loss Price -->
                  <ion-item>
                    <ion-label position="stacked">Stop Loss Price ($)</ion-label>
                    <ion-input
                        v-model="stopLossPrice"
                        type="number"
                        step="0.01"
                        placeholder="95.00"
                        @ionInput="calculatePositionSize"
                    />
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-lg="6" v-if="positionSize !== null">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Position Size Results</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6">
                      <ion-text>
                        <h3>Risk Amount:</h3>
                        <p>${{ riskAmount.toFixed(2) }}</p>
                      </ion-text>
                    </ion-col>
                    <ion-col size="6">
                      <ion-text>
                        <h3>Position Size $:</h3>
                        <p>${{ positionSize.toFixed(2) }}</p>
                      </ion-text>
                    </ion-col>
                  </ion-row>
                  <ion-row v-if="stopLossDistance > 0">
                    <ion-col size="6">
                      <ion-text>
                        <h3>Stop Loss Distance:</h3>
                        <p>${{ stopLossDistance.toFixed(2) }}</p>
                      </ion-text>
                    </ion-col>
                    <ion-col size="6">
                      <ion-text>
                        <h3>Position Size (Shares/Contracts):</h3>
                        <p>{{ positionSizeInShares !== null ? positionSizeInShares.toFixed(2) : 'N/A' }}</p>
                      </ion-text>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="6">
                      <ion-text>
                        <h3>Risk per Share:</h3>
                        <p>${{ riskPerShare.toFixed(4) }}</p>
                      </ion-text>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';
import { ref, computed, watch } from 'vue';

// Reactive data
const isLong = ref(true);
const accountSize = ref('');
const riskPercentage = ref('');
const securityFactor = ref('');
const entryPrice = ref('');
const stopLossPrice = ref('');

// Risk presets
const riskPresets = [0.2, 0.3, 0.5, 0.8, 1];

// Computed values
const riskAmount = computed(() => {
  const account = parseFloat(accountSize.value) || 0;
  const risk = parseFloat(riskPercentage.value) || 0;
  return (account * risk) / 100;
});

const stopLossDistance = computed(() => {
  const entry = parseFloat(entryPrice.value) || 0;
  const stop = parseFloat(stopLossPrice.value) || 0;
  return Math.abs(entry - stop);
});

const riskPerShare = computed(() => {
  const distance = stopLossDistance.value;
  return distance > 0 ? riskAmount.value / distance : 0;
});

const positionSize = computed(() => {
  const risk = riskPerShare.value;
  const entry = parseFloat(entryPrice.value) || 0;
  return entry > 0 ? risk * entry : null;
});

const positionSizeInShares = computed(() => {
  const size = positionSize.value;
  const entry = parseFloat(entryPrice.value) || 0;
  return entry > 0 && size !== null ? size / entry : null;
});

// Methods
const setRiskPercentage = (percentage: number) => {
  riskPercentage.value = percentage.toString();
  calculatePositionSize();
};

const calculatePositionSize = () => {
  // This will trigger the computed properties to recalculate
  // The actual calculation happens in the computed properties above
};

// Watch for changes to recalculate
watch([accountSize, riskPercentage, securityFactor, entryPrice, stopLossPrice, isLong], () => {
  calculatePositionSize();
});
</script>

<style scoped>
.direction-toggle {
  display: flex;
  gap: 8px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
</style>
