
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SupplierlistRowMutations} from './SupplierlistRowMutations';

//be gate keeper and auth 
import { validateSelect } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let mutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        mutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'fuel_suppliers',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('fuel_suppliers', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }

    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SupplierlistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Supplierlist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Supplierlist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SupplierlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SupplierlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SupplierlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SupplierlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SupplierlistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SupplierlistFormAction = body.fuel_suppliers_mosy_action;
    const fuel_suppliers_uptoken_value = base64Decode(body.fuel_suppliers_uptoken);

		//--- Begin  fuel_suppliers inputs array ---// 

const SupplierlistInputsArr = {
  "supplier_name" : "?", 
  "supplier_code" : "?", 
  "contact_person" : "?", 
  "phone_number" : "?", 
  "email" : "?", 
  "address" : "?", 

};

//--- End fuel_suppliers inputs array --//

    
    if (SupplierlistFormAction === "add_fuel_suppliers") 
    {
      
      const newId = magicRandomStr(7);
      SupplierlistInputsArr.record_id = newId;
      
      // Insert into table Supplierlist
      const result = await mosySqlInsert("fuel_suppliers", SupplierlistInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_suppliers_uptoken: result.record_id
      });
      
    }
    
    if (SupplierlistFormAction === "update_fuel_suppliers") {
      
      // update table Supplierlist
      const result = await mosySqlUpdate("fuel_suppliers", SupplierlistInputsArr, body, `primkey='${fuel_suppliers_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        fuel_suppliers_uptoken: fuel_suppliers_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SupplierlistFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}