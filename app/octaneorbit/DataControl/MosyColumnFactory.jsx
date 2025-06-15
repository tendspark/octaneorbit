const MosyColumnFactory = {

   //-- banking cols--//
  banking: ["station_id", "shift_code", "record_date", "expected_sales_amount", "actual_banked_amount", "variance_amount", "variance_reason", "banked_by", "banked_on", "bank_reference_code", "banking_status", "payment_notes", "verified_by", "verified_on"],

   //-- clients cols--//
  clients: ["client_name", "client_type", "phone_number", "alt_phone", "email", "national_id", "kra_pin", "vehicle_plate", "contact_person", "payment_mode_preference", "credit_limit", "balance_due", "client_status", "loyalty_points", "physical_address", "county", "location_description", "registered_by", "registered_on", "last_transaction_on", "remarks", "created_on"],

   //-- deposits_by_mode cols--//
  deposits_by_mode: ["station_id", "date_deposited", "amount_deposited", "payment_mode", "ref_number", "shift_id", "deposit_file_id", "remark"],

   //-- fuel_clients_vehicles cols--//
  fuel_clients_vehicles: ["client_name", "client_code", "contact_number", "email", "vehicle_number_plate", "vehicle_type", "fuel_type", "status", "created_on", "station_id"],

   //-- fuel_deliveries cols--//
  fuel_deliveries: ["fuel_station_id", "supplier_name", "fuel_type", "quantity_litres", "cost_per_litre", "total_cost", "delivered_by", "received_by_staff_id", "delivery_note_number", "delivery_date"],

   //-- fuel_fleet cols--//
  fuel_fleet: ["vehicle_name", "vehicle_number_plate", "vehicle_type", "fuel_type", "assigned_station_id", "driver_name", "driver_contact", "status", "created_on"],

   //-- fuel_inventory cols--//
  fuel_inventory: ["item_name", "fuel_type", "buying_price", "Selling_price", "fuel_grade", "current_stock_litres", "density_kg_per_m3", "volume_correction_factor", "manual_dip_reading_litres", "atg_reading_litres", "percentage_variance", "variance_reason_code", "tank_reference", "last_updated_on", "created_on", "item_code"],

   //-- fuel_pump_nozzles cols--//
  fuel_pump_nozzles: ["pump_id", "nozzle_label", "fuel_type", "calibration_factor", "status", "installed_on", "last_maintenance_date", "created_on"],

   //-- fuel_pumps cols--//
  fuel_pumps: ["fuel_station_id", "pump_name", "manufacturer", "model_number", "installation_date", "status", "created_on"],

   //-- fuel_sales cols--//
  fuel_sales: ["fuel_station_id", "pump_nozzle_id", "vehicle_plate", "fuel_type", "quantity_sold_litres", "sale_price_per_litre", "total_amount", "sold_by_staff_id", "sale_method", "sale_date"],

   //-- fuel_staff cols--//
  fuel_staff: ["station_id", "full_name", "staff_code", "position", "phone_number", "email", "employment_date", "status", "created_on"],

   //-- fuel_stations cols--//
  fuel_stations: ["station_name", "station_code", "location", "county", "contact_number", "email", "manager_name", "status", "latitude", "longitude", "google_maps_link", "opening_hours", "is_operational", "has_atg_system", "licence_number", "licence_expiry_date", "erp_integration_code", "till_number", "paybill_number", "bank_account_name", "bank_account_number", "default_payment_mode", "storage_capacity_litres", "additional_details", "created_on"],

   //-- fuel_suppliers cols--//
  fuel_suppliers: ["supplier_name", "supplier_code", "contact_person", "phone_number", "email", "address"],

   //-- page_manifest_ cols--//
  page_manifest_: ["page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],


};
export default MosyColumnFactory;