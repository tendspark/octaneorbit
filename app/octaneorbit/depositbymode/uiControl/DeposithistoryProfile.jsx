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
import { inteprateDeposithistoryFormAction, deposithistoryProfileData , popDeleteDialog, InteprateDeposithistoryEvent } from '../dataControl/DeposithistoryRequestHandler';

//state management
import { useDeposithistoryState } from '../dataControl/DeposithistoryStateManager';

import  DeposithistoryList from './DeposithistoryList';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown
} from '../../UiControl/componentControl';



export default function DeposithistoryProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DeposithistoryMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Deposithistory states
  const [stateItem, stateItemSetters] = useDeposithistoryState(settersOverrides);
  const deposits_by_modeNode = stateItem.deposithistoryNode
  
  // -- basic states --//
  const paramDeposithistoryUptoken  = stateItem.deposithistoryUptoken
  const deposithistoryActionStatus = stateItem.deposithistoryActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDeposithistoryNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDeposithistoryFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDeposithistoryFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDeposithistoryFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("DeposithistoryProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    deposithistoryProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("DeposithistoryProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center " id="DeposithistoryProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postDeposithistoryFormData} encType="multipart/form-data" id="deposits_by_mode_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {deposits_by_modeNode?.primkey ? (  <span> Deposit / {deposits_by_modeNode?.ref_number || ""}</span> ) :(<span>  Record banking deposit </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramDeposithistoryUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramDeposithistoryUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
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
                
                
                {paramDeposithistoryUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramDeposithistoryUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramDeposithistoryUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramDeposithistoryUptoken && (
                
                <AddNewButton link="./profile" label=" Record banking deposit " icon="plus-circle" />
                
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
                    <LiveSearchDropdown
                    apiEndpoint="/api/octaneorbit/stations/fuelstations"
                    tblName="fuel_stations"
                    parentTable="deposits_by_mode"
                    inputName="txt__fuel_stations_station_name_station_id"
                    hiddenInputName="txt_station_id"
                    valueField="record_id"
                    displayField="station_name"
                    label="Station"
                    defaultValue={{ record_id: deposits_by_modeNode?.station_id || "", station_name: deposits_by_modeNode?._fuel_stations_station_name_station_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  console.log("Data seleted")}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="deposits_by_mode"
                    field="date_deposited"
                    label="Date Deposited"
                    value={deposits_by_modeNode?.date_deposited || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="deposits_by_mode"
                    field="amount_deposited"
                    label="Amount Deposited"
                    value={deposits_by_modeNode?.amount_deposited || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Payment Mode</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/depositbymode/deposithistory"
                      idField="primkey"
                      labelField="payment_mode"
                      inputName="txt_payment_mode"
                      label="Payment Mode"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={deposits_by_modeNode?.payment_mode || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="deposits_by_mode"
                    field="ref_number"
                    label="Ref Number"
                    value={deposits_by_modeNode?.ref_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="deposits_by_mode"
                    field="shift_id"
                    label="Shift Id"
                    value={deposits_by_modeNode?.shift_id || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    <LiveSearchDropdown
                    apiEndpoint="/api/octaneorbit/banking/bankdeposits"
                    tblName="banking"
                    parentTable="deposits_by_mode"
                    inputName="txt__banking_record_id_deposit_file_id"
                    hiddenInputName="txt_deposit_file_id"
                    valueField="record_id"
                    displayField="record_id"
                    label="Deposit File Id"
                    defaultValue={{ record_id: deposits_by_modeNode?.deposit_file_id || "", record_id: deposits_by_modeNode?._banking_record_id_deposit_file_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) => handleInputChange(`txt_shift_id`,(dataRes?.shift_code))}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="deposits_by_mode"
                    field="remark"
                    label="Remark"
                    value={deposits_by_modeNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="deposits_by_mode" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="deposits_by_mode_uptoken" name="deposits_by_mode_uptoken" value={paramDeposithistoryUptoken}/>
                <input type="hidden" id="deposits_by_mode_mosy_action" name="deposits_by_mode_mosy_action" value={deposithistoryActionStatus}/>
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
  
