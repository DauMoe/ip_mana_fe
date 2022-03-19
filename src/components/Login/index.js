import "./Login.sass";
import React, {useEffect, useState} from "react";
import {BASE_URL, LOGIN, WEB_BASE_NAME} from "../API_URL";
import {useDispatch, useSelector} from "react-redux";
import {LOGGED_IN, NOT_LOGGED_IN} from "../Redux/ReducersAndActions/Authentication/AuthenActionsDefinition";
import {ERROR, LOADED, LOADING} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {toast, ToastContainer} from "react-toastify";
import {Redirect} from "react-router-dom";
import jwt_decode from "jwt-decode";

function Login(props) {
    const {_title}          = props;
    const {token}           = useSelector(state => state.Authen);
    const dispatch          = useDispatch();
    const [email, setEmail] = useState("admin@gmail.com");
    const [pass, setPass]   = useState("123");

    const __FetchFunction = (URL, body, callback) => {
        dispatch({type: LOADING});
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow'
        };
        fetch(URL, requestOptions)
            .then(res => res.json())
            .then(result => {
                if (result.code === 200) {
                    callback(result.msg, null);
                } else {
                    toast.error(result.msg);
                }
            })
            .catch(e => {
                toast.error(e);
            });
    }

    const Login = (event) => {
        event.preventDefault();
        if (email.trim() === "") {
            toast.error("Fill email!");
            return;
        }
        if (pass.trim() === "") {
            toast.error("Fill password!");
            return;
        }
        const BodyData = {
            email: email,
            pass: pass
        };
        __FetchFunction(LOGIN, BodyData, function(response) {
            const {is_admin} = jwt_decode(response.token);
            dispatch({
                type: LOGGED_IN,
                token: response.token,
                is_admin: is_admin
            });
            <Redirect to={"/rules"}/>
        });
    }

    useEffect(() => {
        dispatch({type: NOT_LOGGED_IN});
        document.title = _title + WEB_BASE_NAME;
    }, [token]);
    return(
        <div className={"login_container"}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                theme="colored"
                draggable={false}
                pauseOnHover/>

            <div className={"login_form"}>
                <h2 className={"text-center"}>IP Manager</h2>
                <form onSubmit={Login}>
                    <div>
                        <label htmlFor={"email"} className={"bold"}>Email:</label>
                        <input type={"text"} id={"email"} className={"form-control"} value={email} onChange={e => setEmail(e.target.value)} placeholder={"Email"}/>
                    </div>
                    <div className={"margin-top-20"}>
                        <label htmlFor={"pass"} className={"bold"}>Password:</label>
                        <input type={"password"} id={"pass"} className={"form-control"} value={pass} onChange={e => setPass(e.target.value)} placeholder={"Password"}/>
                    </div>
                    <div className={"margin-top-35"}>
                        <button type={"submit"} className={"btn btn-block theme_blue"}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;