
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultFuelpumpsStateDefaults = {

  //state management for list page
  fuelpumpsListData : [],
  fuelpumpsListPageCount : 1,
  fuelpumpsLoading: true,  
  parentUseEffectKey : 'loadFuelpumpsList',
  localEventSignature: 'loadFuelpumpsList',
  fuelpumpsQuerySearchStr: '',

  
  //for profile page
  fuel_pumpsNode : {},
  fuelpumpsActionStatus : 'add_fuel_pumps',
  paramfuelpumpsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  fuelpumpsUptoken:'',
  fuelpumpsNode : {},
  
  //dataScript
  fuelpumpsCustomProfileQuery : '',
  fuelnozzlesCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useFuelpumpsState(overrides = {}) {
  const combinedDefaults = { ...defaultFuelpumpsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

