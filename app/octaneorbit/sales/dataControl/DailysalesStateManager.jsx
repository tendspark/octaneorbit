
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDailysalesStateDefaults = {

  //state management for list page
  dailysalesListData : [],
  dailysalesListPageCount : 1,
  dailysalesLoading: true,  
  parentUseEffectKey : 'loadDailysalesList',
  localEventSignature: 'loadDailysalesList',
  dailysalesQuerySearchStr: '',

  
  //for profile page
  fuel_salesNode : {},
  dailysalesActionStatus : 'add_fuel_sales',
  paramdailysalesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  dailysalesUptoken:'',
  dailysalesNode : {},
  
  //dataScript
  dailysalesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDailysalesState(overrides = {}) {
  const combinedDefaults = { ...defaultDailysalesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

