import {useDispatch, useSelector} from "react-redux";
import {toast, ToastContainer} from "react-toastify";
import Modal from "../Modal";
import Select from "react-select";
import {IconContext} from "react-icons";
import {BiAddToQueue, FaRegWindowClose, MdOutlineSave, RiFunctionLine} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {ERROR, LOADED} from "../Redux/ReducersAndActions/Status/StatusActionsDefinition";
import {CREATE_USER, DELETE_USERS, GET_USER_INFO, LIST_USERS, UPDATE_USERS, WEB_BASE_NAME} from "../API_URL";
import {NOT_LOGGED_IN} from "../Redux/ReducersAndActions/Authentication/AuthenActionsDefinition";
import swal from "sweetalert";

function User(props) {
    const CREATE_USER_MODE                      = 1;
    const {_title}                              = props;
    const dispatch                              = useDispatch();
    const {token, is_admin}                     = useSelector(state => state.Authen);
    const [ShowAppBox, setShowAppBox]           = useState(false);
    const [UserData, setUserData]               = useState([]);
    const [DetailData, setDetailData]           = useState({});
    const [ModalData, setModalData]             = useState({mode: -1, data: {list_property: [], list_property_assign: []}, show: false, title: "no title"});
    const Genders = [{
        value: 0,
        label: "Male"
    }, {
        value: 1,
        label: "Female"
    }, {
        value: 2,
        label: "Other"
    }]

    const __FetchFunction = (URL, body, callback, dismiss = true) => {
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
                    if(dismiss) dispatch({type: LOADED});
                    callback(result.msg, null);
                } else if (result.code === 700) {
                    dispatch({type: NOT_LOGGED_IN});
                } else {
                    callback(null, result.msg);
                    dispatch({
                        type: ERROR,
                        msg: result.msg
                    });
                    toast.error(result.msg);
                }
            })
            .catch(e => {
                dispatch({
                    type: ERROR,
                    msg: e
                })
            });
    }

    const ToggleApplicationBox = (e) => {
        e.stopPropagation();
        setShowAppBox(!ShowAppBox);
    }

    const HandleClickOut = (e) => {
        setModalData({
            ...ModalData,
            show: false
        })
    }
    const GetUserInfo = (user) => {
        setDetailData(user);
        // let BodyData = {
        //     "ssid": token,
        //     "uid": user.uid
        // }
        // __FetchFunction(GET_USER_INFO, BodyData, function (resp) {
        //     for (let i of Genders) {
        //         if (i.value === resp[0].gender) {
        //             resp[0].gender_obj = i;
        //             break;
        //         }
        //     }
        //     UserData.map(function (i, ix) {
        //         if (i.uid === resp[0].uid) {
        //             let CloneUserData = [...UserData];
        //             CloneUserData[ix] = resp[0];
        //             setUserData(CloneUserData);
        //         }
        //     });
        //     setDetailData(resp[0]);
        // });
    }

    const ChangeGenderModal = (item) => {
        setModalData({
            ...ModalData,
            data: {
                ...ModalData.data,
                gender_obj: item
            }
        });
    }

    const ChangeGender = (item) => {
      setDetailData({
          ...DetailData,
          gender_obj: item
      });
    }

    const DeleteUser = () => {
        swal({
            title: "DELETE",
            text: `DELETE User and CAN NOT RECOVER. Continue?`,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(val => {
            if (val) {
                let BodyData = {
                    "ssid": token,
                    "uid": DetailData.uid
                }
                __FetchFunction(DELETE_USERS, BodyData, function(resp) {
                    __FetchFunction(LIST_USERS, BodyData, function (resp, err) {
                        setUserData(resp);
                        if (resp.length > 0) {
                            GetUserInfo(resp[0]);
                        }
                    });
                    toast.success(resp);
                }, false);
            }
        });
    }
    
    const UpdateUser = () => {
      let BodyData = {
          "ssid": token,
          "uid": DetailData.uid,
          "username": DetailData.username,
          "fullname": DetailData.fullname,
          "gender": DetailData.gender_obj.value,
          "phone": DetailData.phone,
          "dob": DetailData.dob,
          "is_admin": DetailData.is_admin
      }
      __FetchFunction(UPDATE_USERS, BodyData, function (resp) {
          GetUserInfo(DetailData);
          toast.success(resp);
      });
    }

    const OpenModalCreateUser = () => {
      setModalData({
          ...ModalData,
          title: "Create User",
          mode: CREATE_USER_MODE,
          show: true,
          data: {
              email: "",
              username: "",
              fullname: "",
              password: "",
              dob: "",
              gender_obj: null,
              phone: "",
              is_admin: false
          }
      });
    }
    
    const CreateUser = () => {
        if (ModalData.data.email.trim() === "") {
            toast.error("Fill email field");
            return;
        }
        if (ModalData.data.fullname.trim() === "") {
            toast.error("Fill fullname field");
            return;
        }
        if (ModalData.data.password.trim() === "") {
            toast.error("Fill password field");
            return;
        }
        if (ModalData.data.gender_obj === null) {
            toast.error("Select gender");
            return;
        }
        let BodyData = {
            "ssid": token,
            email: ModalData.data.email,
            username: ModalData.data.username,
            fullname: ModalData.data.fullname,
            password: ModalData.data.password,
            gender: ModalData.data.gender_obj.value,
            phone: ModalData.data.phone,
            is_admin: ModalData.data.is_admin
        }
        __FetchFunction(CREATE_USER, BodyData, function (resp) {
            __FetchFunction(LIST_USERS, BodyData, function (resp, err) {
                setUserData(resp);
                if (resp.length > 0) {
                    GetUserInfo(resp[0]);
                }
            });
            setModalData({
                ...ModalData,
                show: false
            })
            toast.success(resp);
        }, false);
    }
    
    useEffect(function() {
        document.title = _title + WEB_BASE_NAME;
        let BodyData = {
            "ssid": token
        }
        __FetchFunction(LIST_USERS, BodyData, function (resp, err) {
            if (err === null) {
                setUserData(resp);
                if (resp.length > 0) {
                    GetUserInfo(resp[0]);
                }
            }
        });
    },[token]);

    return (
        <div className="container" onClick={() => setShowAppBox(false)}>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                theme="colored"
                draggable={false}
                pauseOnHover/>

            <Modal
                show={ModalData.show}
                title={ModalData.title}
                onClickOut={HandleClickOut}
                CloseModal={_ => setModalData({...ModalData, show: false})}
                WrapClass={"modal_wrap"}>
                    {ModalData.mode === CREATE_USER_MODE && (
                        <div style={{
                            minWidth: '60vw',
                        }}>
                            <div>
                                <label htmlFor={"create_email"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Email:</span>
                                </label>
                                <input className={"form-control"} id={"create_email"} placeholder={"Email"} value={ModalData.data.email} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        email: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"create_username"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Username:</span>
                                </label>
                                <input className={"form-control"} id={"create_username"} placeholder={"Username"} value={ModalData.data.username} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        username: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"create_fullname"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Fullname:</span>
                                </label>
                                <input className={"form-control"} id={"create_fullname"} placeholder={"Fullname"} value={ModalData.data.fullname} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        fullname: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"create_password"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Password:</span>
                                </label>
                                <input className={"form-control"} id={"create_password"} type={"password"} placeholder={"Password"} value={ModalData.data.password} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        password: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"create_dob"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Date of birth:</span>
                                </label>
                                <input className={"form-control"} id={"create_dob"} type={"date"} placeholder={"Date of birth"} value={ModalData.data.dob} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        dob: e.target.value
                                    }
                                })}}/>
                            </div>


                            <div className="margin-top-20">
                                <label htmlFor={"create_gender"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Gender:</span>
                                </label>
                                <Select
                                    options={Genders}
                                    value={ModalData.data.gender_obj}
                                    onChange={ChangeGenderModal}
                                />
                            </div>

                            <div className="margin-top-20">
                                <label htmlFor={"create_phone"}>
                                    <span className="bold" style={{textTransform: "capitalize"}}>Phone:</span>
                                </label>
                                <input className={"form-control"} id={"create_phone"} type={"text"} placeholder={"Date of birth"} value={ModalData.data.phone} onChange={e => {setModalData({
                                    ...ModalData,
                                    data: {
                                        ...ModalData.data,
                                        phone: e.target.value
                                    }
                                })}}/>
                            </div>

                            <div className={"margin-top-20"}>
                                <input type={"checkbox"} checked={ModalData.data.is_admin} id={"create_is_admin"} onChange={e => {
                                    setModalData({
                                        ...ModalData,
                                        data: {
                                            ...ModalData.data,
                                            is_admin: !ModalData.data.is_admin
                                        }
                                    })
                                }}/>
                                <label htmlFor={"create_is_admin"}>
                                    &nbsp; ADMIN Role
                                </label>
                            </div>
                            <div className={"margin-top-20"}>
                                <button className={"btn pull-right"} onClick={_ => setModalData({...ModalData, show: false})}>Cancel</button>
                                <button className={"btn theme_green pull-right margin-right-10"} onClick={CreateUser}>Create</button>
                            </div>
                        </div>
                    )}
            </Modal>

            <div className="box-style" style={{height: "calc(100% - 40px)", padding: '20px', display: 'flex', position: 'relative'}}>

                <div style={{width: '300px', height: 'calc(100% - 30px)', display: 'inline-block'}}>
                    <input className="form-control" disabled={true} placeholder="Find by email ..."/>
                    <div className="list-container margin-top-10">
                        {Array.isArray(UserData) && UserData.length > 0 ?
                            UserData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="list-item"
                                    onClick={_ => GetUserInfo(item)}>
                                    {item.username}
                                </div>
                            )
                        }): (
                                <div>
                                    <span>No user founded!</span>
                                </div>
                            )
                        }
                    </div>
                </div>

                {Array.isArray(UserData) && UserData.length > 0 && (
                    <div style={{
                        width: 'calc(100% - 350px)',
                        height: 'calc(100% - 70px)',
                        marginLeft: '50px',
                        marginTop: '50px',
                        display: 'inline-block',
                        overflow: 'auto',
                        padding: '10px'}}>

                        <div className="margin-top-20">
                            <label htmlFor="email">
                                <span className="bold">Email:</span>
                            </label>
                            <input className="form-control" id="email" type={"text"} disabled={true} value={DetailData.email} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    email: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="username">
                                <span className="bold">Username:</span>
                            </label>
                            <input className="form-control" id="username" type={"text"} value={DetailData.username} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    username: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="fullname">
                                <span className="bold">Fullname:</span>
                            </label>
                            <input className="form-control" id="fullname" type={"text"} value={DetailData.fullname} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    fullname: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="dob">
                                <span className="bold">Date of birth:</span>
                            </label>
                            <input className="form-control" id="dob" type={"date"} value={DetailData.dob} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    dob: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="dob">
                                <span className="bold">Gender:</span>
                            </label>
                            <Select
                                options={Genders}
                                value={DetailData.gender_obj}
                                onChange={ChangeGender}
                            />
                        </div>

                        <div className="margin-top-20">
                            <label htmlFor="phone">
                                <span className="bold">Phone number:</span>
                            </label>
                            <input className="form-control" id="phone" type={"text"} value={DetailData.phone} onChange={e => {
                                setDetailData({
                                    ...DetailData,
                                    phone: e.target.value
                                })
                            }}/>
                        </div>

                        <div className="margin-top-20">
                            <input type={"checkbox"} checked={DetailData.is_admin} disabled={!is_admin} id={"is_admin"} onChange={e => setDetailData({
                                ...DetailData,
                                is_admin: !DetailData.is_admin
                            })}/>
                            <label htmlFor={"is_admin"}>
                                &nbsp;ADMIN Role
                            </label>
                        </div>

                        <div className="margin-top-20">
                            <button className="btn pull-right theme_red margin-left-10" onClick={DeleteUser}>
                                <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                    <FaRegWindowClose/>
                                </IconContext.Provider>
                                &nbsp;Delete
                            </button>
                            <button className="btn pull-right theme_cyan" onClick={UpdateUser}>
                                <IconContext.Provider value={{size: 22, color: 'white', className: 'middle-btn'}}>
                                    <MdOutlineSave/>
                                </IconContext.Provider>
                                &nbsp;Save change
                            </button>
                        </div>
                    </div>
                )}

                <div onClick={e => e.stopPropagation()}>
                    <span className="fab-button" onClick={ToggleApplicationBox}>
                        <IconContext.Provider value={{size: 25, color: 'white'}}>
                            <RiFunctionLine/>
                        </IconContext.Provider>
                    </span>

                    <div className={ShowAppBox ? "application-box flex" : "application-box"}>
                        {is_admin && (
                            <button className="btn theme_green700 margin-10" onClick={OpenModalCreateUser}>
                                <IconContext.Provider value={{size: 22, className: 'middle-btn'}}>
                                    <BiAddToQueue/>
                                </IconContext.Provider>
                                &nbsp;Create User</button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default User;