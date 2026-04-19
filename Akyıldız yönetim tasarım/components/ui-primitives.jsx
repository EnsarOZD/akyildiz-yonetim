// Shared UI primitives - Top navbar layout matching real Akyıldız app

const TopNav = ({ theme, current, onNav }) => {
  const items = [
    { id: 'dashboard', label: 'Özet' },
    { id: 'tenants', label: 'Kiracılar' },
    { id: 'payments', label: 'Ödemeler' },
    { id: 'expenses', label: 'Giderler' },
    { id: 'debts', label: 'Borçlar' },
    { id: 'units', label: 'Üniteler' },
    { id: 'requests', label: 'Talepler' },
    { id: 'reports', label: 'Raporlar' },
  ];
  return (
    <header style={{
      height: 60, background: theme.surface, borderBottom: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', padding: '0 28px', gap: 28,
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: theme.accent,
        }}></div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.text, letterSpacing: 1.2 }}>AKYILDIZ YÖNETİM</div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
        {items.map(it => {
          const active = current === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              padding: '8px 14px', borderRadius: 8,
              background: active ? theme.accent : 'transparent',
              color: active ? theme.accentText : theme.textDim,
              border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: active ? 600 : 500,
              fontFamily: 'inherit', letterSpacing: -0.1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = theme.text; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = theme.textDim; }}>
              {it.label}
            </button>
          );
        })}
      </nav>
      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: theme.textDim, position: 'relative', padding: 4,
        }}>
          <Icon name="bell" size={18} />
          <span style={{ position: 'absolute', top: 0, right: 0, minWidth: 14, height: 14, borderRadius: 7, background: theme.danger, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>3</span>
        </button>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textDim, padding: 4 }}>
          <Icon name="settings" size={17} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px 4px 4px', borderRadius: 20, background: theme.surfaceAlt }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: theme.accentText,
          }}>EG</div>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: theme.text }}>Ensar</span>
          <Icon name="chevronDown" size={13} color={theme.textMuted} />
        </div>
      </div>
    </header>
  );
};

// Page Header Card — colored left border + icon + title/subtitle + actions
const PageHeader = ({ theme, icon, title, subtitle, actions, accent }) => (
  <div style={{
    background: theme.surface, border: `1px solid ${theme.border}`,
    borderRadius: 14, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 18,
    borderLeft: `4px solid ${accent || theme.accent}`,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: theme.accentBg, color: theme.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={22} strokeWidth={1.8} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: theme.textDim, marginTop: 2 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
  </div>
);

const Card = ({ theme, children, style, padding = 20, ...rest }) => (
  <div style={{
    background: theme.surface, border: `1px solid ${theme.border}`,
    borderRadius: 12, padding, ...style,
  }} {...rest}>{children}</div>
);

const Badge = ({ theme, tone = 'default', children, size = 'md' }) => {
  const tones = {
    success: { bg: theme.successBg, color: theme.success },
    danger: { bg: theme.dangerBg, color: theme.danger },
    warning: { bg: theme.warningBg, color: theme.warning },
    info: { bg: theme.infoBg, color: theme.info },
    accent: { bg: theme.accentBg, color: theme.accent },
    default: { bg: theme.surfaceAlt, color: theme.textDim },
  };
  const t = tones[tone];
  const sizes = { sm: { fontSize: 10, padding: '2px 6px' }, md: { fontSize: 11, padding: '3px 8px' } };
  return (
    <span style={{
      ...sizes[size], fontWeight: 600, borderRadius: 999,
      background: t.bg, color: t.color,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
};

const Button = ({ theme, variant = 'primary', icon, children, onClick, style }) => {
  const variants = {
    primary: { bg: theme.accent, color: theme.accentText, border: 'transparent' },
    secondary: { bg: theme.surfaceAlt, color: theme.text, border: theme.borderStrong },
    ghost: { bg: 'transparent', color: theme.textDim, border: 'transparent' },
    outline: { bg: 'transparent', color: theme.text, border: theme.borderStrong },
    danger: { bg: theme.dangerBg, color: theme.danger, border: 'transparent' },
    success: { bg: theme.successBg, color: theme.success, border: 'transparent' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 8,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      fontSize: 13, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit', letterSpacing: -0.1,
      transition: 'all 0.15s', whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={14} strokeWidth={2} />}
      {children}
    </button>
  );
};

// Stat pill — icon + label + big number (used in sub-headers)
const StatPill = ({ theme, icon, iconColor, iconBg, label, value, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: iconBg || theme.surfaceAlt, color: iconColor || theme.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={20} strokeWidth={1.8} />
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

// Input
const Input = ({ theme, icon, placeholder, style, type = 'text' }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
    padding: '9px 12px', borderRadius: 8, ...style,
  }}>
    {icon && <Icon name={icon} size={14} color={theme.textMuted} />}
    <input type={type} placeholder={placeholder} style={{
      background: 'transparent', border: 'none', outline: 'none',
      color: theme.text, fontSize: 13, flex: 1, fontFamily: 'inherit',
    }} />
  </div>
);

const Select = ({ theme, value, options = [], style }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
    background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
    padding: '9px 12px', borderRadius: 8,
    fontSize: 13, color: theme.text, fontWeight: 500,
    ...style,
  }}>
    <span style={{ flex: 1 }}>{value}</span>
    <Icon name="chevronDown" size={14} color={theme.textMuted} />
  </div>
);

const formatTRY = (n, decimals = 2) => {
  const abs = Math.abs(n);
  return abs.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + ' ₺';
};

const formatTRYShort = (n) => {
  const abs = Math.abs(n);
  return abs.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

window.UI = { TopNav, PageHeader, Card, Badge, Button, StatPill, Input, Select, formatTRY, formatTRYShort };
