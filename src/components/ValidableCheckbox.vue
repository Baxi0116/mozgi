<template lang=html>

<div class="flex items-center justify-items-start gap-x-4"">
	<input class="checkbox" :class="additionalClasses" :id="id" type="checkbox" v-model="selectedAnswer" :value="index">
	<label class="label" :for="id">{{ answer.text }}</label>
</div>
</template>

<script setup lang="ts">
import type { Question } from '@/types/types';
type Props = {
	id: string
	answer: Question['answers'][number];
	correct?: boolean;
}

defineProps<Props>()
</script>


