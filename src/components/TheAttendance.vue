<template>
  <div class="container mt-5 text-light">
    <div class="row no-gutters justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 d-flex justify-content-center">
        <video
          class="video rounded video-shadow-lg mb-3"
          ref="videoRef"
          id="video"
          width="400"
          height="300"
          autoplay
          muted
          @play="recognizeStudents"
        ></video>
      </div>
      <div class="col-12 col-md-10 col-lg-8 text-center mt-3">
        <button
          class="btn btn-primary btn-lg"
          :class="loading ? 'mouse-no-click' : ''"
          @click="openCamera"
          v-if="!stream"
          :disabled="loading"
        >
          Open Camera
        </button>
        <button class="btn btn-secondary btn-lg" @click="stopCamera" v-else>
          Close Camera
        </button>
      </div>
      <div class="col-12 col-md-10 col-lg-8 mt-5">
        <h5>Students:</h5>
        <ul class="list-group">
          <li
            v-for="(student, key) in student_data"
            :key="key"
            class="list-group-item d-flex justify-content-between"
          >
            <span>{{ student.name }}</span>
            <span>{{ student.is_attended ? 'v' : 'x' }}</span>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-10 col-lg-8 mt-5">
        <h5>Attendees:</h5>
        <ul class="list-group">
          <li
            v-for="(student, key) in attended_students"
            :key="key"
            class="list-group-item d-flex justify-content-between"
          >
            <span>{{ student }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js";
import axios from "axios";

export default {
  name: "TheAttendance",
  data() {
    return {
      loading: true,
      student_data: [],
      attended_students: [],
      LabeledFaceDescriptors: null,
      stream: null,
    };
  },
  computed: {
    video() {
      return document.getElementById("video");
    },
  },
  mounted() {
    if (this.$route && this.$route.query && this.$route.query.selectedCourse) {
      const params = {
        courseId: this.$route.query.selectedCourse
      }
      axios.get(`http://localhost:3000/courses/${params.courseId}`, { params: params }).then((response) => {
        const students = response.data.students;
        this.student_data = students.filter((item) => item.photo);
        this.student_data.forEach((student) => {
          student.is_attended = false;
        });
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        ]).then(this.initApp);
      });
    }
  },
  methods: {
    async initApp() {
      this.LabeledFaceDescriptors = await this.loadImages();
      this.loading = false;
    },

    async loadImages() {
      const label = this.student_data.map((student) => student.name);

      console.log("label", label);

      return Promise.all(
        label.map(async (label) => {
          const buffer = this.student_data.find((x) => x.name === label).photo.buffer;
          let imageOf = await new Image();
          imageOf.src = "data:image/png;base64, " + buffer;

          console.log(imageOf.src);
          const descriptions = [];
          const img = await faceapi.fetchImage(imageOf.src);

          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
          console.log(descriptions);

          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    },
    openCamera() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.video.scrObject = stream;
          this.$refs.videoRef.srcObject = stream;
          this.$refs.videoRef.play();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    stopCamera() {
      this.video.pause();
      this.video.srcObject = null;
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    },
    recognizeStudents() {
      const boxSize = {
        width: this.video.width,
        height: this.video.height,
      };

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.8}))
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, boxSize);

        const faceMatcher = new faceapi.FaceMatcher(
          this.LabeledFaceDescriptors,
          0.9
        );

        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );
        console.log(results);
        if (
          results.length > 0 &&
          this.student_data
            .map((student) => student.name)
            .indexOf(results[0].label) > -1
        ) {
          this.student_data.find(student => student.name === results[0].label).is_attended = true;
          if (this.attended_students.filter(x => x === results[0].label).length === 0) {
            this.attended_students.push(results[0].label);
          }
          // clearInterval(cameraInterval);
        } else {
          console.log("SAAADDD");
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.video {
  background-color: #212529;
}

.btn {
  width: 200px;
  border-radius: 50px;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.list-group-item {
  background-color: #212529;
}

.video-shadow-lg {
  box-shadow: 0 1rem 3rem #212529!important;
}
</style>
