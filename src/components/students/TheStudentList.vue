<template>
  <div class="col-12 col-md-10 mt-5 text-light" :class="update ? 'col-lg-8' : 'col-lg-6 px-2'">
    <h5>Students:</h5>
    <ul class="list-group">
      <li
          v-for="(student, key) in student_data"
          :key="key"
          class="list-group-item d-flex justify-content-between"
          :class="update ? 'mouse-click' : ''"
          @click.self="update ? $emit('updateStudent', student) : ''"
      >
        <span>{{ student.name }}</span>
        <span v-if="update">
          <button class="btn btn-outline-danger" @click.self="$emit('deleteStudent', student)">Delete Student</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TheStudentList",
  props: {
    student_data: {
      required: true,
    },
    update: {
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped>
.mouse-click:hover {
  opacity: .8;
}
</style>