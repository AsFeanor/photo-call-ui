export default {
    methods: {
        isAuthenticated() {
            const jwt = localStorage.getItem('jwtToken');
            if (jwt) {
                return jwt !== '';
            } else {
                return false;
            }
        }
    }
}