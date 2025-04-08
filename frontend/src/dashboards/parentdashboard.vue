<template>
  <navigation />
  <div class="bg-orange-50">
    <div class="page-container bg-orange-50 p-6 mx-6">
      <div class="parent-container">
        <div class="greeting mt-10">
          <h1 class="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            Hi 
            <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {{ userName }}
            </span>
            <br>See what's up for today<br>Manage your kids' activities<br> easily and stress-free
          </h1>
        </div>
        <div class="cards-container">
          <AddChildCard @add-child="openAddChildForm" />
          <ChildCard
            v-for="child in children"
            :key="child.id"
            :child="child"
            @delete-child="deleteChild"
            @update-child="openUpdateModal"
            data-aos="flip-down"
            data-aos-duration="2000"
          />
        </div>
      </div>
    </div>

    <!-- Calendar -->
     <h1 class="ml-20 mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-2xl">Workshops Calendar</h1>
    <div id="calendar" class=" m-10 calendar-wrapper sx-vue-calendar-wrapper"></div>

    <!-- Notification -->
    <div v-if="showNotification" class="alert shadow-lg fixed bottom-4 right-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <h3 class="font-bold">{{ notificationTitle }}</h3>
        <div class="text-xs">{{ notificationMessage }}</div>
      </div>
      <button @click="showNotification = false" class="btn btn-sm">Close</button>
    </div>

    <!-- Add Child Modal -->
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <span class="close" @click="closeAddChildForm">&times;</span>
        <h3 class="font-bold text-lg">Add New Child</h3>
        <form @submit.prevent="submitAddChild">
          <input v-model="newChild.nom" type="text" class="h-10 m-5" placeholder="Last Name" required />
          <input v-model="newChild.prenom" type="text" class="h-10 m-5" placeholder="First Name" required />
          <input v-model="newChild.date_naissance" type="date" class="h-10 m-5" placeholder="Date of Birth" required />
          <input v-model="newChild.genre" type="text" class="h-10 m-5" placeholder="Gender" required />
          <input v-model="newChild.photo" type="text" class="h-10 m-10" placeholder="Photo URL" required />
          <div class="modal-action">
            <button type="submit" class="btn btn-dark-blue">Add Child</button>
            <button type="button" class="btn" @click="closeAddChildForm">Close</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Edit Child Modal -->
    <dialog id="edit_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <span class="close" @click="closeEditChildForm">&times;</span>
        <h3 class="font-bold text-lg">Edit Child</h3>
        <form @submit.prevent="submitEditChild">
          <input v-model="editChild.nom" type="text" class="h-10 m-5" placeholder="Last Name" required />
          <input v-model="editChild.prenom" type="text" class="h-10 m-5" placeholder="First Name" required />
          <input v-model="editChild.date_naissance" type="date" class="h-10 m-5" placeholder="Date of Birth" required />
          <input v-model="editChild.genre" type="text" class="h-10 m-5" placeholder="Gender" required />
          <input v-model="editChild.photo" type="text" class="h-10 m-10" placeholder="Photo URL" required />
          <div class="modal-action">
            <button type="submit" class="btn btn-dark-blue">Update Child</button>
            <button type="button" class="btn" @click="closeEditChildForm">Close</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ChildCard from './ChildCard.vue';
import AddChildCard from './AddChildCard.vue';
import axios from 'axios';
import Navigation from '@/components/navigation.vue';
import { createCalendar, viewDay, viewWeek, viewMonthGrid, viewMonthAgenda } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';

export default {
  components: {
    ChildCard,
    AddChildCard,
    Navigation
  },
  data() {
    return {
      newChild: {
        nom: '',
        prenom: '',
        date_naissance: '',
        genre: '',
        photo: ''
      },
      editChild: {
        id: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        genre: '',
        photo: ''
      },
      showNotification: false,
      notificationTitle: '',
      notificationMessage: '',
      calendar: null,
      calendarRef: null,
      events: [] // Store events directly here
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      parentId: 'parentId',
      children: 'children'
    }),
    userName() {
      return this.currentUser ? this.currentUser.name : 'Guest';
    }
  },
  methods: {
    ...mapActions(['fetchChildren']),
    openAddChildForm() {
      document.getElementById('my_modal_5').showModal();
    },
    closeAddChildForm() {
      document.getElementById('my_modal_5').close();
      this.resetNewChildForm();
    },
    resetNewChildForm() {
      this.newChild = {
        nom: '',
        prenom: '',
        date_naissance: '',
        genre: '',
        photo: ''
      };
    },
    openUpdateModal(child) {
      this.editChild = { ...child };
      document.getElementById('edit_modal').showModal();
    },
    closeEditChildForm() {
      document.getElementById('edit_modal').close();
      this.resetEditChildForm();
    },
    resetEditChildForm() {
      this.editChild = {
        id: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        genre: '',
        photo: ''
      };
    },
    async submitAddChild() {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/parentals/${this.parentId}/enfants`, this.newChild, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        });
        this.children.push(response.data);
        this.closeAddChildForm();
        this.showNotificationMessage('Child Added', 'The child was added successfully.');
      } catch (error) {
        console.error('Failed to add child:', error);
        console.error('Error details:', error.response ? error.response.data : error.message);
      }
    },
    async deleteChild(childId) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/parentals/${this.parentId}/enfants/${childId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        });
        this.children = this.children.filter(child => child.id !== childId);
        this.showNotificationMessage('Child Deleted', 'The child was deleted successfully.');
      } catch (error) {
        console.error('Failed to delete child:', error);
      }
    },
    async submitEditChild() {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/parentals/${this.parentId}/enfants/${this.editChild.id}`, this.editChild, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`
          }
        });
        const index = this.children.findIndex(c => c.id === this.editChild.id);
        if (index !== -1) {
          this.children.splice(index, 1, response.data);
        }
        this.closeEditChildForm();
        this.showNotificationMessage('Child Updated', 'The child was updated successfully.');
      } catch (error) {
        console.error('Failed to update child:', error);
      }
    },
    showNotificationMessage(title, message) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    async fetchAndDisplayEvents() {
      try {
        console.log('Fetching data...');
        const horairesResponse = await axios.get('http://127.0.0.1:8000/api/horaires');
        const activitesResponse = await axios.get('http://127.0.0.1:8000/api/activites');

        console.log('Data fetched:', { horaires: horairesResponse.data, activites: activitesResponse.data });

        const activites = activitesResponse.data;

        const activiteEvents = await Promise.all(
          activites.map(async (activite) => {
            const activiteHorairesResponse = await axios.get(
              `http://127.0.0.1:8000/api/activites/${activite.id}/horaires`
            );
            const activiteHoraires = activiteHorairesResponse.data;

            return activiteHoraires.map((horaire) => ({
              id: horaire.id,
              title: activite.nom,
              start: this.formatDateAndTime(this.getDateOfNext(horaire.jour), horaire.heure_debut),
              end: this.formatDateAndTime(this.getDateOfNext(horaire.jour), horaire.heure_fin),
            }));
          })
        );

        this.events = activiteEvents.flat();
        console.log('All events:', this.events);

        this.initializeCalendar();
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    getDateOfNext(dayName) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayIndex = daysOfWeek.indexOf(dayName);
      const todayIndex = new Date().getDay();
      const dayOffset = (dayIndex + 7 - todayIndex) % 7;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + dayOffset);
      return nextDate.toISOString().split('T')[0];
    },
    formatDateAndTime(date, time) {
      const formattedTime = time.substring(0, 5); // 'HH:mm:ss' -> 'HH:mm'
      return `${date} ${formattedTime}`;
    },
    initializeCalendar() {
      this.calendar = createCalendar({
        views: [viewMonthGrid, viewMonthAgenda, viewWeek, viewDay],
        datePicker: {
          selectedDate: new Date().toISOString().split('T')[0],
        },
        defaultView: viewWeek.name,
        events: this.events,
        plugins: [createDragAndDropPlugin(), createEventModalPlugin()],
      });

      if (this.calendarRef) {
        this.calendar.render(this.calendarRef);
        console.log('Calendar rendered.');
      } else {
        throw new Error('Calendar element is not available');
      }
    },
  },
  mounted() {
    this.calendarRef = document.getElementById('calendar');
    this.fetchAndDisplayEvents();
    if (this.currentUser) {
      this.fetchChildren();
    }
  }
};
</script>

<style scoped>
.parent-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
}

.greeting {
  flex-shrink: 0;
}

.cards-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.child-card {
  flex: 0 0 auto;
}

.alert {
  display: flex;
  align-items: center;
  background-color: #fefcbf;
  border: 1px solid #fbd38d;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.alert svg {
  margin-right: 8px;
}

.alert .btn {
  margin-left: auto;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content form input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
}

.modal-content form button {
  margin-bottom: 10px;
}

.btn {
  background: #000000;
  border: none;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.btn:hover {
  background: #ea580c;
}

.btn-dark-blue {
  background: #1e3a8a;
}

.btn-dark-blue:hover {
  background: #1e40af;
}

.sx-vue-calendar-wrapper {
  margin-left: 10px;
  width: 60%;
  height: 500px;
  max-height: 90vh;
  margin-top: 20px; /* Add some spacing between calendar and the rest of the content */
}
</style>
