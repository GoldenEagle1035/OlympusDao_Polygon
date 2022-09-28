import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as vote } from "../../assets/icons/vote2.svg";

export default function Social() {
  const medium_link = "/";
  return (
    <div className="social-row">
      {/* <Link href="https://" target="_blank">
        <SvgIcon color="primary" component={vote} />
      </Link> */}

      <Link href="https://discord.gg/GXQPeQ94Sv" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>

      <Link href="https://medium.com/@HOMdao" target="_blank">
        <SvgIcon color="primary" component={Medium} />
      </Link>
    </div>
  );
}
