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
import { inteprateFuelpumpsFormAction, fuelpumpsProfileData , popDeleteDialog, InteprateFuelpumpsEvent } from '../dataControl/FuelpumpsRequestHandler';

//state management
import { useFuelpumpsState } from '../dataControl/FuelpumpsStateManager';

import  FuelpumpsList from './FuelpumpsList';

//nozzles data & component
//list
import FuelnozzlesList from '../../nozzles/UiControl/FuelnozzlesList';
import {InteprateFuelnozzlesEvent} from '../../nozzles/dataControl/FuelnozzlesRequestHandler';

//profile
import FuelnozzlesProfile from '../../nozzles/UiControl/FuelnozzlesProfile';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown
} from '../../UiControl/componentControl';



export default function FuelpumpsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="FuelpumpsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Fuelpumps states
  const [stateItem, stateItemSetters] = useFuelpumpsState(settersOverrides);
  const fuel_pumpsNode = stateItem.fuelpumpsNode
  
  // -- basic states --//
  const paramFuelpumpsUptoken  = stateItem.fuelpumpsUptoken
  const fuelpumpsActionStatus = stateItem.fuelpumpsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setFuelpumpsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postFuelpumpsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateFuelpumpsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postFuelpumpsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("FuelpumpsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    fuelpumpsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("FuelpumpsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //SetFuelnozzlesCustomProfileQuery Script
  const SetFuelnozzlesCustomProfileQuery = stateItemSetters.SetFuelnozzlesCustomProfileQuery;
  const fuelnozzlesCustomProfileQuery =  stateItem.fuelnozzlesCustomProfileQuery;
  
  useEffect(() => {
    if (fuel_pumpsNode?.primkey && SetFuelnozzlesCustomProfileQuery) {
      
      const query = `where pump_id ='${fuel_pumpsNode?.record_id}' order by primkey desc   `;
      
      const tokenUrl = mosyUrlParam("fuel_pump_nozzles_uptoken")
      
      if(!tokenUrl)
      {
        SetFuelnozzlesCustomProfileQuery(query);
      }
      
    }
  }, [fuel_pumpsNode, SetFuelnozzlesCustomProfileQuery]);
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="FuelpumpsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postFuelpumpsFormData} encType="multipart/form-data" id="fuel_pumps_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {fuel_pumpsNode?.primkey ? (  <span>Pump details / {fuel_pumpsNode?.pump_name || ""}</span> ) :(<span> Add pump</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramFuelpumpsUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramFuelpumpsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
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
                
                
                {paramFuelpumpsUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramFuelpumpsUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramFuelpumpsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramFuelpumpsUptoken && (
                
                <AddNewButton link="./profile" label="Add pump" icon="plus-circle" />
                
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
                    module="fuel_pumps"
                    field="pump_name"
                    label="Pump Name"
                    value={fuel_pumpsNode?.pump_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    <LiveSearchDropdown
                    apiEndpoint="/api/octaneorbit/stations/fuelstations"
                    tblName="fuel_stations"
                    parentTable="fuel_pumps"
                    inputName="txt__fuel_stations_station_name_fuel_station_id"
                    hiddenInputName="txt_fuel_station_id"
                    valueField="record_id"
                    displayField="station_name"
                    label="Station"
                    defaultValue={{ record_id: fuel_pumpsNode?.fuel_station_id || "", station_name: fuel_pumpsNode?._fuel_stations_station_name_fuel_station_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  console.log("Data seleted")}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Manufacturer</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/pumps/fuelpumps"
                      idField="primkey"
                      labelField="manufacturer"
                      inputName="txt_manufacturer"
                      label="Manufacturer"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_pumpsNode?.manufacturer || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_pumps"
                    field="model_number"
                    label="Model Number"
                    value={fuel_pumpsNode?.model_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_pumps"
                    field="installation_date"
                    label="Installation Date"
                    value={fuel_pumpsNode?.installation_date || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label >Status</label>
                      
                      <select name="txt_status" id="txt_status" className="form-control">
                        <option  value={fuel_pumpsNode?.status || ""}>{fuel_pumpsNode?.status || "Select Status"}</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        
                      </select>
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_pumps"
                    field="created_on"
                    label="Created On"
                    value={fuel_pumpsNode?.created_on || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    {fuel_pumpsNode?.primkey && (
                      <div className="form-group col-md-6 hive_data_cell  ">
                        <label >Nozzles</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_nozzles" name="div_nozzles" placeholder="Nozzles">{fuel_pumpsNode?.nozzles || ""}</div>
                      </div>)}
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons tblName="fuel_pumps" extraClass="optional-custom-class" />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="fuel_pumps_uptoken" name="fuel_pumps_uptoken" value={paramFuelpumpsUptoken}/>
                  <input type="hidden" id="fuel_pumps_mosy_action" name="fuel_pumps_mosy_action" value={fuelpumpsActionStatus}/>
                </section>
                
                
              </div>
              
            </form>
            
            
            <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
              {/*<hive_mini_list/>*/}
              
              {fuel_pumpsNode?.primkey && (
                <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                  <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage Nozzles`} </h5>
                  <FuelnozzlesProfile
                  key={`${ fuelnozzlesCustomProfileQuery}-${localEventSignature}`}
                  dataIn={{
                    
                    parentStateSetters : stateItemSetters,
                    parentUseEffectKey : localEventSignature,
                    showNavigationIsle:false,
                    customQueryStr : fuelnozzlesCustomProfileQuery,
                    customProfileData :
                    //pump Nozzles pump id data
                    {
                      pump_id : (fuel_pumpsNode?.record_id || ""),
                      _fuel_pumps_pump_name_pump_id : (fuel_pumpsNode?.pump_name | "")
                    }
                    
                    
                    
                  }}
                  
                  dataOut={{
                    
                    setChildDataOut: InteprateFuelnozzlesEvent,
                    setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                    
                  }}
                  />
                  
                </section>
              )}
              
              
              <style jsx global>{`
              .data_list_section {
                display: none;
              }
              .bottom_tbl_handler{
                padding-bottom:70px!important;
              }
              `}
            </style>
            {fuel_pumpsNode?.primkey && (
              <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`${fuel_pumpsNode?.pump_name} Nozzle list`} </h5>
                
                <FuelnozzlesList
                key={`${customQueryStr}-${localEventSignature}`}
                dataIn={{
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  customQueryStr : btoa(`where pump_id='${fuel_pumpsNode?.record_id}' order by primkey desc `),
                  customProfilePath:""
                  
                }}
                
                dataOut={{
                  setChildDataOut: InteprateFuelnozzlesEvent,
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
  
