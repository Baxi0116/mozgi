<template lang="html">
<div class="card w-full">
	<h3 class="card-title">{{ question.question }}</h3>

	<section class="card-body">
		<div class="flex items-center justify-items-start gap-x-4" v-for="(answer, index) in question.answers" :key="`answer-${index}`">
			<input
				class="checkbox"
				:class="{ 'checkbox-error': correct === false && !answer.value, 'checkbox-success': correct !== undefined && answer.value }"
				:id="`answer-${index}`"
				type="checkbox"
				v-model="selectedAnswer"
				:value="index">
			<label :for="`answer-${index}`">{{ answer.text }}</label>
		</div>
	</section>
	<section class="card-actions">
		<button v-if="correct === undefined" class="btn btn-secondary" @click="onSubmitAnswer" :disabled="selectedAnswer === undefined">Ellenőriz</button>
		<div v-if="correct" class="badge badge-soft badge-success">Siker 🥳</div>
		<div v-if="correct === false" class="badge badge-soft badge-error">Nem nyert 😔</div>
	</section>
</div>
</template>

<script setup lang="ts">
import type { Question } from '@/types/types';
import { ref } from 'vue';


type Props = {
	question: Question;
	correct?: boolean
}

defineProps<Props>();

const emit = defineEmits<{
	submitAnswer: [number[]];
}>()

const selectedAnswer = ref<number[]>([]);

const onSubmitAnswer = () => {
	if (selectedAnswer.value.length === 0) {
		return
	}

	emit('submitAnswer', selectedAnswer.value)
}

</script>
