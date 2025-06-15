
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultFuelstockStateDefaults = {

  //state management for list page
  fuelstockListData : [],
  fuelstockListPageCount : 1,
  fuelstockLoading: true,  
  parentUseEffectKey : 'loadFuelstockList',
  localEventSignature: 'loadFuelstockList',
  fuelstockQuerySearchStr: '',

  
  //for profile page
  fuel_inventoryNode : {},
  fuelstockActionStatus : 'add_fuel_inventory',
  paramfuelstockUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  fuelstockUptoken:'',
  fuelstockNode : {},
  
  //dataScript
  fuelstockCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useFuelstockState(overrides = {}) {
  const combinedDefaults = { ...defaultFuelstockStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

