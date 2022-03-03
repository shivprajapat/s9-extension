import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import Scrollbar from 'react-smooth-scrollbar';


export interface IAppProps {
  dispatch: Dispatch<any>;
  backToRecordList:Function;
  selectedRecord:[];
}

class RecordDetails extends Component<IAppProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
		
  }	
  backToRecordList(){
	this.props.backToRecordList();
  }

  RecordDetailHeader() {
	return (
		<div className="detail-content-header">
			<i className="fa fa-angle-left back-icon" onClick={this.backToRecordList.bind(this)}></i>
			<span className="app-name detail-header-logo">
				<img className="home-logo" src="../images/splashId-logo.png" height="35"/>
				SplashID
			</span>
			<div className='record-header-icon-view'>
				<img className='archive-delete-icon' src="../images/icon_archive.svg" />
				<img className='archive-delete-icon' src="../images/icon_delete.svg" />
			</div>
		</div>
	);
  }
  RecordDetailBody() {
	let selectedRecord = this.props['appState']['selectedRecord'];
	console.log(selectedRecord);
	return (
		<div className='record-details-main'>
			<div className='field-content-main'>
				<img className="home-logo record-detail-icon" src="../images/default_icon.png" height="35"/>
				<div className='record-detail-main'>
					<div className='record-detail-name'>{selectedRecord.name}</div>
					<p className='record-detail-date'>Last updates Dec 21th, 2021</p>
					<a href=''>See History</a>
				</div>
				<img className="record-detail-icon-fav" src="../images/icon_fav.svg" />  
				
			</div>
			<div className='field-content'>
				<label className='field-title'>Category</label>
				<p className='field-value'>Bussiness</p>
			</div>
			<div className='field-content'>
				<label className='field-title'>Type</label>
				<p className='field-value'>Bank Account</p>
			</div>
			<div className='field-content'>
				<label className='field-title'>Email</label>
				<div>
					<span className='field-value'>user@gmail.com</span>
					<button type="button" className="btn btn-primary field-btn">Open Link</button>
				</div>
			</div>
			<div className='field-content'>
				<label className='field-title'>Phone Number</label>
				<div>
					<span className='field-value'>+62909099009</span>
					<button type="button" className="btn btn-primary field-btn">Call Now</button>
				</div>
			</div>
			<div className='field-content'>
				<label className='field-title'>Notes</label>
				<p className='field-value'>Testing Notes</p>
			</div>
			<div className='field-content'>
				<label className='field-title'>Tags</label>
				
			</div>
			<div className='field-content'>
				<label className='field-title'>Sharing</label>
				
			</div>
			<div className='field-content'>
				<label className='field-title'>Attachment</label>
				<p>
					<img className="home-logo" src="../images/default_icon.png" height="35"/>
					<span className='attachment-name'>Attachment1</span>
				</p>
				<p>
					<img className="home-logo" src="../images/default_icon.png" height="35"/>
					<span className='attachment-name'>Attachment2</span>
				</p>
				<p>
					<img className="home-logo" src="../images/default_icon.png" height="35"/>
					<span className='attachment-name'>Attachment3</span>
				</p>
			</div>
			<div className='field-content'>
				<label className='field-title'>Sync</label>
				<p className='field-value'>No</p>
			</div>
		</div>
	);
  }
  render() {
	return (
		<div className="record-detail-content">
			{this.RecordDetailHeader()}
			<div className='record-detail-body'>
				<Scrollbar style={{ height: 510}}>	
					{this.RecordDetailBody()}
				</Scrollbar>
			</div>
		</div>
	);
  }
}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(RecordDetails);
