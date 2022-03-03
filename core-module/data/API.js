//import is from 'is_js';
var localStorage = require('localStorage');
// import ApiConfig from '../../../config/ApiConfig';
// var env = process.env.API_URL;
// var app_url = ApiConfig[env].app_url;
//static AppUrl = app_url;
console.log('call file');
const AppUrl = 'https://s9a.splashid.com';
const ApiModule = {
  default: '/api/v1/',
};

const EndPoint = {
  records:'records',
  categories:'categories',
  types:'types',
  tags:'tags',
  icons:'icons',
  iconSome:'icons/some/',
  attachments:'attachments/',
}

const Method = {
  get: "GET",
  post: "POST"
}

function authToken() {
  let auth = localStorage.getItem('auth_token');
  return auth;
}

function setAuthToken(session_token) {
  localStorage.setItem('auth_token', session_token);
}

function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

function logout() {
  removeAuthToken();
  if(is.chrome()){
      chrome.storage.sync.remove('AccessToken', function() {});
      chrome.storage.sync.remove('hideshowautocapture', function() {});
  }else{
      browser.storage.local.remove('AccessToken', function() {});
      browser.storage.local.remove('hideshowautocapture', function() {});
  }
}



function callRecords(endpoint, apiModule, type, params, payload, onCompletion) {
  var url = "";
  url = app_url + "/" + apiModule + "/" + endpoint + (params ? "" : "");
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+ authToken(),
      //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
    },
  }).then((response) => {
      if (response.status == 200) {
        return response.json();
      }
  }).then((json) => {
    onCompletion(json);
  }).catch((error) => {
    onCompletion(error.response);
  });
}

function masterAPI(endPoint, method, params, payload, onCompletion) {
  callRecords(endPoint, ApiModule.default, method, params, payload, onCompletion)
}

