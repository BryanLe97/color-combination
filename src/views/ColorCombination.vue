<script setup lang="ts">
import { combinations } from '@/data/combinations.json';
import { ref, computed, reactive } from 'vue';
import heartIcon from '@/assets/images/heart.svg';


const itemsPerPage = 5; 
const currentPage = ref(1);
const selectedCombination = ref(combinations[0]);
const selectedColor = reactive(['','','','']); // Default color
const colorPickers = ref([]);

const visibleRelatedCombinations = computed(() => {
  const start = 0;
  const end = currentPage.value * itemsPerPage;
  return selectedCombination.value.relatedCombinations.slice(start, end);
});

const selectCombination = (id) => {
  const combination = combinations.find(
    (combo) => combo.combination.id === id
  );
  if (combination) {
    selectedCombination.value = combination;
  }
};
const loadMoreCombinations = () => {
  if (
    currentPage.value * itemsPerPage <
    selectedCombination.value.relatedCombinations.length
  ) {
    currentPage.value++;
  }
};

const updateColor = (index) => {
  selectedCombination.value.combination.colors[index].hex = selectedColor.value;
};

const triggerColorPicker = (index, color) => {
  const colorPicker = colorPickers.value[index];
  selectedColor[index] = color; 
  if (colorPicker) {
    colorPicker.click();
  }
};

const getTextColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;

  // Apply gamma correction
  const correctedR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const correctedG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const correctedB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  const luminance = 0.2126 * correctedR + 0.7152 * correctedG + 0.0722 * correctedB;

  // Return #000 for light backgrounds and #FFF for dark backgrounds
  return luminance > 0.5 ? '#000' : '#FFF';
};

const titleTextColor = computed(() => {
  const backgroundColor = selectedCombination.value.combination.color.hex;
  return getTextColor(backgroundColor);
});


</script>

<template>
    <div class="combinations">
      <div class="combinations__combination" :style="`background-color: ${selectedCombination.combination?.color.hex}`">
          <div class="combinations__breadcrumb">
            <nav>
              <ul>
                <li>Colors</li>
                <li>Colors palettes</li>
                <li>{{ selectedCombination.combination?.name }}</li>
              </ul>
            </nav>
          </div>
          <div class="combinations__title">
             <h1
              class="combinations__name"
              :style="{ color: titleTextColor }"
            >
              {{ selectedCombination.combination?.name }}
            </h1>
            <h1 :style="{ color: titleTextColor }">color combination</h1>
          </div>
          <div class="combinations__combination-selected">
            <div class="combinations__like">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="combinations__like-icon"
                  :class="{ 'un-liked': !selectedCombination.combination?.liked}"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
              </svg>
              <span class="combinations__like-count">{{ selectedCombination.combination?.likes || 0 }}</span>
            </div>
            <img 
              class="combinations__featuredImage" 
              :src="`src/assets/images/thumbnail/${selectedCombination.combination?.featuredImage?.url}`"
              :alt="selectedCombination.combination?.featuredImage?.alt"
            />
            <div class="combinations__colors">
              <div
                v-for="(color,index) in selectedCombination.combination.colors"
                class="combinations__color"
              >
                <div class="combinations__box-color" :style="`background-color: ${color.hex}`" />
                <p>{{ color.name }}</p>
                <div class="combinations__color-picker">
                  <p @click="triggerColorPicker(index, color.hex)">{{ color.hex }}</p>
                  <input
                    type="color"
                    ref="colorPickers"
                    :data-index="index"
                    v-model="selectedColor"
                    @input="updateColor(index)"
                    class="hidden-color-picker"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="combinations__related">
        <h1>Related Combinations</h1>
        <div style="display: grid;  grid-template-columns: repeat(2, 1fr); gap: 1rem; grid-auto-rows: minmax(auto, 80px);">
          <div
            v-for="relatedCombination in visibleRelatedCombinations"
            class="combinations__item"
            :key="relatedCombination.name"
            @click="selectCombination(relatedCombination.id)"
          >
            <div
              v-for="color in relatedCombination.colors"
              :style="`background-color: ${color}`"
              class="combinations__related-box-color"
            />
          </div>
          <div 
            v-if="selectedCombination.relatedCombinations.length > 5"
            class="combinations__more-item"
            :class="{ 'disabled': !(currentPage * itemsPerPage < selectedCombination.relatedCombinations.length) }"
            @click="loadMoreCombinations"
          >
            See more combinations
          </div>
        </div>
        <h2>Use this color palette and create beatiful designs and documents!</h2>
        <div class="combinations__button" :style="`background-color: ${selectedCombination.combination?.color.hex}`">
          Browser template
        </div>
      </div>
    </div>
</template>
<style scoped lang="scss">
.combinations {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem ;
  &__combination {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding: 2rem 0;
    background-image: url('@/assets/images/foreground.png');
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
    
  }
  &__breadcrumb {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        position: relative;
        &::after {
          content: '>';
          margin: 0 0.5rem;
        }
        &:last-child::after {
          content: '';
        }
      }
    }
  }
  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;
    h1 {
      font-size: 2rem;
      margin: 0;
      font-weight: 600;
    }
  }
  &__related {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
  }
  &__item ,
  &__more-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    &.disabled {
      cursor: not-allowed;
      background-color: #cccccc;
      pointer-events: none; /* Prevent clicks */
    }
  }
  &__related-box-color {
      width: 80px;
      height: 80px;
  }
  &__featuredImage {
    width: 654px;
    display: block;
  }
  &__colors {
    width: 100%;
    display: flex;
    align-items: center;
    p {
      margin: 0;
      font-size: 1.2rem;
    }
  }
  &__color { 
    flex: 1; 
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  &__box-color {
    width: 100%;
    height: 132px;
    margin-bottom: 0.5rem;
  }
  &__button{
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
  }
  &__like {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0.8); 
    padding: 0.5rem 1rem;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10; 
  }
  &__like-icon {
    width: 24px; 
    height: 24px; 
    cursor: pointer;
    transition: transform 0.3s ease, filter 0.3s ease; 
    fill: red;
    svg {
      transition: fill 0.3s ease; 
    }
    &.un-liked {
     fill: #ebe9e9; 
    }
  }
  &__like-count {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }
  &__combination-selected {
    position: relative; 
  }
  &__color-picker {
    position: relative;
    gap: 0.5rem;
    p {
      margin: 0;
      font-size: 1rem;
      font-weight: bold;
      color: #333;
      &:hover {
        background-color: #f0f0f0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .hidden-color-picker {
      visibility: hidden;
    }
    
  }
}

</style>