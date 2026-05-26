<template lang="html">
<section class=" w-full h-full flex items-center justify-between flex-col gap-y-8">
  <button class="btn btn-primary" v-if="!selectedQuestion" @click="selectQuestion">Jöjjön egy kérdés</button>
  <template v-else>
    <MultiQuestion :key="selectedQuestion.question" v-if="selectedQuestion.type === 'multi'" :question="selectedQuestion" :correct="questionCorrect" @submit-answer="validateAnswer"/>
    <BoolQuestion :key="selectedQuestion.question" v-if="selectedQuestion.type === 'bool'" :question="selectedQuestion" :correct="questionCorrect" @submit-answer="validateAnswer"/>

    <button class="btn btn-primary" @click="selectQuestion">{{ buttonText }}</button>
  </template>
</section>

</template>

<script setup lang="ts">

import type { Question } from '@/types/types';
import questions from '@/assets/data/data.json';
import { ref, computed } from 'vue';
import BoolQuestion from './components/BoolQuestion.vue';
import MultiQuestion from './components/MultiQuestion.vue';

const selectedQuestion = ref<Question>();
const questionCount = questions.length;
const questionCorrect = ref<boolean>();

const usedIndexes: number[] = []
const selectedIndex = ref<number>(-1);

const resetState = () => {
  selectedIndex.value = -1;
  questionCorrect.value = undefined;
  selectedQuestion.value = undefined;
}

const buttonText = computed(() => {
  if (selectedQuestion.value && questionCorrect.value === undefined) {
    return 'Legyen inkább egy másik'
  } else {
    return 'Jöjjön egy másik'
  }
})

const selectQuestion = () => {
  resetState();

  const idx = Math.floor(Math.random() * questionCount);
  if (idx in usedIndexes) {
    selectQuestion();
  }
  else {
    selectedQuestion.value = questions[idx] as Question;
    selectedIndex.value = idx
  }
}


const validateAnswer = (answer: number | number[]) => {
  console.log(answer);
    if (selectedQuestion.value?.type === 'bool') {
      const correct = selectedQuestion.value.answers[answer as number]?.value

      usedIndexes.push(selectedIndex.value);
      questionCorrect.value = correct;
  }
  else {
    const correct = (answer as number[]).every(a => selectedQuestion.value?.answers[a]?.value)
    questionCorrect.value = correct
    if (correct) {
      usedIndexes.push(selectedIndex.value);
    }
  }
}


</script>
