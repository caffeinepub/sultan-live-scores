import { useState } from "react";
import { useTheme } from "../App";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import { useApiKey } from "../hooks/useApiKey";
import { fetchTodayMatches } from "../services/footballApi";

export default function SettingsScreen() {
  const { dark, toggle } = useTheme();
  const { apiKey, saveApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [matchStart, setMatchStart] = useState(true);
  const [fullTime, setFullTime] = useState(true);
  const [testStatus, setTestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [testError, setTestError] = useState("");

  const bg = dark ? "#0f1923" : "#f0f4f8";
  const cardBg = dark ? "#1a2535" : "#ffffff";
  const textPrimary = dark ? "#ffffff" : "#1e293b";
  const textSecondary = "#64748b";
  const border = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const maskedKey = apiKey
    ? `${"•".repeat(Math.max(0, apiKey.length - 4))}${apiKey.slice(-4)}`
    : "";

  async function handleSaveConnect() {
    const key = inputKey.trim();
    if (!key) return;
    setTestStatus("loading");
    setTestError("");
    try {
      await fetchTodayMatches(key);
      saveApiKey(key);
      setInputKey("");
      setTestStatus("success");
    } catch (e) {
      setTestStatus("error");
      setTestError(e instanceof Error ? e.message : "Connection failed");
    }
  }

  function SettingRow({
    label,
    sub,
    children,
  }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <div>
          <div className="text-sm font-medium" style={{ color: textPrimary }}>
            {label}
          </div>
          {sub && (
            <div className="text-xs mt-0.5" style={{ color: textSecondary }}>
              {sub}
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bg, minHeight: "100%" }}>
      <div
        className="px-4 pt-12 pb-4"
        style={{ backgroundColor: dark ? "#0a1520" : "#ffffff" }}
      >
        <h1 className="text-xl font-bold" style={{ color: textPrimary }}>
          Settings
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Appearance */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: cardBg }}
        >
          <div
            className="px-4 py-2"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: textSecondary }}
            >
              APPEARANCE
            </span>
          </div>
          <SettingRow label="Dark Mode" sub="Toggle dark/light theme">
            <Switch
              checked={dark}
              onCheckedChange={toggle}
              data-ocid="settings.toggle"
            />
          </SettingRow>
        </div>

        {/* Notifications */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: cardBg }}
        >
          <div
            className="px-4 py-2"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: textSecondary }}
            >
              NOTIFICATIONS
            </span>
          </div>
          <SettingRow label="Goal Alerts" sub="Get notified on goals">
            <Switch checked={goalAlerts} onCheckedChange={setGoalAlerts} />
          </SettingRow>
          <SettingRow label="Match Start" sub="When matches kick off">
            <Switch checked={matchStart} onCheckedChange={setMatchStart} />
          </SettingRow>
          <SettingRow label="Full Time" sub="Final whistle notifications">
            <Switch checked={fullTime} onCheckedChange={setFullTime} />
          </SettingRow>
        </div>

        {/* API Integration */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: cardBg }}
        >
          <div
            className="px-4 py-2"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: textSecondary }}
            >
              LIVE DATA
            </span>
          </div>
          <div className="px-4 py-3.5">
            <div
              className="text-sm font-medium mb-1"
              style={{ color: textPrimary }}
            >
              API Key
            </div>
            <div className="text-xs mb-3" style={{ color: textSecondary }}>
              Connect to football-data.org for live scores
            </div>

            {apiKey && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: dark ? "#0f1923" : "#f0fdf4",
                  border: "1px solid #00e676",
                }}
              >
                <span className="text-xs" style={{ color: "#00e676" }}>
                  ✓ Connected
                </span>
                <span
                  className="text-xs flex-1 font-mono"
                  style={{ color: textSecondary }}
                >
                  {maskedKey}
                </span>
                <button
                  type="button"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                  onClick={() => {
                    saveApiKey("");
                    setTestStatus("idle");
                  }}
                  data-ocid="settings.delete_button"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="password"
              placeholder={
                apiKey
                  ? "Enter new API key to replace..."
                  : "Enter your API key..."
              }
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setTestStatus("idle");
              }}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: dark ? "#0f1923" : "#f8fafc",
                color: textPrimary,
                border: `1px solid ${border}`,
              }}
              data-ocid="settings.input"
            />

            {inputKey && (
              <button
                type="button"
                onClick={handleSaveConnect}
                disabled={testStatus === "loading"}
                className="mt-2 w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  backgroundColor:
                    testStatus === "loading" ? "#64748b" : "#00e676",
                  color: "#0a1520",
                  opacity: testStatus === "loading" ? 0.7 : 1,
                }}
                data-ocid="settings.submit_button"
              >
                {testStatus === "loading" ? (
                  <>
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <span>Testing connection...</span>
                  </>
                ) : (
                  "Save & Connect"
                )}
              </button>
            )}

            {testStatus === "success" && (
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#00e676" }}
                data-ocid="settings.success_state"
              >
                ✓ Connected successfully! Live data is now active.
              </p>
            )}
            {testStatus === "error" && (
              <p
                className="text-xs mt-2"
                style={{ color: "#ef4444" }}
                data-ocid="settings.error_state"
              >
                ✗ {testError}
              </p>
            )}

            <p className="text-[11px] mt-3" style={{ color: textSecondary }}>
              Free tier: football-data.org • Get your key at{" "}
              <a
                href="https://www.football-data.org/client/register"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#00e676" }}
              >
                football-data.org
              </a>
            </p>
          </div>
        </div>

        {/* About */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: cardBg }}
        >
          <div
            className="px-4 py-2"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: textSecondary }}
            >
              ABOUT
            </span>
          </div>
          <div className="px-4 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: textSecondary }}>
                App Name
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: textPrimary }}
              >
                Sultan Live Scores
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: textSecondary }}>
                Version
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: textPrimary }}
              >
                1.0.0
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: textSecondary }}>
                Leagues
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: textPrimary }}
              >
                6 competitions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
