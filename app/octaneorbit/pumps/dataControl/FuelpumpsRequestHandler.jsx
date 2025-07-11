'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertFuelpumps() {
 //console.log(`Form fuel_pumps insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_pumps_profile_form',
    url: '/api/octaneorbit/pumps/fuelpumps',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateFuelpumps() {

  //console.log(`Form fuel_pumps update sent `)

  return await mosyPostFormData({
    formId: 'fuel_pumps_profile_form',
    url: '/api/octaneorbit/pumps/fuelpumps',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateFuelpumpsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_pumps_mosy_action');
 
 //console.log(`Form fuel_pumps submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_pumps') {

      actionMessage ='Record added succesfully!';

      result = await insertFuelpumps();
    }

    if (actionType === 'update_fuel_pumps') {

      actionMessage ='Record updated succesfully!';

      result = await updateFuelpumps();
    }

    if (result?.status === 'success') {
      
      const fuel_pumpsUptoken = btoa(result.fuel_pumps_uptoken || '');

      //set id key
      setters.setFuelpumpsUptoken(fuel_pumpsUptoken);
      
      //update url with new fuel_pumpsUptoken
      mosyUpdateUrlParam('fuel_pumps_uptoken', fuel_pumpsUptoken)

      setters.setFuelpumpsActionStatus('update_fuel_pumps')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_pumpsUptoken,
        actionName : actionType,
        actionType : 'fuel_pumps_form_submission'
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


export async function initFuelpumpsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_fuel_station_id : [],
    
    nozzles : [],

  }
  

  MosyNotify({message : 'Refreshing Fuel pumps' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/pumps/fuelpumps',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('pumps Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching pumps data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteFuelpumps(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/pumps/delete',
        params: { 
          _fuel_pumps_delete_record: (token), 
          },
      });

      console.log('Token DeleteFuelpumps '+token)
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


export async function getFuelpumpsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _fuel_stations_station_name_fuel_station_id : [],
    
    nozzles : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qfuel_pumps_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/pumps/fuelpumps',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_pumps_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('pumps Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching pumps data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadFuelpumpsListData(customQueryStr, setters) {

    const gftFuelpumps = MosyFilterEngine('fuel_pumps', true);
    let finalFilterStr = btoa(gftFuelpumps);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setFuelpumpsLoading(true);
    
    const fuelpumpsListData = await getFuelpumpsListData(finalFilterStr);
    
    setters.setFuelpumpsLoading(false)
    setters.setFuelpumpsListData(fuelpumpsListData?.data)

    setters.setFuelpumpsListPageCount(fuelpumpsListData?.page_count)


    return fuelpumpsListData

}
  
  
export async function fuelpumpsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const fuelpumpsTokenId = mosyUrlParam('fuel_pumps_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_pumps_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedFuelpumpsToken = '0';
    if (fuelpumpsTokenId) {
      
      decodedFuelpumpsToken = atob(fuelpumpsTokenId); // Decode the record_id
      setters.setFuelpumpsUptoken(fuelpumpsTokenId);
      setters.setFuelpumpsActionStatus('update_fuel_pumps');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawFuelpumpsQueryStr =`where primkey ='${decodedFuelpumpsToken}'`
    if(customQueryStr!='')
    {
      rawFuelpumpsQueryStr = customQueryStr
    }

    const profileDataRecord = await initFuelpumpsProfileData(rawFuelpumpsQueryStr)

    if(deleteParam){
      popDeleteDialog(fuelpumpsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setFuelpumpsNode(finalProfileData)
    
    


}
  
  

export function InteprateFuelpumpsEvent(data) {
     
  //console.log('🎯 Fuelpumps Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_pumps){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setFuelpumpsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_pumps_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_pumps){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_pumps `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_pumps){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_pumps `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_pumps){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../pumps/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteFuelpumps(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_pumps_delete');
        
    }
  
  });

}