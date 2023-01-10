<template>
  <div>
    <div class="d-flex justify-content-center align-items-center row no-gutters text-light">
      <div class="col-12 col-md-10 mt-5 text-light col-lg-8">
        <h5>Lecturers:</h5>
        <ul class="list-group">
          <li
              v-for="(lecturer, key) in lecturer_data"
              :key="key"
              class="list-group-item d-flex justify-content-between mouse-click"
              @click.self="openUpdateLecturerModal(lecturer)"
          >
            <span>{{ lecturer.name }}</span>
            <span>
              <button class="btn btn-outline-danger" @click.self="deleteLecturer(lecturer)">Delete Lecturer</button>
            </span>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-10 col-lg-8 mt-5">
        <button class="btn btn-primary" @click="openCreateLecturerModal">
          Create New Lecturer
        </button>
      </div>
    </div>
    <TheLecturerModal
        v-if="lecturerModal.show"
        @close="lecturerModal.show = false"
        @createNewLecturer="createNewLecturer"
        @updateLecturer="updateLecturer"
        :config="lecturerModal"
        :action="lecturerModal.action"
        :key="lecturerModal.selector"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TheLecturerManagement",
  data() {
    return {
      lecturer_data: [],
      lecturerModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
        action: null,
      },
    };
  },
  components: {
    TheLecturerModal: () => import('@/components/TheLecturerModal.vue'),
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      axios.get('http://localhost:3000/lecturers').then((response) => {
        console.log(response);
        this.lecturer_data = response.data.filter(x => x.isSuperUser === false);
      })
    },
    openCreateLecturerModal() {
      this.lecturerModal.action = "create";
      this.lecturerModal.show = true;
    },
    openUpdateLecturerModal(lecturer) {
      this.lecturerModal.data = lecturer;
      this.lecturerModal.action = "update";
      this.lecturerModal.show = true;
    },
    createNewLecturer(lecturer) {
      axios.post('http://localhost:3000/lecturers', lecturer).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Created!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.lecturerModal.show = false;
        this.initialize();
      });
    },
    updateLecturer(lecturer) {
      axios.patch(`http://localhost:3000/lecturers/${lecturer.lecturerId}`, lecturer.data).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Updated!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.lecturerModal.show = false;
        this.initialize();
      });
    },
    deleteLecturer(lecturer) {
      const lecturerId = lecturer._id;
      axios.delete(`http://localhost:3000/lecturers/${lecturerId}`).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Deleted!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.initialize();
      })
    }
  },
}
</script>

<style scoped>
.mouse-click:hover {
  opacity: .8;
}
</style>