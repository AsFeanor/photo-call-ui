<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <span>Course Detail</span>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="row no-gutters w-100">
                <div class="form-group col-12 px-2">
                  <label>Course Name:</label>
                  <input type="text" class="form-control" v-model="updateData.name">
                </div>
                <div class="row no-gutters w-100 d-flex justify-content-center" v-if="config.action === 'update' && student_data">
                  <div class="col-12 mt-5">
                    <h5>Students:</h5>
                    <ul class="list-group student-item pc-scroll-style">
                      <li
                          v-for="(student, key) in student_data"
                          :key="key"
                          class="list-group-item d-flex justify-content-between"
                      >
                        <span>{{ student.name }}</span>
                        <div>
                          <button class="btn btn-outline-danger ml-3" @click.self="removeStudent(student._id)">Remove Student</button>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="col-12 mt-2" v-if="student_data && config.data.allStudents.length !== student_data.length">
                    <div class="row no-gutters w-100 d-flex justify-content-end">
                      <div class="col-3 d-flex justify-content-end">
                        <button
                            class="btn btn-primary pc-border-radius"
                            :disabled="config.data.allStudents.length === 0"
                            @click="$emit('addStudents', config.data)"
                        >
                          Add Student
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-primary" @click="createOrUpdateCourse" :disabled="!validateCourse">
                {{ config.action === 'create' ? 'Create' : 'Update' }}
              </button>
              <button class="btn btn-secondary" @click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "TheCourseModal",
  props: ['config'],
  data() {
    return {
      updateData: {
        name: null,
        student_ids: [],
      },
      course_id: null,
      student_data: [],
    };
  },
  computed: {
    validateCourse() {
      return !(this.config.data.name === this.updateData.name || !this.updateData.name || (this.updateData.name && this.updateData.name.length < 3));
    }
  },
  created() {
    if (this.config.action === 'update') {
      this.initUpdateModal();
    }
  },
  methods: {
    initUpdateModal() {
      this.course_id = this.config.data._id;
      this.updateData.name = this.config.data.name;
      this.updateData.student_ids = this.config.data.students.map(x => x._id);
      this.student_data = this.config.data.students;
    },
    removeStudent(studentId) {
      this.$emit('removeStudent', { student_id: studentId, course: this.config.data });
      this.student_data = this.student_data.filter(student => student._id !== studentId);
    },
    createOrUpdateCourse() {
      if (this.config.action === 'create') {
        this.$emit('createCourse', this.updateData);
      } else {

        this.$emit('updateCourse', { data: this.updateData, course_id: this.course_id });
      }
    }
  },
}
</script>

<style scoped>
.modal-mask {
  color: #212529 !important;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>