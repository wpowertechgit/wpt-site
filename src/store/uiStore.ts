import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UIState = {
  language: string;
  mobileMenuOpen: boolean;
  mobileLanguageDrawerOpen: boolean;
  mobileNavbarCollapsed: boolean;
  setLanguage: (language: string) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openMobileLanguageDrawer: () => void;
  closeMobileLanguageDrawer: () => void;
  toggleMobileLanguageDrawer: () => void;
  toggleMobileNavbarCollapsed: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: "en",
      mobileMenuOpen: false,
      mobileLanguageDrawerOpen: false,
      mobileNavbarCollapsed: false,
      setLanguage: (language) => set({ language }),
      openMobileMenu: () => set({ mobileMenuOpen: true }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      openMobileLanguageDrawer: () => set({ mobileLanguageDrawerOpen: true }),
      closeMobileLanguageDrawer: () => set({ mobileLanguageDrawerOpen: false }),
      toggleMobileLanguageDrawer: () =>
        set((state) => ({
          mobileLanguageDrawerOpen: !state.mobileLanguageDrawerOpen,
        })),
      toggleMobileNavbarCollapsed: () =>
        set((state) => ({ mobileNavbarCollapsed: !state.mobileNavbarCollapsed })),
    }),
    {
      name: "wpt-ui-store",
      partialize: (state) => ({ language: state.language }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
