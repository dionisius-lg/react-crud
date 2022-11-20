import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import history from "./../helpers/history";

const Protected = ({ children }) => {
    const { user } = useSelector(x => x.auth)

    if (!user) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" state={{ from: history.location }} />
    }

    // authorized so return child components
    return children
}

export default Protected