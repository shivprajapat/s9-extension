import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {DebounceInput} from 'react-debounce-input';
import RecordList from "./RecordList";


export interface IAppProps {
  dispatch: Dispatch<any>;
  logout:Function;
}

class Home extends Component<IAppProps> {
	constructor(props) {
		super(props);
		this.state = {
			shown: props['whichScreen'],
			searchStr:'',
		};
	}

	componentDidMount() {
		
	}

	folderTab(){
		this.setState({shown: 3});
	}	

	//All and  Fav Tabs  Click
    All_and_Fav_Tabs(param,event) {
		// if(param == 1){
		// 	this.setState({showingRecordLen:this.props.allRecord.length});
		// }else if(param == 2){
		// 	this.setState({showingRecordLen:this.props.favRecord.length});
		// }else if(param == 4){
		// 	this.setState({showingRecordLen:this.props.webLoginRecord.length});
		// }
		this.setState({ shown: param,searchStr:''});
		//Constants.selectedTab = param;
	}
	//search Records
	searchRecords(event){	
		// if(this.state.shown == 3){
		// 	this.state.shown = 1;
		// }	
		// var searchVal = event.target.value;
		// this.setState({searchStr:searchVal})
		// this.props.searchRecord(searchVal,this.state.shown);
	}
	logout(){
		chrome.runtime.sendMessage({type:'logoutExtension'}, function(response) {if (chrome.runtime.lastError) {}});
	}
	clearSearch(){
		this.setState({searchStr:""});
		//this.props.searchRecord('',this.state.shown);
	}
	// //search Records
	// searchRecords(event){	
	// 	if(this.state.shown == 3){
	// 		this.state.shown = 1;
	// 	}	
	// 	var searchVal = event.target.value;
	// 	this.setState({searchStr:searchVal})
	// 	this.props.searchRecord(searchVal,this.state.shown);
	// }
	HeaderDump(){
		return (
            <div className="home-content-header">
				{this.LogoDump()}
				{this.TabDump()}
				{this.LogoutButtonDump()}
			</div>
        )
	}
	LogoDump(){
		return(
			<div className="imgLogo">
				<span className="app-name">
					<img className="home-logo" src="../images/splashId-logo.png" height="35"/>SplashID
				</span>
			</div>
		)
	}
	TabDump(){
		let selectedTab = this.state['shown'];
		return(
			<ul className="nav nav-pills" id="TabLiData">
				<li className={ selectedTab == 3 ? 'active folder-li' : 'folder-li'}> 
					<a className="tabnavClick folder-a" data-toggle="tab" onClick={this.folderTab.bind(this)}>
						<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder" width={20} height={17} className="svg-inline--fa fa-folder fa-w-16 folder-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"></path>
						</svg>
					</a>
				</li>
				<li className={ selectedTab==4 ? 'active' : ''} onClick={this.All_and_Fav_Tabs.bind(this,4)}>
					<a className={ selectedTab==4 ? 'tabnavClick web-login-tab' : 'tabnavClick'} href="#1a" data-toggle="tab">
						<i className="fa fa-globe" aria-hidden="true"></i>
					</a>
				</li>
				<li className={ selectedTab==1 ? 'active' : ''}> 
					<a className="tabnavClick" href="#1a" data-toggle="tab" id="allContain" onClick={this.All_and_Fav_Tabs.bind(this,1)}>All</a>
				</li>
				<li className={ selectedTab == 2 ? 'active' : ''}> 
					<a className="tabnavClick" href="#1a" data-toggle="tab" id="allFav" onClick={this.All_and_Fav_Tabs.bind(this,2)}>Fav</a>
				</li>
			</ul>
		)
	}
	LogoutButtonDump(){
		return(
			<span id="logout" onClick={this.logout.bind(this)}>
				<i className="fa fa-sign-out logout-icon" aria-hidden="true"></i>

				{/* <i className="logout-icon" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Logout"></i> */}
			</span>
		)
	}
	SearchViewDump(){
		return (
			<div className="search-box">
				<div className="form-group" id="search-group">
					<DebounceInput
						placeholder="Search records..."
						className="form-control search-input"
						autoFocus
						minLength={1}
						debounceTimeout={500}
						value={this.state['searchStr']}
						onChange={this.searchRecords.bind(this)} 
					/>
					{this.iconDump()}
				</div>
				{this.ShowingRecordDump()}
			</div>
        )
	}
	iconDump(){
		if(this.state['searchStr'].length == 0){
			return(
				<i className="search-icon" id="searchIcon"></i>
			)
		}else{
			return(
				<span className="clear-x" onClick={this.clearSearch.bind(this)}></span>
			)
		}
	}
	ShowingRecordDump(){
		if(this.state['shown'] == 3){
			return(
				<div className="showing-record">
					Logins for : <span className="font-bold"> abc </span>
				</div>
			)
		}else{
			let filterRecordMsg;
			let recordList = this.props['appState']['allRecords']['records'];
			// if(this.state.searchStr.length == 0){
			// 	filterRecordMsg = "records";
			// }else{
			// 	var filterRecordLen = 0;
			// 	if(this.state.shown == 1){
			// 		filterRecordLen = this.props.allRecordOld.length;
			// 	}else if(this.state.shown == 4){
			// 		filterRecordLen = this.props.webLoginRecordOld.length;
			// 	}else{
			// 		filterRecordLen = this.props.favRecordOld.length;
			// 	}
			filterRecordMsg = "records (filtered from "+recordList.length+" total entries)";
			// }
			return(
				<div className="showing-record">
					Showing <span className="font-bold"> {recordList.length} </span> {filterRecordMsg}
				</div>
			)
		}
	}
	RecordListDump(){
		let selectedTab = this.state['shown'];
		// return(
		// <RecordList 
			
		// />)
		if(selectedTab == 3){
			return(
				<div></div>
				// <FolderRecordList
				// 	folderRecordList={this.props.folderRecord}
				// 	domainName={this.props.domainName}
				// 	customIcon={this.props.customIcon}
				// /> 
			)
		}else{
			console.log(this.props['loading']);
			if(this.props['loading']){
				return(
					<div style={{height:'416px'}}>
						<img className="loader loader_position" src="https://splashid.com/images/loader.svg" />
					</div>
				)
			}else{
				return(
					<RecordList 
						
					/>
				)
			}
		}
	}
	FooterDump(){
		return (
            <div className="home-content-footer">
				<label className="home-content-footer-label">
					<span className="footer-check-icon">
						<i className="fa fa-check seti" aria-hidden="true"></i>
					</span>
					<b className="">Disable Auto-Capture Web Logins</b>
				</label>
			</div>
        )
	}
	render() {
		return (
			<div className="login-content" id="Loginscreen">
				<div className="main-popup-body">
					{this.HeaderDump()}
					{this.SearchViewDump()}
					{this.RecordListDump()}
					{this.FooterDump()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(Home);
