import { withRouter } from "react-router-dom";
const ErrorPage = ({ location }: any) => {
  const defaultError = {
    error: {
      statusCode: 500,
      message: "Internal Server error",
      details: ["Error in processing"],
    },
  };

  const error = location.state || defaultError;
  return (
    <>
      <div className="mw-100">
        <div className="m-3 border-bottom row">
          <h2 data-testid='errorStatus'>HTTP ERROR {error.statusCode}</h2>
        </div>
        <div className="m-4 row" data-testid='errorMessage'>
          <span>{error.message}</span>
        </div>
        {error.details && (
          <div className="m-4 row">
            <ul>
              {error.details.map((detail: any, index: number) => {
                return <li key={index}>{detail}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default withRouter(ErrorPage);
