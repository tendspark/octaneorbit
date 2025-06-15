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
import { loadSupplierlistListData, popDeleteDialog, InteprateSupplierlistEvent  } from '../dataControl/SupplierlistRequestHandler';

//state management
import { useSupplierlistState } from '../dataControl/SupplierlistStateManager';

import { MosyLiveSearch } from '../../UiControl/customUI';

export default function SupplierlistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../suppliers/profile",
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
  
  //manage Supplierlist states
  const [stateItem, stateItemSetters] = useSupplierlistState(settersOverrides);
  
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
    
    loadSupplierlistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"fuel_suppliers", keyword:stateItem.supplierlistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Supplier list </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_fuel_suppliers" name="txt_fuel_suppliers" className="custom-search-input form-control" placeholder="Search in Supplier list "
          onChange={(e) => stateItemSetters.setSupplierlistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qfuel_suppliers_btn" name="qfuel_suppliers_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton link={customProfilePath} label="New supplier Account " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="fuel_suppliers_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Supplier Name</b></th>
              <th scope="col"><b>Supplier Code</b></th>
              <th scope="col"><b>Contact Person</b></th>
              <th scope="col"><b>Phone Number</b></th>
              <th scope="col"><b>Email</b></th>
              <th scope="col"><b>Address</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.supplierlistLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="7" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Supplier list ...</h5>
                </td>
              </tr>
            ) : stateItem.supplierlistListData?.length > 0 ? (
              stateItem.supplierlistListData.map((listfuel_suppliers_result, index) => (
                <Fragment key={`_row_${listfuel_suppliers_result.primkey}`}>
                  <tr key={listfuel_suppliers_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listfuel_suppliers_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="fuel_suppliers"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listfuel_suppliers_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listfuel_suppliers_result.supplier_name}>{magicTrimText(listfuel_suppliers_result.supplier_name, 70)}</span></td>
                    <td scope="col"><span title={listfuel_suppliers_result.supplier_code}>{magicTrimText(listfuel_suppliers_result.supplier_code, 70)}</span></td>
                    <td scope="col"><span title={listfuel_suppliers_result.contact_person}>{magicTrimText(listfuel_suppliers_result.contact_person, 70)}</span></td>
                    <td scope="col"><span title={listfuel_suppliers_result.phone_number}>{magicTrimText(listfuel_suppliers_result.phone_number, 70)}</span></td>
                    <td scope="col"><span title={listfuel_suppliers_result.email}>{magicTrimText(listfuel_suppliers_result.email, 70)}</span></td>
                    <td scope="col"><span title={listfuel_suppliers_result.address}>{magicTrimText(listfuel_suppliers_result.address, 70)}</span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="7" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no fuel suppliers records found</h6>
                  
                  <AddNewButton link={customProfilePath} label="New supplier Account " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="fuel_suppliers"
        totalPages={stateItem.supplierlistListPageCount}
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

