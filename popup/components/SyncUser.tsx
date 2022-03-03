import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";


export interface IAppProps {
  dispatch: Dispatch<any>;
  signIn:Function;
}

class SyncUser extends Component<IAppProps> {
  constructor(props) {
    super(props);
	this.state = {	
		email:'',
		password:'',
	};
  }

  componentDidMount() {
		
	}	
	handleChange(param,event) {			
		this.setState({[param]: event.target.value});		
	}
	signIn(){
		//this.props.signIn();
		chrome.runtime.sendMessage({type: 'SendLoginLink'}, function(response) {if (chrome.runtime.lastError) {}});
		window.close();
	}
	redirectionSplashIDWebapp(){
		chrome.runtime.sendMessage({type: 'redirectionSplashIDWeb'}, function(response) {if (chrome.runtime.lastError) {}});
		window.close();
	}
	HeaderDump(){
		return(
			<div className="login-header">
				<div className="header-image" onClick={this.redirectionSplashIDWebapp.bind(this)}>
					<span className="app-name">
						<img className="home-logo" src="../images/splashId-logo.png" height="35"/>SplashID
					</span>
				</div>
				<div className="clear"></div>
			</div>
		)
	}
	BodyDump(){
		return(
			<div className="login-body-section">
				{/* <div className="form-group">
					<input type="email" className="form-control" placeholder="Email"  value={this.state['email']} onChange={this.handleChange.bind(this,"email") } required />
				</div>
				<div className="form-group">
					<input type="password" className="form-control" placeholder="Password" value={this.state['password']} onChange={this.handleChange.bind(this,"password") } required />
				</div> */}
				<div className="form-group">
					Others sync type
				</div>   
			</div>
		)
	}
	FooterDump(){
		var manifestData = chrome.runtime.getManifest();
		return(
			<div className="row" id="footerTempId">
				<div className="login-footer">
					<span className="fl">Version {manifestData.version}</span>
					<span className="splashdata fr">{'© 2001- '+(new Date).getFullYear()+' SplashData, Inc'}</span>
				</div>
			</div>
		)
	}
	render() {
		return (
			<div className="login-content" id="Loginscreen">
				<div className="main-popup-body">
					{this.HeaderDump()}
					{this.BodyDump()}
					{/* {this.FooterDump()} */}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(SyncUser);
