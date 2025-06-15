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
import { loadFuelpumpsListData, popDeleteDialog, InteprateFuelpumpsEvent  } from '../dataControl/FuelpumpsRequestHandler';

//state management
import { useFuelpumpsState } from '../dataControl/FuelpumpsStateManager';



export default function FuelpumpsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../pumps/profile",
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
  
  //manage Fuelpumps states
  const [stateItem, stateItemSetters] = useFuelpumpsState(settersOverrides);
  
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
    
    loadFuelpumpsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_pumps", keyword:stateItem.fuelpumpsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Fuel pumps </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_pumps" name="txt_fuel_pumps" className="custom-search-input form-control" placeholder="Search in Fuel pumps "
          onChange={(e) => stateItemSetters.setFuelpumpsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_pumps_btn" name="qfuel_pumps_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label="Add pump" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "fuel_pumps_print_card", defaultTitle:"Fuel pumps"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("fuel_pumps_data_table", "Fuel pumps.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 " id="fuel_pumps_print_card">
      <table className="table table-hover  text-left printTarget" id="fuel_pumps_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Pump Name</b></th>
            <th scope="col"><b>Station</b></th>
            <th scope="col"><b>Manufacturer</b></th>
            <th scope="col"><b>Model Number</b></th>
            <th scope="col"><b>Installation Date</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Nozzles</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.fuelpumpsLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="8" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Fuel pumps ...</h5>
              </td>
            </tr>
          ) : stateItem.fuelpumpsListData?.length > 0 ? (
            stateItem.fuelpumpsListData.map((listfuel_pumps_result, index) => (
              <Fragment key={`_row_${listfuel_pumps_result.primkey}`}>
                <tr key={listfuel_pumps_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn"><b>{listfuel_pumps_result.row_count}</b></div>
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="fuel_pumps"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listfuel_pumps_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                      </div>
                    </div>
                  </td>
                  
                  <td scope="col"><span title={listfuel_pumps_result.pump_name}>{magicTrimText(listfuel_pumps_result.pump_name, 70)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.fuel_station_id}>{magicTrimText(listfuel_pumps_result._fuel_stations_station_name_fuel_station_id, 70)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.manufacturer}>{magicTrimText(listfuel_pumps_result.manufacturer, 70)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.model_number}>{magicTrimText(listfuel_pumps_result.model_number, 70)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.installation_date}>{mosyFormatDateOnly(listfuel_pumps_result.installation_date)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.status}>{magicTrimText(listfuel_pumps_result.status, 70)}</span></td>
                  <td scope="col"><span title={listfuel_pumps_result.nozzles}>{magicTrimText(listfuel_pumps_result.nozzles, 70)}</span></td>
                  
                </tr>
                
              </Fragment>
              
            ))
            
          ) : (
            
            <tr><td colSpan="8" className="text-muted">
              
              
              <div className="col-md-12 text-center mt-4">
                <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel pumps records found</h6>
                
                <AddNewButton link={customProfilePath} label="Add pump" icon="plus-circle" />
                <div className="col-md-12 pt-5 " id=""></div>
              </div>
            </td></tr>
            
          )}
        </tbody>
      </table>
    </div>
    <MosyPaginationUi
    tblName="fuel_pumps"
    totalPages={stateItem.fuelpumpsListPageCount}
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

