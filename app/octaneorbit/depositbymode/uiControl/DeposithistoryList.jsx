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
import { loadDeposithistoryListData, popDeleteDialog, InteprateDeposithistoryEvent  } from '../dataControl/DeposithistoryRequestHandler';

//state management
import { useDeposithistoryState } from '../dataControl/DeposithistoryStateManager';



export default function DeposithistoryList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../depositbymode/profile",
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
  
  //manage Deposithistory states
  const [stateItem, stateItemSetters] = useDeposithistoryState(settersOverrides);
  
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
    
    loadDeposithistoryListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"deposits_by_mode", keyword:stateItem.deposithistoryQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Deposit history </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_deposits_by_mode" name="txt_deposits_by_mode" className="custom-search-input form-control" placeholder="Search in Deposit history "
          onChange={(e) => stateItemSetters.setDeposithistoryQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qdeposits_by_mode_btn" name="qdeposits_by_mode_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton link={customProfilePath} label=" Record banking deposit " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="deposits_by_mode_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Station</b></th>
              <th scope="col"><b>Date Deposited</b></th>
              <th scope="col"><b>Amount Deposited</b></th>
              <th scope="col"><b>Payment Mode</b></th>
              <th scope="col"><b>Ref Number</b></th>
              <th scope="col"><b>Shift Id</b></th>
              <th scope="col"><b>Deposit File Id</b></th>
              <th scope="col"><b>Remark</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.deposithistoryLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="9" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Deposit history ...</h5>
                </td>
              </tr>
            ) : stateItem.deposithistoryListData?.length > 0 ? (
              stateItem.deposithistoryListData.map((listdeposits_by_mode_result, index) => (
                <Fragment key={`_row_${listdeposits_by_mode_result.primkey}`}>
                  <tr key={listdeposits_by_mode_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listdeposits_by_mode_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="deposits_by_mode"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listdeposits_by_mode_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listdeposits_by_mode_result.station_id}>{magicTrimText(listdeposits_by_mode_result._fuel_stations_station_name_station_id, 70)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.date_deposited}>{mosyFormatDateOnly(listdeposits_by_mode_result.date_deposited)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.amount_deposited}>{magicTrimText(listdeposits_by_mode_result.amount_deposited, 70)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.payment_mode}>{magicTrimText(listdeposits_by_mode_result.payment_mode, 70)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.ref_number}>{magicTrimText(listdeposits_by_mode_result.ref_number, 70)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.shift_id}>{magicTrimText(listdeposits_by_mode_result.shift_id, 70)}</span></td>
                    <td scope="col"><span title={listdeposits_by_mode_result.deposit_file_id}>{magicTrimText(listdeposits_by_mode_result._banking_record_id_deposit_file_id, 70)}</span></td>
                    <td scope="col"><span>{magicTrimText(listdeposits_by_mode_result.remark, 70)}</span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="9" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no deposits by mode records found</h6>
                  
                  <AddNewButton link={customProfilePath} label=" Record banking deposit " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="deposits_by_mode"
        totalPages={stateItem.deposithistoryListPageCount}
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

