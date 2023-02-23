import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const TransferDialog = ({ dialog, onStateChange }) => {

    const [showDialog, setShowDialog] = useState(false);

    const hideDialog = useCallback(e => {
        e.preventDefault();
        setShowDialog(false);
    }, [onStateChange])

    return (
        
            <></>
            
        
    )
}

export default TransferDialog
