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
import { inteprateClientlistFormAction, clientlistProfileData , popDeleteDialog, InteprateClientlistEvent } from '../dataControl/ClientlistRequestHandler';

//state management
import { useClientlistState } from '../dataControl/ClientlistStateManager';



import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown
} from '../../UiControl/componentControl';



export default function ClientlistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ClientlistMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Clientlist states
  const [stateItem, stateItemSetters] = useClientlistState(settersOverrides);
  const clientsNode = stateItem.clientlistNode
  
  // -- basic states --//
  const paramClientlistUptoken  = stateItem.clientlistUptoken
  const clientlistActionStatus = stateItem.clientlistActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setClientlistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postClientlistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateClientlistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postClientlistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("ClientlistProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    clientlistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("ClientlistProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center " id="ClientlistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postClientlistFormData} encType="multipart/form-data" id="clients_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {clientsNode?.primkey ? (  <span>Client list Profile</span> ) :(<span> New Client Account</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramClientlistUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramClientlistUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
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
                
                
                {paramClientlistUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramClientlistUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramClientlistUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramClientlistUptoken && (
                
                <AddNewButton link="./profile" label="New Client Account" icon="plus-circle" />
                
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
                    module="clients"
                    field="client_name"
                    label="Client Name"
                    value={clientsNode?.client_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="client_type"
                    label="Client Type"
                    value={clientsNode?.client_type || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="phone_number"
                    label="Phone Number"
                    value={clientsNode?.phone_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="alt_phone"
                    label="Alt Phone"
                    value={clientsNode?.alt_phone || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="clients"
                    field="email"
                    label="Email"
                    value={clientsNode?.email || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    {clientsNode?.primkey && (
                      <div className="form-group col-md-6 hive_data_cell  ">
                        <label >National Id</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_national_id" name="div_national_id" placeholder="National Id">{clientsNode?.national_id || ""}</div>
                      </div>)}
                      
                      <MosySmartField
                      module="clients"
                      field="kra_pin"
                      label="Kra Pin"
                      value={clientsNode?.kra_pin || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="vehicle_plate"
                      label="Vehicle Plate"
                      value={clientsNode?.vehicle_plate || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="contact_person"
                      label="Contact Person"
                      value={clientsNode?.contact_person || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="payment_mode_preference"
                      label="Payment Mode Preference"
                      value={clientsNode?.payment_mode_preference || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="credit_limit"
                      label="Credit Limit"
                      value={clientsNode?.credit_limit || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="balance_due"
                      label="Balance Due"
                      value={clientsNode?.balance_due || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="client_status"
                      label="Client Status"
                      value={clientsNode?.client_status || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="loyalty_points"
                      label="Loyalty Points"
                      value={clientsNode?.loyalty_points || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="physical_address"
                      label="Physical Address"
                      value={clientsNode?.physical_address || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="county"
                      label="County"
                      value={clientsNode?.county || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="location_description"
                      label="Location Description"
                      value={clientsNode?.location_description || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="registered_by"
                      label="Registered By"
                      value={clientsNode?.registered_by || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="registered_on"
                      label="Registered On"
                      value={clientsNode?.registered_on || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="last_transaction_on"
                      label="Last Transaction On"
                      value={clientsNode?.last_transaction_on || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="remarks"
                      label="Remarks"
                      value={clientsNode?.remarks || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                      
                      <MosySmartField
                      module="clients"
                      field="created_on"
                      label="Created On"
                      value={clientsNode?.created_on || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="text"
                      cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                      />
                      
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons tblName="clients" extraClass="optional-custom-class" />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="clients_uptoken" name="clients_uptoken" value={paramClientlistUptoken}/>
                  <input type="hidden" id="clients_mosy_action" name="clients_mosy_action" value={clientlistActionStatus}/>
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
    
