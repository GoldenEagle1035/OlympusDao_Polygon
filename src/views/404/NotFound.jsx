import OlympusLogo from "../../assets/Olympus Logo.svg";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://HOMdao.finance/" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt="HOM DAO" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
