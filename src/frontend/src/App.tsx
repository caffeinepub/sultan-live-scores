import { createContext, useContext, useEffect, useState } from "react";
import FavoritesScreen from "./screens/FavoritesScreen";
import HomeScreen from "./screens/HomeScreen";
import LeagueDetailScreen from "./screens/LeagueDetailScreen";
import LeaguesScreen from "./screens/LeaguesScreen";
import MatchDetailScreen from "./screens/MatchDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import type { League, Match } from "./types";

type Tab = "home" | "leagues" | "favorites" | "settings";

type Screen =
  | { type: "home" }
  | { type: "leagues" }
  | { type: "league-detail"; league: League }
  | { type: "match-detail"; match: Match }
  | { type: "favorites" }
  | { type: "settings" };

interface ThemeContextType {
  dark: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  dark: true,
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

interface NavContextType {
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

export const NavContext = createContext<NavContextType>({
  navigate: () => {},
  goBack: () => {},
});
export const useNav = () => useContext(NavContext);

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [screenStack, setScreenStack] = useState<Screen[]>([{ type: "home" }]);

  const currentScreen = screenStack[screenStack.length - 1];

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const navigate = (screen: Screen) => {
    setScreenStack((prev) => [...prev, screen]);
    if (screen.type === "leagues") setActiveTab("leagues");
    if (screen.type === "favorites") setActiveTab("favorites");
    if (screen.type === "settings") setActiveTab("settings");
    if (screen.type === "home") setActiveTab("home");
  };

  const goBack = () => {
    setScreenStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setScreenStack([{ type: tab }]);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "⚽" },
    { id: "leagues", label: "Leagues", icon: "🏆" },
    { id: "favorites", label: "Favorites", icon: "★" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderScreen = () => {
    switch (currentScreen.type) {
      case "home":
        return <HomeScreen />;
      case "leagues":
        return <LeaguesScreen />;
      case "league-detail":
        return <LeagueDetailScreen league={currentScreen.league} />;
      case "match-detail":
        return <MatchDetailScreen match={currentScreen.match} />;
      case "favorites":
        return <FavoritesScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isTopLevel = screenStack.length === 1;

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <NavContext.Provider value={{ navigate, goBack }}>
        <div
          className={`min-h-screen flex flex-col items-center ${dark ? "bg-[#070d14]" : "bg-gray-100"}`}
        >
          <div
            className="w-full max-w-[430px] min-h-screen flex flex-col relative"
            style={{
              backgroundColor: dark ? "#0f1923" : "#f5f5f5",
              color: dark ? "#ffffff" : "#1a1a1a",
            }}
          >
            {/* Screen content */}
            <div className="flex-1 overflow-y-auto pb-20">{renderScreen()}</div>

            {/* Bottom tab bar */}
            {isTopLevel && (
              <div
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex"
                style={{
                  backgroundColor: dark ? "#0a1520" : "#ffffff",
                  borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
                  paddingBottom: "env(safe-area-inset-bottom, 8px)",
                }}
              >
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
                    style={{
                      color:
                        activeTab === tab.id
                          ? "#00e676"
                          : dark
                            ? "#64748b"
                            : "#94a3b8",
                    }}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-[10px] font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span
                        className="absolute bottom-0 w-6 h-0.5 rounded-full"
                        style={{ backgroundColor: "#00e676" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </NavContext.Provider>
    </ThemeContext.Provider>
  );
}
