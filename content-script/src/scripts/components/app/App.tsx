import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";

import openSocket from "socket.io-client";
var socket = openSocket("ws://localhost:3000", {transports: ['websocket'],upgrade: true});
socket.connect();
socket.connected = true;

export interface IAppProps {
  dispatch: Dispatch<any>;
}

class App extends Component<IAppProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var self = this;
    var bc = new BroadcastChannel('splashid_channel');
    bc.onmessage = function(event) {
      if(event.data != undefined && event.data.type == "autoLoginExtension"){
          var response = event.data;
          console.log('login data for web :- ',response);
          chrome.runtime.sendMessage({type: 'signInExtension',value:response}, function(response) {if (chrome.runtime.lastError) {}});
      }

      if(event.data != undefined && event.data.type == "autoLogoutExtension"){
        chrome.runtime.sendMessage({type:'logoutExtension'}, function(response) {if (chrome.runtime.lastError) {}});
      }

      if(event.data != undefined && event.data.type == "autofillRecord"){
        console.log('autofillRecord');
      }
    };
    document.addEventListener('readystatechange', (event) => {
      if (document.readyState == 'complete') {
        

        socket.on("autofillRecord", message => {
          chrome.runtime.sendMessage({type: 'autofillRecord',value:message}, function(response) {if (chrome.runtime.lastError) {}});
        });

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
          if(request.type == 'receiveAllRecords'){
            
          }
    
          if(request.type=="autoFill"){
            console.log(JSON.parse(request.value));
          }
        });
      }
    });
  }
  render() {
    return (
      <div></div>
    );
  }
}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(App);
