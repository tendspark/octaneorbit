'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertSupplierlist() {
 //console.log(`Form fuel_suppliers insert sent `)

  return await mosyPostFormData({
    formId: 'fuel_suppliers_profile_form',
    url: '/api/octaneorbit/suppliers/supplierlist',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateSupplierlist() {

  //console.log(`Form fuel_suppliers update sent `)

  return await mosyPostFormData({
    formId: 'fuel_suppliers_profile_form',
    url: '/api/octaneorbit/suppliers/supplierlist',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateSupplierlistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('fuel_suppliers_mosy_action');
 
 //console.log(`Form fuel_suppliers submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_fuel_suppliers') {

      actionMessage ='Record added succesfully!';

      result = await insertSupplierlist();
    }

    if (actionType === 'update_fuel_suppliers') {

      actionMessage ='Record updated succesfully!';

      result = await updateSupplierlist();
    }

    if (result?.status === 'success') {
      
      const fuel_suppliersUptoken = btoa(result.fuel_suppliers_uptoken || '');

      //set id key
      setters.setSupplierlistUptoken(fuel_suppliersUptoken);
      
      //update url with new fuel_suppliersUptoken
      mosyUpdateUrlParam('fuel_suppliers_uptoken', fuel_suppliersUptoken)

      setters.setSupplierlistActionStatus('update_fuel_suppliers')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: fuel_suppliersUptoken,
        actionName : actionType,
        actionType : 'fuel_suppliers_form_submission'
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


export async function initSupplierlistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Supplier list' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/suppliers/supplierlist',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('suppliers Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching suppliers data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSupplierlist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/octaneorbit/suppliers/delete',
        params: { 
          _fuel_suppliers_delete_record: (token), 
          },
      });

      console.log('Token DeleteSupplierlist '+token)
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


export async function getSupplierlistListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qfuel_suppliers_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/octaneorbit/suppliers/supplierlist',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qfuel_suppliers_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('suppliers Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching suppliers data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSupplierlistListData(customQueryStr, setters) {

    const gftSupplierlist = MosyFilterEngine('fuel_suppliers', true);
    let finalFilterStr = btoa(gftSupplierlist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSupplierlistLoading(true);
    
    const supplierlistListData = await getSupplierlistListData(finalFilterStr);
    
    setters.setSupplierlistLoading(false)
    setters.setSupplierlistListData(supplierlistListData?.data)

    setters.setSupplierlistListPageCount(supplierlistListData?.page_count)


    return supplierlistListData

}
  
  
export async function supplierlistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const supplierlistTokenId = mosyUrlParam('fuel_suppliers_uptoken');
    
    const deleteParam = mosyUrlParam('fuel_suppliers_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSupplierlistToken = '0';
    if (supplierlistTokenId) {
      
      decodedSupplierlistToken = atob(supplierlistTokenId); // Decode the record_id
      setters.setSupplierlistUptoken(supplierlistTokenId);
      setters.setSupplierlistActionStatus('update_fuel_suppliers');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSupplierlistQueryStr =`where primkey ='${decodedSupplierlistToken}'`
    if(customQueryStr!='')
    {
      rawSupplierlistQueryStr = customQueryStr
    }

    const profileDataRecord = await initSupplierlistProfileData(rawSupplierlistQueryStr)

    if(deleteParam){
      popDeleteDialog(supplierlistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSupplierlistNode(finalProfileData)
    
    


}
  
  

export function InteprateSupplierlistEvent(data) {
     
  //console.log('🎯 Supplierlist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_fuel_suppliers){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSupplierlistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('fuel_suppliers_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_fuel_suppliers){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add fuel_suppliers `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_fuel_suppliers){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update fuel_suppliers `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_fuel_suppliers){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../suppliers/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSupplierlist(deleteToken).then(data=>{
  
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
       deleteUrlParam('fuel_suppliers_delete');
        
    }
  
  });

}