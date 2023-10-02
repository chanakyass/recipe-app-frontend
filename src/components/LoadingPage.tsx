import { FunctionComponent } from 'react';

const withLoading = (Component: FunctionComponent): (props: { loadingStatus: boolean, [key: string]: any }) => JSX.Element => {
    return  (props) => {
    const { loadingStatus, ...others } = props;
    return <>
        {
            loadingStatus &&
            <div className="z1">
                <div className="d-flex justify-content-center align-items-center w-100 h-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        }
        <Component { ...others } />
    </>;
    }
}

export default withLoading;