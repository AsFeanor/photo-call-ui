<template>
  <div>
    <div class="d-flex justify-content-center align-items-center row no-gutters text-light">
      <div class="col-12 col-md-10 col-lg-8 mt-5 text-light">
        <h5>Courses:</h5>
        <ul class="list-group">
          <li
              v-for="(course, key) in courses"
              :key="key"
              class="list-group-item d-flex justify-content-between"
              :class="allStudents.length > 0 ? 'mouse-click' : 'mouse-no-click'"
              @click.self="allStudents.length > 0 ? openUpdateCourseModal(course) : ''"
          >
            <span>{{ course.name }}</span>
            <span>
            <button class="btn btn-outline-danger" @click.self="deleteCourse(course._id)">Delete Course</button>
          </span>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-10 col-lg-8 mt-5">
        <button class="btn btn-primary" @click="openCreateCourseModal">
          Create New Course
        </button>
      </div>
    </div>
    <the-course-modal
        v-if="courseModal.show"
        @close="courseModal.show = false"
        :config="courseModal"
        :action="courseModal.action"
        :key="courseModal.selector"
        @removeStudent="removeStudentFromCourse"
        @addStudents="openAddStudentsModal"
        @createCourse="createNewCourse"
        @updateCourse="updateCourse"
    />
    <add-student-to-course-modal
        v-if="addStudentModal.show"
        @close="addStudentModal.show = false"
        :config="addStudentModal.data"
        :key="addStudentModal.selector"
        @addStudents="addStudentsToCourse"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TheCourseManagement",
  data() {
    return {
      courses: [],
      allStudents: [],
      courseModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
        action: null,
      },
      addStudentModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
      },
    };
  },
  components: {
    TheCourseModal: () => import('@/components/courses/TheCourseModal.vue'),
    AddStudentToCourseModal: () => import("@/components/courses/AddStudentToCourseModal.vue"),
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      Promise.all([
          this.getCourses(),
          this.getStudents(),
      ])
    },
    getCourses() {
      axios.get('http://localhost:3000/courses').then((response) => {
        this.courses = response.data;
      });
    },
    getStudents() {
      axios
          .get(`http://localhost:3000/students`)
          .then((response) => {
            {
              this.allStudents = response.data;
            }
          })
          .catch((e) => console.error(e));
    },
    openUpdateCourseModal(course) {
      this.courseModal.data = { ...course, allStudents: this.allStudents};
      this.courseModal.action = 'update';
      this.courseModal.show = true;
    },
    openCreateCourseModal() {
      this.courseModal.data = { allStudents: this.allStudents };
      this.courseModal.action = 'create';
      this.courseModal.show = true;
    },
    openAddStudentsModal(course) {
      this.addStudentModal.data = {
        students: this.allStudents,
        courseStudents: course.students,
        courseId: course._id,
      };
      this.addStudentModal.show = true;
    },
    addStudentsToCourse(data) {
      axios
          .patch(
              `http://localhost:3000/courses/${data.courseId}/add_students`,
              { studentIds: data.selectedStudents }
          )
          .then((response) => {
            console.log(response);
            this.$toast.open({
              message: "Successfully Added!",
              type: "success",
              duration: 5000,
              dismissible: true,
              position: "top-right",
            });
            this.addStudentModal.show = false;
            this.courseModal.show = false;
            this.initialize();
          });
    },
    removeStudentFromCourse(data) {
      axios.patch(`http://localhost:3000/courses/${data.course._id}/remove_student`, { studentId: data.student_id }).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Removed!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.initialize();
      })
    },
    createNewCourse(payload) {
      axios.post('http://localhost:3000/courses', { ...payload }).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Created!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.initialize();
        this.courseModal.show = false;
      })
    },
    updateCourse(payload) {
      axios.patch(`http://localhost:3000/courses/${payload.course_id}`, { ...payload.data }).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Updated!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.initialize();
        this.courseModal.show = false;
      })
    },
    deleteCourse(courseId) {
      axios.delete(`http://localhost:3000/courses/${courseId}`).then((response) => {
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
    },
  },
}
</script>

<style scoped>
  .mouse-click:hover {
    opacity: .8;
  }
</style>