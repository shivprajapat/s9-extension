import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import AlphabetList from "react-alphabet-list";
import Scrollbar from 'react-smooth-scrollbar';

export interface IAppProps {
  dispatch: Dispatch<any>;
}

class RecordList extends Component<IAppProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
   
  }
  // getName(data){
  //     let recordName = [];
  //     data.map((record,key) => {	
  //       recordName.push(record.FIELD1);
  //     });
  //     return recordName;
  // }
  
  showRecordDetail(selectedRecord){
		chrome.runtime.sendMessage({type: 'singleRecord',value:selectedRecord}, function(response) {if (chrome.runtime.lastError) {}});
	}

  recordItemDump(){
    let recordList = this.props['appState']['allRecords']['records'];
    let recordArr=[];
    if(recordList.length == 0){
			return(
				<div id="notFound">
					<p className="norecords_msg">No records Found</p>
				</div>
			)
		}else{
      recordList.map((item,key) => {
        let files = item.attachments.length +" Files";	
        recordArr.push(
          <div key={item} >
            <div className="record-card">
              <div className="record-icon">
                <img className="record-image" src="../images/default_icon.png"/>  
              </div>
              <div className="container" onClick={this.showRecordDetail.bind(this,item)}>
                <h5 className="record-name"><b>{item.name}</b></h5>
                <span>{files}</span>
              </div>
              <img className="icon-fav" src="../images/icon_fav.svg" />
            </div>
        </div>
        )										
      });
      return recordArr;
    }
	}
  render() {
    
     return (
      <div className='record-list-body'>
        <Scrollbar style={{ height: 410}}>	
          {this.recordItemDump()}
        </Scrollbar>
        {/* <AlphabetList
          data={this.getName(data)}
          style={{width:'100%'}}
          
          generateFn={
            (item, index) => {
              return (
                <div key={item} >
                  <div className="record-card">
                      <div className="record-icon">
                        <img src="img_avatar.png" alt="Avatar"/>  
                      </div>
                      <div className="container">
                        <h4><b>{item}</b></h4>
                        <span>test</span>
                      </div>
                    </div>
                </div>
              )
            }
          }
        />   */}
      </div>
    );
  }
}

const mapStateToProps = (state): Partial<IAppProps> => {
  return state;
};

export default connect(mapStateToProps)(RecordList);
