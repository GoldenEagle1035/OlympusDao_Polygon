import { Box, SvgIcon } from "@material-ui/core";

function BondLogo({ bond }) {
  let viewBox = "0 0 32 32";
  let style = { height: "42px", width: "42px" };

  // Need more space if its an LP token
  if (bond.isLP) {
    viewBox = "0 0 64 32";
    style = { height: "42px", width: "95px" };
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      <img src = {bond.bondIconSvg}  style={style} />
    </Box>
  );
}

export default BondLogo;
