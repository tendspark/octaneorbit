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
import { inteprateFuelstationsFormAction, fuelstationsProfileData , popDeleteDialog, InteprateFuelstationsEvent } from '../dataControl/FuelstationsRequestHandler';

//state management
import { useFuelstationsState } from '../dataControl/FuelstationsStateManager';

import  FuelstationsList from './FuelstationsList';

import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  MosyDateInputComponent,
} from '../../UiControl/componentControl';



export default function FuelstationsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="FuelstationsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Fuelstations states
  const [stateItem, stateItemSetters] = useFuelstationsState(settersOverrides);
  const fuel_stationsNode = stateItem.fuelstationsNode
  
  // -- basic states --//
  const paramFuelstationsUptoken  = stateItem.fuelstationsUptoken
  const fuelstationsActionStatus = stateItem.fuelstationsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setFuelstationsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postFuelstationsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateFuelstationsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postFuelstationsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("FuelstationsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    fuelstationsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("FuelstationsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center " id="FuelstationsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postFuelstationsFormData} encType="multipart/form-data" id="fuel_stations_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {fuel_stationsNode?.primkey ? (  <span>Station profile /  {fuel_stationsNode?.station_code || ""} / {fuel_stationsNode?.station_name || ""}</span> ) :(<span> Add Station</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramFuelstationsUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramFuelstationsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
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
                
                
                {paramFuelstationsUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramFuelstationsUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramFuelstationsUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramFuelstationsUptoken && (
                
                <AddNewButton link="./station_profile" label="Add Station" icon="plus-circle" />
                
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
                    <div className="col-md-5 text-center">Station Info</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="station_name"
                    label="Station Name"
                    value={fuel_stationsNode?.station_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="station_code"
                    label="Station Code"
                    value={fuel_stationsNode?.station_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="storage_capacity_litres"
                    label="Storage Capacity Litres"
                    value={fuel_stationsNode?.storage_capacity_litres || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="manager_name"
                    label="Manager"
                    value={fuel_stationsNode?.manager_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="contact_number"
                    label="Mobile"
                    value={fuel_stationsNode?.contact_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="email"
                    label="Email"
                    value={fuel_stationsNode?.email || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label >Is Operational</label>
                      
                      <select name="txt_is_operational" id="txt_is_operational" className="form-control">
                        <option  value={fuel_stationsNode?.is_operational || ""}>{fuel_stationsNode?.is_operational || "Select Is Operational"}</option>
                        <option>Yes</option>
                        <option>No</option>
                        
                      </select>
                    </div>
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">County</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/stations/fuelstations"
                      idField="primkey"
                      labelField="county"
                      inputName="txt_county"
                      label="County"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_stationsNode?.county || ""}
                      />
                    </div>
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Location</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/stations/fuelstations"
                      idField="primkey"
                      labelField="location"
                      inputName="txt_location"
                      label="Location"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_stationsNode?.location || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="opening_hours"
                    label="Opening Hours"
                    value={fuel_stationsNode?.opening_hours || ""}
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
                    <div className="col-md-5 text-center">Account Details</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="bank_account_name"
                    label="Bank Account Name"
                    value={fuel_stationsNode?.bank_account_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="bank_account_number"
                    label="Bank Account Number"
                    value={fuel_stationsNode?.bank_account_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="paybill_number"
                    label="Paybill Number"
                    value={fuel_stationsNode?.paybill_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="till_number"
                    label="Till Number"
                    value={fuel_stationsNode?.till_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Default Payment Mode</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/octaneorbit/stations/fuelstations"
                      idField="primkey"
                      labelField="default_payment_mode"
                      inputName="txt_default_payment_mode"
                      label="Default Payment Mode"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={fuel_stationsNode?.default_payment_mode || ""}
                      />
                    </div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Compliance Info</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label >Has Atg System</label>
                      
                      <select name="txt_has_atg_system" id="txt_has_atg_system" className="form-control">
                        <option  value={fuel_stationsNode?.has_atg_system || ""}>{fuel_stationsNode?.has_atg_system || "Select Has Atg System"}</option>
                        <option>Yes</option>
                        <option>No</option>
                        
                      </select>
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="erp_integration_code"
                    label="Erp Integration Code"
                    value={fuel_stationsNode?.erp_integration_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="licence_number"
                    label="Licence Number"
                    value={fuel_stationsNode?.licence_number || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="licence_expiry_date"
                    label="Licence Expiry Date"
                    value={fuel_stationsNode?.licence_expiry_date || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Additional Details</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label >Status</label>
                      
                      <select name="txt_status" id="txt_status" className="form-control">
                        <option  value={fuel_stationsNode?.status || ""}>{fuel_stationsNode?.status || "Select Status"}</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Under maintainance</option>
                        
                      </select>
                    </div>
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="latitude"
                    label="Latitude"
                    value={fuel_stationsNode?.latitude || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="longitude"
                    label="Longitude"
                    value={fuel_stationsNode?.longitude || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="google_maps_link"
                    label="Google Maps Link"
                    value={fuel_stationsNode?.google_maps_link || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="additional_details"
                    label="Notes and remarks"
                    value={fuel_stationsNode?.additional_details || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                    
                    <MosySmartField
                    module="fuel_stations"
                    field="created_on"
                    label="Created On"
                    value={fuel_stationsNode?.created_on || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    {fuel_stationsNode?.primkey && (
                      <div className="form-group col-md-6 hive_data_cell  ">
                        <label >Date Added</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_date_added" name="div_date_added" placeholder="Date Added">{fuel_stationsNode?.date_added || ""}</div>
                      </div>)}
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons tblName="fuel_stations" extraClass="optional-custom-class" />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="fuel_stations_uptoken" name="fuel_stations_uptoken" value={paramFuelstationsUptoken}/>
                  <input type="hidden" id="fuel_stations_mosy_action" name="fuel_stations_mosy_action" value={fuelstationsActionStatus}/>
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
            {fuel_stationsNode?.primkey && (
              <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`More stations list`} </h5>
                
                <div className="col-md-12 p-2 text-right ">
                  <a href={`../stations/list?fuel_stations_mosyfilter`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
                </div>
                
                <FuelstationsList
                key={`${customQueryStr}-${localEventSignature}`}
                dataIn={{
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  customQueryStr : '',
                  customProfilePath:""
                  
                }}
                
                dataOut={{
                  setChildDataOut: InteprateFuelstationsEvent,
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
  
