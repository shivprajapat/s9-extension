import {createStore, applyMiddleware} from 'redux';
import thunk from "redux-thunk";
import rootReducer from './reducers';
import {wrapStore} from 'webext-redux';
var localStorage = require('localStorage');
var base64 = require('base-64');
const crypto = require('crypto');
// const {Student} = require('../../core-module/data/API.js');
// console.log(Student);

const store = createStore(rootReducer, applyMiddleware(thunk));
wrapStore(store);

import openSocket from "socket.io-client";
var socket = openSocket("ws://localhost:3000", {transports: ['websocket'],upgrade: true});
socket.connect();
socket.connected = true;

socket.on("autoLoginExtension", loginData => {
  console.log('login data desktop :- ',loginData);
  setJwtToken(loginData.jwt);
  setKeyPack(loginData.keyPack);
  setSyncType(loginData.syncType);
});

var app_url = 'https://s9a.splashid.com/#/welcomeScreen';
var api_url = 'https://s9a.splashid.com/api/v1/';
var intervalId;

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    
    if(request.type == "SendLoginLink"){
        redirectionSplashidTab(app_url);      
    }
    
    if (request.type == 'signInExtension') {
      var loginData = request.value;
      console.log('login data :- ' , loginData);
      setJwtToken(loginData.jwt);
      setKeyPack(loginData.keyPack);
      setSyncType(loginData.syncType);
    }

    if(request.type == "singleRecord"){
      var attachments = request.value.attachments;
      if(attachments.length == 0){
        chrome.runtime.sendMessage({type: 'receiveSingleRecord',value:request.value}, function(response) {if (chrome.runtime.lastError) {}});
      } else {
        getAttachments(request.value);
      }
    }

    if(request.type == "getAllRecords"){
      var syncType = getSyncType();
      if(syncType == 'CLOUD'){
        getAllIconsIds();
        getAllRecords();
        getAllCategory();
        getAllTypes();
        getAllTags();
      } else {
        chrome.runtime.sendMessage({type: 'othersSyncType'}, function(response) {if (chrome.runtime.lastError) {}});
      }
    }

    if(request.type == "setConnectedPort") {

    }

    if(request.type == "getMsgFromApp"){
      
    }

    if(request.type == "autofillRecord") {
      autoFillData(request.value);
    }

    if (request.type == 'logoutExtension') {
      removeStorageData();
      chrome.runtime.sendMessage({type:'logout'}, function(response) {if (chrome.runtime.lastError) {}});
      redirectionSplashidTab(app_url);
  }
});

async function getAllRecords() {
    var token = await getJwtToken();
    fetch(api_url+'records', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer '+ token,
              //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
            },
          }).then((response) => {
              if (response.status == 200) {
                return response.json();
              }
          }).then((json) => {
            if(json.success){
              encryptRecords(json.records);
            }
          }).catch((error) => {
            console.log(error);
          });
}

async function getAllCategory() {
  var token = await getJwtToken();
  fetch(api_url+'categories', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+ token,
            //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
          },
        }).then((response) => {
            if (response.status == 200) {
              return response.json();
            }
        }).then((json) => {
          if(json.success){
            decryptCategory(json.categories);
          }
        }).catch((error) => {
          console.log(error);
        });
}

async function getAllTypes() {
  var token = await getJwtToken();
  fetch(api_url+'types', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+ token,
            //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
          },
        }).then((response) => {
            if (response.status == 200) {
              return response.json();
            }
        }).then((json) => {
          if(json.success){
            decryptType(json.types);
          }
        }).catch((error) => {
          console.log(error);
        });
}

async function getAllTags() {
  var token = await getJwtToken();
  fetch(api_url+'tags', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+ token,
            //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
          },
        }).then((response) => {
            if (response.status == 200) {
              return response.json();
            }
        }).then((json) => {
          if(json.success){
            decryptTags(json.tags);
          }
        }).catch((error) => {
          console.log(error);
        });
}

async function getAllIconsIds() {
  var token = await getJwtToken();
  fetch(api_url+'icons', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+ token,
            //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
          },
        }).then((response) => {
            if (response.status == 200) {
              return response.json();
            }
        }).then((json) => {
          if(json.success){
            let icons = json.icons;
            let iconsIds = [];
            for (var i = 0; i < icons.length; i++) {
              iconsIds.push(icons[i]._id);
            }
            getAllIcons(iconsIds);
          }
        }).catch((error) => {
          console.log(error);
        });
}

async function getAllIcons(iconIds) {
  let token = await getJwtToken();
  let iconLength = iconIds.length;
  const size = 10;
  var iconList = [];
  for (var i = 0; i < iconLength; i += size) {
    let end = (i + size < iconLength) ? i + size : iconLength;
    let ids = iconIds.slice(i, end).join(',');
    var customIcon = await fetch(api_url+'icons/some/'+ids, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
        //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
      },
    }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
    }).then((json) => {
      if(json.success){
        return json.icons;
      }
    }).catch((error) => {
      console.log(error);
    });
    iconList = iconList.concat(customIcon);
  }
  decryptIcon(iconList);
}

async function getAttachments(selectedRecord) {
  let token = await getJwtToken();
  var attachments = selectedRecord.attachments;
  let attachmentsList = [];
  for (var i = 0; i < attachments.length; i++) {
    var attId = subStringValue(attachments[i]['"id"']);
    var attachment = await fetch(api_url+'attachments/'+attId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
        //'Cookie': 's9a=s%3ApSp_JWrnnl-vRVz1Gc778kHK_cANJ4b1.eF%2FVqusmSPfQTpBLE1lKNU68PH5IXdRZrQss1edpGEs'
      },
    }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
    }).then((json) => {
      if(json.success){
        return json.attachment;
      }
    }).catch((error) => {
      console.log(error);
    });
    attachmentsList.push(attachment);
  }
  decryptAttachments(attachmentsList,selectedRecord);
}

async function encryptRecords(encryptRecords) {
  var tadId = await getCurrentTab();
  var decryptRecordList = [];
  for (var i = 0; i < encryptRecords.length; i++) {
    decryptRecordList[i] = await decryptRecord(encryptRecords[i]);
  }
  chrome.runtime.sendMessage({type: 'receiveAllRecords',value:decryptRecordList}, function(response) {if (chrome.runtime.lastError) {}});
  //chrome.tabs.sendMessage(tadId[0].id, {type: 'receiveAllRecords',value: json.records}, function(response) {if (chrome.runtime.lastError) {}});
}

async function decryptRecord(record) {
  var dataKey = getKeyPack();
  var encConfig = JSON.parse(record.encConfig);
  var encKey = await decryptEncKey(record.encKey,dataKey,encConfig.config);
  var name = await decryptData(record.name , encKey,encConfig.config);
  var decryptFields = [];
  for (var i = 0; i < record.fields.length; i++) {
    var fields = record.fields[i];
    var type = await decryptData(subStringValue(fields['"type"']), encKey ,encConfig.config);
    var label = await decryptData(subStringValue(fields['"label"']) , encKey ,encConfig.config);
    var value = await decryptData(subStringValue(fields['"value"']) , encKey ,encConfig.config);
    var id = subStringValue(fields['"id"']);
    var masked = fields['"masked"'];
    var decryptFieldsObject = {id:id,label:label,masked:masked,type:type,value:value};
    decryptFields.push(decryptFieldsObject);
  }
  record.encConfig = encConfig;
  record.encKey = encKey;
  record.name = name;
  record.fields = decryptFields;
  return record;
}

async function decryptCategory(categoryList) {
  var dataKey = getKeyPack();
  for (var i = 0; i < categoryList.length; i++) {
    var encConfig = JSON.parse(categoryList[i].encConfig);
    var encKey = await decryptEncKey(categoryList[i].encKey,dataKey,encConfig.config);
    var name = await decryptData(categoryList[i].name , encKey,encConfig.config);
    categoryList[i].encConfig = encConfig;
    categoryList[i].encKey = encKey;
    categoryList[i].name = name;
  }
  chrome.runtime.sendMessage({type: 'receiveAllCategory', value : categoryList}, function(response) {if (chrome.runtime.lastError) {}});
}

async function decryptType(typeList) {
  var dataKey = getKeyPack();
  for (var i = 0; i < typeList.length; i++) {
    var encConfig = JSON.parse(typeList[i].encConfig);
    var encKey = await decryptEncKey(typeList[i].encKey,dataKey,encConfig.config);
    var name = await decryptData(typeList[i].name , encKey,encConfig.config);
    
    var decryptTypeFields = [];
    var fields = typeList[i].fields;
    for (var f = 0; f < fields.length; f++) {
      var label = await decryptData(fields[f].label , encKey ,encConfig.config);
      var type = await decryptData(fields[f].type, encKey ,encConfig.config);
      var decryptFieldsObject = {label:label, masked:fields[f].masked, type:type};
      decryptTypeFields.push(decryptFieldsObject);
    }
    typeList[i].encConfig = encConfig;
    typeList[i].encKey = encKey;
    typeList[i].name = name;
    typeList[i].fields = decryptTypeFields;
  }
  chrome.runtime.sendMessage({type: 'receiveAllTypes', value : typeList}, function(response) {if (chrome.runtime.lastError) {}});
}

async function decryptTags(tagList) {
  var dataKey = getKeyPack();
  for (var i = 0; i < tagList.length; i++) {
    var encConfig = JSON.parse(tagList[i].encConfig);
    var encKey = await decryptEncKey(tagList[i].encKey,dataKey,encConfig.config);
    var tagName = await decryptData(tagList[i].tag , encKey,encConfig.config);
    tagList[i].encConfig = encConfig;
    tagList[i].encKey = encKey;
    tagList[i].tag = tagName;
  }
  chrome.runtime.sendMessage({type: 'receiveAllTags', value : tagList}, function(response) {if (chrome.runtime.lastError) {}});
}
async function decryptIcon(iconList) {
  var dataKey = getKeyPack();
  for (var i = 0; i < iconList.length; i++) {
    var encConfig = JSON.parse(iconList[i].encConfig);
    var encKey = await decryptEncKey(iconList[i].encKey,dataKey,encConfig.config);
    var content = await decryptData(iconList[i].content , encKey,encConfig.config);
    var description = await decryptData(iconList[i].description , encKey,encConfig.config);
    
    iconList[i].encConfig = encConfig;
    iconList[i].encKey = encKey;
    iconList[i].content = content;
    iconList[i].description = description;
  }
  chrome.runtime.sendMessage({type: 'receiveAllIcon', value : iconList}, function(response) {if (chrome.runtime.lastError) {}});
}

async function decryptAttachments(attachmentsList,selectedRecord) {
  var dataKey = getKeyPack();
  for (var i = 0; i < attachmentsList.length; i++) {
    var encConfig = JSON.parse(attachmentsList[i].encConfig);
    var encKey = await decryptEncKey(attachmentsList[i].encKey,dataKey,encConfig.config);
    var content = await decryptData(attachmentsList[i].content , encKey,encConfig.config);
    var name = await decryptData(attachmentsList[i].name , encKey,encConfig.config);
    var mime = await decryptData(attachmentsList[i].mime , encKey,encConfig.config);

    attachmentsList[i].encConfig = encConfig;
    attachmentsList[i].encKey = encKey;
    attachmentsList[i].content = content;
    attachmentsList[i].name = name;
    attachmentsList[i].mime = mime;
  }
  selectedRecord.attachments = attachmentsList;
  chrome.runtime.sendMessage({type: 'receiveSingleRecord',value:selectedRecord}, function(response) {if (chrome.runtime.lastError) {}});
}

async function decryptEncKey(value,dataKey,cryptoConfig) {
  var enc = Buffer.from(dataKey, 'base64');
  var cipherMap = JSON.parse(value);
  var iv = Buffer.from(cipherMap.i, 'base64');
  var cipherText = Buffer.from(cipherMap.c, 'base64');
  var auth = Buffer.from(cipherMap.a, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', enc, iv);
  decipher.setAuthTag(auth);
  let cleartext = decipher.update(cipherText, 'base64');
  return base64.encode(ab2str(cleartext));
}

function decryptData(value,dataKey,cryptoConfig) {
  var enc = Buffer.from(dataKey, 'base64');
  var cipherMap = JSON.parse(value);
  var iv = Buffer.from(cipherMap.i, 'base64');
  var cipherText = Buffer.from(cipherMap.c, 'base64');
  var auth = Buffer.from(cipherMap.a, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', enc, iv);
  decipher.setAuthTag(auth);
  let cleartext = decipher.update(cipherText, 'base64');
  return ab2str(cleartext);
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function subStringValue(string) {
  return string.substring(1, string.length-1);
}

function setJwtToken(token) {
  chrome.storage.sync.set({ 'auth_token': token });
}

function getJwtToken() {
  return new Promise(resolve => {
      try {
          chrome.storage.sync.get('auth_token', (response) => {
              resolve(response.auth_token ?? []);
          });
      } catch (e) {
          console.log(e);
          resolve({});
      }
  });
}

function removeStorageData (){
  chrome.storage.sync.remove('auth_token', function() {});
  localStorage.removeItem('keyPack');
  localStorage.removeItem('syncType');
}

function setKeyPack(keyPack) {
  localStorage.setItem('keyPack', keyPack);
}

function getKeyPack() {
  return localStorage.getItem('keyPack');
}

function setSyncType(syncType){
  localStorage.setItem('syncType', syncType);
}

function getSyncType() {
  return localStorage.getItem('syncType');
}

// Get current tab
function getCurrentTab() {
  return new Promise(resolve => {
    try {
      let queryOptions = { active: true, currentWindow: true };
      chrome.tabs.query(queryOptions, function(tabs) {
        resolve(tabs);
      });
    } catch (e) {
        console.log(e);
        resolve('');
    }
  });
}

function redirectionSplashidTab(newURL){
  var NotOpenTvbcall=0;
  chrome.tabs.query({currentWindow: true}, function(tabslist) {
      for(var j=0;j<tabslist.length;j++) {
          var Tbaurl=tabslist[j].url;			
          if(Tbaurl.indexOf('s9a.splashid.com') >= 0){
              NotOpenTvbcall=1
              var tab=tabslist[j];							
              chrome.tabs.update(tab.id, {url: newURL, selected: true});
          }else{
              if(tabslist.length == (j+1) && NotOpenTvbcall==0){
                  chrome.tabs.create({url: newURL}, function(tab) {})
              }							
          }			
      }
  });
}

function sendAutologin(FullData){
  let self = this;
  setTimeout(function(){
      localStorage.setItem('AutoData',JSON.stringify(FullData));
      chrome.tabs.create({url: FullData.newURL},function (tab) {
          localStorage.setItem('SetActiveTabId', tab.id);
          callAutofill();
          if (chrome.runtime.lastError) {}
      });
  },100);
}
// Auto fill username and password
function callAutofill () {
  clearInterval(intervalId)
  intervalId = setInterval(function () {
      var TabID = localStorage.getItem('SetActiveTabId')
      if(TabID){
          chrome.tabs.get(parseInt(TabID),callback);
      }
  },1000)
}

function callback() {
  var TabID = localStorage.getItem('SetActiveTabId')
  if (chrome.runtime.lastError) {        
      clearInterval(intervalId)
  } else {        
      var FullData = localStorage.getItem('AutoData');
      chrome.tabs.sendMessage(parseInt(TabID),{'type':'AutoFill','value':FullData},function(){
          if (chrome.runtime.lastError) {            
          }
      }) 
  }
}

async function autoFillData(record) {
  var tadId = await getCurrentTab();
  var decryptedRecord = await decryptRecord(record);
  var selectedField = decryptedRecord.fields;
  var userName = '';
  var password = '';
  var url = '';

  for (var i = 0; i < selectedField.length; i++) {
    if (selectedField[i].label == 'Username') {
      userName = selectedField[i].value;
    }

    if (selectedField[i].type == 'Password') {
      password = selectedField[i].value;
    }

    if (selectedField[i].type == 'URL Field') {
      url = selectedField[i].value;
    }
  }
  
  var fillData = {
    'userName': userName,
    'Password': password,
    'newURL': url
  };
  chrome.tabs.sendMessage(tadId[0].id, {type: 'autoFill',value: JSON.stringify(fillData)}, function(response) {if (chrome.runtime.lastError) {}});
}