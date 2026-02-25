import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('token')

    if (token) {
      config.headers['X-Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => {
    switch (response.data.status) {
      case 400:
        Cookies.remove('token')
        return Promise.reject(response.data)
      case 403:
        Cookies.remove('token')
        window.location.href = '/login'
    }
    return response
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
