import React, {useEffect} from "react";
import "./DownloadFile.sass";
import {WEB_BASE_NAME} from "../API_URL";

const DownloadFile = (props) => {
    const {URI, _title} = props;
    useEffect(() => {
        document.title = _title + WEB_BASE_NAME;
        window.location.href = URI || "";
    }, []);

    return (
        <div className="center-div">
            <h2>Don't worry. Your file will be download soon!</h2>
        </div>
    );
}

export default DownloadFile;