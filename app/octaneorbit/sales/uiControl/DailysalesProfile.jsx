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
import { inteprateDailysalesFormAction, dailysalesProfileData , popDeleteDialog, InteprateDailysalesEvent } from '../dataControl/DailysalesRequestHandler';

//state management
import { useDailysalesState } from '../dataControl/DailysalesStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

import  DailysalesList from './DailysalesList';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';
import { MosyLiveSearch } from '../../UiControl/customUI';



export default function DailysalesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DailysalesMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Dailysales states
  const [stateItem, stateItemSetters] = useDailysalesState(settersOverrides);
  const fuel_salesNode = stateItem.dailysalesNode
  
  // -- basic states --//
  const paramDailysalesUptoken  = stateItem.dailysalesUptoken
  const dailysalesActionStatus = stateItem.dailysalesActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDailysalesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDailysalesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDailysalesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDailysalesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("DailysalesProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    dailysalesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("DailysalesProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="DailysalesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-11 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postDailysalesFormData} encType="multipart/form-data" id="fuel_sales_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {fuel_salesNode?.primkey ? (  <span>Daily sales Profile</span>) : (<span>Add Fuel Sales</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramDailysalesUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramDailysalesUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
                  >
                  <i className='fa fa-trash'></i> Delete
                </button>)}
                
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <>{showNavigationIsle && (<div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                {paramDailysalesUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramDailysalesUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramDailysalesUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramDailysalesUptoken && (
                
                <AddNewButton link="./profile" label=" Add new" icon="plus-circle" />
                
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
                    <div className="col-md-5 text-center">Sales Info</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0 ">
                    <LiveSearchDropdown
                    apiEndpoint="/api/octaneorbit/stations/fuelstations"
                    tblName="fuel_stations"
                    parentTable="fuel_sales"
                    inputName="txt__fuel_stations_station_name_fuel_station_id"
                    hiddenInputName="txt_fuel_station_id"
                    valueField="record_id"
                    displayField="station_name"
                    label="Fuel Station Id"
                    defaultValue={{ record_id: fuel_salesNode?.fuel_station_id || "", station_name: fuel_salesNode?._fuel_stations_station_name_fuel_station_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  console.log("Data seleted")}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="pump_nozzle_id"
                    label="Pump Nozzle Id"
                    value={fuel_salesNode?.pump_nozzle_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="vehicle_plate"
                    label="Vehicle Plate"
                    value={fuel_salesNode?.vehicle_plate || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="fuel_type"
                    label="Fuel Type"
                    value={fuel_salesNode?.fuel_type || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="quantity_sold_litres"
                    label="Quantity Sold Litres"
                    value={fuel_salesNode?.quantity_sold_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="sale_price_per_litre"
                    label="Sale Price Per Litre"
                    value={fuel_salesNode?.sale_price_per_litre || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="total_amount"
                    label="Total Amount"
                    value={fuel_salesNode?.total_amount || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="sold_by_staff_id"
                    label="Sold By Staff Id"
                    value={fuel_salesNode?.sold_by_staff_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="sale_method"
                    label="Sale Method"
                    value={fuel_salesNode?.sale_method || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_sales"
                    field="sale_date"
                    label="Sale Date"
                    value={fuel_salesNode?.sale_date || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="fuel_sales" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="fuel_sales_uptoken" name="fuel_sales_uptoken" value={paramDailysalesUptoken}/>
                <input type="hidden" id="fuel_sales_mosy_action" name="fuel_sales_mosy_action" value={dailysalesActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
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
  
