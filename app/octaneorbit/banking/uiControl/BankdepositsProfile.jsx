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
import { inteprateBankdepositsFormAction, bankdepositsProfileData , popDeleteDialog, InteprateBankdepositsEvent } from '../dataControl/BankdepositsRequestHandler';

//state management
import { useBankdepositsState } from '../dataControl/BankdepositsStateManager';


//depositbymode data & component
//list
import DeposithistoryList from '../../depositbymode/uiControl/DeposithistoryList';
import {InteprateDeposithistoryEvent} from '../../depositbymode/dataControl/DeposithistoryRequestHandler';

//profile
import DeposithistoryProfile from '../../depositbymode/uiControl/DeposithistoryProfile';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown
} from '../../UiControl/componentControl';



export default function BankdepositsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="BankdepositsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Bankdeposits states
  const [stateItem, stateItemSetters] = useBankdepositsState(settersOverrides);
  const bankingNode = stateItem.bankdepositsNode
  
  // -- basic states --//
  const paramBankdepositsUptoken  = stateItem.bankdepositsUptoken
  const bankdepositsActionStatus = stateItem.bankdepositsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setBankdepositsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postBankdepositsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateBankdepositsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postBankdepositsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("BankdepositsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    bankdepositsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("BankdepositsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setDeposithistoryCustomProfileQuery Script
  const setDeposithistoryCustomProfileQuery = stateItemSetters.setDeposithistoryCustomProfileQuery;
  const deposithistoryCustomProfileQuery =  stateItem.deposithistoryCustomProfileQuery;
  
  useEffect(() => {
    if (bankingNode?.primkey && setDeposithistoryCustomProfileQuery) {
      
      const query = `where deposit_file_id ='${bankingNode?.record_id}' order by primkey desc   `;
      
      const tokenUrl = mosyUrlParam("deposits_by_mode_uptoken")
      
      if(!tokenUrl)
      {
        setDeposithistoryCustomProfileQuery(query);
      }
      
    }
  }, [bankingNode, setDeposithistoryCustomProfileQuery]);
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center " id="BankdepositsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postBankdepositsFormData} encType="multipart/form-data" id="banking_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {bankingNode?.primkey ? (  <span> Closing shift profile</span> ) :(<span>  Record closing shift </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramBankdepositsUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramBankdepositsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
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
                
                
                {paramBankdepositsUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramBankdepositsUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramBankdepositsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramBankdepositsUptoken && (
                
                <AddNewButton link="./profile" label=" Record closing shift " icon="plus-circle" />
                
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
                    parentTable="banking"
                    inputName="txt__fuel_stations_station_name_station_id"
                    hiddenInputName="txt_station_id"
                    valueField="record_id"
                    displayField="station_name"
                    label="Station"
                    defaultValue={{ record_id: bankingNode?.station_id || "", station_name: bankingNode?._fuel_stations_station_name_station_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  console.log("Data seleted")}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-3 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="banking"
                    field="shift_code"
                    label="Shift Code"
                    value={bankingNode?.shift_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="record_date"
                    label="Record Date"
                    value={bankingNode?.record_date || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="expected_sales_amount"
                    label="Expected Amt"
                    value={bankingNode?.expected_sales_amount || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="actual_banked_amount"
                    label="Amount banked"
                    value={bankingNode?.actual_banked_amount || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="variance_amount"
                    label="Variance Amount"
                    value={bankingNode?.variance_amount || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="variance_reason"
                    label="Variance Reason"
                    value={bankingNode?.variance_reason || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="bank_reference_code"
                    label="Bank Reference Code"
                    value={bankingNode?.bank_reference_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="banking"
                    field="payment_notes"
                    label="Payment Notes"
                    value={bankingNode?.payment_notes || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="banking" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="banking_uptoken" name="banking_uptoken" value={paramBankdepositsUptoken}/>
                <input type="hidden" id="banking_mosy_action" name="banking_mosy_action" value={bankdepositsActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            {bankingNode?.primkey && (
              <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage Deposits`} </h5>
                <DeposithistoryProfile
                key={`${ deposithistoryCustomProfileQuery}-${localEventSignature}`}
                dataIn={{
                  
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  customQueryStr : deposithistoryCustomProfileQuery,
                  customProfileData :
                  //bank id data
                  {
                    deposit_file_id : (bankingNode?.record_id || ""),
                    station_id : (bankingNode?.station_id || ""),
                    shift_id : (bankingNode?.shift_code || ""),
                    _fuel_stations_station_name_station_id: (bankingNode?._fuel_stations_station_name_station_id || ""),
                    _banking_record_id_deposit_file_id: (bankingNode?.record_id || "")
                  }
                  
                  
                  
                }}
                
                dataOut={{
                  
                  setChildDataOut: InteprateDeposithistoryEvent
                  ,
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
          {bankingNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Deposits list`} </h5>
              
              <DeposithistoryList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : btoa(`where deposit_file_id='${bankingNode?.record_id}' order by primkey desc `),
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateDeposithistoryEvent,
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

