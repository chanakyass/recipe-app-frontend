import { useEffect } from "react"
import { useAppDispatch, useErrorSelector } from "../store/store.model"
import { showNotifications } from "../store/notification";
import Toast from 'react-bootstrap/Toast';
import { debounced } from "../util/utility-functions";

const AppToast = () => {

    const toastMessage = useErrorSelector((state) => state.notifications.currentNotificationMessage);

    const notifications = useErrorSelector((state) => state.notifications.notifications);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (notifications.length > 0) {
            debounced(dispatch, 300, showNotifications());
        }
    }, [dispatch, notifications])

    return <div className="d-flex justify-content-center w-100 z2"  data-testid='toastMessage'>
        {   toastMessage &&
            <Toast className="toast-rewrite rounded" delay={2500}>
                <Toast.Header>
                    <strong >Notification</strong>
                    <small className="ml-auto"></small>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        }  
    </div>
}

export default AppToast;