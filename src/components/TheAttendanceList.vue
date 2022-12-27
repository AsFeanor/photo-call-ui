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
            <span>Not Attended: {{ attendanceList.length - attendanceCount.filter(x => x === student._id).length }}</span>
          </li>
        </ul>
      </div>
      <div class="col-12 mt-5">
        <div class="row no-gutters w-100 d-flex justify-content-center">
          <div class="col-4 p-2 course-sessions pc-border-radius pc-scroll-style">
            <h5>Course Sessions:</h5>
            <ul class="list-group pc-border-radius">
              <li
                  v-for="(attendance, key) in attendanceList"
                  :key="key"
                  class="list-group-item attendance-item pc-border-radius d-flex justify-content-center my-2" @click="openAttendanceDialog(attendance)"
              >
                <span>{{ uiDateFormat(attendance.session, true) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <the-attendance-modal v-if="attendanceDialog.show" @close="attendanceDialog.show = false" :config="attendanceDialog.data" :key="attendanceDialog.selector"/>
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
      attendanceDialog: {
        show: false,
        selector: Math.random().toString(36).substr(2, 9),
        data: null,
      }
    };
  },
  components: {
    TheAttendanceModal: () => import('@/components/TheAttendanceModal.vue'),
  },
  computed: {
    courseId() {
      return this.$route.query.selectedCourse;
    },
  },
  created() {
    this.getAttendanceList();
  },
  methods: {
    uiDateFormat,
    getAttendanceList() {
      axios
        .get(`http://localhost:3000/courses/${this.courseId}`)
        .then((response) => {
          this.selectedCourse = response.data
          this.initAttendanceList();
        });
    },
    initAttendanceList() {
      this.studentList = this.selectedCourse.students;
      this.attendanceList = this.selectedCourse.attendance;
      this.attendanceCount = this.attendanceList.map(x => x.students).flat().map(x => x._id);
    },
    openAttendanceDialog(data) {
      this.attendanceDialog.show = true;
      this.attendanceDialog.data = data;
    },
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
  opacity: .8;
}
.course-sessions {
  max-height: 400px;
  background-color: #212529;
  border: 1px solid #282d31;
}
</style>
