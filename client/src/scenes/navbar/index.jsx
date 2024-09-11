import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  ClickAwayListener,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Message,
  Notifications,
  Help,
  Menu,
  Close,
  Search,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchPage from "./SearchPage"; // Ensure correct path

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 700px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSearchClick = () => {
    setIsSearchBarVisible(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0 && !isSearchBarVisible) {
      setIsSearchBarVisible(true);
    }
  };

  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor={alt}
      sx={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "20" }}
    >
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          GoSocial
        </Typography>
        <Box position="relative">
          {isNonMobileScreens ? (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="1rem"
              padding="0.1rem 1.5rem"
              sx={{ width: "300px" }}
            >
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onClick={handleSearchClick}
                sx={{ width: "100%" }}
              />
              <IconButton onClick={handleSearchClick}>
                <Search />
              </IconButton>

              {/* Display SearchPage when search results are available */}
              {isSearchBarVisible && (
                <ClickAwayListener
                  onClickAway={() => setIsSearchBarVisible(false)}
                >
                  <Box
                    position="absolute"
                    top="3.5rem"
                    left="0"
                    width="100%"
                    backgroundColor={neutralLight}
                    zIndex="30"
                    sx={{
                      boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <SearchPage
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      onSearchResultClick={(id) => {
                        navigate(`/profile/${id}`);
                        setIsSearchBarVisible(false);
                      }}
                    />
                  </Box>
                </ClickAwayListener>
              )}
            </FlexBetween>
          ) : (
            <>
              <IconButton onClick={handleSearchClick}>
                <Search />
              </IconButton>
              {isSearchBarVisible && (
                <ClickAwayListener
                  onClickAway={() => setIsSearchBarVisible(false)}
                >
                  <Box
                    position="fixed"
                    top="4rem" // Positioning below the navbar
                    left="10%"
                    backgroundColor={neutralLight}
                    padding="0.5rem"
                    zIndex="30"
                    sx={{
                      width: "80vw", // Width set to 80% of the viewport
                      boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
                      ...(isNonMobileScreens
                        ? {} // No changes for non-mobile screens
                        : { width: "100vw", left: "0" }), // Full width on mobile screens
                    }}
                  >
                    <InputBase
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      sx={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <SearchPage
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      onSearchResultClick={(id) => {
                        navigate(`/profile/${id}`);
                        setIsSearchBarVisible(false);
                      }}
                    />
                  </Box>
                </ClickAwayListener>
              )}
            </>
          )}
        </Box>
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton
            sx={{ fontSize: "25px", cursor: "pointer" }}
            onClick={() => navigate("/chat")}
          >
            <Message />
          </IconButton>
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="80%"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode />
              ) : (
                <LightMode sx={{ color: dark }} />
              )}
            </IconButton>
            <IconButton
              sx={{ fontSize: "25px", cursor: "pointer" }}
              onClick={() => navigate("/chat")}
            >
              <Message />
            </IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
