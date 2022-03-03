import { RecordModel } from '../../../models/RecordModel';

const defaultState = {
  count: 0,
  allRecords: new RecordModel([]),
  selectedRecord: [],
};

//export default (state = defaultState, action) => {
const mainReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_COUNT':
      return {
        ...state,
        count: state.count + (action.payload || 1)
      }
    case 'GET_ALL_RECORD':
      return {
        ...state,
        allRecords: action.allRecords
      }
    case 'SELECTED_RECORD':
      return {
        ...state,
        selectedRecord: action.selectedRecord
      }
    default:
      return state;
  }
};

export default mainReducer;
