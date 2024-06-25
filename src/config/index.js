// const API_URL = 'https://api2.unicon.uz/uz'
const API_URL = 'https://dcid.unicon.uz/uz'

const APIS = {
  getOneIdLogin: `${API_URL}/api/oauth/oneid-login?path=http://localhost:3000`,
  logOut: `${API_URL}/api/oauth/logout`,
  login: `${API_URL}/api/oauth/login`,
  getUser: `${API_URL}/api/oauth/get-user`,
  getUserDetail: `${API_URL}/contracts/user-detail`
}

export {APIS, API_URL}