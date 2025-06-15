'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertFuelstations() {
 //console.log(`Form fuel_stations insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_stations_profile_form',
    url: '/api/octaneorbit/stations/fuelstations',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateFuelstations() {

  //console.log(`Form fuel_stations update sent `)

  return await mosyPostFormData({
    formId: 'fuel_stations_profile_form',
    url: '/api/octaneorbit/stations/fuelstations',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateFuelstationsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_stations_mosy_action');
 
 //console.log(`Form fuel_stations submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_stations') {

      actionMessage ='Record added succesfully!';

      result = await insertFuelstations();
    }

    if (actionType === 'update_fuel_stations') {

      actionMessage ='Record updated succesfully!';

      result = await updateFuelstations();
    }

    if (result?.status === 'success') {
      
      const fuel_stationsUptoken = btoa(result.fuel_stations_uptoken || '');

      //set id key
      setters.setFuelstationsUptoken(fuel_stationsUptoken);
      
      //update url with new fuel_stationsUptoken
      mosyUpdateUrlParam('fuel_stations_uptoken', fuel_stationsUptoken)

      setters.setFuelstationsActionStatus('update_fuel_stations')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_stationsUptoken,
        actionName : actionType,
        actionType : 'fuel_stations_form_submission'
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


export async function initFuelstationsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
         
    date_added : [],

  }
  

  MosyNotify({message : 'Refreshing Fuel Stations' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/stations/fuelstations',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('stations Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching stations data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteFuelstations(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/stations/delete',
        params: { 
          _fuel_stations_delete_record: (token), 
          },
      });

      console.log('Token DeleteFuelstations '+token)
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


export async function getFuelstationsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
         
    date_added : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qfuel_stations_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/stations/fuelstations',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_stations_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('stations Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching stations data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadFuelstationsListData(customQueryStr, setters) {

    const gftFuelstations = MosyFilterEngine('fuel_stations', true);
    let finalFilterStr = btoa(gftFuelstations);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setFuelstationsLoading(true);
    
    const fuelstationsListData = await getFuelstationsListData(finalFilterStr);
    
    setters.setFuelstationsLoading(false)
    setters.setFuelstationsListData(fuelstationsListData?.data)

    setters.setFuelstationsListPageCount(fuelstationsListData?.page_count)


    return fuelstationsListData

}
  
  
export async function fuelstationsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const fuelstationsTokenId = mosyUrlParam('fuel_stations_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_stations_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedFuelstationsToken = '0';
    if (fuelstationsTokenId) {
      
      decodedFuelstationsToken = atob(fuelstationsTokenId); // Decode the record_id
      setters.setFuelstationsUptoken(fuelstationsTokenId);
      setters.setFuelstationsActionStatus('update_fuel_stations');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawFuelstationsQueryStr =`where primkey ='${decodedFuelstationsToken}'`
    if(customQueryStr!='')
    {
      rawFuelstationsQueryStr = customQueryStr
    }

    const profileDataRecord = await initFuelstationsProfileData(rawFuelstationsQueryStr)

    if(deleteParam){
      popDeleteDialog(fuelstationsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setFuelstationsNode(finalProfileData)
    
    


}
  
  

export function InteprateFuelstationsEvent(data) {
     
  //console.log('🎯 Fuelstations Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_stations){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setFuelstationsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_stations_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_stations){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_stations `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_stations){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_stations `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_stations){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../stations/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteFuelstations(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_stations_delete');
        
    }
  
  });

}