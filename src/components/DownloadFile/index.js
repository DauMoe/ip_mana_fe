import React, {useEffect} from "react";
import "./DownloadFile.sass";

const DownloadFile = (props) => {
    useEffect(() => {
        window.location.href = props.URI || "";
    }, []);

    return (
        <div className="center-div">
            <h2>Don't worry. Your file will be download soon!</h2>
        </div>
    );
}

export default DownloadFile;