
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDeposithistoryStateDefaults = {

  //state management for list page
  deposithistoryListData : [],
  deposithistoryListPageCount : 1,
  deposithistoryLoading: true,  
  parentUseEffectKey : 'loadDeposithistoryList',
  localEventSignature: 'loadDeposithistoryList',
  deposithistoryQuerySearchStr: '',

  
  //for profile page
  deposits_by_modeNode : {},
  deposithistoryActionStatus : 'add_deposits_by_mode',
  paramdeposithistoryUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  deposithistoryUptoken:'',
  deposithistoryNode : {},
  
  //dataScript
  deposithistoryCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDeposithistoryState(overrides = {}) {
  const combinedDefaults = { ...defaultDeposithistoryStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

