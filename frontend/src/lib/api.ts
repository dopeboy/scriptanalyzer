export const getAPIURL = () => {
    return process.env.NODE_ENV === 'production' ? 'https://api.myapp.com' : 'http://127.0.0.1:8000/api';
}