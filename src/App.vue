<template lang="html">

<section v-if="mode === undefined && !isFinish" class="w-full h-full flex items-center justify-center gap-x-4">
  <button class="btn btn-neutral" @click="setupTimeChallenge()">Időzített teszt</button>
  <button class="btn btn-neutral" @click="setupZenMode()">Zen mód</button>
</section>

<section v-else-if="mode !== undefined && currentQuestion && !isFinish" class="w-full h-full">
  <div class="flex items-center justify-between w-full">
    <div class="score">{{ currentIndex + 1 }} / {{ questionnaireLength }}</div>
    <time :datetime="timeLeftFormatted">{{ timeLeftFormatted }}</time>
  </div>
  <MultiQuestion 
    :key="currentQuestion.question" 
    v-if="currentQuestion.type === 'multi'" 
    :question="currentQuestion" 
    :correct="questionCorrect" 
    @submit-answer="validateAnswer"/>
  <BoolQuestion 
    :key="currentQuestion.question"
    v-if="currentQuestion.type === 'bool'" 
    :question="currentQuestion" 
    :correct="questionCorrect" 
    @submit-answer="validateAnswer"/>
  <div class="pt-4">
    <button class="btn btn-neutral" @click="nextQuestion" :disabled="questionCorrect === undefined">Következő kérdés</button>
  </div>
</section>

<section v-else>
  <div class="card card-sm">
    <div class="card-title">Teszt vége</div>
    <div class="card-body">
      <p>Jó válaszok száma: {{ correctAnswers }}</p>
      <p>Helytelen válaszok száma: {{ incorrectAnswers }}</p>
    </div>
    <div class="card-actions">
      <button class="btn btn-neutral" @click="resetState">Újrakezdés</button>
    </div>
  </div>
</section>

</template>

<script setup lang="ts">

import type { Question } from '@/types/types';
import questions from '@/assets/data/data.json';
import { ref, computed } from 'vue';
import BoolQuestion from './components/BoolQuestion.vue';
import MultiQuestion from './components/MultiQuestion.vue';

const mode = ref<'timechallenge' | 'zen'>();
const isFinish = ref(false);

const timeLeft = ref<number>();
const timer = ref<ReturnType<typeof setInterval>>();


const dateFormatter = new Intl.DateTimeFormat('hu-HU', {
  minute: '2-digit',
  second: '2-digit'
})
const timeLeftFormatted = computed(() => {
  if (!timeLeft.value) {
    return ''
  }

  return dateFormatter.format(timeLeft.value)
})

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const resetScore = function() {
  correctAnswers.value = 0;
  incorrectAnswers.value = 0;
}

const currentIndex = ref(0);
const currentQuestion = computed<Question | undefined>(() => {
  return questions?.[questionnaire.value?.[currentIndex.value] ?? 0];
});
const questionCount = questions.length;
const questionnaireLength = 30;
const questionnaire = ref<number[]>([]);
const questionCorrect = ref<boolean>();

const clearTimers = function() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = undefined;
  }
  timeLeft.value = undefined;
}

const resetState = () => {
  questionCorrect.value = undefined;
  currentIndex.value = 0;
  questionnaire.value = [];
  mode.value = undefined;
  isFinish.value = false;
  clearTimers();  
  resetScore();

}

const generateQuestionnaire = function() {
  if(questionnaire.value.length === questionnaireLength) {
    return
  }
  const idx = Math.floor(Math.random() * questionCount);
  if (!questionnaire.value.includes(idx)) {
    questionnaire.value.push(idx);
  }  
  return generateQuestionnaire();
}

const setupZenMode = function() {
  resetState();
  generateQuestionnaire();
  mode.value = 'zen';
}

const finishChallenge = function () {
  clearTimers();
  isFinish.value = true;
}

const setupTimeChallenge = function() {
  resetState();
  generateQuestionnaire();
  mode.value = 'timechallenge';

  timeLeft.value = 40 * 60000;
  timer.value = setInterval(() => {
    timeLeft.value -= 1000
    if(timeLeft.value <= 0) {
      finishChallenge();
    }
  }, 1000)

}


const validateAnswer = (answer: number | number[]) => {
  if (currentQuestion.value?.type === 'bool') {
    const correct = currentQuestion.value.answers[answer as number]?.value
    questionCorrect.value = correct;
    if (correct) {
      correctAnswers.value += 1;
    } else {
      incorrectAnswers.value += 1;
    }

  }
  else {
    const correct = (answer as number[]).every(a => currentQuestion.value?.answers[a]?.value)
    questionCorrect.value = correct
    if (correct) {
      correctAnswers.value += 1;
    } else {
      incorrectAnswers.value += 1;
    }
  }
}

const nextQuestion = function() {
  currentIndex.value += 1;
  if (currentIndex.value + 1 > questionnaireLength) {
    finishChallenge();
  }
  questionCorrect.value = undefined;
}

</script>
