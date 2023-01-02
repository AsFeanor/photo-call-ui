<template>
  <div class="d-flex align-items-center row no-gutters">
    <div class="col-12 d-flex justify-content-center">
      <img src="/assets/wallpaper.png" alt="wall" style="max-width: 800px; width: inherit"/>
    </div>
    <div class="col-12 d-flex justify-content-center mt-3">
      <select class="form-control w-80" v-model="selectedCourse">
        <option :value="null" disabled selected>
          Please Select A Course
        </option>
        <option v-for="(course, key) in courses" :key="key" :value="course">
          {{ course.name }}
        </option>
      </select>
    </div>
    <div class="col-12 d-flex justify-content-center mt-3">
      <div class="row no-gutters w-80 d-flex justify-content-end">
        <div class="col">
          <button
              type="button"
              class="btn btn-primary mr-3"
              :class="!selectedCourse ? 'mouse-no-click' : ''"
              :disabled="!selectedCourse"
              @click="startAttendance"
          >
            Start Attendance</button>
          <button
              type="button"
              class="btn btn-light"
              :class="!selectedCourse ? 'mouse-no-click' : ''"
              :disabled="!selectedCourse"
              @click="goAttendanceList"
          >
            See Attendance List</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SelectCourse",
  data() {
    return {
      courses: [],
      selectedCourse: null,
    };
  },
  created() {
    this.fetchCourses();
  },
  methods: {
    fetchCourses() {
      axios
          .get("http://localhost:3000/courses")
          .then((response) => (this.courses = response.data));
    },
    startAttendance() {
      this.$router.push({
        path: '/attendance',
        query: {
          selectedCourse: this.selectedCourse._id
        }
      })
    },
    goAttendanceList() {
      this.$router.push({
        path: '/attendance-list',
        query: {
          selectedCourse: this.selectedCourse._id
        }
      })
    },
  },
}
</script>

<style scoped>

</style>