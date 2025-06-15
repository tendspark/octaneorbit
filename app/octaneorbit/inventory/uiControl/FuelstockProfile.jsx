'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  "../../../MosyUtils/ActionModals";

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateFuelstockFormAction, fuelstockProfileData , popDeleteDialog, InteprateFuelstockEvent } from '../dataControl/FuelstockRequestHandler';

//state management
import { useFuelstockState } from '../dataControl/FuelstockStateManager';

import  FuelstockList from './FuelstockList';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown
} from '../../UiControl/componentControl';



export default function FuelstockProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="FuelstockMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Fuelstock states
  const [stateItem, stateItemSetters] = useFuelstockState(settersOverrides);
  const fuel_inventoryNode = stateItem.fuelstockNode
  
  // -- basic states --//
  const paramFuelstockUptoken  = stateItem.fuelstockUptoken
  const fuelstockActionStatus = stateItem.fuelstockActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setFuelstockNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postFuelstockFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateFuelstockFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postFuelstockFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("FuelstockProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    fuelstockProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("FuelstockProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center " id="FuelstockProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postFuelstockFormData} encType="multipart/form-data" id="fuel_inventory_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {fuel_inventoryNode?.primkey ? (  <span>Stock Item /{fuel_inventoryNode?.item_code || ""} / {fuel_inventoryNode?.item_name || ""}</span> ) :(<span> Create inventory</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramFuelstockUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramFuelstockUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
                  >
                  <i className='fa fa-trash'></i> Delete
                </button>)}
                
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <>{showNavigationIsle && (<div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                <Link href="./fuel" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                {paramFuelstockUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramFuelstockUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramFuelstockUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramFuelstockUptoken && (
                
                <AddNewButton link="./fuel_profile" label="Create inventory" icon="plus-circle" />
                
              )}
              
            </div>
          </div>)}</>
          <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
          {/*    Navigation isle      */}
          <div className="row justify-content-center m-0 p-0 col-md-12" id="">
            {/*    Image section isle      */}
            
            {/*    Image section isle      */}
            
            {/*  //-------------    main content starts here  ------------------------------ */}
            
            
            
            <div className="col-md-12 row justify-content-center m-0  p-0">
              {/*    Input cells section isle      */}
              <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Item Details & Pricing Info</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="item_name"
                    label="Item Name"
                    value={fuel_inventoryNode?.item_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="item_code"
                    label="Item Code"
                    value={fuel_inventoryNode?.item_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Fuel Type</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/inventory/fuelstock"
                      idField="primkey"
                      labelField="fuel_type"
                      inputName="txt_fuel_type"
                      label="Fuel Type"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_inventoryNode?.fuel_type || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="buying_price"
                    label="Buying Price"
                    value={fuel_inventoryNode?.buying_price || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="Selling_price"
                    label="Selling Price"
                    value={fuel_inventoryNode?.Selling_price || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Fuel Grade</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/inventory/fuelstock"
                      idField="primkey"
                      labelField="fuel_grade"
                      inputName="txt_fuel_grade"
                      label="Fuel Grade"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_inventoryNode?.fuel_grade || ""}
                      />
                    </div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Stock Details</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="current_stock_litres"
                    label="Volume (Ltrs)"
                    value={fuel_inventoryNode?.current_stock_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="density_kg_per_m3"
                    label="Density Kg Per M3"
                    value={fuel_inventoryNode?.density_kg_per_m3 || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="percentage_variance"
                    label="Loss variance (%)"
                    value={fuel_inventoryNode?.percentage_variance || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="manual_dip_reading_litres"
                    label="Manual Dip Reading Litres"
                    value={fuel_inventoryNode?.manual_dip_reading_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="atg_reading_litres"
                    label="Atg Reading Litres"
                    value={fuel_inventoryNode?.atg_reading_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center"></div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="volume_correction_factor"
                    label="Volume Correction Factor"
                    value={fuel_inventoryNode?.volume_correction_factor || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="variance_reason_code"
                    label="Variance Reason Code"
                    value={fuel_inventoryNode?.variance_reason_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="tank_reference"
                    label="Tank Reference"
                    value={fuel_inventoryNode?.tank_reference || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="last_updated_on"
                    label="Last Updated On"
                    value={fuel_inventoryNode?.last_updated_on || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="created_on"
                    label="Created On"
                    value={fuel_inventoryNode?.created_on || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="fuel_inventory" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="fuel_inventory_uptoken" name="fuel_inventory_uptoken" value={paramFuelstockUptoken}/>
                <input type="hidden" id="fuel_inventory_mosy_action" name="fuel_inventory_mosy_action" value={fuelstockActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
            
            <style jsx global>{`
            .data_list_section {
              display: none;
            }
            .bottom_tbl_handler{
              padding-bottom:70px!important;
            }
            `}
          </style>
          {fuel_inventoryNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`More stock items`} </h5>
              
              <FuelstockList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : '',
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateFuelstockEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
              }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
    
    
    {/* snack notifications -- */}
    {snackMessage &&(
      <MosySnackWidget
      content={snackMessage}
      duration={5000}
      type="custom"
      onDone={() => {
        stateItemSetters.setSnackMessage("");
        stateItem.snackOnDone(); // Run whats inside onDone
        deleteUrlParam("snack_alert")
      }}
      
      />)}
      {/* snack notifications -- */}
      
      
      {/* ================== End Feature Section========================== ------*/}
    </div>
    
  );
  
}

