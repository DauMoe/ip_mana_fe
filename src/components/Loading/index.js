import React from 'react';
import './Loading.sass'

function Loading (props) {
    return(
        <div className="loading_container">
            <div className={"center-div"}>
                <div className={"loader"}>Loading</div>
            </div>
        </div>
    );
}

export default Loading;