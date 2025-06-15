'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertFuelnozzles() {
 //console.log(`Form fuel_pump_nozzles insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_pump_nozzles_profile_form',
    url: '/api/octaneorbit/nozzles/fuelnozzles',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateFuelnozzles() {

  //console.log(`Form fuel_pump_nozzles update sent `)

  return await mosyPostFormData({
    formId: 'fuel_pump_nozzles_profile_form',
    url: '/api/octaneorbit/nozzles/fuelnozzles',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateFuelnozzlesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_pump_nozzles_mosy_action');
 
 //console.log(`Form fuel_pump_nozzles submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_pump_nozzles') {

      actionMessage ='Record added succesfully!';

      result = await insertFuelnozzles();
    }

    if (actionType === 'update_fuel_pump_nozzles') {

      actionMessage ='Record updated succesfully!';

      result = await updateFuelnozzles();
    }

    if (result?.status === 'success') {
      
      const fuel_pump_nozzlesUptoken = btoa(result.fuel_pump_nozzles_uptoken || '');

      //set id key
      setters.setFuelnozzlesUptoken(fuel_pump_nozzlesUptoken);
      
      //update url with new fuel_pump_nozzlesUptoken
      mosyUpdateUrlParam('fuel_pump_nozzles_uptoken', fuel_pump_nozzlesUptoken)

      setters.setFuelnozzlesActionStatus('update_fuel_pump_nozzles')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_pump_nozzlesUptoken,
        actionName : actionType,
        actionType : 'fuel_pump_nozzles_form_submission'
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


export async function initFuelnozzlesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _fuel_pumps_pump_name_pump_id : [],

  }
  

  MosyNotify({message : 'Refreshing Fuel nozzles' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/nozzles/fuelnozzles',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('nozzles Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching nozzles data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteFuelnozzles(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/nozzles/delete',
        params: { 
          _fuel_pump_nozzles_delete_record: (token), 
          },
      });

      console.log('Token DeleteFuelnozzles '+token)
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


export async function getFuelnozzlesListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _fuel_pumps_pump_name_pump_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qfuel_pump_nozzles_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/nozzles/fuelnozzles',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_pump_nozzles_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('nozzles Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching nozzles data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadFuelnozzlesListData(customQueryStr, setters) {

    const gftFuelnozzles = MosyFilterEngine('fuel_pump_nozzles', true);
    let finalFilterStr = btoa(gftFuelnozzles);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setFuelnozzlesLoading(true);
    
    const fuelnozzlesListData = await getFuelnozzlesListData(finalFilterStr);
    
    setters.setFuelnozzlesLoading(false)
    setters.setFuelnozzlesListData(fuelnozzlesListData?.data)

    setters.setFuelnozzlesListPageCount(fuelnozzlesListData?.page_count)


    return fuelnozzlesListData

}
  
  
export async function fuelnozzlesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const fuelnozzlesTokenId = mosyUrlParam('fuel_pump_nozzles_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_pump_nozzles_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedFuelnozzlesToken = '0';
    if (fuelnozzlesTokenId) {
      
      decodedFuelnozzlesToken = atob(fuelnozzlesTokenId); // Decode the record_id
      setters.setFuelnozzlesUptoken(fuelnozzlesTokenId);
      setters.setFuelnozzlesActionStatus('update_fuel_pump_nozzles');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawFuelnozzlesQueryStr =`where primkey ='${decodedFuelnozzlesToken}'`
    if(customQueryStr!='')
    {
      rawFuelnozzlesQueryStr = customQueryStr
    }

    const profileDataRecord = await initFuelnozzlesProfileData(rawFuelnozzlesQueryStr)

    if(deleteParam){
      popDeleteDialog(fuelnozzlesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setFuelnozzlesNode(finalProfileData)
    
    


}
  
  

export function InteprateFuelnozzlesEvent(data) {
     
  //console.log('🎯 Fuelnozzles Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_pump_nozzles){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setFuelnozzlesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_pump_nozzles_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_pump_nozzles){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_pump_nozzles `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_pump_nozzles){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_pump_nozzles `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_pump_nozzles){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../nozzles/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteFuelnozzles(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_pump_nozzles_delete');
        
    }
  
  });

}