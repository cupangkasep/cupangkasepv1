// --- FUNGSI ADMIN: PILIH MEMBER VERIFIED, KELOLA KUOTA & MODERASI ---
  function filterDropdownMemberTesti() {
    const selectEl = document.getElementById("admTestiMemberSelect");
    const searchEl = document.getElementById("admTestiMemberSearch");
    if (!selectEl) return;

    const q = (searchEl ? searchEl.value : "").trim().toLowerCase();
    const filtered = adminVerifiedMembersList.filter(m =>
      !q || m.nama.toLowerCase().includes(q) || m.wa.includes(q)
    );

    if (filtered.length === 0) {
      selectEl.innerHTML = `<option value="">-- Member tidak ditemukan --</option>`;
      return;
    }

    selectEl.innerHTML = `<option value="">-- Pilih Member Terverifikasi (${filtered.length}) --</option>` +
      filtered.map(m => {
        return `<option value="${escapeHtml(m.wa)}" data-nama="${escapeHtml(m.nama || '')}">${escapeHtml(m.nama)} (${escapeHtml(m.wa)})</option>`;
      }).join("");
  }

  async function muatDataTestimoniAdmin() {
    const qBox = document.getElementById("admTestiQuotaList");
    const mBox = document.getElementById("admTestiModerationList");
    if (mBox) mBox.innerHTML = `<div style="font-size:11.5px; color:var(--text-muted);">⏳ Memuat data testimoni...</div>`;

    const res = await kirimKeGoogleSheets({ action: "admin_get_testimonials" });
    if (!res || res.status !== "ok") {
      if (mBox) mBox.innerHTML = `<div style="font-size:11.5px; color:#fca5a5;">Gagal memuat data testimoni.</div>`;
      return;
    }

    adminVerifiedMembersList = res.verifiedMembers || [];
    filterDropdownMemberTesti();

    if (qBox) {
      const quotas = res.quotas || [];
      qBox.innerHTML = quotas.length === 0
        ? `<div style="font-size:11px; color:var(--text-muted);">Belum ada data kuota pembeli.</div>`
        : quotas.map(q => `
            <div class="admin-row-item">
              <div><strong>${escapeHtml(q.nama)}</strong> (${escapeHtml(q.wa)})<br><span style="color:var(--text-muted); font-size:10.5px;">Terkirim: ${Number(q.terkirim) || 0}x • Update: ${escapeHtml(q.updated)}</span></div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="chance-pill" style="font-size:10.5px;">Sisa: ${Number(q.sisa) || 0}</span>
                <button type="button" class="admin-mini-btn green" data-action="admin-add-testi-quota" data-wa="${escapeHtml(q.wa || '')}" data-nama="${escapeHtml(q.nama || 'Kolektor')}" title="Tambah +1 kuota">+1</button>
              </div>
            </div>
          `).join("");
    }

    if (mBox) {
      const items = res.testimonials || [];
      mBox.innerHTML = items.length === 0
        ? `<div style="font-size:11px; color:var(--text-muted);">Belum ada testimoni masuk.</div>`
        : items.map(t => {
            const isTampil = t.status === "TAMPIL";
            const nextStatus = isTampil ? "HIDDEN" : "TAMPIL";
            const cleanFoto = sanitizeUrl(t.foto, "");
            const idAttr = escapeHtml(t.id);
            const stars = "★".repeat(Math.min(5, Math.max(1, Number(t.rating) || 5)));
            return `
              <div class="admin-row-item" style="align-items:flex-start;">
                <div style="display:flex; gap:10px; flex:1; min-width:200px;">
                  ${cleanFoto ? `<img src="${escapeHtml(cleanFoto)}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; cursor:pointer;" referrerpolicy="no-referrer" data-action="zoom-img" data-url="${escapeHtml(cleanFoto)}">` : ""}
                  <div>
                    <strong>${escapeHtml(t.nama)}${t.kota ? ', ' + escapeHtml(t.kota) : ''}</strong> <span style="color:var(--gold-primary);">${stars}</span><br>
                    <span style="font-size:11px; color:#e2e8f0;">"${escapeHtml(t.isi)}"</span><br>
                    <span style="font-size:10px; color:var(--text-muted);">${idAttr} • ${escapeHtml(t.tanggal)} • Status: <b style="color:${isTampil ? '#6ee7b7' : '#fca5a5'}">${escapeHtml(t.status)}</b></span>
                  </div>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  <button type="button" class="admin-mini-btn ${isTampil ? '' : 'green'}" data-action="admin-toggle-testi" data-id="${idAttr}" data-status="${nextStatus}">
                    ${isTampil ? '👁️ Hide' : '✔ Tampilkan'}
                  </button>
                  <button type="button" class="admin-mini-btn red" data-action="admin-delete-testi" data-id="${idAttr}">🗑️ Hapus</button>
                </div>
              </div>
            `;
          }).join("");
    }
  }

  async function adminTambahKuotaTesti() {
    const selectEl = document.getElementById("admTestiMemberSelect");
    const wa = selectEl ? selectEl.value.trim() : "";
    const selectedOpt = selectEl && selectEl.options[selectEl.selectedIndex];
    const nama = (selectedOpt && selectedOpt.getAttribute("data-nama")) || "Kolektor";
    const addQuota = Number(document.getElementById("admTestiAddQuota").value) || 1;

    if (!wa) {
      tampilkanToast("⚠️ Pilih member terverifikasi terlebih dahulu");
      return;
    }

    const res = await kirimKeGoogleSheets({ action: "admin_set_testi_quota", wa: wa, nama: nama, addQuota: addQuota });
    if (res && res.status === "ok") {
      tampilkanToast(`✦ Kuota ${nama} kini ${res.sisa}x testimoni`);
      selectEl.value = "";
      const searchEl = document.getElementById("admTestiMemberSearch");
      if (searchEl) searchEl.value = "";
      muatDataTestimoniAdmin();
    } else {
      tampilkanDialogModal((res && res.message) || "Gagal menambah kuota.", {
        title: "Gagal Menambah Kuota",
        icon: "✕"
      });
    }
  }

  async function adminTambahKuotaCepat(wa, nama) {
    const res = await kirimKeGoogleSheets({ action: "admin_set_testi_quota", wa: wa, nama: nama, addQuota: 1 });
    if (res && res.status === "ok") {
      tampilkanToast(`✦ +1 kuota untuk ${nama} (Sisa: ${res.sisa})`);
      muatDataTestimoniAdmin();
    }
  }

  async function adminToggleStatusTesti(id, newStatus) {
    const res = await kirimKeGoogleSheets({ action: "admin_toggle_testi_status", id: id, newStatus: newStatus });
    if (res && res.status === "ok") {
      tampilkanToast(newStatus === "HIDDEN" ? "👁️ Testimoni disembunyikan" : "✔ Testimoni ditampilkan kembali");
      muatDataTestimoniAdmin();
      muatTestimoniPublik();
    }
  }

  async function adminHapusTesti(id) {
    const setuju = await tampilkanKonfirmasiModal(
      `Yakin ingin menghapus permanen testimoni ${id} beserta fotonya?`,
      { title: "Hapus Testimoni", icon: "✕", okText: "Hapus Permanen", cancelText: "Batal" }
    );
    if (!setuju) return;

    const res = await kirimKeGoogleSheets({ action: "admin_delete_testi", id: id });
    if (res && res.status === "ok") {
      tampilkanToast("🗑️ Testimoni berhasil dihapus");
      muatDataTestimoniAdmin();
      muatTestimoniPublik();
    }
  }

// Kunci Jarak Sidebar Admin PC agar persis mengikuti batas atas & bawah kotak utama (.admin-workspace)
  function sinkronPosisiSidebarAdmin() {
    const sidebar = document.querySelector(".admin-sidebar");
    const workspace = document.querySelector(".admin-workspace");
    const adminSec = document.getElementById("sectionAdmin");
    if (!sidebar || !workspace || !adminSec || adminSec.style.display === "none") return;

    if (window.innerWidth > 900) {
      const wsRect = workspace.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const defaultTop = 114;

      const batasBawah = wsRect.bottom - sidebarHeight;
      let targetTop = Math.min(defaultTop, batasBawah);
      targetTop = Math.max(wsRect.top, targetTop);

      sidebar.style.top = targetTop + "px";
    } else {
      sidebar.style.top = "";
    }
  }

  window.addEventListener("scroll", sinkronPosisiSidebarAdmin, { passive: true });
  window.addEventListener("resize", sinkronPosisiSidebarAdmin, { passive: true });
  document.addEventListener("click", function(e) {
    if (e.target.closest(".admin-hub-tab-btn")) {
      setTimeout(sinkronPosisiSidebarAdmin, 50);
    }
  });

/* =========================================================
     LOGIKA COMMAND CENTER ADMIN (HALAMAN PENUH 5 MODUL)
     ========================================================= */
  const STORAGE_KEY_ADMIN_BNR = "ck_admin_blocked_wa_v1";
  const STORAGE_KEY_ADMIN_CLAIMS = "ck_admin_winner_claims_v1";

  async function sinkronDataSertifikatDanVoucherAdmin() {
    if (!apakahUserAdmin()) return;
    const [resCerts, resVouchers] = await Promise.all([
      kirimKeGoogleSheets({ action: "admin_get_certs" }),
      kirimKeGoogleSheets({ action: "admin_get_vouchers" })
    ]);
    if (resCerts && resCerts.status === "ok" && resCerts.certs) {
      adminCertsCache = resCerts.certs;
      renderDaftarSertifikatAdminHub();
    }
    if (resVouchers && resVouchers.status === "ok" && Array.isArray(resVouchers.vouchers)) {
      adminVouchersCache = resVouchers.vouchers;
      renderDaftarVoucherAdminHub();
    }
  }

  function gantiTabAdminHub(namaTab, btnEl) {
    document.querySelectorAll(".admin-hub-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-hub-pane").forEach(p => p.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    const pane = document.getElementById("adminPane_" + namaTab);
    if (pane) pane.classList.add("active");
    segarkanSemuaTampilanAdminHub();
  }

  async function muatUlangDataAdminHub() {
    tampilkanToast("⏳ Menyinkronkan data terbaru...");
    await segarkanDataKatalogSenyap();
    segarkanSemuaTampilanAdminHub();
    tampilkanToast("✦ Data Admin diperbarui");
  }

  function perbaruiStatistikCepatAdmin() {
    const elTotalLelang = document.getElementById("admQuickTotalLelang");
    const elPenawarAktif = document.getElementById("admQuickPenawarAktif");
    const elBlacklist = document.getElementById("admQuickBlacklist");

    const listLelang = masterCatalogItems.filter(i => String(i.kategori || "").toLowerCase() === "lelang");
    let totalPenawar = 0;
    listLelang.forEach(item => {
      try {
        const arr = JSON.parse(item.bidHistoryRaw || "[]");
        totalPenawar += Array.isArray(arr) ? arr.length : 0;
      } catch (e) {}
    });

    const totalBlacklist = typeof getBlockedBNRList === "function" ? getBlockedBNRList().length : 0;

    if (elTotalLelang) elTotalLelang.innerText = listLelang.length;
    if (elPenawarAktif) elPenawarAktif.innerText = totalPenawar;
    if (elBlacklist) elBlacklist.innerText = totalBlacklist;
  }

  function segarkanSemuaTampilanAdminHub() {
    perbaruiStatistikCepatAdmin();
    renderDropdownPilihLelangAdmin();
    renderDaftarBlokirBNRAdmin();
    renderDaftarKatalogAdminHub();
    renderDaftarVoucherAdminHub();
    renderDaftarSertifikatAdminHub();
    renderAnalitikDanPemenangAdminHub();
    sinkronDataSertifikatDanVoucherAdmin();
  }

  // --- MODUL 1: KENDALI LELANG VIP & BNR ---
  function renderDropdownPilihLelangAdmin() {
    const sel = document.getElementById("adminAuctionSelect");
    if (!sel) return;
    const nilaiLama = sel.value;
    const listLelang = masterCatalogItems.filter(i => i.kategori.toLowerCase() === "lelang");

    if (listLelang.length === 0) {
      sel.innerHTML = `<option value="">Belum ada koleksi lelang</option>`;
      document.getElementById("adminAuctionControlBox").innerHTML = `<div class="profile-empty-note">Tidak ada item lelang aktif.</div>`;
      return;
    }

    sel.innerHTML = listLelang.map(it =>
      `<option value="${escapeHtml(it.kode)}">[${escapeHtml(it.kode)}] ${escapeHtml(it.nama)} — Bid: ${escapeHtml(formatRupiah(it.currentBid || it.ob))}</option>`
    ).join("");

    if (listLelang.some(i => i.kode === nilaiLama)) sel.value = nilaiLama;
    renderDetailLelangAdminHub();
  }

  function renderDetailLelangAdminHub() {
    const sel = document.getElementById("adminAuctionSelect");
    const box = document.getElementById("adminAuctionControlBox");
    if (!sel || !box) return;

    const item = masterCatalogItems.find(i => i.kode === sel.value);
    if (!item) {
      box.innerHTML = "";
      return;
    }

    const kodeAttr = escapeHtml(item.kode);
    let riwayat = [];
    try { riwayat = JSON.parse(item.bidHistoryRaw || "[]"); } catch (e) {}

    const daftarBidHtml = riwayat.length === 0
      ? `<div class="profile-empty-note">Belum ada penawar pada ikan ini.</div>`
      : riwayat.slice().reverse().map((r, idx) => {
          const realIdx = riwayat.length - 1 - idx;
          const waUtuh = normalisasiNomorWA(r.wa || "");
          return `
            <div class="admin-row-item">
              <div>
                <strong>${idx === 0 ? '👑 ' : ''}${escapeHtml(r.nama)}</strong>
                <span style="color:var(--gold-light); font-weight:800; margin-left:6px;">${escapeHtml(formatRupiah(r.nominal))}</span><br>
                <small style="color:var(--text-muted);">WA: <b style="color:#fff;">${escapeHtml(waUtuh || r.waMasked || '-')}</b> • ${escapeHtml(r.waktu || '')}</small>
              </div>
              <div style="display:flex; gap:5px;">
                ${waUtuh ? `<a href="https://wa.me/${encodeURIComponent(waUtuh)}" target="_blank" rel="noopener noreferrer" class="admin-mini-btn green">💬 Chat WA</a>` : ''}
                <button type="button" class="admin-mini-btn red" data-action="admin-rollback" data-kode="${kodeAttr}" data-index="${realIdx}">🗑️ Batalkan Bid</button>
              </div>
            </div>
          `;
        }).join("");

    const sudahTutup = apakahItemKatalogHabis(item) || apakahWaktuLelangHabis(item.endTime);

    box.innerHTML = `
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button type="button" class="admin-mini-btn ${sudahTutup ? 'green' : 'red'}" data-action="admin-toggle-auction" data-kode="${kodeAttr}">
          ${sudahTutup ? '🔓 Buka Kembali Lelang' : '🔒 Hentikan / Tutup Lelang Sekarang'}
        </button>
        <button type="button" class="admin-mini-btn" data-action="admin-view-auction" data-kode="${kodeAttr}">
          👁️ Lihat Halaman Lelang
        </button>
      </div>
      <div class="admin-form-grid" style="margin-top:4px;">
        <input type="text" id="admEditStart_${kodeAttr}" class="catalog-input" value="${escapeHtml(item.startTime || '')}" placeholder="Waktu Mulai (YYYY-MM-DD HH:mm)">
        <input type="text" id="admEditEnd_${kodeAttr}" class="catalog-input" value="${escapeHtml(item.endTime || '')}" placeholder="Waktu Tutup (YYYY-MM-DD HH:mm)">
      </div>
      <button type="button" class="admin-mini-btn" style="justify-content:center; padding:8px;" data-action="admin-save-schedule" data-kode="${kodeAttr}">
        ⏱️ Perbarui Jadwal Waktu Mulai & Tutup Lelang
      </button>
      <div style="font-size:11px; font-weight:700; color:var(--gold-light); margin-top:4px;">Daftar Penawar (Nomor WA Utuh):</div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:165px; overflow-y:auto;">
        ${daftarBidHtml}
      </div>
    `;
  }

  async function adminRollbackBidTertentu(kodeProduk, indexBid) {
    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (!item) return;

    let riwayat = [];
    try { riwayat = JSON.parse(item.bidHistoryRaw || "[]"); } catch (e) {}
    if (indexBid < 0 || indexBid >= riwayat.length) return;

    const targetHapus = riwayat[indexBid];
    riwayat.splice(indexBid, 1);

    if (riwayat.length > 0) {
      const topBaru = riwayat[riwayat.length - 1];
      item.currentBid = Number(topBaru.nominal) || 0;
      item.highestBidder = `${topBaru.nama} (${topBaru.waMasked || sensorNomorWA(topBaru.wa)})`;
    } else {
      item.currentBid = 0;
      item.highestBidder = "-";
    }
    item.bidHistoryRaw = JSON.stringify(riwayat);

    renderDetailLelangAdminHub();
    if (currentOpenDetailCode && currentOpenDetailCode.toUpperCase() === item.kode.toUpperCase()) {
      bukaDetailProduk(item.kode, false);
    }

    tampilkanToast(`🗑️ Bid ${targetHapus.nama} (${formatRupiah(targetHapus.nominal)}) dibatalkan`);

    await kirimKeGoogleSheets({
      action: "admin_rollback_bid",
      sheet: CONFIG.AUCTION_SHEET_NAME,
      kode: item.kode,
      currentBid: item.currentBid,
      highestBidder: item.highestBidder,
      bidHistoryRaw: item.bidHistoryRaw
    });
  }

  async function adminToggleTutupLelang(kodeProduk) {
    const item = masterCatalogItems.find(i => i.kode === kodeProduk);
    if (!item) return;

    const sedangTutup = apakahItemKatalogHabis(item) || apakahWaktuLelangHabis(item.endTime);
    if (sedangTutup) {
      item.stok = 1;
      item.status = "Tersedia";
      const besok = new Date(Date.now() + 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000);
      item.endTime = besok.toISOString().slice(0, 16).replace("T", " ");
      tampilkanToast(`🔓 Lelang [${item.kode}] dibuka kembali`);
    } else {
      item.stok = 0;
      item.status = "Terjual";
      tampilkanToast(`🔒 Lelang [${item.kode}] resmi ditutup`);
    }

    renderDetailLelangAdminHub();
    terapkanFilterKatalog();

    await kirimKeGoogleSheets({
      action: "admin_update_stock",
      sheet: CONFIG.AUCTION_SHEET_NAME,
      kode: item.kode,
      stok: item.stok,
      status: item.status,
      endTime: item.endTime
    });
  }

  async function adminSimpanJadwalLelang(kodeProduk) {
    const item = masterCatalogItems.find(i => i.kode === kodeProduk);
    if (!item) return;

    const startVal = document.getElementById("admEditStart_" + kodeProduk).value.trim();
    const endVal = document.getElementById("admEditEnd_" + kodeProduk).value.trim();
    item.startTime = startVal;
    item.endTime = endVal;

    renderDetailLelangAdminHub();
    terapkanFilterKatalog();
    tampilkanToast(`⏱️ Jadwal lelang [${item.kode}] diperbarui`);

    await kirimKeGoogleSheets({
      action: "admin_update_schedule",
      sheet: CONFIG.AUCTION_SHEET_NAME,
      kode: item.kode,
      startTime: startVal,
      endTime: endVal
    });
  }

  function getBlockedBNRList() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_BNR)) || []; } catch (e) { return []; }
  }

  async function adminTambahBlokirBNR() {
    const inp = document.getElementById("adminBlockWaInput");
    const waClean = normalisasiNomorWA(inp ? inp.value : "");
    if (!waClean || waClean.length < 8) {
      tampilkanToast("⚠️ Masukkan nomor WA yang valid");
      return;
    }
    const list = getBlockedBNRList();
    if (!list.includes(waClean)) {
      list.push(waClean);
      localStorage.setItem(STORAGE_KEY_ADMIN_BNR, JSON.stringify(list));
    }
    if (inp) inp.value = "";
    renderDaftarBlokirBNRAdmin();
    tampilkanToast(`🚫 Nomor ${waClean} masuk daftar blokir BNR`);

    await kirimKeGoogleSheets({
      action: "admin_block_wa",
      wa: waClean
    });
  }

  async function adminBukaBlokirBNR(waTarget) {
    const list = getBlockedBNRList().filter(w => w !== waTarget);
    localStorage.setItem(STORAGE_KEY_ADMIN_BNR, JSON.stringify(list));
    renderDaftarBlokirBNRAdmin();
    tampilkanToast(`🔓 Blokir nomor ${waTarget} dibuka`);

    await kirimKeGoogleSheets({
      action: "admin_unblock_wa",
      wa: waTarget
    });
  }

  function renderDaftarBlokirBNRAdmin() {
    const box = document.getElementById("adminBlockedListContainer");
    if (!box) return;
    const list = getBlockedBNRList();
    if (list.length === 0) {
      box.innerHTML = `<div class="profile-empty-note">Belum ada nomor WhatsApp dalam daftar blokir BNR.</div>`;
      return;
    }
    box.innerHTML = list.map(wa => `
      <div class="admin-row-item">
        <span>🚫 <strong>${escapeHtml(wa)}</strong> (Diblokir BNR)</span>
        <button type="button" class="admin-mini-btn green" data-action="admin-unblock-bnr" data-wa="${escapeHtml(wa)}">Buka Blokir</button>
      </div>
    `).join("");
  }

  // --- MODUL 2: MANAJEMEN KOLEKSI CK (KATALOG & STOK) ---
  function renderDaftarKatalogAdminHub() {
    const box = document.getElementById("adminCatalogQuickList");
    const qInput = document.getElementById("adminCatalogFilterInput");
    if (!box) return;
    const q = (qInput ? qInput.value : "").trim().toLowerCase();

    const hasil = masterCatalogItems.filter(it =>
      !q || it.kode.toLowerCase().includes(q) || it.nama.toLowerCase().includes(q) || it.kategori.toLowerCase().includes(q)
    );

    if (hasil.length === 0) {
      box.innerHTML = `<div class="profile-empty-note">Koleksi tidak ditemukan.</div>`;
      return;
    }

    box.innerHTML = hasil.map(it => {
      const isHabis = apakahItemKatalogHabis(it);
      const kodeAttr = escapeHtml(it.kode);
      return `
        <div class="admin-row-item">
          <div style="flex:1; min-width:150px;">
            <strong>[${kodeAttr}] ${escapeHtml(it.nama)}</strong><br>
            <small style="color:var(--text-muted);">${escapeHtml(it.kategori)} • ${escapeHtml(formatRupiah(it.harga))} • Stok: <b>${Number(it.stok) || 0}</b></small>
          </div>
          <div style="display:flex; gap:5px; align-items:center;">
            <button type="button" class="admin-mini-btn" data-action="admin-stock-delta" data-kode="${kodeAttr}" data-delta="-1">−</button>
            <button type="button" class="admin-mini-btn" data-action="admin-stock-delta" data-kode="${kodeAttr}" data-delta="1">+</button>
            <button type="button" class="admin-mini-btn ${isHabis ? 'red' : 'green'}" data-action="admin-toggle-stock" data-kode="${kodeAttr}">
              ${isHabis ? 'Terjual / Habis' : '✔ Tersedia'}
            </button>
            <button type="button" class="admin-mini-btn" data-action="admin-edit-item" data-kode="${kodeAttr}" title="Edit">✏️</button>
          </div>
        </div>
      `;
    }).join("");
  }

  async function adminUbahStokCepat(kodeProduk, delta) {
    const item = masterCatalogItems.find(i => i.kode === kodeProduk);
    if (!item) return;
    item.stok = Math.max(0, (Number(item.stok) || 0) + delta);
    item.status = item.stok > 0 ? "Tersedia" : "Habis";
    renderDaftarKatalogAdminHub();
    terapkanFilterKatalog();

    await kirimKeGoogleSheets({
      action: "admin_update_stock",
      sheet: item.kategori.toLowerCase() === "lelang" ? CONFIG.AUCTION_SHEET_NAME : CONFIG.CATALOG_SHEET_NAME,
      kode: item.kode,
      stok: item.stok,
      status: item.status
    });
  }

  async function adminToggleStatusKoleksi(kodeProduk) {
    const item = masterCatalogItems.find(i => i.kode === kodeProduk);
    if (!item) return;
    const isHabis = apakahItemKatalogHabis(item);
    if (isHabis) {
      item.stok = Math.max(1, Number(item.stok) || 1);
      item.status = "Tersedia";
    } else {
      item.stok = 0;
      item.status = "Terjual";
    }
    renderDaftarKatalogAdminHub();
    terapkanFilterKatalog();
    tampilkanToast(`✦ Status [${item.kode}] diubah ke ${item.status}`);

    await kirimKeGoogleSheets({
      action: "admin_update_stock",
      sheet: item.kategori.toLowerCase() === "lelang" ? CONFIG.AUCTION_SHEET_NAME : CONFIG.CATALOG_SHEET_NAME,
      kode: item.kode,
      stok: item.stok,
      status: item.status
    });
  }

  function adminIsiFormEditKoleksi(kodeProduk) {
    const item = masterCatalogItems.find(i => i.kode === kodeProduk);
    if (!item) return;
    document.getElementById("admItemKode").value = item.kode;
    document.getElementById("admItemNama").value = item.nama;
    document.getElementById("admItemKategori").value = item.kategori;
    document.getElementById("admItemJenis").value = item.jenis;
    document.getElementById("admItemHarga").value = item.harga || item.ob;
    document.getElementById("admItemStok").value = item.stok;
    document.getElementById("admItemSize").value = item.size || "";
    document.getElementById("admItemSex").value = item.sex || "";
    document.getElementById("admItemTailType").value = item.tailType || "";
    document.getElementById("admItemFoto").value = item.foto || "";
    document.getElementById("admItemDesc").value = item.deskripsi || "";
    tampilkanToast(`✏️ Data [${item.kode}] dimuat ke form bawah`);
  }

  async function adminSimpanKoleksiBaru() {
    const kode = document.getElementById("admItemKode").value.trim().toUpperCase();
    const nama = document.getElementById("admItemNama").value.trim();
    const kategori = document.getElementById("admItemKategori").value;
    const jenis = document.getElementById("admItemJenis").value.trim() || "Koleksi VIP";
    const harga = Number(document.getElementById("admItemHarga").value) || 0;
    const stok = Number(document.getElementById("admItemStok").value);
    const size = document.getElementById("admItemSize").value.trim();
    const sex = document.getElementById("admItemSex").value.trim();
    const tailTypeInput = document.getElementById("admItemTailType").value.trim();
    const tailType = tailTypeInput || (kategori === "Produk" ? "-" : "HMPK - Halfmoon Plakat");
    const foto = document.getElementById("admItemFoto").value.trim() || CONFIG.PLACEHOLDER_IMAGE;
    const deskripsi = document.getElementById("admItemDesc").value.trim() || "Koleksi resmi berkualitas dari Cupang Kasep.";

    if (!kode || !nama) {
      tampilkanToast("⚠️ Kode dan Nama wajib diisi");
      return;
    }

    const objBaru = {
      kode,
      nama,
      kategori,
      jenis,
      harga,
      foto,
      deskripsi,
      stok: isNaN(stok) ? 1 : stok,
      status: (isNaN(stok) ? 1 : stok) > 0 ? "Tersedia" : "Habis",
      spesies: "Betta Splendens",
      tailType,
      sex,
      size,
      origin: "Indonesia",
      shipping: "Garansi Hidup Sampai Tujuan (DOA)",
      views: 1,
      ob: harga,
      kb: 20000,
      bin: 0,
      postDate: dapatkanTanggalSekarang(),
      startTime: "",
      endTime: "",
      currentBid: 0,
      highestBidder: "-",
      bidHistoryRaw: "[]"
    };

    const idx = masterCatalogItems.findIndex(i => i.kode === kode);
    if (idx !== -1) {
      masterCatalogItems[idx] = { ...masterCatalogItems[idx], ...objBaru };
    } else {
      masterCatalogItems.unshift(objBaru);
    }

    tampilkanToast(`⏳ Menyimpan [${kode}] ke Google Sheets...`);

    const resServer = await kirimKeGoogleSheets({
      action: "admin_save_item",
      sheet: kategori.toLowerCase() === "lelang" ? CONFIG.AUCTION_SHEET_NAME : CONFIG.CATALOG_SHEET_NAME,
      item: objBaru
    });

    if (resServer && resServer.status === "ok") {
      perbaruiDropdownJenis();
      terapkanFilterKatalog();
      segarkanSemuaTampilanAdminHub();
      ["admItemKode", "admItemNama", "admItemJenis", "admItemHarga", "admItemSize", "admItemSex", "admItemTailType", "admItemFoto", "admItemDesc"].forEach(idEl => {
        const el = document.getElementById(idEl);
        if (el) el.value = "";
      });
      const stokEl = document.getElementById("admItemStok");
      if (stokEl) stokEl.value = "1";
      tampilkanToast(`✦ [${kode}] berhasil tersimpan di Google Sheets!`);
    } else {
      tampilkanToast(`❌ Gagal menyimpan ke Sheet: ${(resServer && resServer.message) ? resServer.message : "Pastikan Apps Script sudah Deploy Versi Baru"}`);
    }
  }

  // --- MODUL 3: GENERATOR VOUCHER & VERIFIKASI UNDIAN ---
  function adminAcakKodeVoucher() {
    const karakter = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let buntut = "";
    for (let i = 0; i < 4; i++) {
      buntut += karakter.charAt(Math.floor(Math.random() * karakter.length));
    }
    const inp = document.getElementById("admNewVoucherInput");
    if (inp) inp.value = `CK-VIP-${buntut}`;
  }

  async function adminBuatVoucherBaru() {
    const inp = document.getElementById("admNewVoucherInput");
    const kode = (inp ? inp.value : "").trim().toUpperCase();
    if (!kode) {
      adminAcakKodeVoucher();
      return;
    }

    const res = await kirimKeGoogleSheets({
      action: "admin_create_voucher",
      kode: kode,
      remaining: 3,
      tanggal: dapatkanTanggalSekarang()
    });

    if (res && res.status === "ok") {
      adminVouchersCache = [{ kode: kode, remaining: 3, status: "BELUM DIGUNAKAN" }, ...adminVouchersCache.filter(v => v.kode !== kode)];
      if (navigator.clipboard) {
        navigator.clipboard.writeText(kode).catch(() => {});
      }
      if (inp) inp.value = "";
      renderDaftarVoucherAdminHub();
      tampilkanToast(`🎟️ Voucher ${kode} aktif di server & disalin!`);
    } else {
      tampilkanToast("⚠️ Gagal membuat voucher di server");
    }
  }

  function renderDaftarVoucherAdminHub() {
    const box = document.getElementById("admVoucherCreatedList");
    if (!box) return;
    if (!adminVouchersCache || adminVouchersCache.length === 0) {
      box.innerHTML = `<div class="profile-empty-note">Memuat daftar voucher dari server...</div>`;
      return;
    }

    box.innerHTML = adminVouchersCache.slice(0, 10).map(v => {
      const kodeAttr = escapeHtml(v.kode);
      return `
        <div class="admin-row-item">
          <span>🎟️ <strong>${kodeAttr}</strong> — Sisa: <b>${Number(v.remaining) || 0}/3 Spin</b></span>
          <button type="button" class="admin-mini-btn" data-action="admin-copy-voucher" data-kode="${kodeAttr}">Salin Kode</button>
        </div>
      `;
    }).join("");
  }

  async function adminVerifikasiTokenDariHub() {
    const val = document.getElementById("admHubClaimToken").value.trim();
    document.getElementById("adminClaimTokenInput").value = val;
    document.getElementById("admHubVoucherResult").innerHTML = `<span style="color:var(--gold-light)">⏳ Memverifikasi ke server...</span>`;
    await verifikasiTokenKlaim();
    document.getElementById("admHubVoucherResult").innerHTML = document.getElementById("adminSecretResultBox").innerHTML;
  }

  async function adminCekRiwayatVoucherDariHub() {
    const val = document.getElementById("admHubVoucherCheck").value.trim();
    document.getElementById("adminVoucherCheckInput").value = val;
    await cekRiwayatVoucherLokal();
    document.getElementById("admHubVoucherResult").innerHTML = document.getElementById("adminSecretResultBox").innerHTML;
  }

  function adminAktifkanSpinUnlimited() {
    if (!apakahUserAdmin()) return;
    tutupModalAdminHub();
    bukaHalamanUndian();
    isAdminSpinMode = true;
    activeVoucherCode = "ADMIN-TEST";
    perbaruiTampilanVoucher();
    tampilkanToast("👑 Mode Testing Unlimited Spin Aktif!");
  }

  // --- MODUL 4: PENERBITAN SERTIFIKAT KEASLIAN VIP ---
  async function adminTerbitkanSertifikatBaru() {
    const id = document.getElementById("admCertId").value.trim().toUpperCase();
    const owner = document.getElementById("admCertOwner").value.trim();
    const strain = document.getElementById("admCertStrain").value.trim();
    const grade = document.getElementById("admCertGrade").value.trim() || "Premium Collector";
    const size = document.getElementById("admCertSize").value.trim() || "Medium (M)";
    const form = document.getElementById("admCertForm").value.trim() || "HMPK - 180° Symmetrical";
    const date = document.getElementById("admCertDate").value.trim() || dapatkanTanggalSekarang();
    const img = document.getElementById("admCertImg").value.trim() || CONFIG.PLACEHOLDER_IMAGE;

    if (!id || !owner || !strain) {
      tampilkanToast("⚠️ Nomor Sertifikat, Pemilik, dan Strain wajib diisi");
      return;
    }

    const hash = `${id}-AUTHENTIC-VIP-${hitungHashRahasia(id + "|" + owner)}`;
    const certData = {
      owner,
      strain,
      grade,
      size,
      form,
      date,
      breeder: "CUPANG KASEP",
      hash,
      img
    };

    const res = await kirimKeGoogleSheets({
      action: "admin_create_cert",
      id: id,
      cert: certData
    });

    if (res && res.status === "ok") {
      adminCertsCache[id] = certData;
      const baseUrl = window.location.href.split("#")[0].split("?")[0];
      const shareUrl = `${baseUrl}?cert=${encodeURIComponent(id)}#verifikasi`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      renderDaftarSertifikatAdminHub();
      tampilkanToast(`📜 Sertifikat [${id}] tersimpan di server & link disalin!`);
    } else {
      tampilkanToast("⚠️ Gagal menyimpan sertifikat ke server");
    }
  }

  function renderDaftarSertifikatAdminHub() {
    const box = document.getElementById("admCertListContainer");
    if (!box) return;
    const entries = Object.entries(adminCertsCache || {});
    if (entries.length === 0) {
      box.innerHTML = `<div class="profile-empty-note">Memuat daftar sertifikat dari server...</div>`;
      return;
    }
    box.innerHTML = entries.map(([id, data]) => {
      const idAttr = escapeHtml(id);
      return `
        <div class="admin-row-item">
          <div>
            <strong>${idAttr}</strong> — ${escapeHtml(data.owner)}<br>
            <small style="color:var(--text-muted);">${escapeHtml(data.strain)} (${escapeHtml(data.date)})</small>
          </div>
          <button type="button" class="admin-mini-btn" data-action="admin-view-cert" data-kode="${idAttr}">
            Lihat Sertifikat
          </button>
        </div>
      `;
    }).join("");
  }

  // --- MODUL 5: PANTAUAN TOKO (MINI ANALYTICS) & REKAP PEMENANG ---
  function getWinnerClaimsStatus() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_CLAIMS)) || {}; } catch (e) { return {}; }
  }

  function toggleStatusKlaimPemenang(kodeLelang) {
    const map = getWinnerClaimsStatus();
    map[kodeLelang] = !map[kodeLelang];
    localStorage.setItem(STORAGE_KEY_ADMIN_CLAIMS, JSON.stringify(map));
    renderAnalitikDanPemenangAdminHub();
  }

  function renderAnalitikDanPemenangAdminHub() {
    const statGrid = document.getElementById("admAnalyticsSummaryGrid");
    const winnersBox = document.getElementById("admWinnersRecapList");
    const topViewsBox = document.getElementById("admTopViewsList");
    if (!statGrid || !winnersBox || !topViewsBox) return;

    const totalKoleksi = masterCatalogItems.filter(i => i.kategori.toLowerCase() !== "lelang" && !apakahItemKatalogHabis(i)).length;
    const semuaLelang = masterCatalogItems.filter(i => i.kategori.toLowerCase() === "lelang");
    const lelangAktif = semuaLelang.filter(i => !apakahItemKatalogHabis(i) && !apakahWaktuLelangHabis(i.endTime)).length;
    const totalViews = masterCatalogItems.reduce((acc, i) => acc + (Number(i.views) || 0), 0);
    const lelangBerpemenang = semuaLelang.filter(i => (Number(i.currentBid) || 0) > 0);

    statGrid.innerHTML = `
      <div class="admin-stat-card">
        <span class="admin-stat-num">${totalKoleksi}</span>
        <span class="admin-stat-lbl">Koleksi Tersedia</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-num">${lelangAktif}</span>
        <span class="admin-stat-lbl">Lelang Berjalan</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-num">${lelangBerpemenang.length}</span>
        <span class="admin-stat-lbl">Lelang Terisi Bid</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-num">${totalViews}</span>
        <span class="admin-stat-lbl">Total Tayangan</span>
      </div>
    `;

    const claimsMap = getWinnerClaimsStatus();
    if (lelangBerpemenang.length === 0) {
      winnersBox.innerHTML = `<div class="profile-empty-note">Belum ada lelang yang memiliki penawar/pemenang.</div>`;
    } else {
      winnersBox.innerHTML = lelangBerpemenang.map(it => {
        let riwayat = [];
        try { riwayat = JSON.parse(it.bidHistoryRaw || "[]"); } catch (e) {}
        const topBid = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;
        const waPemenang = topBid ? normalisasiNomorWA(topBid.wa || "") : "";
        const sudahKlaim = Boolean(claimsMap[it.kode]);
        const pesanTagih = `Halo Kak ${topBid ? topBid.nama : ''}, selamat Anda adalah penawar tertinggi / pemenang lelang resmi Cupang Kasep untuk koleksi [${it.kode}] ${it.nama} dengan nominal ${formatRupiah(it.currentBid)}. Silakan konfirmasi pengiriman ya. Terima kasih!`;

        const kodeAttr = escapeHtml(it.kode);
        return `
          <div class="admin-row-item">
            <div>
              <strong>[${kodeAttr}] ${escapeHtml(it.nama)}</strong> — <span style="color:var(--gold-light); font-weight:800;">${escapeHtml(formatRupiah(it.currentBid))}</span><br>
              <small style="color:var(--text-muted);">Pemenang: <b>${escapeHtml(it.highestBidder)}</b> ${waPemenang ? `(${escapeHtml(waPemenang)})` : ''}</small>
            </div>
            <div style="display:flex; gap:5px;">
              <button type="button" class="admin-mini-btn ${sudahKlaim ? 'green' : ''}" data-action="admin-toggle-claim" data-kode="${kodeAttr}">
                ${sudahKlaim ? '✔ Sudah Klaim' : '⏳ Belum Klaim'}
              </button>
              ${waPemenang ? `<a href="https://wa.me/${encodeURIComponent(waPemenang)}?text=${encodeURIComponent(pesanTagih)}" target="_blank" rel="noopener noreferrer" class="admin-mini-btn green">📲 Hubungi Pemenang</a>` : ''}
            </div>
          </div>
        `;
      }).join("");
    }

    const urutPopuler = [...masterCatalogItems].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)).slice(0, 8);
    topViewsBox.innerHTML = urutPopuler.map((it, idx) => `
      <div class="admin-row-item">
        <span>#${idx + 1} <strong>[${escapeHtml(it.kode)}] ${escapeHtml(it.nama)}</strong> <small style="color:var(--text-muted);">(${escapeHtml(it.kategori)})</small></span>
        <span style="color:var(--gold-light); font-weight:800;">◈ ${Number(it.views) || 0}x dilihat</span>
      </div>
    `).join("");
  }