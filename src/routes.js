import HomePage from "@/components/HomePage.vue";
import TheAttendance from "@/components/TheAttendance.vue";
import TheAttendanceList from "@/components/TheAttendanceList.vue";

export default [
    { path: '', component: HomePage },
    { path: '/attendance', component: TheAttendance },
    { path: '/attendance-list', component: TheAttendanceList },
]