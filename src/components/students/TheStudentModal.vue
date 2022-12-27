<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <span>Student Detail</span>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="row no-gutters w-100">
                <div class="form-group col-6 px-2">
                  <label>Student Name:</label>
                  <input type="text" class="form-control" v-model="updateData.name">
                </div>
                <div class="form-group col-6 px-2">
                  <label>Student Number:</label>
                  <input type="number" class="form-control" v-model="updateData.student_number">
                </div>
                <div class="col-12 d-flex align-items-center justify-content-center p-3">
                  <img :src="updatedPhotoURL" style="width: auto; max-height: 400px;" v-if="updatedPhotoURL">
                  <img :src="'data:image/png;base64, ' + updateData.photo.buffer" style="width: auto; max-height: 400px;" v-else-if="updateData.photo && updateData.photo.buffer">
                </div>
                <div class="custom-file col-12 px-2">
                  <input type="file" class="custom-file-input" @change="onFileChange">
                  <label class="custom-file-label">Choose Student Photo</label>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-primary" @click="createOrUpdateStudent">
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
  name: "TheStudentModal",
  props: ['config'],
  data() {
    return {
      updateData: {
        name: null,
        student_number: null,
        photo: null,
      },
      updatedPhotoURL: null,
      createData: new FormData(),
    };
  },
  created() {
    if (this.config.action === 'update') {
      this.initUpdateModal();
    }
  },
  methods: {
    initUpdateModal() {
      this.updateData.name = this.config.data.name;
      this.updateData.student_number = this.config.data.student_number;
      this.updateData.photo = this.config.data.photo;
    },
    onFileChange(e) {
      this.createData.append('photo', e.target.files[0]);
      this.updateData.photo = e.target.files[0];
      this.updatedPhotoURL = URL.createObjectURL(e.target.files[0]);
    },
    createOrUpdateStudent() {
      this.createData.append('name', this.updateData.name);
      this.createData.append('student_number', this.updateData.student_number);
      if (this.config.action === 'create') {
        this.$emit('createNewStudent', this.createData);
      } else {
        this.$emit('updateStudent', { form_data: this.createData, student_number: this.updateData.student_number });
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

</style>