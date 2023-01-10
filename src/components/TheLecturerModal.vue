<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <span>Lecturer Detail</span>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="row no-gutters w-100">
                <div class="form-group col-12 px-2">
                  <label>Lecturer Name:</label>
                  <input type="text" class="form-control" v-model="updateData.name">
                </div>
                <div class="form-group col-12 px-2">
                  <label>Lecturer Email:</label>
                  <input type="text" class="form-control" v-model="updateData.email">
                </div>
                <div class="form-group col-12 px-2">
                  <label>Password:</label>
                  <input type="password" class="form-control" v-model="updateData.password">
                </div>
                <div class="col-12 my-2" v-if="is_add_course">
                  <h5>Courses:</h5>
                  <ul class="list-group" v-if="availableCourses.length > 0">
                    <li
                        v-for="(course, key) in availableCourses"
                        :key="key"
                        class="list-group-item d-flex justify-content-between"
                    >
                      <span>{{ course.name }}</span>
                      <div class="course-check" :id="'check-course'+key" :ref="course._id" @click="checkCourse(course, key)">

                      </div>
                    </li>
                  </ul>
                </div>
                <div class="col-12 d-flex justify-content-end px-2" v-if="!is_add_course" @click="addCourse">
                  <button class="btn btn-primary">Add Course</button>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-primary" @click="createOrUpdateLecturer">
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
import axios from "axios";

export default {
  name: "TheLecturerModal",
  props: ['config'],
  data() {
    return {
      updateData: {
        name: null,
        email: null,
        password: null,
        courses: [],
      },
      is_add_course: false,
      availableCourses: [],
      selectedCourses: [],
    };
  },
  created() {
    if (this.config.action === 'update') {
      this.initUpdateModal();
    }
  },
  destroyed() {
    this.updateData = {
      name: null,
      email: null,
      password: null,
      courses: [],
    };
    this.is_add_course = false;
    this.availableCourses = [];
    this.selectedCourses = [];
  },
  methods: {
    initUpdateModal() {
      this.updateData.name = this.config.data.name;
      this.updateData.email = this.config.data.email;
      this.selectedCourses = this.config.data.courses;
    },
    addCourse() {
      axios.get('http://localhost:3000/courses').then((response) => {
        this.availableCourses = response.data;
        this.is_add_course = true;
        setTimeout(() => {
          this.config.data.courses.forEach(courseId => {
            if (this.$refs && this.$refs[courseId]) {
              const node = document.createElement('span');
              node.innerHTML = '&check;';
              this.$refs[courseId][0].appendChild(node);
            }
          })
        }, 400);
      });
    },
    checkCourse(course, key) {
      const element = document.getElementById(`check-course${key}`)
      if (element.hasChildNodes()) {
        this.selectedCourses = this.selectedCourses.filter(x => x !== course._id);
        element.removeChild(element.firstElementChild);
      } else {
        this.selectedCourses.push(course._id);
        const node = document.createElement('span');
        node.innerHTML = '&check;';
        element.appendChild(node);
      }
    },
    createOrUpdateLecturer() {
      if (this.config.action === 'create') {
        this.updateData.courses = this.selectedCourses;
        this.$emit('createNewLecturer', this.updateData);
      } else {
        this.updateData.courses = this.selectedCourses;
        this.$emit('updateLecturer', { data: this.updateData, lecturerId: this.config.data._id });
      }
    },
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

.course-check {
  border: 1px solid black;
  background-color: azure;
  color: black;
  font-size: 18px;
  display: inline-flex;
  justify-content: center;
  width: 29px;
  height: 29px;
  cursor: pointer;
}
</style>