const BASE_URL = "http://localhost:8080/";

export const LOGIN                  = BASE_URL + 'login';

/*      Blacklist API URL       */
export const BLACKLIST_ADD_IP       = BASE_URL + 'bl_add_ip';
export const BLACKLIST_GET_IP       = BASE_URL + 'bl_get_ip';
export const BLACKLIST_EDIT_IP      = BASE_URL + 'bl_edit_ip';
export const BLACKLIST_REMOVE_IP    = BASE_URL + 'bl_remove_ip';
export const BLACKLIST_SEARCH_IP    = BASE_URL + 'bl_search_ip';
export const BLACKLIST_EXPORT_IP    = BASE_URL + 'bl_export_ip';