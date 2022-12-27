<template>
  <div>
    <div
      class="d-flex justify-content-center align-items-center row no-gutters text-light"
    >
      <TheStudentList
          v-if="student_data"
        :student_data="student_data"
        :update="true"
        @updateStudent="openUpdateStudentModal"
        @deleteStudent="deleteStudent"
      />
      <div class="col-12 col-md-10 col-lg-8 mt-5">
        <button class="btn btn-primary" @click="openCreateStudentModal">
          Create New Student
        </button>
      </div>
    </div>
    <TheStudentModal
      v-if="studentModal.show"
      @close="studentModal.show = false"
      @createNewStudent="createNewStudent"
      @updateStudent="updateStudent"
      :config="studentModal"
      :action="studentModal.action"
      :key="studentModal.selector"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TheStudentManagement",
  data() {
    return {
      student_data: [],
      studentModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
        action: null,
      },
    };
  },
  components: {
    TheStudentList: () => import("@/components/students/TheStudentList.vue"),
    TheStudentModal: () => import("@/components/students/TheStudentModal.vue"),
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
      this.studentModal.data = student;
      this.studentModal.action = "update";
      this.studentModal.show = true;
    },
    openCreateStudentModal() {
      this.studentModal.action = "create";
      this.studentModal.show = true;
    },
    createNewStudent(student) {
      axios
        .post("http://localhost:3000/students", student)
        .then((response) => {
          console.log(response);
          this.$toast.open({
            message: "Successfully Created!",
            type: "success",
            duration: 5000,
            dismissible: true,
            position: "top-right",
          });
          this.initialize();
        })
        .catch((e) => console.error(e));
    },
    updateStudent(student) {
      axios
        .patch(
          `http://localhost:3000/students/${student.student_number}`,
          student.form_data
        )
        .then((response) => {
          console.log(response);
          this.$toast.open({
            message: "Successfully Updated!",
            type: "success",
            duration: 5000,
            dismissible: true,
            position: "top-right",
          });
          this.initialize();
          this.studentModal.show = false;
        })
        .catch((e) => console.error(e));
    },
    deleteStudent(student) {
      axios
        .delete(`http://localhost:3000/students/${student._id}`)
        .then((response) => {
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
        .catch((e) => console.error(e));
    },
  },
};
</script>

<style scoped></style>
