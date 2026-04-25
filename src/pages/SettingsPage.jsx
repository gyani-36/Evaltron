import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const translations = {
  English: {
    back: "← Back",
    settings: "Settings",
    profile: "👤 Profile",
    displayName: "Display Name",
    email: "Email",
    saveProfile: "Save Profile",
    savedProfile: "Saved ✓",
    changePassword: "🔒 Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    enterCurrent: "Enter current password",
    enterNew: "Enter new password",
    confirmNew: "Confirm new password",
    updatePassword: "Update Password",
    passwordUpdated: "Password Updated ✓",
    preferences: "⚙️ Preferences",
    pushNotifications: "Push Notifications",
    pushDesc: "Get notified when evaluation is done",
    emailNotifications: "Email Notifications",
    emailDesc: "Receive results via email",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    account: "🛡️ Account",
    accountStatus: "Account Status",
    accountActive: "Your account is active",
    active: "Active",
    logout: "Logout",
    logoutDesc: "Sign out of your account",
    logoutBtn: "Logout",
    deleteAccount: "Delete Account",
    deleteDesc: "Permanently delete your account and data",
    deleteBtn: "Delete",
    deleteConfirm: "Are you sure you want to delete your account? This cannot be undone.",
    allFieldsRequired: "All password fields are required.",
    passwordMismatch: "New passwords do not match.",
    passwordLength: "Password must be at least 6 characters.",
  },
  Hindi: {
    back: "← वापस",
    settings: "सेटिंग्स",
    profile: "👤 प्रोफ़ाइल",
    displayName: "प्रदर्शन नाम",
    email: "ईमेल",
    saveProfile: "प्रोफ़ाइल सहेजें",
    savedProfile: "सहेजा गया ✓",
    changePassword: "🔒 पासवर्ड बदलें",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmPassword: "नया पासवर्ड पुष्टि करें",
    enterCurrent: "वर्तमान पासवर्ड दर्ज करें",
    enterNew: "नया पासवर्ड दर्ज करें",
    confirmNew: "नया पासवर्ड पुष्टि करें",
    updatePassword: "पासवर्ड अपडेट करें",
    passwordUpdated: "पासवर्ड अपडेट हुआ ✓",
    preferences: "⚙️ प्राथमिकताएं",
    pushNotifications: "पुश सूचनाएं",
    pushDesc: "मूल्यांकन पूरा होने पर सूचना पाएं",
    emailNotifications: "ईमेल सूचनाएं",
    emailDesc: "परिणाम ईमेल पर प्राप्त करें",
    language: "भाषा",
    theme: "थीम",
    dark: "डार्क",
    light: "लाइट",
    account: "🛡️ खाता",
    accountStatus: "खाता स्थिति",
    accountActive: "आपका खाता सक्रिय है",
    active: "सक्रिय",
    logout: "लॉगआउट",
    logoutDesc: "अपने खाते से साइन आउट करें",
    logoutBtn: "लॉगआउट",
    deleteAccount: "खाता हटाएं",
    deleteDesc: "अपना खाता और डेटा स्थायी रूप से हटाएं",
    deleteBtn: "हटाएं",
    deleteConfirm: "क्या आप वाकई अपना खाता हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।",
    allFieldsRequired: "सभी पासवर्ड फ़ील्ड आवश्यक हैं।",
    passwordMismatch: "नए पासवर्ड मेल नहीं खाते।",
    passwordLength: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
  },
  Telugu: {
    back: "← వెనుకకు",
    settings: "సెట్టింగులు",
    profile: "👤 ప్రొఫైల్",
    displayName: "ప్రదర్శన పేరు",
    email: "ఇమెయిల్",
    saveProfile: "ప్రొఫైల్ సేవ్ చేయి",
    savedProfile: "సేవ్ అయింది ✓",
    changePassword: "🔒 పాస్‌వర్డ్ మార్చు",
    currentPassword: "ప్రస్తుత పాస్‌వర్డ్",
    newPassword: "కొత్త పాస్‌వర్డ్",
    confirmPassword: "కొత్త పాస్‌వర్డ్ నిర్ధారించు",
    enterCurrent: "ప్రస్తుత పాస్‌వర్డ్ నమోదు చేయి",
    enterNew: "కొత్త పాస్‌వర్డ్ నమోదు చేయి",
    confirmNew: "కొత్త పాస్‌వర్డ్ నిర్ధారించు",
    updatePassword: "పాస్‌వర్డ్ అప్‌డేట్ చేయి",
    passwordUpdated: "పాస్‌వర్డ్ అప్‌డేట్ అయింది ✓",
    preferences: "⚙️ ప్రాధాన్యతలు",
    pushNotifications: "పుష్ నోటిఫికేషన్లు",
    pushDesc: "మూల్యాంకనం పూర్తయినప్పుడు తెలియజేయి",
    emailNotifications: "ఇమెయిల్ నోటిఫికేషన్లు",
    emailDesc: "ఫలితాలను ఇమెయిల్ ద్వారా పొందు",
    language: "భాష",
    theme: "థీమ్",
    dark: "డార్క్",
    light: "లైట్",
    account: "🛡️ ఖాతా",
    accountStatus: "ఖాతా స్థితి",
    accountActive: "మీ ఖాతా సక్రియంగా ఉంది",
    active: "సక్రియం",
    logout: "లాగ్అవుట్",
    logoutDesc: "మీ ఖాతా నుండి సైన్ అవుట్ చేయి",
    logoutBtn: "లాగ్అవుట్",
    deleteAccount: "ఖాతా తొలగించు",
    deleteDesc: "మీ ఖాతా మరియు డేటాను శాశ్వతంగా తొలగించు",
    deleteBtn: "తొలగించు",
    deleteConfirm: "మీరు నిజంగా మీ ఖాతాను తొలగించాలనుకుంటున్నారా? దీన్ని రద్దు చేయడం సాధ్యం కాదు.",
    allFieldsRequired: "అన్ని పాస్‌వర్డ్ ఫీల్డ్‌లు అవసరం.",
    passwordMismatch: "కొత్త పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
    passwordLength: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
  },
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "Dark");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  const t = translations[language];

  // Apply theme to document root so it affects the entire app
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.toLowerCase());
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const isDark = theme === "Dark";

  const bg = isDark ? "#050816" : "#f0f4ff";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const cardBorder = isDark ? "#1e293b" : "#e2e8f0";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "#1e293b" : "#f8fafc";
  const inputBorder = isDark ? "#334155" : "#cbd5e1";
  const accentColor = "#6366f1";

  const handleSaveProfile = () => {
    const updated = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updated));
    setSaved("profile");
    setTimeout(() => setSaved(""), 2000);
  };

  const handleChangePassword = async () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t.allFieldsRequired); return;
    }
    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch); return;
    }
    if (newPassword.length < 6) {
      setError(t.passwordLength); return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.status === 401) { localStorage.clear(); navigate("/login"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setSaved("password");
      setTimeout(() => setSaved(""), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t.deleteConfirm)) {
      localStorage.clear();
      navigate("/register");
    }
  };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 48, height: 26, borderRadius: 99,
        background: value ? accentColor : isDark ? "#374151" : "#cbd5e1",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.3s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: value ? 25 : 3, width: 20, height: 20,
        borderRadius: "50%", background: "#fff",
        transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );

  const inputStyle = {
    width: "100%", background: inputBg,
    border: `1.5px solid ${inputBorder}`, color: textPrimary,
    padding: "12px 16px", borderRadius: 12, fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const cardStyle = {
    background: cardBg, border: `1.5px solid ${cardBorder}`,
    borderRadius: 16, padding: 28,
    boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(99,102,241,0.07)",
  };

  const labelStyle = { fontSize: 13, color: textSecondary, display: "block", marginBottom: 6 };
  const sectionTitle = { fontSize: 16, fontWeight: 600, color: accentColor, marginBottom: 20 };
  const primaryBtn = {
    width: "100%", background: accentColor, color: "#fff",
    border: "none", padding: "14px", borderRadius: 12,
    fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.2s",
  };

  return (
    <div style={{
      background: bg, color: textPrimary, minHeight: "100vh",
      padding: "40px 20px", transition: "background 0.3s, color 0.3s",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", color: accentColor,
          cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0,
        }}>
          {t.back}
        </button>

        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 32, textAlign: "center" }}>
          <span style={{ color: accentColor }}>{t.settings}</span>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* PROFILE */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t.profile}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%", background: accentColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{name}</p>
                <p style={{ color: textSecondary, fontSize: 13, margin: 0 }}>{email}</p>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{t.displayName}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{t.email}</label>
              <input type="text" value={email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
            </div>
            <button onClick={handleSaveProfile} style={primaryBtn}>
              {saved === "profile" ? t.savedProfile : t.saveProfile}
            </button>
          </div>

          {/* CHANGE PASSWORD */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t.changePassword}</p>
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444",
                color: "#f87171", padding: "12px 16px", borderRadius: 10,
                fontSize: 13, marginBottom: 16,
              }}>
                {error}
              </div>
            )}
            {[
              { label: t.currentPassword, val: currentPassword, set: setCurrentPassword, ph: t.enterCurrent },
              { label: t.newPassword, val: newPassword, set: setNewPassword, ph: t.enterNew },
              { label: t.confirmPassword, val: confirmPassword, set: setConfirmPassword, ph: t.confirmNew },
            ].map(({ label, val, set, ph }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{label}</label>
                <input type="password" value={val} onChange={(e) => set(e.target.value)} placeholder={ph} style={inputStyle} />
              </div>
            ))}
            <button onClick={handleChangePassword} style={primaryBtn}>
              {saved === "password" ? t.passwordUpdated : t.updatePassword}
            </button>
          </div>

          {/* PREFERENCES */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t.preferences}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.pushNotifications}</p>
                <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>{t.pushDesc}</p>
              </div>
              <Toggle value={notifications} onChange={setNotifications} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.emailNotifications}</p>
                <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>{t.emailDesc}</p>
              </div>
              <Toggle value={emailNotifications} onChange={setEmailNotifications} />
            </div>

            {/* Language */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{t.language}</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["English", "Hindi", "Telugu"].map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: `1.5px solid ${language === lang ? accentColor : inputBorder}`,
                    background: language === lang ? (isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)") : inputBg,
                    color: language === lang ? accentColor : textSecondary,
                    fontWeight: language === lang ? 600 : 400,
                    fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {lang === "English" ? "🇬🇧 English" : lang === "Hindi" ? "🇮🇳 हिंदी" : "🇮🇳 తెలుగు"}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label style={labelStyle}>{t.theme}</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Dark", "Light"].map((th) => (
                  <button key={th} onClick={() => setTheme(th)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: `1.5px solid ${theme === th ? accentColor : inputBorder}`,
                    background: theme === th ? (isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)") : inputBg,
                    color: theme === th ? accentColor : textSecondary,
                    fontWeight: theme === th ? 600 : 400,
                    fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {th === "Dark" ? `🌙 ${t.dark}` : `☀️ ${t.light}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ACCOUNT */}
          <div style={cardStyle}>
            <p style={sectionTitle}>{t.account}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${cardBorder}` }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.accountStatus}</p>
                <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>{t.accountActive}</p>
              </div>
              <span style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid #22c55e", fontSize: 12, padding: "4px 12px", borderRadius: 99 }}>
                {t.active}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${cardBorder}` }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.logout}</p>
                <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>{t.logoutDesc}</p>
              </div>
              <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={{
                background: isDark ? "#1e293b" : "#f1f5f9",
                border: `1px solid ${inputBorder}`, color: textPrimary,
                padding: "8px 18px", borderRadius: 10, fontSize: 13, cursor: "pointer",
              }}>
                {t.logoutBtn}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#f87171", margin: 0 }}>{t.deleteAccount}</p>
                <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>{t.deleteDesc}</p>
              </div>
              <button onClick={handleDeleteAccount} style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444",
                color: "#f87171", padding: "8px 18px", borderRadius: 10,
                fontSize: 13, cursor: "pointer",
              }}>
                {t.deleteBtn}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}