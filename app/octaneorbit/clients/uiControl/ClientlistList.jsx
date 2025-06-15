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
import { loadClientlistListData, popDeleteDialog, InteprateClientlistEvent  } from '../dataControl/ClientlistRequestHandler';

//state management
import { useClientlistState } from '../dataControl/ClientlistStateManager';

import { MosyLiveSearch } from '../../UiControl/customUI';

export default function ClientlistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../clients/profile",
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
  
  //manage Clientlist states
  const [stateItem, stateItemSetters] = useClientlistState(settersOverrides);
  
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
    
    loadClientlistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"clients", keyword:stateItem.clientlistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Client list </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_clients" name="txt_clients" className="custom-search-input form-control" placeholder="Search in Client list "
          onChange={(e) => stateItemSetters.setClientlistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qclients_btn" name="qclients_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton link={customProfilePath} label="New Client Account" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "clients_print_card", defaultTitle:"Client list"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("clients_data_table", "Client list.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 " id="clients_print_card">
      <table className="table table-hover  text-left printTarget" id="clients_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Client Name</b></th>
            <th scope="col"><b>Client Type</b></th>
            <th scope="col"><b>Phone Number</b></th>
            <th scope="col"><b>Alt Phone</b></th>
            <th scope="col"><b>Email</b></th>
            <th scope="col"><b>National Id</b></th>
            <th scope="col"><b>Kra Pin</b></th>
            <th scope="col"><b>Vehicle Plate</b></th>
            <th scope="col"><b>Contact Person</b></th>
            <th scope="col"><b>Payment Mode Preference</b></th>
            <th scope="col"><b>Credit Limit</b></th>
            <th scope="col"><b>Balance Due</b></th>
            <th scope="col"><b>Client Status</b></th>
            <th scope="col"><b>Loyalty Points</b></th>
            <th scope="col"><b>Physical Address</b></th>
            <th scope="col"><b>County</b></th>
            <th scope="col"><b>Location Description</b></th>
            <th scope="col"><b>Registered By</b></th>
            <th scope="col"><b>Registered On</b></th>
            <th scope="col"><b>Last Transaction On</b></th>
            <th scope="col"><b>Remarks</b></th>
            <th scope="col"><b>Created On</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.clientlistLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="23" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Client list ...</h5>
              </td>
            </tr>
          ) : stateItem.clientlistListData?.length > 0 ? (
            stateItem.clientlistListData.map((listclients_result, index) => (
              <Fragment key={`_row_${listclients_result.primkey}`}>
                <tr key={listclients_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn"><b>{listclients_result.row_count}</b></div>
                      <div className="table_cell_dropdown-content">
                        <MosySmartDropdownActions
                        tblName="clients"
                        setters={{
                          
                          childStateSetters: stateItemSetters,
                          parentStateSetters: parentStateSetters
                          
                        }}
                        
                        attributes={`${listclients_result.primkey}:${customProfilePath}:false`}
                        callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                        
                        />
                        
                      </div>
                    </div>
                  </td>
                  
                  <td scope="col"><span title={listclients_result.client_name}>{magicTrimText(listclients_result.client_name, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.client_type}>{magicTrimText(listclients_result.client_type, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.phone_number}>{magicTrimText(listclients_result.phone_number, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.alt_phone}>{magicTrimText(listclients_result.alt_phone, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.email}>{magicTrimText(listclients_result.email, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.national_id}>{magicTrimText(listclients_result.national_id, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.kra_pin}>{magicTrimText(listclients_result.kra_pin, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.vehicle_plate}>{magicTrimText(listclients_result.vehicle_plate, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.contact_person}>{magicTrimText(listclients_result.contact_person, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.payment_mode_preference}>{magicTrimText(listclients_result.payment_mode_preference, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.credit_limit}>{magicTrimText(listclients_result.credit_limit, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.balance_due}>{magicTrimText(listclients_result.balance_due, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.client_status}>{magicTrimText(listclients_result.client_status, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.loyalty_points}>{magicTrimText(listclients_result.loyalty_points, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.physical_address}>{magicTrimText(listclients_result.physical_address, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.county}>{magicTrimText(listclients_result.county, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.location_description}>{magicTrimText(listclients_result.location_description, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.registered_by}>{magicTrimText(listclients_result.registered_by, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.registered_on}>{magicTrimText(listclients_result.registered_on, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.last_transaction_on}>{magicTrimText(listclients_result.last_transaction_on, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.remarks}>{magicTrimText(listclients_result.remarks, 70)}</span></td>
                  <td scope="col"><span title={listclients_result.created_on}>{magicTrimText(listclients_result.created_on, 70)}</span></td>
                  
                </tr>
                
              </Fragment>
              
            ))
            
          ) : (
            
            <tr><td colSpan="23" className="text-muted">
              
              
              <div className="col-md-12 text-center mt-4">
                <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no clients records found</h6>
                
                <AddNewButton link={customProfilePath} label="New Client Account" icon="plus-circle" />
                <div className="col-md-12 pt-5 " id=""></div>
              </div>
            </td></tr>
            
          )}
        </tbody>
      </table>
    </div>
    <MosyPaginationUi
    tblName="clients"
    totalPages={stateItem.clientlistListPageCount}
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

