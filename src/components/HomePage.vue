<template>
  <div class="container-fluid p-0" v-if="superUser !== undefined">
    <div
      class="row no-gutters w-100 d-flex justify-content-center align-items-center p-3"
    >
      <template v-for="(tab, index) in tabs">
        <button
          class="btn mr-2"
          :class="selectedComponent === tab.value ? 'btn-light' : 'btn-outline-light'"
          :key="index"
          @click="selectTab(tab.value)">
          {{ tab.name }}
        </button>
      </template>
    </div>
    <keep-alive>
      <component :is="selectedComponent" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      selectedComponent: "SelectCourse",
      tabs: [
        {
          name: "Select Course",
          value: "SelectCourse",
        },
        {
          name: "Student Management",
          value: "TheStudentManagement",
        },
      ],
    };
  },
  components: {
    SelectCourse: () => import("@/components/SelectCourse.vue"),
    TheStudentManagement: () => import("@/components/TheStudentManagement.vue"),
    TheCourseManagement: () =>
      import("@/components/courses/TheCourseManagement.vue"),
    TheLecturerManagement: () =>
      import("@/components/TheLecturerManagement.vue"),
  },
  computed: {
    superUser() {
      return localStorage.getItem("super_user");
    },
  },
  created() {
    if (this.superUser && this.superUser === "true") {
      this.tabs.push(
        {
          name: "Lecturer Management",
          value: "TheLecturerManagement",
        },
        {
          name: "Course Management",
          value: "TheCourseManagement",
        },
      );
    }
  },
  methods: {
    selectTab(tab) {
      this.selectedComponent = tab;
    },
  },
};
</script>

<style scoped></style>
