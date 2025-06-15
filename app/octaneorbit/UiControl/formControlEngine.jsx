// utils/inputControlEngine.js
const controlMap = {
    
     fuel_stations: {
      created_on: {input: { readOnly: false, required: false}, cellClass: "d-none"},
     },
     
     fuel_pumps: {
      created_on: {input: { readOnly: false, required: false}, cellClass: "d-none"},
      txt_pump_id : {input: { readOnly: false, required: false}, cellClass: "d-none"},
     },
     
     fuel_pump_nozzles: {
      created_on: {input: { readOnly: false, required: false}, cellClass: "d-none"},
      txt_pump_id: {input: { readOnly: false, required: false}, cellClass: "d-none"},
     }, 
     
     fuel_inventory: {
      created_on: {input: { readOnly: false, required: false}, cellClass: "d-none"},
      last_updated_on: {input: { readOnly: false, required: false}, cellClass: "d-none"},
     },  
     
     deposits_by_mode : {
      txt_station_id: {input: { readOnly: false, required: false}, cellClass: "d-none"},
      shift_id: {input: { readOnly: false, required : false}, cellClass: "d-none"},
      txt_deposit_file_id : {input: { readOnly: false, required: false}, cellClass: "d-none"},
     },          
  };

// --- Custom override functions --- //
function customInputsControl(module, field, controlData = {}) {

  ///console.log(`customInputsControl `, module , field , controlData)

  // Example: override for Child source
  if (module === "staff" && field === "daily_wages") {
    return {
      required: true,
    };
  }

  if (module === "staff" && field === "national_id") {
    return {
      required: true,
    };
  }

  // Default: return null if no custom override
  return null;
}

function customCellControls(module, field, controlData = {}) {


  const hostParent = controlData?.hostParent
  //console.log(`customCellControls `, module , field , controlData , hostParent)

  // Example: hide site_id for some context
  if ((module==="site_list" && field === "txt_site_id") && hostParent==="SiteListProjectsMainProfilePage") {

    return "d-none";
  }

  return null;
}

// --- Get input props with optional overrides --- //
export function mosyInputProps(module, field, controlData = {}, overrides = {}) {
  const base = controlMap?.[module]?.[field]?.input || {};
  const custom = customInputsControl(module, field, controlData) || {};

  return {
    ...base,
    ...custom,
    ...overrides
  };
}

// --- Get cell class with dynamic and override support --- //
export function mosyCellClass(module, field, controlData = {}, overrides = {}) {
  const baseClass = controlMap?.[module]?.[field]?.cellClass || "";
  const customClass = customCellControls(module, field, controlData) || "";
  const overrideClass = overrides.additionalClass || "";

  return [baseClass, customClass, overrideClass].join(" ").trim();
}