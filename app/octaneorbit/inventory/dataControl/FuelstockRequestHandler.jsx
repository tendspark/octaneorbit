'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertFuelstock() {
 //console.log(`Form fuel_inventory insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_inventory_profile_form',
    url: '/api/octaneorbit/inventory/fuelstock',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateFuelstock() {

  //console.log(`Form fuel_inventory update sent `)

  return await mosyPostFormData({
    formId: 'fuel_inventory_profile_form',
    url: '/api/octaneorbit/inventory/fuelstock',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateFuelstockFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_inventory_mosy_action');
 
 //console.log(`Form fuel_inventory submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_inventory') {

      actionMessage ='Record added succesfully!';

      result = await insertFuelstock();
    }

    if (actionType === 'update_fuel_inventory') {

      actionMessage ='Record updated succesfully!';

      result = await updateFuelstock();
    }

    if (result?.status === 'success') {
      
      const fuel_inventoryUptoken = btoa(result.fuel_inventory_uptoken || '');

      //set id key
      setters.setFuelstockUptoken(fuel_inventoryUptoken);
      
      //update url with new fuel_inventoryUptoken
      mosyUpdateUrlParam('fuel_inventory_uptoken', fuel_inventoryUptoken)

      setters.setFuelstockActionStatus('update_fuel_inventory')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_inventoryUptoken,
        actionName : actionType,
        actionType : 'fuel_inventory_form_submission'
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


export async function initFuelstockProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Fuel stock' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/inventory/fuelstock',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('inventory Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching inventory data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteFuelstock(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/inventory/delete',
        params: { 
          _fuel_inventory_delete_record: (token), 
          },
      });

      console.log('Token DeleteFuelstock '+token)
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


export async function getFuelstockListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
     
  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qfuel_inventory_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/inventory/fuelstock',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_inventory_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('inventory Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching inventory data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadFuelstockListData(customQueryStr, setters) {

    const gftFuelstock = MosyFilterEngine('fuel_inventory', true);
    let finalFilterStr = btoa(gftFuelstock);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setFuelstockLoading(true);
    
    const fuelstockListData = await getFuelstockListData(finalFilterStr);
    
    setters.setFuelstockLoading(false)
    setters.setFuelstockListData(fuelstockListData?.data)

    setters.setFuelstockListPageCount(fuelstockListData?.page_count)


    return fuelstockListData

}
  
  
export async function fuelstockProfileData(customQueryStr, setters, router, customProfileData={}) {

    const fuelstockTokenId = mosyUrlParam('fuel_inventory_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_inventory_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedFuelstockToken = '0';
    if (fuelstockTokenId) {
      
      decodedFuelstockToken = atob(fuelstockTokenId); // Decode the record_id
      setters.setFuelstockUptoken(fuelstockTokenId);
      setters.setFuelstockActionStatus('update_fuel_inventory');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawFuelstockQueryStr =`where primkey ='${decodedFuelstockToken}'`
    if(customQueryStr!='')
    {
      rawFuelstockQueryStr = customQueryStr
    }

    const profileDataRecord = await initFuelstockProfileData(rawFuelstockQueryStr)

    if(deleteParam){
      popDeleteDialog(fuelstockTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setFuelstockNode(finalProfileData)
    
    


}
  
  

export function InteprateFuelstockEvent(data) {
     
  //console.log('🎯 Fuelstock Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_inventory){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setFuelstockCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_inventory_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_inventory){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_inventory `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_inventory){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_inventory `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_inventory){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../inventory/fuel')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteFuelstock(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_inventory_delete');
        
    }
  
  });

}