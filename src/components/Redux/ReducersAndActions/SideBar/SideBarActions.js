import { CLOSE_SIDEBAR, OPEN_SIDEBAR } from "./ActionsDefinition";

export const OpenSideBar = () => {
    return {
        type: OPEN_SIDEBAR
    }
}

export const CloseSideBar = () => {
    return {
        type: CLOSE_SIDEBAR
    }
}