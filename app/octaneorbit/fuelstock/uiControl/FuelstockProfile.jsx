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
  MosyActionButton
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
  
  // Manage delete
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
              <div className="col m-0 p-0">
                {fuel_inventoryNode?.primkey ? (  <span>Fuel stock Profile</span>) : (<span>Add Fuel Inventory</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right">
                
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
                
                <Link href="./fuelstock" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
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
                
                <AddNewButton link="./fuelstock_profile" label=" Add new" icon="plus-circle" />
                
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
              <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                <div className="col-md-12 row justify-content-center p-0 m-0">
                  <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="station_id"
                    label="Station Id"
                    value={fuel_inventoryNode?.station_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="fuel_type"
                    label="Fuel Type"
                    value={fuel_inventoryNode?.fuel_type || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="quantity_litres"
                    label="Quantity Litres"
                    value={fuel_inventoryNode?.quantity_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="supplier_id"
                    label="Supplier Id"
                    value={fuel_inventoryNode?.supplier_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="delivery_date"
                    label="Delivery Date"
                    value={fuel_inventoryNode?.delivery_date || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="status"
                    label="Status"
                    value={fuel_inventoryNode?.status || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_inventory"
                    field="created_on"
                    label="Created On"
                    value={fuel_inventoryNode?.created_on || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
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
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`${staffNode?.name} staff list`} </h5>
              
              <FuelstockList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : btoa(`where  site_id ='${staffNode?.site_id}' order by primkey desc   `),
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateSitestaffEvent,
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

