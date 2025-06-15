'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from "../../../MosyUtils/hiveUtils"

import { mosyFilterUrl } from "../../DataControl/MosyFilterEngine";


//components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyImageViewer ,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi
} from "../../UiControl/componentControl";

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadFuelnozzlesListData, popDeleteDialog, InteprateFuelnozzlesEvent  } from '../dataControl/FuelnozzlesRequestHandler';

//state management
import { useFuelnozzlesState } from '../dataControl/FuelnozzlesStateManager';



export default function FuelnozzlesList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../nozzles/profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Fuelnozzles states
  const [stateItem, stateItemSetters] = useFuelnozzlesState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadFuelnozzlesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_pump_nozzles", keyword:stateItem.fuelnozzlesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Fuel nozzles </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_pump_nozzles" name="txt_fuel_pump_nozzles" className="custom-search-input form-control" placeholder="Search in Fuel nozzles "
          onChange={(e) => stateItemSetters.setFuelnozzlesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_pump_nozzles_btn" name="qfuel_pump_nozzles_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label="Add Nozzle" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="fuel_pump_nozzles_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Pump Id</b></th>
              <th scope="col"><b>Nozzle Label</b></th>
              <th scope="col"><b>Fuel Type</b></th>
              <th scope="col"><b>Calibration Factor</b></th>
              <th scope="col"><b>Status</b></th>
              <th scope="col"><b>Installed On</b></th>
              <th scope="col"><b>Last Maintenance Date</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.fuelnozzlesLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="8" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Fuel nozzles ...</h5>
                </td>
              </tr>
            ) : stateItem.fuelnozzlesListData?.length > 0 ? (
              stateItem.fuelnozzlesListData.map((listfuel_pump_nozzles_result, index) => (
                <Fragment key={`_row_${listfuel_pump_nozzles_result.primkey}`}>
                  <tr key={listfuel_pump_nozzles_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listfuel_pump_nozzles_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="fuel_pump_nozzles"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listfuel_pump_nozzles_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listfuel_pump_nozzles_result.pump_id}>{magicTrimText(listfuel_pump_nozzles_result._fuel_pumps_pump_name_pump_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.nozzle_label}>{magicTrimText(listfuel_pump_nozzles_result.nozzle_label, 70)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.fuel_type}>{magicTrimText(listfuel_pump_nozzles_result.fuel_type, 70)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.calibration_factor}>{magicTrimText(listfuel_pump_nozzles_result.calibration_factor, 70)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.status}>{magicTrimText(listfuel_pump_nozzles_result.status, 70)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.installed_on}>{mosyFormatDateOnly(listfuel_pump_nozzles_result.installed_on)}</span></td>
                    <td scope="col"><span title={listfuel_pump_nozzles_result.last_maintenance_date}>{mosyFormatDateOnly(listfuel_pump_nozzles_result.last_maintenance_date)}</span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="8" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel pump nozzles records found</h6>
                  
                  <AddNewButton link={customProfilePath} label="Add Nozzle" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="fuel_pump_nozzles"
        totalPages={stateItem.fuelnozzlesListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
      
    </form>
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
    </div>
  );
  
}

