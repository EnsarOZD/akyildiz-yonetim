// Dashboard (Özet) — matches real app structure

const DashboardPage = ({ theme }) => {
  const { formatTRY, Card, PageHeader, Button, Select } = UI;

  const kasaBakiyesi = 2075638.37;
  const toplamGelir = 6536227.94;
  const toplamGider = 4460589.57;
  const geciken = 1737447.30;
  const bekleyen = { aidat: 1684840.73, elektrik: 410321.26, su: 45493.44 };
  const bekleyenToplam = bekleyen.aidat + bekleyen.elektrik + bekleyen.su;

  const monthMax = Math.max(...MOCK.MONTHLY.map(m => Math.max(m.income, m.expense)));

  const quickActions = [
    { icon: 'plus', label: 'Borç Ekle', color: '#A78BFA' },
    { icon: 'cash', label: 'Tahsilat Al', color: '#34D399' },
    { icon: 'trash', label: 'Gider Ekle', color: '#F87171' },
    { icon: 'users', label: 'Kiracılar', color: '#A78BFA' },
    { icon: 'file', label: 'Raporlar', color: '#60A5FA' },
    { icon: 'inbox', label: 'Talepler', color: '#60A5FA' },
    { icon: 'megaphone', label: 'Duyuru Yap', color: '#A78BFA' },
  ];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme}
        icon="pieChart" title="Genel Bakış" subtitle="Finansal özet ve son aktiviteler"
        actions={<>
          <Select theme={theme} value="Tüm Zamanlar" />
          <Button theme={theme} variant="secondary" icon="refresh">Yenile</Button>
        </>} />

      {/* Top row: stats + overdue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginTop: 20 }}>
        <Card theme={theme} style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: 'wallet', label: 'Kasa Bakiyesi', value: kasaBakiyesi, color: theme.success, sub: null },
              { icon: 'trending', label: 'Toplam Gelir', value: toplamGelir, color: theme.accent, sub: '+100.000,00 bu ay' },
              { icon: 'arrowDown', label: 'Toplam Gider', value: toplamGider, color: theme.danger, sub: '97 kalem' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: s.color + '18', color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={s.icon} size={18} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.7 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(s.value)}</div>
                {s.sub && <div style={{ fontSize: 11.5, color: theme.textMuted }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </Card>

        {/* Overdue card */}
        <Card theme={theme} style={{ padding: 20, position: 'relative', overflow: 'hidden', borderLeft: `3px solid ${theme.danger}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: theme.dangerBg, color: theme.danger,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="alert" size={20} />
            </div>
            <div style={{
              background: theme.danger, color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '4px 10px', borderRadius: 999,
            }}>71 Ödeme</div>
          </div>
          <div style={{ fontSize: 13, color: theme.textDim, marginTop: 14 }}>Geciken Toplam</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: theme.danger, letterSpacing: -1, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(geciken)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: theme.textDim }}>
            <Icon name="calendar" size={13} />
            En Eski Borç: <span style={{ color: theme.danger, fontWeight: 600 }}>11 Mar</span>
          </div>
          <div style={{ height: 1, background: theme.border, margin: '14px 0 10px' }}></div>
          <a style={{ fontSize: 11.5, color: theme.danger, fontWeight: 700, letterSpacing: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            DETAYLARI GÖR
            <Icon name="chevronRight" size={14} />
          </a>
        </Card>
      </div>

      {/* Bekleyen alacaklar + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginTop: 20 }}>
        <Card theme={theme} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 3, height: 14, background: theme.accent, borderRadius: 2 }}></span>
              Aylık Gelir / Gider
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: theme.textDim }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.success }}></span>Gelir</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.danger }}></span>Gider</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '0 4px' }}>
            {MOCK.MONTHLY.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 150, width: '100%', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: `${(m.income / monthMax) * 150}px`, background: `linear-gradient(180deg, ${theme.success}, ${theme.success}80)`, borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: 16, height: `${(m.expense / monthMax) * 150}px`, background: `linear-gradient(180deg, ${theme.danger}, ${theme.danger}80)`, borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>{m.month}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card theme={theme} style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ width: 3, height: 14, background: theme.accent, borderRadius: 2 }}></span>
            Bekleyen Alacaklar
          </div>
          {[
            { label: 'Aidat', val: bekleyen.aidat, color: theme.success },
            { label: 'Elektrik', val: bekleyen.elektrik, color: theme.warning },
            { label: 'Su', val: bekleyen.su, color: theme.info },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }}></span>
                <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{r.label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(r.val)}</div>
            </div>
          ))}
          <div style={{ height: 1, background: theme.borderStrong, margin: '6px 0' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
            <span style={{ fontSize: 13.5, color: theme.textDim, fontWeight: 600 }}>Toplam</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: theme.warning, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>{formatTRY(bekleyenToplam)}</span>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Hızlı İşlemler</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
          {quickActions.map((q, i) => (
            <button key={i} style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: '18px 12px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceAlt; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: q.color + '20', color: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={q.icon} size={18} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Overdue list */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alert" size={15} color={theme.danger} />
            Geciken Ödemeler
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>71 adet</div>
        </div>
        <Card theme={theme} padding={0}>
          {MOCK.OVERDUE.slice(0, 6).map((o, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px',
              borderTop: i > 0 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.dangerBg, color: theme.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="alert" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: theme.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.tenant}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>— {o.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.danger, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(o.amount)}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{o.date}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: '12px 18px', borderTop: `1px solid ${theme.border}` }}>
            <a style={{ fontSize: 12, color: theme.accent, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Tümünü gör <Icon name="chevronRight" size={12} />
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

window.DashboardPage = DashboardPage;
