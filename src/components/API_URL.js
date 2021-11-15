export const BASE_URL               = process.env.REACT_APP_BASEURL;
export const TEMPLATE_URL           = BASE_URL + "asset/template/";
export const REPORT_URL             = BASE_URL + "asset/report/";
export const WEB_BASE_NAME          = " | IP  Manager";

export const LOGIN                  = BASE_URL + 'login';

/*      Blacklist API URL       */
const BL_URL                        = BASE_URL + 'blacklist/';
export const BLACKLIST_ADD_IP       = BL_URL + 'bl_add_ip';
export const BLACKLIST_GET_IP       = BL_URL + 'bl_get_ip';
export const BLACKLIST_EDIT_IP      = BL_URL + 'bl_edit_ip';
export const BLACKLIST_REMOVE_IP    = BL_URL + 'bl_remove_ip';
export const BLACKLIST_SEARCH_IP    = BL_URL + 'bl_search_ip';
export const BLACKLIST_EXPORT_EXCEL = BL_URL + 'bl_export_excel';
export const BLACKLIST_ADD_EXCEL    = BL_URL + 'bl_new_excel';
export const BLACKLIST_UPDATE_EXCEL = BL_URL + 'bl_update_excel';
export const BLACKLIST_DELETE_EXCEL = BL_URL + 'bl_delete_excel';

export const BLACKLIST_IMPORTED_IP_TODAY_EXCEL = BL_URL + 'bl_list_imported_ip_excel';


/*      VLAN API URL    */
const VLAN_URL                      = BASE_URL + 'vlan/';
export const ADD_PROPERTIES         = VLAN_URL + "/add_properties";
export const ADD_NEW_IP             = VLAN_URL + "/new_vlan_ip";
export const GET_PRO_BY_ID          = VLAN_URL + "/get_pro_by_id";
export const VLAN_GET_IP            = VLAN_URL + "/get_vlan_ip"