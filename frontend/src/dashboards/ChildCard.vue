<template>
  <div class="child-card">
    <div class="child-info">
      <h2>{{ child.nom }} {{ child.prenom }}</h2>
      <p>Gender: {{ child.genre || 'N/A' }}</p>
    </div>
    <img :src="imageURL" alt="Child Image" class="child-image" />
    
      <button @click="deleteChild" class="btn-delete text-orange-700">
        <box-icon type='solid' name='x-circle'></box-icon>
      </button>
      <button @click="openUpdateModal" class="btn-update">
        <box-icon name='pencil'></box-icon>
      </button>
   
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageURL() {
      // Assuming the photo URL is a full URL, otherwise adjust accordingly
      return this.child.photo;
    }
  },
  methods: {
    deleteChild() {
      this.$emit('delete-child', this.child.id);
    },
    openUpdateModal() {
      this.$emit('update-child', this.child);
    }
  }
}
</script>

<style scoped>
.child-card {
  border: 1px solid #ddd;
  border-radius: 30px; /* Rounded corners */
  padding: 32px; /* Increased padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px; /* Increased bottom margin */
  background-color: #f3f4f6; /* Light gray background */
  text-align: center;
  width: 200px; /* Set a fixed width for the card */
  flex: 0 0 auto; /* Prevent cards from shrinking */
  position: relative; /* For positioning the buttons */
}

.child-image {
  width: 100px; /* Increased width */
  height: 100px; /* Increased height */
  border-radius: 50%;
  margin-top: 16px; /* Top margin for vertical alignment */
}

.child-info {
  margin-bottom: 16px; /* Space between text and image */
}


.btn-delete, .btn-update {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
