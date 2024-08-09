import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="data:image/png;base64,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"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
