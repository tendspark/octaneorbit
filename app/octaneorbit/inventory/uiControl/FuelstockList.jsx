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
import { loadFuelstockListData, popDeleteDialog, InteprateFuelstockEvent  } from '../dataControl/FuelstockRequestHandler';

//state management
import { useFuelstockState } from '../dataControl/FuelstockStateManager';



export default function FuelstockList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../inventory/fuel_profile",
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
  
  //manage Fuelstock states
  const [stateItem, stateItemSetters] = useFuelstockState(settersOverrides);
  
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
    
    loadFuelstockListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_inventory", keyword:stateItem.fuelstockQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Fuel stock </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_inventory" name="txt_fuel_inventory" className="custom-search-input form-control" placeholder="Search in Fuel stock "
          onChange={(e) => stateItemSetters.setFuelstockQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_inventory_btn" name="qfuel_inventory_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="fuel" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton link={customProfilePath} label="Create inventory" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "fuel_inventory_print_card", defaultTitle:"Fuel stock"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("fuel_inventory_data_table", "Fuel stock.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 " id="fuel_inventory_print_card">
      <table className="table table-hover  text-left printTarget" id="fuel_inventory_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Item Name</b></th>
            <th scope="col"><b>Item Code</b></th>
            <th scope="col"><b>Fuel Type</b></th>
            <th scope="col"><b>Selling Price</b></th>
            <th scope="col"><b>Volume (Ltrs)</b></th>
            <th scope="col"><b>Buying Price</b></th>
            <th scope="col"><b>Fuel Grade</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.fuelstockLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="8" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Fuel stock ...</h5>
              </td>
            </tr>
          ) : stateItem.fuelstockListData?.length > 0 ? (
            stateItem.fuelstockListData.map((listfuel_inventory_result, index) => (
              <Fragment key={`_row_${listfuel_inventory_result.primkey}`}>
                <tr key={listfuel_inventory_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn"><b>{listfuel_inventory_result.row_count}</b></div>
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="fuel_inventory"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listfuel_inventory_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                      </div>
                    </div>
                  </td>
                  
                  <td scope="col"><span title={listfuel_inventory_result.item_name}>{magicTrimText(listfuel_inventory_result.item_name, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.item_code}>{magicTrimText(listfuel_inventory_result.item_code, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.fuel_type}>{magicTrimText(listfuel_inventory_result.fuel_type, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.Selling_price}>{magicTrimText(listfuel_inventory_result.Selling_price, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.current_stock_litres}>{magicTrimText(listfuel_inventory_result.current_stock_litres, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.buying_price}>{magicTrimText(listfuel_inventory_result.buying_price, 70)}</span></td>
                  <td scope="col"><span title={listfuel_inventory_result.fuel_grade}>{magicTrimText(listfuel_inventory_result.fuel_grade, 70)}</span></td>
                  
                </tr>
                
              </Fragment>
              
            ))
            
          ) : (
            
            <tr><td colSpan="8" className="text-muted">
              
              
              <div className="col-md-12 text-center mt-4">
                <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel inventory records found</h6>
                
                <AddNewButton link={customProfilePath} label="Create inventory" icon="plus-circle" />
                <div className="col-md-12 pt-5 " id=""></div>
              </div>
            </td></tr>
            
          )}
        </tbody>
      </table>
    </div>
    <MosyPaginationUi
    tblName="fuel_inventory"
    totalPages={stateItem.fuelstockListPageCount}
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

