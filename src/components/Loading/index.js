import React from 'react';
import './Loading.sass'

function Loading (props) {
    return(
        <div className="loading_container">
            <div className="center-div">
                <span className="loader"/>
            </div>
        </div>
    );
}

export default Loading;