
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSupplierlistStateDefaults = {

  //state management for list page
  supplierlistListData : [],
  supplierlistListPageCount : 1,
  supplierlistLoading: true,  
  parentUseEffectKey : 'loadSupplierlistList',
  localEventSignature: 'loadSupplierlistList',
  supplierlistQuerySearchStr: '',

  
  //for profile page
  fuel_suppliersNode : {},
  supplierlistActionStatus : 'add_fuel_suppliers',
  paramsupplierlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  supplierlistUptoken:'',
  supplierlistNode : {},
  
  //dataScript
  supplierlistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSupplierlistState(overrides = {}) {
  const combinedDefaults = { ...defaultSupplierlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

