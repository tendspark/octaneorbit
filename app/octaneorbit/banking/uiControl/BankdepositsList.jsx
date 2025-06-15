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
import { loadBankdepositsListData, popDeleteDialog, InteprateBankdepositsEvent  } from '../dataControl/BankdepositsRequestHandler';

//state management
import { useBankdepositsState } from '../dataControl/BankdepositsStateManager';

import { MosyLiveSearch } from '../../UiControl/customUI';

export default function BankdepositsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../banking/profile",
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
  
  //manage Bankdeposits states
  const [stateItem, stateItemSetters] = useBankdepositsState(settersOverrides);
  
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
    
    loadBankdepositsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"banking", keyword:stateItem.bankdepositsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Bank deposits </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_banking" name="txt_banking" className="custom-search-input form-control" placeholder="Search in Bank deposits "
          onChange={(e) => stateItemSetters.setBankdepositsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qbanking_btn" name="qbanking_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <MosyActionButton
            label=" Search by station"
            icon="search"
            onClick={()=>{
              MosyLiveSearch({
                api:'/api/octaneorbit/stations/fuelstations',
                displayField:'station_name',
                tableName:'banking',
                actionName : 'mosyfilter',
                title:'Search by station',
                actionData : {path: '../banking/list', router : router , qstr : `station_id='{{record_id}}'`, stateSetters : stateItemSetters}
              })
              
            }}
            />
            
            
            <AddNewButton link={customProfilePath} label=" Record closing shift " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "banking_print_card", defaultTitle:"Bank deposits"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("banking_data_table", "Bank deposits.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 " id="banking_print_card">
      <table className="table table-hover  text-left printTarget" id="banking_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Station</b></th>
            <th scope="col"><b>Shift Code</b></th>
            <th scope="col"><b>Record Date</b></th>
            <th scope="col"><b>Expected Amt</b></th>
            <th scope="col"><b>Amount banked</b></th>
            <th scope="col"><b>Variance Amount</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.bankdepositsLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="8" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Bank deposits ...</h5>
              </td>
            </tr>
          ) : stateItem.bankdepositsListData?.length > 0 ? (
            stateItem.bankdepositsListData.map((listbanking_result, index) => (
              <Fragment key={`_row_${listbanking_result.primkey}`}>
                <tr key={listbanking_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn"><b>{listbanking_result.row_count}</b></div>
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="banking"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listbanking_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                      </div>
                    </div>
                  </td>
                  
                  <td scope="col"><span title={listbanking_result.station_id}>{magicTrimText(listbanking_result._fuel_stations_station_name_station_id, 70)}</span></td>
                  <td scope="col"><span title={listbanking_result.shift_code}>{magicTrimText(listbanking_result.shift_code, 70)}</span></td>
                  <td scope="col"><span title={listbanking_result.record_date}>{mosyFormatDateOnly(listbanking_result.record_date)}</span></td>
                  <td scope="col"><span title={listbanking_result.expected_sales_amount}>{magicTrimText(listbanking_result.expected_sales_amount, 70)}</span></td>
                  <td scope="col"><span title={listbanking_result.actual_banked_amount}>{magicTrimText(listbanking_result.actual_banked_amount, 70)}</span></td>
                  <td scope="col"><span title={listbanking_result.variance_amount}>{magicTrimText(listbanking_result.variance_amount, 70)}</span></td>
                  
                </tr>
                
                
                <tr className="bg-light">
                  <td>-</td>
                  <td colSpan="9">
                    {/*<!-- Start  Title ribbon-->*/}
                    <div className="col-md-12 row p-2  justify-content-center p-0">
                      <div className="col text-left h6"><b>{`Deposits`}</b></div>
                      <div className="col-md-12 border-bottom border_set"></div>
                    </div>
                    {/*<!-- End Title ribbon-->*/}
                    
                    {Array.isArray(listbanking_result.deposit_list) && listbanking_result.deposit_list.length > 0 ? (
                      <>
                      {/*-- Start Table --*/}
                      <div className="table-responsive data-tables">
                        <table className="table table-hover text-left">
                          <thead className="text-uppercase">
                            <tr>
                              <th>#</th>
                              <th>payment mode</th>
                              <th>ref number</th>
                              <th>amount deposited</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {/*$banking_deposit_list_row_count=0;
                            */}
                            {listbanking_result.deposit_list.map((banking_deposit_list_record, idx) => (
                              
                              <tr key={`mini_list_${banking_deposit_list_record.row_count}`}>
                                <td><b>{banking_deposit_list_record.row_count}</b></td>
                                <td>{magicTrimText(banking_deposit_list_record.payment_mode,70)}</td>
                                <td>{magicTrimText(banking_deposit_list_record.ref_number,70)}</td>
                                <td>{magicTrimText(banking_deposit_list_record.amount_deposited,70)}</td>
                                
                              </tr>
                            ))}
                            
                          </tbody>
                          <tfoot>
                            <tr>
                              <td></td>
                              
                              <td></td>
                              <td></td>
                              <td></td>
                              
                            </tr>
                          </tfoot>
                          
                        </table>
                      </div>
                      {/*<!-- End Table -->*/}
                      {/*<!-- Start  Title ribbon-->*/}
                      <div className="col-md-12 row p-2  justify-content-center p-0">
                        <div className="col text-left multigrid_view_more skip_print no-export "><a href={`transactions_list?deposits_by_mode_mosyfilter=${btoa(`deposit_file_id='${listbanking_result.record_id}'`)}&mosytitle=${btoa(`Deposits`)}`}></a></div>
                      </div>
                      {/*<!-- End Title ribbon--> */}
                    </>
                  ) : (
                    <div className="col-md-12 text-center " id="">No Deposit List records found</div>
                    
                  )}
                  
                </td>
              </tr>
              
              
            </Fragment>
            
          ))
          
        ) : (
          
          <tr><td colSpan="8" className="text-muted">
            
            
            <div className="col-md-12 text-center mt-4">
              <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no banking records found</h6>
              
              <AddNewButton link={customProfilePath} label=" Record closing shift " icon="plus-circle" />
              <div className="col-md-12 pt-5 " id=""></div>
            </div>
          </td></tr>
          
        )}
      </tbody>
    </table>
  </div>
  <MosyPaginationUi
  tblName="banking"
  totalPages={stateItem.bankdepositsListPageCount}
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

