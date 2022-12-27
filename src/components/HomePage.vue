<template>
  <div class="container">
    <div class="row no-gutters w-100 d-flex justify-content-center align-items-center p-3">
      <template v-for="(tab, index) in tabs">
        <button class="btn btn-outline-light mr-2" :key="index" @click="selectTab(tab.value)">{{ tab.name }}</button>
      </template>
    </div>
    <keep-alive>
      <component :is="selectedComponent"/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      selectedComponent: 'SelectCourse',
      tabs: [
        {
          name: 'Select Course',
          value: 'SelectCourse',
        },
        {
          name: 'Student Management',
          value: 'TheStudentManagement',
        }
      ]
    };
  },
  components: {
    SelectCourse: () => import('@/components/SelectCourse.vue'),
    TheStudentManagement: () => import('@/components/TheStudentManagement.vue'),
  },
  methods: {
    selectTab(tab) {
      this.selectedComponent = tab;
    },
  },
};
</script>

<style scoped></style>
