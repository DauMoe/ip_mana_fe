export const BASE_URL               = process.env.REACT_APP_BASEURL;
export const TEMPLATE_URL           = BASE_URL + "asset/template/";
export const REPORT_URL             = BASE_URL + "asset/report/";
export const WEB_BASE_NAME          = " | IP  Manager";

export const LOGIN                  = BASE_URL + 'login';

/*      Blacklist API URL       */
export const BLACKLIST_ADD_IP       = BASE_URL + 'bl_add_ip';
export const BLACKLIST_GET_IP       = BASE_URL + 'bl_get_ip';
export const BLACKLIST_EDIT_IP      = BASE_URL + 'bl_edit_ip';
export const BLACKLIST_REMOVE_IP    = BASE_URL + 'bl_remove_ip';
export const BLACKLIST_SEARCH_IP    = BASE_URL + 'bl_search_ip';
export const BLACKLIST_EXPORT_EXCEL = BASE_URL + 'bl_export_excel';
export const BLACKLIST_ADD_EXCEL    = BASE_URL + 'bl_new_excel';
export const BLACKLIST_UPDATE_EXCEL = BASE_URL + 'bl_update_excel';
export const BLACKLIST_DELETE_EXCEL = BASE_URL + 'bl_delete_excel';

export const BLACKLIST_IMPORTED_IP_TODAY_EXCEL = BASE_URL + 'bl_list_imported_ip_excel';