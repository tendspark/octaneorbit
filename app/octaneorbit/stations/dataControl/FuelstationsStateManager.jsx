
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultFuelstationsStateDefaults = {

  //state management for list page
  fuelstationsListData : [],
  fuelstationsListPageCount : 1,
  fuelstationsLoading: true,  
  parentUseEffectKey : 'loadFuelstationsList',
  localEventSignature: 'loadFuelstationsList',
  fuelstationsQuerySearchStr: '',

  
  //for profile page
  fuel_stationsNode : {},
  fuelstationsActionStatus : 'add_fuel_stations',
  paramfuelstationsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  fuelstationsUptoken:'',
  fuelstationsNode : {},
  
  //dataScript
  fuelstationsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useFuelstationsState(overrides = {}) {
  const combinedDefaults = { ...defaultFuelstationsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

