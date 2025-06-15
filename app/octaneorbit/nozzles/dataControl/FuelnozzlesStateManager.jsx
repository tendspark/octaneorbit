
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultFuelnozzlesStateDefaults = {

  //state management for list page
  fuelnozzlesListData : [],
  fuelnozzlesListPageCount : 1,
  fuelnozzlesLoading: true,  
  parentUseEffectKey : 'loadFuelnozzlesList',
  localEventSignature: 'loadFuelnozzlesList',
  fuelnozzlesQuerySearchStr: '',

  
  //for profile page
  fuel_pump_nozzlesNode : {},
  fuelnozzlesActionStatus : 'add_fuel_pump_nozzles',
  paramfuelnozzlesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  fuelnozzlesUptoken:'',
  fuelnozzlesNode : {},
  
  //dataScript
  fuelnozzlesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useFuelnozzlesState(overrides = {}) {
  const combinedDefaults = { ...defaultFuelnozzlesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

