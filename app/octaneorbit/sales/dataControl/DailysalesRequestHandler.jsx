'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertDailysales() {
 //console.log(`Form fuel_sales insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_sales_profile_form',
    url: '/api/octaneorbit/sales/dailysales',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateDailysales() {

  //console.log(`Form fuel_sales update sent `)

  return await mosyPostFormData({
    formId: 'fuel_sales_profile_form',
    url: '/api/octaneorbit/sales/dailysales',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateDailysalesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_sales_mosy_action');
 
 //console.log(`Form fuel_sales submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_sales') {

      actionMessage ='Record added succesfully!';

      result = await insertDailysales();
    }

    if (actionType === 'update_fuel_sales') {

      actionMessage ='Record updated succesfully!';

      result = await updateDailysales();
    }

    if (result?.status === 'success') {
      
      const fuel_salesUptoken = btoa(result.fuel_sales_uptoken || '');

      //set id key
      setters.setDailysalesUptoken(fuel_salesUptoken);
      
      //update url with new fuel_salesUptoken
      mosyUpdateUrlParam('fuel_sales_uptoken', fuel_salesUptoken)

      setters.setDailysalesActionStatus('update_fuel_sales')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_salesUptoken,
        actionName : actionType,
        actionType : 'fuel_sales_form_submission'
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


export async function initDailysalesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_fuel_station_id : [],

  }
  

  MosyNotify({message : 'Refreshing Daily sales' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/sales/dailysales',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('sales Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching sales data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDailysales(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/sales/delete',
        params: { 
          _fuel_sales_delete_record: (token), 
          },
      });

      console.log('Token DeleteDailysales '+token)
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


export async function getDailysalesListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_fuel_station_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qfuel_sales_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/sales/dailysales',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_sales_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('sales Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching sales data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDailysalesListData(customQueryStr, setters) {

    const gftDailysales = MosyFilterEngine('fuel_sales', true);
    let finalFilterStr = btoa(gftDailysales);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDailysalesLoading(true);
    
    const dailysalesListData = await getDailysalesListData(finalFilterStr);
    
    setters.setDailysalesLoading(false)
    setters.setDailysalesListData(dailysalesListData?.data)

    setters.setDailysalesListPageCount(dailysalesListData?.page_count)


    return dailysalesListData

}
  
  
export async function dailysalesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const dailysalesTokenId = mosyUrlParam('fuel_sales_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_sales_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDailysalesToken = '0';
    if (dailysalesTokenId) {
      
      decodedDailysalesToken = atob(dailysalesTokenId); // Decode the record_id
      setters.setDailysalesUptoken(dailysalesTokenId);
      setters.setDailysalesActionStatus('update_fuel_sales');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDailysalesQueryStr =`where primkey ='${decodedDailysalesToken}'`
    if(customQueryStr!='')
    {
      rawDailysalesQueryStr = customQueryStr
    }

    const profileDataRecord = await initDailysalesProfileData(rawDailysalesQueryStr)

    if(deleteParam){
      popDeleteDialog(dailysalesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDailysalesNode(finalProfileData)
    
    


}
  
  

export function InteprateDailysalesEvent(data) {
     
  //console.log('🎯 Dailysales Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_sales){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDailysalesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_sales_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_sales){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_sales `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_sales){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_sales `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_sales){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../sales/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDailysales(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_sales_delete');
        
    }
  
  });

}