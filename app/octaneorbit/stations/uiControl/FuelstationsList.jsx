'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from "../../../MosyUtils/hiveUtils"

import { mosyFilterUrl } from "../../DataControl/MosyFilterEngine";

//print utils
import { exportTableToExcel } from '../../../MosyUtils/exportToExcel';
import { mosyPrintToPdf } from '../../../MosyUtils/hiveUtils';


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
import { loadFuelstationsListData, popDeleteDialog, InteprateFuelstationsEvent  } from '../dataControl/FuelstationsRequestHandler';

//state management
import { useFuelstationsState } from '../dataControl/FuelstationsStateManager';


import { MosyLiveSearch } from '../../UiControl/customUI';

//custom event manager
import { customEventHandler } from '../../DataControl/customDataFunction';


export default function FuelstationsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../stations/station_profile",
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
  
  //manage Fuelstations states
  const [stateItem, stateItemSetters] = useFuelstationsState(settersOverrides);
  
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
    
    loadFuelstationsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_stations", keyword:stateItem.fuelstationsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Fuel Stations </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_stations" name="txt_fuel_stations" className="custom-search-input form-control" placeholder="Search in Fuel Stations "
          onChange={(e) => stateItemSetters.setFuelstationsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_stations_btn" name="qfuel_stations_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <MosyActionButton
            label=" Search by location"
            icon="search"
            onClick={()=>{
              MosyLiveSearch({
                api:'/api/octaneorbit/stations/fuelstations',
                displayField:'location',
                tableName:'fuel_stations',
                actionName : 'mosyfilter',
                title:'Search by location',
                actionData : {path: '../stations/list', router : router , qstr : `location='{{location}}'`, stateSetters : stateItemSetters}
              })
              
            }}
            />
            
            
            <AddNewButton link={customProfilePath} label="Add Station" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "fuel_stations_print_card", defaultTitle:"Fuel Stations"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("fuel_stations_data_table", "Fuel Stations.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 " id="fuel_stations_print_card">
      <table className="table table-hover  text-left printTarget" id="fuel_stations_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Station Name</b></th>
            <th scope="col"><b>Station Code</b></th>
            <th scope="col"><b>Manager</b></th>
            <th scope="col"><b>Mobile</b></th>
            <th scope="col"><b>County</b></th>
            <th scope="col"><b>Location</b></th>
            <th scope="col"><b>Is Operational</b></th>
            <th scope="col"><b>Date Added</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.fuelstationsLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="9" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Fuel Stations ...</h5>
              </td>
            </tr>
          ) : stateItem.fuelstationsListData?.length > 0 ? (
            stateItem.fuelstationsListData.map((listfuel_stations_result, index) => (
              <Fragment key={`_row_${listfuel_stations_result.primkey}`}>
                <tr key={listfuel_stations_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn"><b>{listfuel_stations_result.row_count}</b></div>
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="fuel_stations"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listfuel_stations_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                        <MosyGridRowOptions
                        label=" View pumps"
                        icon="list"
                        dataIn={{actionName:'view_station_pumps',data:`${listfuel_stations_result?.record_id}`}}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td scope="col"><span title={listfuel_stations_result.station_name}>{magicTrimText(listfuel_stations_result.station_name, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.station_code}>{magicTrimText(listfuel_stations_result.station_code, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.manager_name}>{magicTrimText(listfuel_stations_result.manager_name, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.contact_number}>{magicTrimText(listfuel_stations_result.contact_number, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.county}>{magicTrimText(listfuel_stations_result.county, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.location}>{magicTrimText(listfuel_stations_result.location, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.is_operational}>{magicTrimText(listfuel_stations_result.is_operational, 70)}</span></td>
                  <td scope="col"><span title={listfuel_stations_result.date_added}>{magicTrimText(listfuel_stations_result.date_added, 70)}</span></td>
                  
                </tr>
                
              </Fragment>
              
            ))
            
          ) : (
            
            <tr><td colSpan="9" className="text-muted">
              
              
              <div className="col-md-12 text-center mt-4">
                <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel stations records found</h6>
                
                <AddNewButton link={customProfilePath} label="Add Station" icon="plus-circle" />
                <div className="col-md-12 pt-5 " id=""></div>
              </div>
            </td></tr>
            
          )}
        </tbody>
      </table>
    </div>
    <MosyPaginationUi
    tblName="fuel_stations"
    totalPages={stateItem.fuelstationsListPageCount}
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

