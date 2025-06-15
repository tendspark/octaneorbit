'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertBankdeposits() {
 //console.log(`Form banking insert sent `)

  return await mosyPostFormData({
    formId: 'banking_profile_form',
    url: '/api/octaneorbit/banking/bankdeposits',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateBankdeposits() {

  //console.log(`Form banking update sent `)

  return await mosyPostFormData({
    formId: 'banking_profile_form',
    url: '/api/octaneorbit/banking/bankdeposits',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateBankdepositsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('banking_mosy_action');
 
 //console.log(`Form banking submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_banking') {

      actionMessage ='Record added succesfully!';

      result = await insertBankdeposits();
    }

    if (actionType === 'update_banking') {

      actionMessage ='Record updated succesfully!';

      result = await updateBankdeposits();
    }

    if (result?.status === 'success') {
      
      const bankingUptoken = btoa(result.banking_uptoken || '');

      //set id key
      setters.setBankdepositsUptoken(bankingUptoken);
      
      //update url with new bankingUptoken
      mosyUpdateUrlParam('banking_uptoken', bankingUptoken)

      setters.setBankdepositsActionStatus('update_banking')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: bankingUptoken,
        actionName : actionType,
        actionType : 'banking_form_submission'
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


export async function initBankdepositsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_station_id : [],
    
    deposit_list : [],

  }
  

  MosyNotify({message : 'Refreshing Bank deposits' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/banking/bankdeposits',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('banking Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching banking data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteBankdeposits(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/banking/delete',
        params: { 
          _banking_delete_record: (token), 
          },
      });

      console.log('Token DeleteBankdeposits '+token)
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


export async function getBankdepositsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_station_id : [],
    
    deposit_list : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qbanking_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/banking/bankdeposits',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qbanking_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('banking Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching banking data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadBankdepositsListData(customQueryStr, setters) {

    const gftBankdeposits = MosyFilterEngine('banking', true);
    let finalFilterStr = btoa(gftBankdeposits);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setBankdepositsLoading(true);
    
    const bankdepositsListData = await getBankdepositsListData(finalFilterStr);
    
    setters.setBankdepositsLoading(false)
    setters.setBankdepositsListData(bankdepositsListData?.data)

    setters.setBankdepositsListPageCount(bankdepositsListData?.page_count)


    return bankdepositsListData

}
  
  
export async function bankdepositsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const bankdepositsTokenId = mosyUrlParam('banking_uptoken');
    
    const deleteParam = mosyUrlParam('banking_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedBankdepositsToken = '0';
    if (bankdepositsTokenId) {
      
      decodedBankdepositsToken = atob(bankdepositsTokenId); // Decode the record_id
      setters.setBankdepositsUptoken(bankdepositsTokenId);
      setters.setBankdepositsActionStatus('update_banking');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawBankdepositsQueryStr =`where primkey ='${decodedBankdepositsToken}'`
    if(customQueryStr!='')
    {
      rawBankdepositsQueryStr = customQueryStr
    }

    const profileDataRecord = await initBankdepositsProfileData(rawBankdepositsQueryStr)

    if(deleteParam){
      popDeleteDialog(bankdepositsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setBankdepositsNode(finalProfileData)
    
    


}
  
  

export function InteprateBankdepositsEvent(data) {
     
  //console.log('🎯 Bankdeposits Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_banking){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setBankdepositsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('banking_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_banking){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add banking `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_banking){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update banking `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_banking){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../banking/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteBankdeposits(deleteToken).then(data=>{
  
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
       deleteUrlParam('banking_delete');
        
    }
  
  });

}