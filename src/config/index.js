const api_url = 'https://api2.unicon.uz/uz'
// const api_url = 'https://dcid.unicon.uz/uz'

const APIS = {
  getOneIdLogin: `${api_url}/api/oauth/oneid-login?path=http://localhost:3000`,
  logOut: `${api_url}/api/oauth/logout`,
  login: `${api_url}/api/oauth/login`,
  getUser: `${api_url}/api/oauth/get-user`,
  getUserDetail: `${api_url}/contracts/user-detail`,
  refreshToken: `${api_url}/auth/token/refresh/`,
  customLogin: `${api_url}/api/oauth/custom-login`,
  eriLogin: `${api_url}/api/oauth/login/eri`
}

export {APIS, api_url}