import React, {useEffect} from "react";
import './NotFound.sass';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SELECT_ITEM} from "../Redux/ReducersAndActions/SideBar/SideBarActionsDefinition";

const NotFound = (props) => {
    const {_title}      = props;
    const dispatch      = useDispatch();
    const ChangeState   = () => {
        dispatch({
            type: SELECT_ITEM,
            index: 0
        });
    }

    useEffect(() => {
        document.title = _title + " | IP Manager";
    }, []);

    return(
        <div className="notfound_wrap">
            <div className="center-div text-center">
                <span className="notfound_title">404</span>
                <span className="notfound_desc">
                    Hmm, seem you're lost! Let's go&nbsp;
                    <Link to="/blacklist" onClick={ChangeState}>
                        back
                    </Link>
                </span>
            </div>
        </div>
    );
}

export default NotFound;