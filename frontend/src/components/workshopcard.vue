<template>
  <div class="card" v-if="workshop" @click="navigateToDetail(workshop)">
    <div class="flex">
      <img :src="workshop.thumbnail" alt="Workshop Thumbnail">
      <h5 class="card-text">{{ workshop.titre }}</h5>
      <div class="genre card-text">{{ workshop.type_activite }}</div>
    </div>
    <div class="description card-text">{{ workshop.description }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  workshop: Object
});

const router = useRouter();

const navigateToDetail = (workshop) => {
  if (workshop && workshop.id) {
    router.push(`/activities/${workshop.id}`);
  } else {
    console.error('Workshop ID not found');
  }
};
</script>

<style scoped>
.card {
  padding: 0.7rem;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border: 1px solid rgba(2, 28, 62, .03);
  box-shadow: 20px 2px 25px rgba(2, 129, 255, .03);
  gap: 1rem;
  cursor: pointer;
  text-align: left;
}

.card-text {
  padding: 0 0.5rem;
}

img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
  transition: 0.3s;
  height: 350px;
}

h5.card-text {
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 1rem;
  padding-bottom: 0.2rem;
}

.genre {
  font-size: 0.9rem;
}

.description {
  font-size: 0.9rem;
}

.flex {
  display: flex;
  flex-direction: column;
}

.card:hover img {
  transform: scale(1.15) translateY(-30px);
  box-shadow: 3px 2px 25px rgba(2, 129, 255, .03);
}
</style>
