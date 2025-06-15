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
import { loadDailysalesListData, popDeleteDialog, InteprateDailysalesEvent  } from '../dataControl/DailysalesRequestHandler';

//state management
import { useDailysalesState } from '../dataControl/DailysalesStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

import { MosyLiveSearch } from '../../UiControl/customUI';

export default function DailysalesList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../sales/profile",
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
  
  //manage Dailysales states
  const [stateItem, stateItemSetters] = useDailysalesState(settersOverrides);
  
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
    
    loadDailysalesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_sales", keyword:stateItem.dailysalesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Daily sales </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_sales" name="txt_fuel_sales" className="custom-search-input form-control" placeholder="Search in Daily sales "
          onChange={(e) => stateItemSetters.setDailysalesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_sales_btn" name="qfuel_sales_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="fuel_sales_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Fuel Station Id</b></th>
              <th scope="col"><b>Pump Nozzle Id</b></th>
              <th scope="col"><b>Vehicle Plate</b></th>
              <th scope="col"><b>Fuel Type</b></th>
              <th scope="col"><b>Quantity Sold Litres</b></th>
              <th scope="col"><b>Sale Price Per Litre</b></th>
              <th scope="col"><b>Total Amount</b></th>
              <th scope="col"><b>Sold By Staff Id</b></th>
              <th scope="col"><b>Sale Method</b></th>
              <th scope="col"><b>Sale Date</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.dailysalesLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="11" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Daily sales ...</h5>
                </td>
              </tr>
            ) : stateItem.dailysalesListData?.length > 0 ? (
              stateItem.dailysalesListData.map((listfuel_sales_result, index) => (
                <Fragment key={`_row_${listfuel_sales_result.primkey}`}>
                  <tr key={listfuel_sales_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listfuel_sales_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="fuel_sales"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listfuel_sales_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listfuel_sales_result.fuel_station_id}>{magicTrimText(listfuel_sales_result._fuel_stations_station_name_fuel_station_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.pump_nozzle_id}>{magicTrimText(listfuel_sales_result.pump_nozzle_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.vehicle_plate}>{magicTrimText(listfuel_sales_result.vehicle_plate, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.fuel_type}>{magicTrimText(listfuel_sales_result.fuel_type, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.quantity_sold_litres}>{magicTrimText(listfuel_sales_result.quantity_sold_litres, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.sale_price_per_litre}>{magicTrimText(listfuel_sales_result.sale_price_per_litre, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.total_amount}>{magicTrimText(listfuel_sales_result.total_amount, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.sold_by_staff_id}>{magicTrimText(listfuel_sales_result.sold_by_staff_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.sale_method}>{magicTrimText(listfuel_sales_result.sale_method, 70)}</span></td>
                    <td scope="col"><span title={listfuel_sales_result.sale_date}>{magicTrimText(listfuel_sales_result.sale_date, 70)}</span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="11" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel sales records found</h6>
                  
                  <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="fuel_sales"
        totalPages={stateItem.dailysalesListPageCount}
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

