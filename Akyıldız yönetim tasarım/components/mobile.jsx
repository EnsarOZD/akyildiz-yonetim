// Mobile tenant view - iOS frame

const MobileTenantView = ({ theme }) => {
  const [screen, setScreen] = React.useState('home');
  const tenant = MOCK.TENANTS[0]; // Özkan Mühendislik - has debt
  const { formatTRY } = UI;

  const tabBar = (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: theme.surface + 'E6',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${theme.border}`,
      padding: '8px 16px 28px', display: 'flex', justifyContent: 'space-around',
    }}>
      {[
        { id: 'home', icon: 'home', label: 'Ana' },
        { id: 'debts', icon: 'receipt', label: 'Borçlar' },
        { id: 'requests', icon: 'inbox', label: 'Talep' },
        { id: 'profile', icon: 'users', label: 'Profil' },
      ].map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: screen === t.id ? theme.accent : theme.textMuted,
          padding: 4, fontFamily: 'inherit',
        }}>
          <Icon name={t.icon} size={22} strokeWidth={screen === t.id ? 2.2 : 1.7} />
          <span style={{ fontSize: 10, fontWeight: screen === t.id ? 600 : 500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );

  const content = () => {
    if (screen === 'home') return (
      <div style={{ padding: '16px 20px 100px' }}>
        {/* Balance card */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
          borderRadius: 20, padding: 20, color: theme.accentText,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Güncel Bakiyeniz</div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            {formatTRY(tenant.balance)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Ödenmesi gereken tutar</div>
          <button style={{
            marginTop: 16, width: '100%', padding: '12px',
            background: theme.accentText, color: theme.accent,
            border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>Hemen Öde</button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Bekleyen Ödemeler</div>
        {[
          { t: 'Aidat (Nisan)', a: 3200, d: '15 Nis', over: true, i: 'building' },
          { t: 'Elektrik', a: 1650, d: '20 Nis', over: false, i: 'bolt' },
        ].map((d, i) => (
          <div key={i} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: 14, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={d.i} size={18} color={d.over ? theme.danger : theme.accent} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{d.t}</div>
              <div style={{ fontSize: 11.5, color: d.over ? theme.danger : theme.textMuted, marginTop: 2 }}>
                {d.over ? 'Gecikmiş · ' : 'Son ödeme '}{d.d}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, fontVariantNumeric: 'tabular-nums' }}>
              {formatTRY(d.a)}
            </div>
          </div>
        ))}

        <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '20px 0 10px' }}>Hızlı İşlemler</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { i: 'inbox', l: 'Talep Oluştur', s: theme.accent },
            { i: 'receipt', l: 'Dekont Yükle', s: theme.info },
            { i: 'file', l: 'Belgelerim', s: theme.warning },
            { i: 'phone', l: 'Yönetim', s: theme.success },
          ].map((q, i) => (
            <button key={i} style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 14, padding: 14, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
              fontFamily: 'inherit',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: q.s + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={q.i} size={16} color={q.s} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{q.l}</div>
            </button>
          ))}
        </div>
      </div>
    );

    if (screen === 'requests') return (
      <div style={{ padding: '16px 20px 100px' }}>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: theme.accent, color: theme.accentText, border: 'none',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginBottom: 16,
        }}>
          <Icon name="plus" size={16} strokeWidth={2.5} />
          Yeni Talep Oluştur
        </button>
        {MOCK.REQUESTS.slice(0, 4).map(r => (
          <div key={r.id} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: 14, marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: theme.fontMono }}>#{r.id}</div>
              <div style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                background: r.status === 'open' ? theme.dangerBg : r.status === 'in-progress' ? theme.warningBg : theme.successBg,
                color: r.status === 'open' ? theme.danger : r.status === 'in-progress' ? theme.warning : theme.success,
              }}>
                {r.status === 'open' ? 'AÇIK' : r.status === 'in-progress' ? 'İŞLEMDE' : 'ÇÖZÜLDÜ'}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginTop: 8, lineHeight: 1.3 }}>{r.subject}</div>
            <div style={{ fontSize: 12, color: theme.textDim, marginTop: 8, lineHeight: 1.5 }}>{r.desc.slice(0, 80)}...</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.date} · {r.time}</span>
              {r.messages > 0 && <span>💬 {r.messages} mesaj</span>}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: theme.accentText,
        }}>{tenant.avatar}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{tenant.name}</div>
          <div style={{ fontSize: 13, color: theme.textDim, marginTop: 2 }}>Ofis {tenant.unit} · {tenant.category}</div>
        </div>
        <div style={{ width: '100%', background: theme.surface, borderRadius: 14, border: `1px solid ${theme.border}`, overflow: 'hidden', marginTop: 8 }}>
          {[
            { i: 'phone', l: 'Telefon', v: tenant.phone },
            { i: 'users', l: 'Yetkili', v: tenant.rep },
            { i: 'calendar', l: 'Başlangıç', v: tenant.since },
            { i: 'building', l: 'Metrekare', v: '145 m²' },
          ].map((it, i) => (
            <div key={i} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderTop: i > 0 ? `1px solid ${theme.border}` : 'none',
            }}>
              <Icon name={it.i} size={16} color={theme.textMuted} />
              <div style={{ flex: 1, fontSize: 13, color: theme.textDim }}>{it.l}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: 390, height: 780, borderRadius: 46, overflow: 'hidden', background: theme.bg, position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 10px #1a1a1a, 0 0 0 11px #2a2a2a', fontFamily: theme.fontSans }}>
      {/* Status bar */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px 0', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>9:41</div>
        <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 110, height: 32, borderRadius: 20, background: '#000' }} />
        <div style={{ display: 'flex', gap: 6, color: theme.text, fontSize: 14 }}>
          <span style={{ letterSpacing: -1 }}>●●●●</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textDim }}>Merhaba 👋</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.5, marginTop: 2 }}>{tenant.rep.split(' ')[0]}</div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          background: theme.surface, border: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <Icon name="bell" size={18} color={theme.text} />
          <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: theme.danger, border: `2px solid ${theme.surface}` }}></span>
        </button>
      </div>

      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
        {content()}
      </div>
      {tabBar}
    </div>
  );
};

window.MobileTenantView = MobileTenantView;
