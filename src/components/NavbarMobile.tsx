import React from 'react';
import { Link } from 'react-router-dom';

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';

import { IoMdClose } from 'react-icons/io';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { IoLanguage } from 'react-icons/io5';
import { MdLanguage } from 'react-icons/md';

import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../store/uiStore";

const COLORS = {
  navbarBg: '#FFFFFF',
  drawerBg: '#FFFFFF',
  text: '#000000',
  divider: '#000000',
  icon: '#000000',
  buttonBg: '#0000FF',
  buttonHover: '#ED1C24',
};

const LOCALES = [
  ['en', '/us.png', 'English'],
  ['ro', '/ro.png', 'Română'],
  ['hu', '/hu.png', 'Magyar'],
] as const;

const NavbarMobile = () => {
  const { t } = useTranslation();
  const menuOpen = useUIStore((state) => state.mobileMenuOpen);
  const languageDrawerOpen = useUIStore((state) => state.mobileLanguageDrawerOpen);
  const isNavbarCollapsed = useUIStore((state) => state.mobileNavbarCollapsed);
  const currentLanguage = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);
  const toggleDrawer = useUIStore((state) => state.toggleMobileMenu);
  const closeDrawer = useUIStore((state) => state.closeMobileMenu);
  const toggleLanguageDrawer = useUIStore((state) => state.toggleMobileLanguageDrawer);
  const closeLanguageDrawer = useUIStore((state) => state.closeMobileLanguageDrawer);
  const toggleNavbarCollapse = useUIStore((state) => state.toggleMobileNavbarCollapsed);

  const handleLanguageChange = (lng: string) => {
    setLanguage(lng);
    closeLanguageDrawer();
  };

  const brochureHref =
    currentLanguage === "ro"
      ? "/docs/wpt- brosura-ro.pdf"
      : "/docs/wpt- brosura-en.pdf";

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: COLORS.navbarBg,
          color: COLORS.text,
          padding: '0.75em 1em',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          transform: isNavbarCollapsed ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease-in-out',
          borderBottom: `1px solid ${COLORS.divider}`,
          height: '5em',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ width: '50vw', display: 'block' }}>
          <img
            src="/wpt-black-full-length-logo.svg"
            alt="Logo"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ width: '100%', height: 'auto', maxHeight: '3.5em', objectFit: 'contain' }}
          />
        </Link>
        <Box
          sx={{
            position: 'absolute',
            top: '0.6em',
            right: '1em',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
          }}
        >
          {/* Language Button */}
          <IconButton
            onClick={toggleLanguageDrawer}
            sx={{
              color: COLORS.icon,
              width: '2.75em',
              height: '2.75em',
              backgroundColor: COLORS.navbarBg,
            }}
          >
            <IoLanguage />
            <MdLanguage />
          </IconButton>

          {/* Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={toggleDrawer}
            sx={{
              width: '2.75em',
              height: '2.75em',
              backgroundColor: COLORS.navbarBg,
            }}
          >
            {menuOpen ? <IoMdClose /> : <HiOutlineBars3 />}
          </IconButton>
        </Box>
      </Box>

      {/* ===== COLLAPSE TOGGLE ===== */}
      <IconButton
        onClick={toggleNavbarCollapse}
        sx={{
          position: 'fixed',
          top: isNavbarCollapsed ? '0.5em' : '5em',
          right: '0.5em',
          transform: 'none',
          zIndex: 1001,
          backgroundColor: COLORS.drawerBg,
          color: COLORS.text,
          width: '1.6em',
          height: '1.6em',
          fontSize: '1em',
          transition: 'top 0.3s ease-in-out',
          border: `1px solid ${COLORS.divider}`,
          '&:hover': { backgroundColor: COLORS.buttonHover, color: '#FFFFFF' }
        }}
      >
        {isNavbarCollapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </IconButton>

      {/* ===== LANGUAGE DRAWER ===== */}
      <Drawer anchor="left" open={languageDrawerOpen} onClose={closeLanguageDrawer}
        PaperProps={{
          sx: {
            height: "100%",
            background: COLORS.drawerBg,
            width: '50vw',
            maxWidth: '50vw',
          }
        }}>
        <Box sx={{ width: "100%", p: 0 }}>
          <List sx={{ p: 0, m: 0 }}>
            {LOCALES.map(([code, flag, label]) => (
              <React.Fragment key={code}>
                <ListItem onClick={() => handleLanguageChange(code)} disablePadding sx={{ m: 0 }}>
                  <ListItemButton
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: `1px solid ${COLORS.divider}`,
                    }}
                  >
                    <img
                      src={flag}
                      alt={label}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      style={{
                        width: '10vw',
                        height: 'auto',
                        marginRight: '10px'
                      }}
                    />
                    <span style={{ color: COLORS.text }}>{label}</span>
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* ===== MAIN MENU DRAWER ===== */}
      <Drawer anchor="right" open={menuOpen} onClose={closeDrawer} PaperProps={{
        sx: {
          height: "100%",
          background: COLORS.drawerBg,
          width: '50vw',
          maxWidth: '50vw',
        }
      }}>
        <Box sx={{ width: "100%", p: 0, color: COLORS.text }}>
          <List sx={{ p: 0, m: 0 }}>
            {/* Technology */}
            <ListItem component={Link} to="/technology" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000' }}>
                <ListItemText primary={t("tech-title")} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />
            <ListItem component={Link} to="/calculator" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000' }}>
                <ListItemText primary={t("nav.calculator")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />

            {/* Applications */}
            <ListItem component={Link} to="/applications" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("nav.applications")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />

            {/* Docs */}
            <ListItem component={Link} to="/docs" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("nav.docs")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />

            {/* Brochure */}
            <ListItem component="a" href={brochureHref} target="_blank" rel="noreferrer" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("commercial-presentation")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />

            {/* Press */}
            <ListItem component={Link} to="/press" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("nav.press")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />
            <ListItem component={Link} to="/about/history" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("nav.history")} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />
            {/* Contact */}
            <ListItem component={Link} to="/contact" onClick={closeDrawer} disablePadding sx={{ textDecoration: 'none', p: 0, m: 0 }}>
              <ListItemButton sx={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                <ListItemText primary={t("nav.contact")} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ borderColor: COLORS.divider, m: 0 }} />

          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavbarMobile;
