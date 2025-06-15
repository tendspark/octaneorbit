'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam} from "../../../MosyUtils/hiveUtils"
import { mosyFilterUrl } from "../../DataControl/MosyFilterEngine";


//components
import { MosySmartDropdownActions, AddNewButton, MosyImageViewer , MosyActionButton, MosyGridRowOptions} from "../../UiControl/componentControl";
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadFuelstockListData, popDeleteDialog, InteprateFuelstockEvent  } from '../dataControl/FuelstockRequestHandler';

//state management
import { useFuelstockState } from '../dataControl/FuelstockStateManager';



export default function FuelstockList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../fuelstock/fuelstock_profile",
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
            <a href="fuelstock" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <MosyActionButton
            label=" Review request"
            icon="edit"
            onClick={()=>{console.log(`first next js button....`)}}
            />
            
            
            <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="fuel_inventory_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Station Id</b></th>
              <th scope="col"><b>Fuel Type</b></th>
              <th scope="col"><b>Quantity Litres</b></th>
              <th scope="col"><b>Supplier Id</b></th>
              <th scope="col"><b>Delivery Date</b></th>
              <th scope="col"><b>Status</b></th>
              <th scope="col"><b>Created On</b></th>
              
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
            ) : stateItem.fuelstockListData.length > 0 ? (
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
                    
                    <td scope="col"><span title={listfuel_inventory_result.station_id}>{magicTrimText(listfuel_inventory_result.station_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.fuel_type}>{magicTrimText(listfuel_inventory_result.fuel_type, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.quantity_litres}>{magicTrimText(listfuel_inventory_result.quantity_litres, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.supplier_id}>{magicTrimText(listfuel_inventory_result.supplier_id, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.delivery_date}>{magicTrimText(listfuel_inventory_result.delivery_date, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.status}>{magicTrimText(listfuel_inventory_result.status, 70)}</span></td>
                    <td scope="col"><span title={listfuel_inventory_result.created_on}>{magicTrimText(listfuel_inventory_result.created_on, 70)}</span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="8" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel inventory records found</h6>
                  
                  
                  <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
                
              </td></tr>
              
            )}
            
          </tbody>
        </table>
        
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

