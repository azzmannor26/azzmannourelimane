<template>
  <div class="bg-orange-50 min-h-screen">
    <nav>
      <navigationn
        @open-modal="openLoginModal"
        @toggle-theme="toggleTheme"
        class="mb-20"
      />
      <logina v-if="showLoginModal" @close-modal="closeLoginModal" />
    </nav>

    <loading v-if="isLoading" position="center" />
    <main v-else>
      <div
        v-if="workshop"
        class="workshop-detail mx-auto"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div class="flex">
          <img class="side-image mr-10" src="@/assets/istockphoto-1172681503-612x612.jpg" alt="Side Image" />
          <div class="workshop-content">
            <h1>{{ workshop.titre }}</h1>
            <img :src="workshop.thumbnail" alt="Workshop Thumbnail" />
            <p>{{ workshop.description }}</p>
            <ul>
              <li><strong>ID:</strong> {{ workshop.id }}</li>
              <li>
                <strong>Administrateur ID:</strong> {{ workshop.administrateur_id }}
              </li>
              <li><strong>Age Min:</strong> {{ workshop.age_min }}</li>
              <li><strong>Age Max:</strong> {{ workshop.age_max }}</li>
              <li>
                <strong>Type d'Activité:</strong> {{ workshop.type_activite }}
              </li>
              <li><strong>Effectif Min:</strong> {{ workshop.eff_min }}</li>
              <li><strong>Effectif Max:</strong> {{ workshop.eff_max }}</li>
              <li><strong>Nom:</strong> {{ workshop.nom }}</li>
              <li><strong>Catégorie:</strong> {{ workshop.categorie }}</li>
              <li><strong>Service:</strong> {{ workshop.service }}</li>
              <li>
                <strong>Photo:</strong>
                <img :src="workshop.photo" alt="Workshop Photo" />
              </li>
              <li>
                <strong>Mode de Réalisation:</strong>
                {{ workshop.mode_de_realisation }}
              </li>
              <li>
                <strong>Nombre de Séances:</strong> {{ workshop.nbre_seance }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Add Mapbox Map section -->
      <div class="map-section mt-10 flex max-w-screen-lg mx-auto mb-20">
        <div class="map-text flex-1 p-4 bg-white rounded-lg bg-transparent shadow-md mr-4">
          <h2 class="text-xl font-semibold mb-4">Explore this workshop location</h2>
          <p>Discover the nearby football fields, schools, and activity places in the vicinity of this workshop.</p>
        </div>
        <div class="map-container flex-1 p-4 bg-white rounded-lg shadow-md">
          <MapboxMapVue />
        </div>
      </div>

      <div class="flex-container max-w-screen-lg mx-auto">
        <div class="related-activities">
          <h1 class="text-title">
            Check
            <span
              class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600"
              >Related Activities</span
            >
          </h1>
          <div class="related-workshops">
            <WorkshopCard
              v-for="relatedWorkshop in relatedWorkshops"
              :key="relatedWorkshop.id"
              :workshop="relatedWorkshop"
              data-aos="flip-left"
              data-aos-duration="2000"
            />
          </div>
        </div>

        <div class="related-offers">
          <h1 class="text-title">
            Check
            <span
              class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600"
              >Related Offers</span
            >
          </h1>
          <!-- Add your related offers content here -->
        </div>
      </div>

      <h1 class="flex items-center text-5xl mb-10 font-extrabold dark:text-white mx-auto mt-20 max-w-screen-lg">
        Reviews
        <span
          class="bg-blue-100 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2"
          >Verified</span
        >
      </h1>

      <!-- Add new review form -->
      <div class="review-form bg-white p-4 rounded-lg shadow-md mx-auto mb-10 max-w-screen-lg" data-aos="zoom-in-down">
        <h2 class="text-xl font-semibold mb-4">Add a Review</h2>
        <form @submit.prevent="submitReview">
          <div class="mb-4">
            <label for="review-description" class="block mb-2">Your Review</label>
            <textarea
              v-if="isAuthenticated"
              v-model="reviewDescription"
              id="review-description"
              class="w-full p-2 border h-40 border-gray-300 rounded"
              required
            ></textarea>
            <input
              v-else
              type="text"
              placeholder="Only parents are allowed to leave a review."
              class="input input-bordered w-full "
              disabled
            />
          </div>
          <div class="mb-4">
            <label for="review-rating" class="block mb-2">Rating</label>
            <div class="rating" id="review-rating">
              <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" value="1" v-model="reviewRating" />
              <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" value="2" v-model="reviewRating" />
              <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" value="3" v-model="reviewRating" />
              <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" value="4" v-model="reviewRating" />
              <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" value="5" v-model="reviewRating" />
            </div>
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="!isAuthenticated">
            Submit Review
          </button>
        </form>
      </div>

      <div v-if="reviews.length" class="reviews-container bg-orange-50 mx-auto max-w-screen-lg mb-2">
        <article v-for="review in reviews" :key="review.id" class="review-item mb-8 p-4 rounded-lg bg-white bg-opacity-50 shadow-md" data-aos="zoom-out-right">
          <div class="flex items-center mb-4">
            <img class="w-10 h-10 me-4 rounded-full" :src="getUserAvatar(review.parental_id)" alt="User Avatar">
            <div class="font-medium dark:text-white">
              <p>{{ getUserName(review.parental_id) }} <time :datetime="getUserCreatedAt(review.parental_id)" class="block text-sm text-gray-500 dark:text-gray-400">Joined on {{ formatDate(getUserCreatedAt(review.parental_id)) }}</time></p>
            </div>
          </div>
          <div class="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
            <svg v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= review.rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
          </div>
          
          <footer class="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Reviewed on <time :datetime="review.created_at">{{ formatDate(review.created_at) }}</time></p></footer>
          <p class="mb-2 text-gray-500 dark:text-gray-400">{{ review.description }}</p>
        </article>

      </div>
    </main>
  </div>
  <foooter/>
</template>

<script setup>
import navigationn from "@/components/navigation.vue";
import logina from "@/components/log-in.vue";
import loading from "@/components/loadinga.vue";
import WorkshopCard from "@/components/workshopcard.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import axios from "axios";
import MapboxMapVue from "@/components/MapboxMap.vue";
import foooter from "@/components/foooter.vue";

const store = useStore();
const route = useRoute();
const workshop = ref(null);
const relatedWorkshops = ref([]);
const reviews = ref([]);
const isLoading = ref(true);
const showLoginModal = ref(false);
const reviewDescription = ref('');
const reviewRating = ref(1);

const isAuthenticated = store.getters.isAuthenticated;

const openLoginModal = () => {
  showLoginModal.value = true;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const fetchWorkshopDetails = async (id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/activites/${id}`
    );
    workshop.value = response.data;
    await fetchRelatedWorkshops(response.data.type_activite);
    await fetchReviews(response.data.id);
  } catch (error) {
    console.error("Failed to fetch workshop details:", error);
  }
};

const fetchRelatedWorkshops = async (typeActivite) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/activites?type_activite=${typeActivite}`
    );
    relatedWorkshops.value = response.data.filter(
      (item) => item.id !== workshop.value.id
    );
  } catch (error) {
    console.error("Failed to fetch related workshops:", error);
  }
};

const fetchReviews = async (workshopId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/parentals/${workshop.value.administrateur_id}/activites/${workshopId}/reviews`
    );
    reviews.value = response.data;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

const getUserAvatar = (userId) => {
  return `/api/parentals/${userId}/avatar`; // Placeholder, adjust as necessary
};

const getUserName = async (userId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`);
    return response.data.name;
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    return `User ${userId}`;
  }
};

const getUserCreatedAt = async (userId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`);
    return response.data.created_at;
  } catch (error) {
    console.error("Failed to fetch user creation date:", error);
    return `2021-01-01`; // Fallback date
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const submitReview = async () => {
  try {
    const reviewData = {
      description: reviewDescription.value,
      rating: reviewRating.value,
    };
    const response = await axios.post(
      `http://127.0.0.1:8000/api/parentals/${store.getters.parentId}/activites/${workshop.value.id}/reviews`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${store.getters.token}`
        }
      }
    );
    reviews.value.push(response.data);
    reviewDescription.value = '';
    reviewRating.value = 1;
  } catch (error) {
    console.error("Failed to submit review:", error);
  }
};

onMounted(async () => {
  const id = route.params.id;
  await fetchWorkshopDetails(id);
  setTimeout(() => {
    isLoading.value = false;
  }, 600);
});

watch(route, async (newRoute) => {
  const id = newRoute.params.id;
  isLoading.value = true;
  await fetchWorkshopDetails(id);
  setTimeout(() => {
    isLoading.value = false;
  }, 600);
});
</script>

<style scoped>
.workshop-detail {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

li strong {
  display: inline-block;
  width: 150px;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
}

.related-activities,
.related-offers {
  flex: 1;
}

.text-title {
  margin-bottom: 1rem;
  margin-top: 0;
  text-align: center;
  font-size: 2rem;
}

.related-workshops {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.reviews-container {
  margin-top: 2rem;
}

.review-item {
  background: rgba(255, 255, 255, 0.9); /* Low opacity white background */
  border-radius: 30px;
  padding: 1rem;
}

.review-form {
  background: rgba(255, 255, 255, 0.9); /* Low opacity white background */
  border-radius: 30px;
  padding: 1rem;
}



@media screen and (max-width: 768px) {
  .flex-container {
    flex-direction: column;
  }

  .related-workshops {
    grid-template-columns: 1fr;
  }
}
</style>
