<template v-if="attendanceList && studentList">
  <div class="container text-light">
    <div class="row no-gutters w-100">
      <div class="col-10 mt-5" v-if="selectedCourse && selectedCourse.name">
        <h1>{{ selectedCourse.name }}</h1>
      </div>
      <div class="col-2 d-flex justify-content-end align-items-center mt-5">
        <span class="mr-2">Total Sessions: </span>
        <span>{{ attendanceList.length }}</span>
      </div>
      <div class="col-12 mt-5">
        <h5>Students:</h5>
        <ul class="list-group student-item pc-scroll-style">
          <li
            v-for="(student, key) in studentList"
            :key="key"
            class="list-group-item d-flex justify-content-between"
          >
            <span>{{ student.name }}</span>
            <div>
              <span>
                Not Attended: {{ attendanceList.length - attendanceCount.filter((x) => x === student._id).length }} / {{ attendanceList.length }}
              </span>
              <button class="btn btn-outline-danger ml-3" @click.self="removeStudentFromCourse(student._id)">Remove Student</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-12 mt-2" v-if="allStudents.length !== studentList.length">
        <div class="row no-gutters w-100 d-flex justify-content-end">
          <div class="col-3 d-flex justify-content-end">
            <button
              class="btn btn-primary pc-border-radius"
              :disabled="allStudents.length === 0"
              @click="openAddStudentsModal"
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 mt-5">
        <div class="row no-gutters w-100 d-flex justify-content-center">
          <div
            class="col-4 p-2 course-sessions pc-border-radius pc-scroll-style"
          >
            <h5>Course Sessions:</h5>
            <ul class="list-group pc-border-radius">
              <li
                v-for="(attendance, key) in attendanceList"
                :key="key"
                class="list-group-item attendance-item pc-border-radius d-flex justify-content-center my-2"
                @click="openAttendanceDialog(attendance)"
              >
                <span>{{ uiDateFormat(attendance.session, true) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <the-attendance-modal
      v-if="attendanceDialog.show"
      @close="attendanceDialog.show = false"
      :config="attendanceDialog.data"
      :key="attendanceDialog.selector"
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
import { uiDateFormat } from "@/services/dates.services";

export default {
  name: "TheAttendanceList",
  data() {
    return {
      selectedCourse: null,
      studentList: [],
      attendanceList: [],
      attendanceCount: null,
      allStudents: [],
      attendanceDialog: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
      },
      addStudentModal: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
      },
    };
  },
  components: {
    TheAttendanceModal: () => import("@/components/TheAttendanceModal.vue"),
    AddStudentToCourseModal: () => import("@/components/courses/AddStudentToCourseModal.vue"),
  },
  computed: {
    courseId() {
      return this.$route.query.selectedCourse;
    },
  },
  created() {
    this.getAttendanceList();
    this.getStudents();
  },
  methods: {
    uiDateFormat,
    getAttendanceList() {
      axios
        .get(`http://localhost:3000/courses/${this.courseId}/list`)
        .then((response) => {
          this.selectedCourse = response.data;
          this.initAttendanceList();
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
    initAttendanceList() {
      this.studentList = this.selectedCourse.students;
      this.attendanceList = this.selectedCourse.attendance;
      this.attendanceCount = this.attendanceList
        .map((x) => x.students)
        .flat()
        .map((x) => x._id);
    },
    openAttendanceDialog(data) {
      this.attendanceDialog.show = true;
      this.attendanceDialog.data = data;
    },
    openAddStudentsModal() {
      this.addStudentModal.data = {
        students: this.allStudents,
        courseStudents: this.studentList,
      };
      this.addStudentModal.show = true;
    },
    addStudentsToCourse(studentIds) {
      axios
        .patch(
          `http://localhost:3000/courses/${this.courseId}/add_students`,
            { studentIds }
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
          this.getAttendanceList();
        });
    },
    removeStudentFromCourse(studentId) {
      axios.patch(`http://localhost:3000/courses/${this.courseId}/remove_student`, { studentId }).then((response) => {
        console.log(response);
        this.$toast.open({
          message: "Successfully Removed!",
          type: "success",
          duration: 5000,
          dismissible: true,
          position: "top-right",
        });
        this.getAttendanceList();
      })
    }
  },
};
</script>

<style scoped>
.student-item {
  max-height: 340px;
}
.list-group-item {
  background-color: #212529;
}
.attendance-item {
  background-color: #282d31;
  cursor: pointer;
}
.attendance-item:hover {
  opacity: 0.8;
}
.course-sessions {
  max-height: 400px;
  background-color: #212529;
  border: 1px solid #282d31;
}
</style>
