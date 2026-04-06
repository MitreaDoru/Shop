import { useSelector } from "react-redux";
import { selectAlert } from "../../features/actions/actionsSelectors";

const Alert = () => {
  const alert = useSelector(selectAlert);
  return (
    <div className="alert">
      <div className="alert__content">
        <h2 className="alert__title">{alert.title}</h2>
        <h3 className="alert__message">{alert.message}</h3>
        <div className="alert__progress"></div>
      </div>
    </div>
  );
};

export default Alert;
