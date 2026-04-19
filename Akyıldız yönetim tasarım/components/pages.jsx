// Pages: Payments, Expenses, Debts, Units, Requests, Reports, Profile, Login

const PaymentsPage = ({ theme }) => {
  const { Card, PageHeader, Button, Badge, Input, Select, formatTRY } = UI;
  const monthMax = Math.max(...MOCK.MONTHLY.map(m => m.income));
  const anlikTotals = { kalan: 4837191.29, odeme: 4108560.19 };

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="wallet2" title="Ödemeler" subtitle="113 ödeme kaydı"
        actions={<>
          <Button theme={theme} variant="ghost" icon="arrowUp">Arama</Button>
          <Button theme={theme} variant="ghost" icon="file">Raporlar</Button>
          <Button theme={theme} variant="ghost" icon="download">Logla</Button>
          <Button theme={theme} variant="primary" icon="plus">Yeni Ödeme</Button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
        {[
          { i: 'trending', c: theme.success, l: 'Bu Ay', v: formatTRY(180689.07) },
          { i: 'wallet', c: theme.accent, l: 'Toplam', v: formatTRY(6576227.94) },
          { i: 'alert', c: theme.warning, l: 'Bekleyen', v: '2' },
          { i: 'card', c: '#A78BFA', l: 'Gün Pik Max', v: formatTRY(121140.22) },
        ].map((s, i) => (
          <Card key={i} theme={theme}>
            <UI.StatPill theme={theme} icon={s.i} iconColor={s.c} iconBg={s.c + '20'} label={s.l} value={s.v} />
          </Card>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginTop: 16 }}>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Aylık Ödeme Girişi</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 160 }}>
            {MOCK.MONTHLY.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '70%', height: `${(m.income / monthMax) * 130}px`, background: `linear-gradient(180deg, ${theme.accent}, ${theme.accent}70)`, borderRadius: '6px 6px 0 0' }}></div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{m.month}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Tip Dağılımı</div>
          {[
            { l: 'Kiralar', v: anlikTotals.kalan, c: theme.success },
            { l: 'Ödeme / Diğer', v: anlikTotals.odeme, c: theme.danger },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.c }}></span>
                <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{r.l}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: r.c, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(r.v)}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Alacak Hesaplam cards */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 10 }}>
        <Icon name="chevronRight" size={14} color={theme.accent} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: theme.textDim }}>Anlık Hesaplam</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { t: 'SAPPHİRE ÖZEL SAĞLIK HİZMETLERİ TURİZM VE TİCARET A.Ş', v: 19.91 },
          { t: 'RESULT TURİZM GAYRİMENKUL DANIŞMANLIK VE LİMİTED ŞİR...', v: 68.27 },
          { t: 'İHC DANIŞMANLIK VE HİZMETLERİ SAĞLIK TURİZM VE TİCA...', v: 6191522.29 },
          { t: 'GALORE GIDA TİCARET LİMİTED ŞİRKETİ', v: 62.06 },
        ].map((c, i) => (
          <Card key={i} theme={theme} style={{ padding: 14 }}>
            <div style={{ fontSize: 10.5, color: theme.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1.3, height: 26, overflow: 'hidden' }}>{c.t}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: theme.accent, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(c.v)}</div>
              <Badge theme={theme} tone="success" size="sm">ÖDENDİ</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 16 }}>
        <Input theme={theme} icon="search" placeholder="Firma, kalıp, tip veya bahiş ara..." />
        <Select theme={theme} value="Tüm Tipler" />
        <Select theme={theme} value="— —" />
      </div>

      {/* Payment list */}
      <Card theme={theme} padding={0} style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${theme.border}` }}>
          <input type="checkbox" style={{ accentColor: theme.accent }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>Tümünü Seç</span>
        </div>
        {MOCK.PAYMENTS_RECENT.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
            <input type="checkbox" style={{ accentColor: theme.accent }} />
            <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.warning + '25', color: theme.warning, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
              {p.tenant[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, textTransform: 'uppercase', letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.tenant}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{p.date} · {p.doc}</div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.success, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(p.amount)}</div>
            <Icon name="chevronDown" size={14} color={theme.textMuted} />
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: theme.textMuted }}>
        <div>1 - 10 / 114 kayıt</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (
            <button key={i} style={{
              minWidth: 28, height: 28, border: `1px solid ${theme.border}`, borderRadius: 6,
              background: p === '1' ? theme.accent : theme.surface, color: p === '1' ? theme.accentText : theme.textDim,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpensesPage = ({ theme }) => {
  const { Card, PageHeader, Button, Badge, Input, Select, formatTRY } = UI;
  const monthMax = Math.max(...MOCK.EXPENSES.map(e => e.amount));
  const categoryMax = Math.max(...MOCK.EXPENSE_CATEGORIES.map(c => c.amount));

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="receipt" title="Giderler"
        subtitle="İşletme giderlerini takip edin ve yeni harcamaları buradan yönetin"
        actions={<><Select theme={theme} value="Tüm Zamanlar" /><Button theme={theme} variant="primary" icon="plus">Yeni Gider</Button></>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
        <Card theme={theme}><UI.StatPill theme={theme} icon="arrowDown" iconColor={theme.danger} iconBg={theme.dangerBg} label="Bu Ay" value={formatTRY(0)} /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="trending" iconColor={theme.info} iconBg={theme.infoBg} label="Toplam" value={formatTRY(4460589.57)} /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="folder" iconColor={theme.warning} iconBg={theme.warningBg} label="Bu Ay (12 Ay)" value="0" /></Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginTop: 16 }}>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Aylık Gider Grafiği</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160 }}>
            {MOCK.MONTHLY.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '70%', height: `${(m.expense / 1200000) * 130 + 10}px`, background: theme.danger, borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{m.month}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card theme={theme}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Tip Dağılımı</div>
          {MOCK.EXPENSE_CATEGORIES.map((c, i) => (
            <div key={i} style={{ padding: '7px 0', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: theme.danger }}></span>
                  <span style={{ fontSize: 12, color: theme.text, fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 10.5, color: theme.textMuted }}>{c.count} gider</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.danger, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(c.amount)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 16 }}>
        <Input theme={theme} icon="search" placeholder="Ara..." />
        <Select theme={theme} value="Tip Seç" />
        <Select theme={theme} value="— —" />
      </div>

      <Card theme={theme} padding={0} style={{ marginTop: 14 }}>
        {MOCK.EXPENSES.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.dangerBg, color: theme.danger, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="arrowDown" size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{e.title}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{e.date}</span>
                <Badge theme={theme} tone="info" size="sm">{e.type}</Badge>
              </div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.danger, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(e.amount)}</div>
            <Icon name="more" size={14} color={theme.textMuted} />
          </div>
        ))}
      </Card>
    </div>
  );
};

const DebtsPage = ({ theme }) => {
  const { Card, PageHeader, Button, Input, Select, formatTRY } = UI;
  const [filter, setFilter] = React.useState('Tüm Borçlar');
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="receipt" title="Borçlar"
        subtitle="Aidat ve fatura borçlarını takip edin"
        actions={<>
          <Button theme={theme} variant="secondary" icon="plus">Aidat</Button>
          <Button theme={theme} variant="secondary" icon="bolt">Elektrik</Button>
          <Button theme={theme} variant="secondary" icon="drop">Su</Button>
          <Button theme={theme} variant="primary" icon="download">Excel'den Yükle</Button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
        <Card theme={theme}><UI.StatPill theme={theme} icon="receipt" iconColor={theme.accent} iconBg={theme.accentBg} label="Toplam" value="391" /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="building" iconColor={theme.info} iconBg={theme.infoBg} label="Aidat" value="176" /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="bolt" iconColor={theme.warning} iconBg={theme.warningBg} label="Elektrik" value="147" /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="drop" iconColor="#67E8F9" iconBg="#67E8F920" label="Su" value="68" /></Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 16 }}>
        <Input theme={theme} icon="search" placeholder="Ara..." />
        <Select theme={theme} value="Tüm Borçlar" />
        <Select theme={theme} value="— —" />
      </div>

      <Card theme={theme} padding={0} style={{ marginTop: 14 }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.textDim }}>Borç Listesi</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted }}>391 kayıt</div>
        </div>
        <div style={{ padding: '10px 18px', borderBottom: `1px solid ${theme.border}`, background: theme.surfaceAlt + '60' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.warning }}></span>
            ÖDEME BOŞ
          </div>
        </div>
        {MOCK.DEBTS.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i > 0 ? `1px solid ${theme.border}` : 'none' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${theme.border}` }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.tenant}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{d.unit} · Son: {d.due}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(d.amount)}</div>
              <div style={{ fontSize: 10.5, color: theme.warning, fontWeight: 600, marginTop: 2 }}>Bekliyor</div>
            </div>
            <Icon name="more" size={14} color={theme.textMuted} />
          </div>
        ))}
      </Card>
    </div>
  );
};

const UnitsPage = ({ theme }) => {
  const { Card, PageHeader, Button, Badge, Input, Select } = UI;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="building" title="Ünite Yönetimi"
        subtitle="İş hanındaki tüm üniteleri yönetin"
        actions={<Button theme={theme} variant="primary" icon="plus">Yeni Ünite</Button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 20 }}>
        <Input theme={theme} icon="search" placeholder="Kod veya kat..." />
        <Select theme={theme} value="Tümü" />
        <Select theme={theme} value="Tümü" />
        <Select theme={theme} value="Tümü" />
        <Select theme={theme} value="Örn: 3" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 12 }}>
        <Icon name="check" size={13} color={theme.accent} />
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textDim }}>Tümünde</span>
        <span style={{ fontSize: 12, color: theme.textMuted, marginLeft: 'auto' }}>13 Ünite</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {MOCK.UNITS.map(u => (
          <Card key={u.id} theme={theme} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: u.color,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800,
              }}>{u.label}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{u.id}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Badge theme={theme} tone="info" size="sm">{u.type}</Badge>
                  <Badge theme={theme} tone={u.filled === 'Dolu' ? 'warning' : 'success'} size="sm">{u.status}</Badge>
                  <Badge theme={theme} tone={u.filled === 'Dolu' ? 'warning' : 'success'} size="sm">{u.filled}</Badge>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
                <Icon name="more" size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: 11.5, color: theme.textMuted, fontWeight: 600 }}>{u.floor}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{u.area} m²</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, fontSize: 12, color: theme.textMuted }}>
        <span>1 - 10 / 13 kayıt</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '1', '2', '›'].map((p, i) => (
            <button key={i} style={{
              minWidth: 28, height: 28, border: `1px solid ${theme.border}`, borderRadius: 6,
              background: p === '1' ? theme.accent : theme.surface, color: p === '1' ? theme.accentText : theme.textDim,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RequestsPage = ({ theme }) => {
  const { Card, PageHeader, Button } = UI;
  const [tab, setTab] = React.useState('all');
  const [showEmpty, setShowEmpty] = React.useState(true);

  const requests = [
    { id: 201, tenant: 'Nova Yazılım', subject: 'A blok 4. kat klima arızası', desc: 'Ofiste klima soğutmuyor. Acil bakım gerekiyor.', status: 'open', date: '17 Nis 2026', priority: 'Yüksek' },
    { id: 202, tenant: 'Özkan Mühendislik', subject: 'Otopark kart okuyucu çalışmıyor', desc: 'Sabah giriş yaparken bariyer açılmadı.', status: 'open', date: '17 Nis 2026', priority: 'Orta' },
    { id: 203, tenant: 'Martı Turizm', subject: 'Aidat ödemesi hakkında bilgi', desc: 'Geçen ay yaptığım ödeme henüz sisteme yansımadı.', status: 'in-progress', date: '16 Nis 2026', priority: 'Düşük' },
    { id: 205, tenant: 'Demir Sigorta', subject: 'Tuvalet lavabo tıkanıklığı', desc: 'Kat lavabosu tıkalıydı, halledildi. Teşekkürler.', status: 'resolved', date: '15 Nis 2026', priority: 'Yüksek' },
  ];

  const tabs = [
    { id: 'all', label: 'Tümü' }, { id: 'open', label: 'Açık' },
    { id: 'in-progress', label: 'İşlemde' }, { id: 'resolved', label: 'Çözüldü' }, { id: 'closed', label: 'Kapalı' },
  ];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="settings" title="Talep Yönetimi"
        subtitle="Bakım, hizmet ve teknik talepleri buradan takip edin ve yönetin"
        actions={<Button theme={theme} variant="primary" icon="plus">Yeni Talep Oluştur</Button>} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: theme.surface, padding: 4, borderRadius: 10, border: `1px solid ${theme.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px', borderRadius: 6,
              background: tab === t.id ? theme.accent : 'transparent',
              color: tab === t.id ? theme.accentText : theme.textDim,
              border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: theme.textMuted }}>
          <button onClick={() => setShowEmpty(!showEmpty)} style={{ background: 'transparent', border: 'none', color: theme.accent, cursor: 'pointer', fontSize: 11.5, textDecoration: 'underline', fontFamily: 'inherit' }}>
            {showEmpty ? 'Örnek talepleri göster' : 'Boş görünüm'}
          </button>
          <span style={{ marginLeft: 12 }}>{showEmpty ? '0' : requests.length} talep gösteriliyor</span>
        </div>
      </div>

      {showEmpty ? (
        <div style={{
          border: `2px dashed ${theme.borderStrong}`, borderRadius: 14, marginTop: 14,
          padding: '70px 20px', textAlign: 'center',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: theme.surface, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="inbox" size={24} color={theme.textMuted} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginTop: 16 }}>Henüz talep yok</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, maxWidth: 320, margin: '6px auto 0' }}>Herhangi bir arıza, temizlik veya güvenlik talebiniz olduğunda buradan kolayca iletebilirsiniz.</div>
          <a style={{ color: theme.accent, fontSize: 13, fontWeight: 600, marginTop: 16, display: 'inline-block', cursor: 'pointer' }}>Yeni Talep Oluştur</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
          {requests.map(r => {
            const stat = r.status === 'open' ? { l: 'AÇIK', c: theme.danger, bg: theme.dangerBg } :
                         r.status === 'in-progress' ? { l: 'İŞLEMDE', c: theme.warning, bg: theme.warningBg } :
                         { l: 'ÇÖZÜLDÜ', c: theme.success, bg: theme.successBg };
            return (
              <Card key={r.id} theme={theme}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: theme.fontMono }}>#{r.id}</span>
                  <Badge theme={theme} tone={r.status === 'open' ? 'danger' : r.status === 'in-progress' ? 'warning' : 'success'}>{stat.l}</Badge>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginTop: 10, lineHeight: 1.3 }}>{r.subject}</div>
                <div style={{ fontSize: 12, color: theme.textDim, marginTop: 6, lineHeight: 1.5 }}>{r.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>
                  <span style={{ fontSize: 11, color: theme.textMuted }}>{r.tenant}</span>
                  <span style={{ fontSize: 11, color: theme.textMuted }}>{r.date}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ReportsPage = ({ theme }) => {
  const { Card, PageHeader, Button, Input, Select, formatTRY } = UI;
  const rows = MOCK.DEBTS.slice(0, 10);
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="file" title="Mali Raporlar"
        subtitle="Gelir, gider ve bakiye durumunu analiz edin"
        actions={<>
          <Button theme={theme} variant="success" icon="excel">Excel Aktar</Button>
          <Button theme={theme} variant="danger" icon="pdf">PDF</Button>
          <Button theme={theme} variant="primary" icon="search">Sorgula</Button>
        </>} />

      <Card theme={theme} style={{ marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {['Başlangıç', 'Bitiş', 'Kiracı', 'Mal Sahibi', 'İşlem Tipi', 'Kategori', 'Borçlu Türü'].map((l, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>{l}</div>
              {i <= 1 ? <Input theme={theme} placeholder="gg.aa.yyyy" /> : <Select theme={theme} value="Tümü" />}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <a style={{ fontSize: 11.5, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>Filtreleri Temizle</a>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 16 }}>
        <Card theme={theme}><UI.StatPill theme={theme} icon="arrowDown" iconColor={theme.danger} iconBg={theme.dangerBg} label="Toplam Tahakkuk" value={formatTRY(8518877.88)} /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="check" iconColor={theme.success} iconBg={theme.successBg} label="Toplam Tahsilat" value={formatTRY(6509564.93)} /></Card>
        <Card theme={theme}><UI.StatPill theme={theme} icon="alert" iconColor={theme.warning} iconBg={theme.warningBg} label="Net Bakiye" value={formatTRY(2009312.95)} /></Card>
      </div>

      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>İşlem Listesi <span style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500, marginLeft: 6 }}>501 kayıt</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, color: theme.textMuted }}>Sayfa başına</span>
          <Select theme={theme} value="10" style={{ padding: '5px 10px' }} />
        </div>
      </div>

      <Card theme={theme} padding={0} style={{ marginTop: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 70px 1.8fr 80px 120px 80px 110px 110px 100px 100px', padding: '10px 14px', fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: `1px solid ${theme.border}`, background: theme.surfaceAlt + '60' }}>
          <div>Tarih</div><div>Dönem</div><div>Kiracı / Ünite</div><div>İşlem</div><div>Açıklama</div><div>Fatura No</div><div>Borç (—)</div><div>Alacak (+)</div><div>Durum</div><div>Vade Tarihi</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 70px 1.8fr 80px 120px 80px 110px 110px 100px 100px', padding: '12px 14px', fontSize: 11.5, borderTop: i > 0 ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
            <div style={{ color: theme.text }}>{r.due}</div>
            <div style={{ color: theme.textDim }}>{r.unit}</div>
            <div>
              <div style={{ fontSize: 12, color: theme.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.tenant}</div>
              <div style={{ fontSize: 10, color: theme.textMuted }}>Daire</div>
            </div>
            <div><Badge theme={theme} tone="danger" size="sm">Borç</Badge></div>
            <div style={{ color: theme.textDim, fontSize: 11 }}>04/2026 AİDAT</div>
            <div style={{ color: theme.textMuted }}>—</div>
            <div style={{ color: theme.danger, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatTRY(r.amount)}</div>
            <div style={{ color: theme.textMuted }}>—</div>
            <div style={{ color: theme.warning, fontWeight: 600 }}>Bekliyor</div>
            <div style={{ color: theme.textDim }}>{r.due}</div>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: theme.textMuted }}>
        <span>501 kayıttan 1–10 arası</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (
            <button key={i} style={{
              minWidth: 28, height: 28, border: `1px solid ${theme.border}`, borderRadius: 6,
              background: p === '1' ? theme.accent : theme.surface, color: p === '1' ? theme.accentText : theme.textDim,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ theme }) => {
  const { Card, PageHeader, Button, Badge, Input } = UI;
  const [tab, setTab] = React.useState('mal');

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1440, margin: '0 auto' }}>
      <PageHeader theme={theme} icon="settings" title="Yönetim Paneli"
        subtitle="Mal sahipleri ve sistem kullanıcılarını buradan yönetin"
        actions={<Button theme={theme} variant="primary" icon="megaphone">Duyuru Yayınla</Button>} />

      <Card theme={theme} style={{ marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { i: 'users', c: theme.info, l: 'Kiracılar', v: '6' },
            { i: 'building', c: theme.success, l: 'Mal Sahipleri', v: '—' },
            { i: 'shield', c: '#A78BFA', l: 'Kullanıcılar', v: '—' },
            { i: 'megaphone', c: theme.warning, l: 'Duyurular', v: '—' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.c + '20', color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.i} size={16} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{s.l}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, letterSpacing: -0.3, marginTop: 2 }}>{s.v}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: `1px solid ${theme.border}` }}>
        {[{ id: 'mal', l: 'Mal Sahipleri', i: 'building' }, { id: 'user', l: 'Kullanıcı Yönetimi', i: 'users' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px',
            borderBottom: tab === t.id ? `2px solid ${theme.accent}` : '2px solid transparent',
            background: 'transparent', color: tab === t.id ? theme.accent : theme.textDim,
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', marginBottom: -1,
          }}>
            <Icon name={t.i} size={14} />
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'mal' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
            <Card theme={theme}><UI.StatPill theme={theme} icon="users" iconColor={theme.info} iconBg={theme.infoBg} label="Mal Sahibi" value="1" /></Card>
            <Card theme={theme}><UI.StatPill theme={theme} icon="building" iconColor={theme.success} iconBg={theme.successBg} label="Sahip Ünite" value="13" /></Card>
            <Card theme={theme}><UI.StatPill theme={theme} icon="home" iconColor={theme.warning} iconBg={theme.warningBg} label="Boş Ünite" value="4" /></Card>
          </div>

          <Input theme={theme} icon="search" placeholder="Mal sahibi adı veya kat ara..." style={{ marginTop: 14 }} />

          <Card theme={theme} padding={0} style={{ marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 80px', padding: '12px 18px', fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, borderBottom: `1px solid ${theme.border}`, background: theme.surfaceAlt + '40' }}>
              <div>Mal Sahibi</div><div>Üniteler</div><div>İşlemler</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 80px', padding: '16px 18px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.accent, color: theme.accentText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800 }}>A</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Akyıldızlar</div>
                  <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>admin@akyildizlayzhk.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {MOCK.UNIT_CHIPS.map((c, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '4px 9px', borderRadius: 6,
                    background: c === 'BİNA OTOPARK' ? theme.successBg : theme.accentBg,
                    color: c === 'BİNA OTOPARK' ? theme.success : theme.accent,
                  }}>{c}</span>
                ))}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
                  <Icon name="more" size={16} />
                </button>
              </div>
            </div>
          </Card>
        </>
      )}

      {tab === 'user' && (
        <Card theme={theme} style={{ marginTop: 20, padding: 40, textAlign: 'center' }}>
          <Icon name="users" size={32} color={theme.textMuted} />
          <div style={{ fontSize: 14, color: theme.textDim, marginTop: 12 }}>Kullanıcı listesi burada görüntülenir</div>
        </Card>
      )}
    </div>
  );
};

const LoginPage = ({ theme, onLogin }) => {
  const { Button, Input } = UI;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: theme.bg, fontFamily: theme.fontSans }}>
      {/* Left */}
      <div style={{
        flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column',
        background: `radial-gradient(circle at 20% 30%, ${theme.accent}25, transparent 40%), linear-gradient(135deg, ${theme.surface}, ${theme.surfaceAlt})`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: theme.accent, color: theme.accentText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>A</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, letterSpacing: 1.5 }}>AKYILDIZ YÖNETİM</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: theme.text, letterSpacing: -1.5, lineHeight: 1.05 }}>
            Profesyonel<br />
            <span style={{ color: theme.accent }}>Yönetim</span><br />
            Sistemi
          </div>
          <div style={{ fontSize: 14, color: theme.textDim, marginTop: 20, lineHeight: 1.6 }}>
            Apartman ve site yönetimini tek bir platformda kolaylaştırın. Kiracılar, ödemeler, giderler — hepsi bir arada.
          </div>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Kiracı ve mal sahibi yönetimi',
              'Otomatik borç takibi ve bildirimler',
              'Ödeme geçmişi ve finansal raporlar',
              'Mobil uyumlu, her cihazdan erişim',
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: theme.textDim }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.accent, color: theme.accentText, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={12} strokeWidth={3} />
                </div>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: theme.textMuted }}>© 2026 Akyıldız Yönetim</div>
      </div>
      {/* Right form */}
      <div style={{ width: 480, background: theme.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, letterSpacing: -0.6 }}>Giriş Yap</div>
        <div style={{ fontSize: 13, color: theme.textDim, marginTop: 6 }}>Hesabınıza erişmek için bilgilerinizi girin</div>
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 6 }}>E-posta</div>
          <Input theme={theme} icon="mail" placeholder="ornek@sirket.com" />
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 6, marginTop: 16 }}>Şifre</div>
          <Input theme={theme} icon="shield" placeholder="••••••••" type="password" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.textDim, cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: theme.accent }} />
              Beni hatırla
            </label>
            <a style={{ color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>Şifremi unuttum</a>
          </div>
          <Button theme={theme} variant="primary" icon="logout" onClick={onLogin}
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '12px' }}>
            Giriş Yap
          </Button>
        </div>
        <div style={{ fontSize: 11.5, color: theme.textMuted, textAlign: 'center', marginTop: 24 }}>© 2026 Akyıldız Yönetim. Tüm hakları saklıdır.</div>
      </div>
    </div>
  );
};

window.PaymentsPage = PaymentsPage;
window.ExpensesPage = ExpensesPage;
window.DebtsPage = DebtsPage;
window.UnitsPage = UnitsPage;
window.RequestsPage = RequestsPage;
window.ReportsPage = ReportsPage;
window.ProfilePage = ProfilePage;
window.LoginPage = LoginPage;
