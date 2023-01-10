<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">Add Students</slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="col-12 my-2">
                <h5>Students:</h5>
                <ul class="list-group" v-if="availableStudents.length > 0">
                  <li
                      v-for="(student, key) in availableStudents"
                      :key="key"
                      class="list-group-item d-flex justify-content-between"
                  >
                    <span>{{ student.name }}</span>
                    <div class="student-check" :id="'check-student'+key" @click="checkStudent(student, key)">

                    </div>
                  </li>
                </ul>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-primary" :disabled="selectedStudents.length === 0"
                      @click="config.courseId ? $emit('addStudents', { selectedStudents, courseId: config.courseId }) : $emit('addStudents', selectedStudents)">
                Add Students
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
  name: "TheStudentModal",
  props: ['config'],
  data() {
    return {
      availableStudents: [],
      selectedStudents: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.availableStudents = this.config.students.filter(student => !this.config.courseStudents.map(x => x._id).includes(student._id))
    },
    checkStudent(student, key) {
      const element = document.getElementById(`check-student${key}`)
      if (element.hasChildNodes()) {
        this.selectedStudents = this.selectedStudents.filter(x => x !== student._id);
        element.removeChild(element.firstElementChild);
      } else {
        this.selectedStudents.push(student._id);
        const node = document.createElement('span');
        node.innerHTML = '&check;';
        element.appendChild(node);
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

.student-check {
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