import {useDispatch, useSelector} from "react-redux";

function User(props) {
    const dispatch  = useDispatch();
    const {token}   = useSelector(state => state.Authen);
    return (
        <>

        </>
    );
}

export default User;