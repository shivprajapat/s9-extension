import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import Login from './Login';
import Home from './Home';
import RecordDetails from './RecordDetails';
import SyncUser from './SyncUser';

import "../../css/bootstrap.min.css";
import "../../css/popup.css";
import { RecordModel } from '../../models/RecordModel';

export interface IAppProps {
  dispatch: Dispatch<any>;
}

class App extends Component<IAppProps> {
  constructor(props) {
    super(props);
    this.state = {
			showingScreen:0,
      whichScreen:1,
      loading:false,
    };
  }

  async componentDidMount() {
    let self = this;
    var tokenCode = await self.getJwtToken();
    console.log(tokenCode);
    console.log('tokenCode');

		if(tokenCode != null && tokenCode != undefined){
      chrome.runtime.sendMessage({type: 'getAllRecords'}, function(response) {if (chrome.runtime.lastError) {}});
      self.setState({showingScreen:1,loading:true});
    } else {
      self.setState({showingScreen:0,loading:false});
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      // Receive selected record
      if (request.type == "receiveSingleRecord") {
        console.log('SelecteRecord :- ', request.value);
        self.props.dispatch({
          type: 'SELECTED_RECORD',
          selectedRecord:request.value
        });
        self.setState({showingScreen:2});
      }

      // Receive all records
      if (request.type == "receiveAllRecords") {
        let record = new RecordModel(request.value);
        self.props.dispatch({
          type: 'GET_ALL_RECORD',
          allRecords:record
        });
        self.setState({loading:false});
      }

      // Receive all icons
      if (request.type == "receiveAllIcon") {
        console.log('Icon :- ', request.value);
      }

      // Receive all category
      if (request.type == "receiveAllCategory") {
        console.log('Category :- ', request.value);
      }

      // Receive all types
      if (request.type == "receiveAllTypes") {
        console.log('Types :- ', request.value);
      }

      // Receive all tags
      if (request.type == "receiveAllTags") {
        console.log('Tags :- ', request.value);
      }

      if (request.type == "othersSyncType") {
        self.setState({showingScreen:3,loading:false});
      }

      if (request.type == "logout") {
        self.logout();
      }
    });
  }

  getJwtToken() {
    return new Promise(resolve => {
        try {
            chrome.storage.sync.get('auth_token', (response) => {
                resolve(response.auth_token);
            });
        } catch (e) {
            console.log(e);
            resolve({});
        }
    });
  }

  backToRecordList(){
		setTimeout(function(){
			this.setState({
				showingScreen:1,
			});
		}.bind(this),200);
	}

  signIn(){
    this.setState({showingScreen:1,loading:true});
  }

  logout(){
		this.setState({showingScreen:0});
		window.close();
	}
  
  render() {
    let selectedScreen = this.state['showingScreen'];

    if (selectedScreen == 0) {
      return (
				<div>
					<Login
              signIn={this.signIn.bind(this)}
					/>
        </div>
			);
    } else if(selectedScreen == 1) {
      return (
        <div>
          <Home
            whichScreen = {this.state['whichScreen']}
            loading = {this.state['loading']}
            logout={this.logout.bind(this)}
          />
        </div>
      );
    } else if(selectedScreen == 2) {
      return (
        <div>
          <RecordDetails
            backToRecordList={this.backToRecordList.bind(this)}
          />
        </div>
      );
    } else if(selectedScreen == 3) {
      return (
        <div>
          <SyncUser
            backToRecordList={this.backToRecordList.bind(this)}
          />
        </div>
      );
    }
  }

}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(App);
