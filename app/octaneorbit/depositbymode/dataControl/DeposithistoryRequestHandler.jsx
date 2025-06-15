'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertDeposithistory() {
 //console.log(`Form deposits_by_mode insert sent `)

  return await mosyPostFormData({
    formId: 'deposits_by_mode_profile_form',
    url: '/api/octaneorbit/depositbymode/deposithistory',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateDeposithistory() {

  //console.log(`Form deposits_by_mode update sent `)

  return await mosyPostFormData({
    formId: 'deposits_by_mode_profile_form',
    url: '/api/octaneorbit/depositbymode/deposithistory',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateDeposithistoryFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('deposits_by_mode_mosy_action');
 
 //console.log(`Form deposits_by_mode submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_deposits_by_mode') {

      actionMessage ='Record added succesfully!';

      result = await insertDeposithistory();
    }

    if (actionType === 'update_deposits_by_mode') {

      actionMessage ='Record updated succesfully!';

      result = await updateDeposithistory();
    }

    if (result?.status === 'success') {
      
      const deposits_by_modeUptoken = btoa(result.deposits_by_mode_uptoken || '');

      //set id key
      setters.setDeposithistoryUptoken(deposits_by_modeUptoken);
      
      //update url with new deposits_by_modeUptoken
      mosyUpdateUrlParam('deposits_by_mode_uptoken', deposits_by_modeUptoken)

      setters.setDeposithistoryActionStatus('update_deposits_by_mode')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: deposits_by_modeUptoken,
        actionName : actionType,
        actionType : 'deposits_by_mode_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initDeposithistoryProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_station_id : [],
          
    _banking_record_id_deposit_file_id : [],

  }
  

  MosyNotify({message : 'Refreshing Deposit history' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/depositbymode/deposithistory',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('depositbymode Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching depositbymode data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDeposithistory(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/depositbymode/delete',
        params: { 
          _deposits_by_mode_delete_record: (token), 
          },
      });

      console.log('Token DeleteDeposithistory '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // ✅ Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getDeposithistoryListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_station_id : [],
          
    _banking_record_id_deposit_file_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qdeposits_by_mode_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/depositbymode/deposithistory',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qdeposits_by_mode_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('depositbymode Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching depositbymode data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDeposithistoryListData(customQueryStr, setters) {

    const gftDeposithistory = MosyFilterEngine('deposits_by_mode', true);
    let finalFilterStr = btoa(gftDeposithistory);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDeposithistoryLoading(true);
    
    const deposithistoryListData = await getDeposithistoryListData(finalFilterStr);
    
    setters.setDeposithistoryLoading(false)
    setters.setDeposithistoryListData(deposithistoryListData?.data)

    setters.setDeposithistoryListPageCount(deposithistoryListData?.page_count)


    return deposithistoryListData

}
  
  
export async function deposithistoryProfileData(customQueryStr, setters, router, customProfileData={}) {

    const deposithistoryTokenId = mosyUrlParam('deposits_by_mode_uptoken');
    
    const deleteParam = mosyUrlParam('deposits_by_mode_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDeposithistoryToken = '0';
    if (deposithistoryTokenId) {
      
      decodedDeposithistoryToken = atob(deposithistoryTokenId); // Decode the record_id
      setters.setDeposithistoryUptoken(deposithistoryTokenId);
      setters.setDeposithistoryActionStatus('update_deposits_by_mode');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDeposithistoryQueryStr =`where primkey ='${decodedDeposithistoryToken}'`
    if(customQueryStr!='')
    {
      rawDeposithistoryQueryStr = customQueryStr
    }

    const profileDataRecord = await initDeposithistoryProfileData(rawDeposithistoryQueryStr)

    if(deleteParam){
      popDeleteDialog(deposithistoryTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDeposithistoryNode(finalProfileData)
    
    


}
  
  

export function InteprateDeposithistoryEvent(data) {
     
  //console.log('🎯 Deposithistory Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_deposits_by_mode){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDeposithistoryCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('deposits_by_mode_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_deposits_by_mode){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add deposits_by_mode `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_deposits_by_mode){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update deposits_by_mode `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_deposits_by_mode){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../depositbymode/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDeposithistory(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('deposits_by_mode_delete');
        
    }
  
  });

}