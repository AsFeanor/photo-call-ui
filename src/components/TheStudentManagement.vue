<template>
  <div>
    <div class="d-flex justify-content-center align-items-center row no-gutters">
      <TheStudentList :student_data="student_data" :update="true" @updateStudent="openUpdateStudentModal"/>
    </div>
    <TheUpdateStudentModal v-if="updateStudentModal.show" @close="updateStudentModal.show = false" :config="updateStudentModal.data" :key="updateStudentModal.selector"/>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TheStudentManagement",
  data() {
    return {
      student_data: [],
      updateStudentModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
      },
    };
  },
  components: {
    TheStudentList: () => import("@/components/students/TheStudentList.vue"),
    TheUpdateStudentModal: () => import('@/components/students/TheUpdateStudentModal.vue'),
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      axios
        .get("http://localhost:3000/students")
        .then((response) => (this.student_data = response.data))
        .catch((e) => console.error(e));
    },
    openUpdateStudentModal(student) {
      this.updateStudentModal.data = student;
      this.updateStudentModal.show = true;
    },
  },
};
</script>

<style scoped></style>
