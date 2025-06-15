
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultBankdepositsStateDefaults = {

  //state management for list page
  bankdepositsListData : [],
  bankdepositsListPageCount : 1,
  bankdepositsLoading: true,  
  parentUseEffectKey : 'loadBankdepositsList',
  localEventSignature: 'loadBankdepositsList',
  bankdepositsQuerySearchStr: '',

  
  //for profile page
  bankingNode : {},
  bankdepositsActionStatus : 'add_banking',
  parambankdepositsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  bankdepositsUptoken:'',
  bankdepositsNode : {},
  
  //dataScript
  bankdepositsCustomProfileQuery : '',
  deposithistoryCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useBankdepositsState(overrides = {}) {
  const combinedDefaults = { ...defaultBankdepositsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

