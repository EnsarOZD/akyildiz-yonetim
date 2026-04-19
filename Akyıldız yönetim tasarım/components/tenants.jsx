// Kiracılar + Kiracı Kartı

const TenantsPage = ({ theme, onSelectTenant }) => {
  const { Card, PageHeader, Button, Badge, Input, Select, formatTRY } = UI;
  const tenants = MOCK.TENANTS;
  const activeCount = tenants.length;
  const doluluk = 69.2;
  const bakiye = tenants.reduce((s, t) => s + t.balance, 0);

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme}
        icon="building" title="İş Hanı Kiracıları"
        subtitle="İş hanındaki tüm kiracıları yönetin"
        actions={<>
          <Button theme={theme} variant="secondary" icon="search">Sorulamalar (0)</Button>
          <Button theme={theme} variant="primary" icon="plus">Yeni Kiracı</Button>
        </>} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
        <Card theme={theme}>
          <UI.StatPill theme={theme} icon="users" iconColor="#60A5FA" iconBg="#60A5FA20"
            label="Aktif Kiracı" value={activeCount} />
        </Card>
        <Card theme={theme}>
          <UI.StatPill theme={theme} icon="trending" iconColor={theme.success} iconBg={theme.successBg}
            label="Doluluk" value={`%${doluluk}`} />
        </Card>
        <Card theme={theme}>
          <UI.StatPill theme={theme} icon="wallet" iconColor={theme.warning} iconBg={theme.warningBg}
            label="Bakiye" value={formatTRY(bakiye)} />
        </Card>
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
        <Input theme={theme} icon="search" placeholder="Şirket, kişi, kimlik ara..." />
        <Select theme={theme} value="Tümü" />
        <Select theme={theme} value="Tüm Katlar" />
        <Select theme={theme} value="Tümü" />
      </div>

      {/* Tenant cards */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 12 }}>
        <Icon name="users" size={14} color={theme.accent} />
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textDim }}>Tümünde</span>
        <span style={{ fontSize: 12, color: theme.textMuted, marginLeft: 'auto' }}>{tenants.length} kiracı</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {tenants.map(t => (
          <Card key={t.id} theme={theme} padding={0} style={{ cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent + '60'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: t.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, flexShrink: 0,
                }}>{t.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Badge theme={theme} tone="info" size="sm">Aktif</Badge>
                    <span style={{ fontSize: 11, color: theme.textMuted }}>Ofis {t.unit}</span>
                  </div>
                </div>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
                  <Icon name="more" size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '10px 0', borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Bakiye</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: theme.danger, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>{formatTRY(t.balance)}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Button theme={theme} variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onSelectTenant(t)}>Detay</Button>
                <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.border}`, background: '#25D36620', color: '#25D366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="whatsapp" size={15} />
                </button>
                <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="phone" size={14} />
                </button>
                <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceAlt, color: theme.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="mail" size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 14 }}>1 - {tenants.length} / {tenants.length} kayıt</div>
    </div>
  );
};

const TenantDetailPage = ({ theme, tenant, onBack }) => {
  const { Card, PageHeader, Button, Badge, formatTRY } = UI;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: theme.textDim, fontSize: 13, fontWeight: 600, marginBottom: 14,
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, fontFamily: 'inherit',
      }}>← Kiracılar</button>

      <Card theme={theme} style={{ padding: 24, borderLeft: `4px solid ${tenant.color}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, background: tenant.color,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800,
          }}>{tenant.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3, textTransform: 'uppercase' }}>{tenant.name}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
              <Badge theme={theme} tone="info">Aktif</Badge>
              <span style={{ fontSize: 13, color: theme.textDim }}>Ofis {tenant.unit} · {tenant.category}</span>
              <span style={{ fontSize: 13, color: theme.textMuted }}>· {tenant.since}'den beri</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.7 }}>Bakiye</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: theme.danger, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.6, marginTop: 2 }}>{formatTRY(tenant.balance)}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>İletişim</div>
          {[
            { i: 'users', l: 'Yetkili', v: tenant.rep },
            { i: 'phone', l: 'Telefon', v: tenant.phone },
            { i: 'building', l: 'Kat', v: tenant.unit },
            { i: 'calendar', l: 'Kiracılık Başlangıcı', v: tenant.since },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
              <Icon name={r.i} size={14} color={theme.textMuted} />
              <span style={{ fontSize: 12, color: theme.textDim, flex: 1 }}>{r.l}</span>
              <span style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{r.v}</span>
            </div>
          ))}
        </Card>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Hızlı İşlemler</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button theme={theme} variant="primary" icon="cash">Tahsilat Al</Button>
            <Button theme={theme} variant="secondary" icon="plus">Borç Ekle</Button>
            <Button theme={theme} variant="secondary" icon="file">Dekont</Button>
            <Button theme={theme} variant="secondary" icon="mail">Mesaj Gönder</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

window.TenantsPage = TenantsPage;
window.TenantDetailPage = TenantDetailPage;
