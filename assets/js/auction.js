/* =========================================================
     5. MESIN UTAMA LELANG VIP, OTP FONNTE 1X SELAMANYA, & BLOKIR BNR
     ========================================================= */
  const STORAGE_KEY_BIDDER = "ck_verified_bidder_v1";
  let pendingBidAction = null; // Menyimpan aksi bid yang tertunda saat diminta verifikasi WA

  function getVerifiedBidder() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_BIDDER)) || null;
    } catch (e) {
      return null;
    }
  }

  function saveVerifiedBidder(data) {
    try {
      localStorage.setItem(STORAGE_KEY_BIDDER, JSON.stringify(data));
    } catch (e) {}
    if (typeof perbaruiTombolAuthHeaderLelang === "function") {
      perbaruiTombolAuthHeaderLelang();
    }
  }

  function dapatkanKodeNegaraTerpilih() {
    const sel = document.getElementById("bidderCountryCode");
    return sel ? String(sel.value).replace(/[^0-9]/g, "") : "62";
  }

  function normalisasiNomorWA(no, kodeNegaraExplicit = null) {
    let clean = String(no || "").replace(/[^0-9]/g, "");
    if (!clean) return "";
    const cc = kodeNegaraExplicit ? String(kodeNegaraExplicit).replace(/[^0-9]/g, "") : dapatkanKodeNegaraTerpilih();

    if (clean.startsWith("00")) {
      clean = clean.slice(2);
    } else if (clean.startsWith("0")) {
      clean = cc + clean.slice(1);
    } else if (!clean.startsWith(cc)) {
      if (cc === "62" && clean.startsWith("8")) {
        clean = "62" + clean;
      } else if (clean.length <= 12) {
        clean = cc + clean;
      }
    }
    return clean;
  }

  function sensorNomorWA(no) {
    const clean = String(no || "").replace(/[^0-9]/g, "");
    if (clean.length < 7) return clean;
    const prefixLen = clean.length >= 10 ? 5 : 4;
    return clean.slice(0, prefixLen) + "****" + clean.slice(-3);
  }

  // Mengunci pembacaan string tanggal/jam dari Google Sheets mutlak ke WIB (UTC+7)
  function parseWaktuLelang(str) {
    if (!str) return 0;
    const raw = String(str).trim();
    if (!raw) return 0;

    // 1. Jika format YYYY-MM-DD HH:mm:ss atau YYYY/MM/DD HH:mm
    let mIso = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (mIso) {
      const y = Number(mIso[1]);
      const mo = Number(mIso[2]) - 1;
      const d = Number(mIso[3]);
      const h = Number(mIso[4] || 0);
      const mi = Number(mIso[5] || 0);
      const s = Number(mIso[6] || 0);
      // Konversi komponen waktu WIB (UTC+7) ke epoch UTC murni
      return Date.UTC(y, mo, d, h - 7, mi, s);
    }

    // 2. Jika format DD/MM/YYYY HH:mm:ss atau DD-MM-YYYY HH:mm
    let mId = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[\s,]+(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?)?/);
    if (mId) {
      const d = Number(mId[1]);
      const mo = Number(mId[2]) - 1;
      const y = Number(mId[3]);
      const h = Number(mId[4] !== undefined ? mId[4] : 23);
      const mi = Number(mId[5] !== undefined ? mId[5] : 59);
      const s = Number(mId[6] || 0);
      return Date.UTC(y, mo, d, h - 7, mi, s);
    }

    // 3. Fallback jika sudah memiliki informasi timezone (Z / +07:00)
    if (/Z|[+\-]\d{2}:?\d{2}$/i.test(raw)) {
      const parsed = Date.parse(raw);
      return isNaN(parsed) ? 0 : parsed;
    }

    const parsedFallback = Date.parse(raw + " GMT+0700");
    return isNaN(parsedFallback) ? 0 : parsedFallback;
  }

  function apakahLelangBelumMulai(startTimeStr) {
    const startTarget = parseWaktuLelang(startTimeStr);
    if (!startTarget) return false;
    return Date.now() < startTarget;
  }

  function apakahWaktuLelangHabis(endTimeStr) {
    const target = parseWaktuLelang(endTimeStr);
    if (!target) return false;
    return Date.now() >= target;
  }

  // Menampilkan waktu jadwal dalam bentuk hitung mundur seragam sesuai bahasa (ID / EN / ZH)
  function formatJadwalTeksLelang(str) {
    const ms = parseWaktuLelang(str);
    if (!ms) return str || "-";
    const selisih = ms - Date.now();
    const pad = n => String(n).padStart(2, "0");
    const u = USER_LANG === "en" ? { d: "d", h: "h", m: "m", s: "s" }
            : (USER_LANG === "zh" ? { d: "天", h: "时", m: "分", s: "秒" }
            : { d: "h", h: "j", m: "m", s: "d" });

    if (selisih <= 0) {
      return `00${u.h} : 00${u.m} : 00${u.s}`;
    }
    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);
    return hari > 0
      ? `${hari}${u.d} ${pad(jam)}${u.h} ${pad(menit)}${u.m} ${pad(detik)}${u.s}`
      : `${pad(jam)}${u.h} : ${pad(menit)}${u.m} : ${pad(detik)}${u.s}`;
  }

  function formatHitungMundurLelang(endTimeStr, startTimeStr = "") {
    const now = Date.now();
    const startTarget = parseWaktuLelang(startTimeStr);
    const endTarget = parseWaktuLelang(endTimeStr);
    const pad = n => String(n).padStart(2, "0");

    const u = USER_LANG === "en"
      ? { d: "d", h: "h", m: "m", s: "s", start: "Starts in", left: "Time Left", active: "● Active", ended: "● AUCTION ENDED" }
      : (USER_LANG === "zh"
      ? { d: "天", h: "时", m: "分", s: "秒", start: "开始倒计时", left: "剩余时间", active: "● 进行中", ended: "● 拍卖已结束" }
      : { d: "h", h: "j", m: "m", s: "d", start: "Mulai", left: "Sisa Waktu", active: "● Aktif", ended: "● LELANG SELESAI" });

    // FASE 1: LELANG BELUM DIMULAI (Menunggu Jam Mulai berdasarkan patokan UTC+7)
    if (startTarget && now < startTarget) {
      const selisihMulai = startTarget - now;
      const hari = Math.floor(selisihMulai / (1000 * 60 * 60 * 24));
      const jam = Math.floor((selisihMulai % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const menit = Math.floor((selisihMulai % (1000 * 60 * 60)) / (1000 * 60));
      const detik = Math.floor((selisihMulai % (1000 * 60)) / 1000);

      const rincianMulai = hari > 0
        ? `${hari}${u.d} ${pad(jam)}${u.h} ${pad(menit)}${u.m} ${pad(detik)}${u.s}`
        : `${pad(jam)}${u.h} : ${pad(menit)}${u.m} : ${pad(detik)}${u.s}`;

      return {
        text: `◈ ${u.start} • ${rincianMulai}`,
        upcoming: true,
        ended: false,
        urgent: false,
        phase: "upcoming"
      };
    }

    // FASE 2 & 3: SUDAH MASUK JAM MULAI -> HITUNG MUNDUR KE WAKTU SELESAI (SERENTAK UTC+7)
    if (!endTarget) {
      return { text: u.active, upcoming: false, ended: false, urgent: false, phase: "active" };
    }
    const selisih = endTarget - now;
    if (selisih <= 0) {
      return { text: u.ended, upcoming: false, ended: true, urgent: false, phase: "ended" };
    }

    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisih % (1000 * 60)) / 1000);

    const rincianWaktu = hari > 0
      ? `${hari}${u.d} ${pad(jam)}${u.h} ${pad(menit)}${u.m} ${pad(detik)}${u.s}`
      : `${pad(jam)}${u.h} : ${pad(menit)}${u.m} : ${pad(detik)}${u.s}`;

    return {
      text: `● ${u.left} • ${rincianWaktu}`,
      upcoming: false,
      ended: false,
      urgent: selisih <= 10 * 60 * 1000,
      phase: "active"
    };
  }

  // Loop update timer lelang pintar: hanya bekerja saat tab aktif & berada di halaman Katalog/Lelang
  setInterval(() => {
    if (document.hidden) return;
    const catPageEl = document.getElementById("catalogPage");
    if (!catPageEl || catPageEl.style.display !== "block") return;

    document.querySelectorAll("[data-auction-subtimer]").forEach(subEl => {
      const targetStr = subEl.getAttribute("data-targettime") || "";
      const tipeSub = subEl.getAttribute("data-auction-subtimer");
      if (!targetStr) return;
      const ms = parseWaktuLelang(targetStr);
      if (!ms) return;
      if (Date.now() >= ms) {
        subEl.innerText = tipeSub === "start" ? "Sudah Dimulai" : "00j : 00m : 00d (Selesai)";
      } else {
        subEl.innerText = formatJadwalTeksLelang(targetStr);
      }
    });

    document.querySelectorAll("[data-auction-timer]").forEach(el => {
      const kode = el.getAttribute("data-auction-timer");
      const startStr = el.getAttribute("data-starttime") || "";
      const endStr = el.getAttribute("data-endtime") || "";
      const isForceEnded = el.getAttribute("data-force-ended") === "true";
      const prevPhase = el.getAttribute("data-phase") || "";

      const info = isForceEnded
        ? { text: "● LELANG SELESAI", upcoming: false, ended: true, urgent: false, phase: "ended" }
        : formatHitungMundurLelang(endStr, startStr);

      el.innerText = info.text;
      el.classList.toggle("upcoming", info.upcoming);
      el.classList.toggle("ended", info.ended);
      el.classList.toggle("active-live", !info.ended && !info.upcoming);
      el.classList.toggle("urgent", !info.ended && !info.upcoming && info.urgent);

      // Jika fase baru saja berubah
      if (prevPhase && prevPhase !== info.phase) {
        el.setAttribute("data-phase", info.phase);

        const cardBtn = document.querySelector(`[data-auction-card-btn="${kode}"]`);
        if (cardBtn) {
          cardBtn.innerText = info.ended ? "Hasil Lelang" : (info.upcoming ? "Detail Jadwal" : "Ikut Bid");
          cardBtn.classList.toggle("restock-mode", info.ended);
        }

        // Jika pengguna sedang membuka halaman detail produk lelang ini, langsung buka/kunci tombol Bid otomatis!
        const detailViewEl = document.getElementById("catalogDetailView");
        if (detailViewEl && detailViewEl.style.display === "block" && currentOpenDetailCode === kode) {
          bukaDetailProduk(kode, false);
        }
      }
    });
  }, 1000);

  // Fungsi mengecek apakah user yang sedang login adalah pemenang sah (Poin 2)
  function apakahUserPemenangSah(item, bidderSession) {
    if (!bidderSession || !bidderSession.wa) return false;
    const myWaClean = normalisasiNomorWA(bidderSession.wa);
    const myWaMasked = sensorNomorWA(myWaClean);

    let riwayatArr = [];
    try { riwayatArr = JSON.parse(item.bidHistoryRaw || "[]"); } catch (e) {}

    if (riwayatArr.length > 0) {
      const topBid = riwayatArr[riwayatArr.length - 1];
      if (topBid.wa && normalisasiNomorWA(topBid.wa) === myWaClean) return true;
      if (topBid.waMasked && topBid.waMasked === myWaMasked &&
          String(topBid.nama || "").trim().toLowerCase() === String(bidderSession.nama || "").trim().toLowerCase()) {
        return true;
      }
    }

    const highBidderStr = String(item.highestBidder || "");
    if (myWaMasked && highBidderStr.includes(myWaMasked)) return true;
    return false;
  }

  // Fungsi Sign Out Instan & Otomatis Kembali ke Beranda jika keluar dari Halaman Admin
  function keluarAkunLelang(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    tutupMenuAuthHeader();
    localStorage.removeItem(STORAGE_KEY_BIDDER);
    perbaruiTombolAuthHeaderLelang();
    tampilkanToast("✦ Berhasil keluar dari akun (Sign Out)");

    const secAdmin = document.getElementById("sectionAdmin");
    if (secAdmin && secAdmin.style.display === "block") {
      navigasiMenuAtas("home");
      return;
    }
    if (currentOpenDetailCode) {
      bukaDetailProduk(currentOpenDetailCode, false);
    }
  }

  // Memastikan tombol X / Tutup merespons instan pada sentuhan pertama di HP tanpa terhalang keyboard
  function inisialisasiTapInstanModal() {
    const pasangTapInstan = (selector, fn) => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener("touchend", function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (document.activeElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
          }
          fn(e);
        }, { passive: false });
      });
    };

    pasangTapInstan(".auth-close-floating", () => tutupModalOtpLelang());
    pasangTapInstan("#cartModal .close-admin-btn", () => tutupModalKeranjang());
    pasangTapInstan(".profile-close-mini", () => tutupMenuAuthHeader());
    pasangTapInstan("#btnProfileSignOut", (e) => keluarAkunLelang(e));
    pasangTapInstan(".lightbox-close", () => tutupZoom());
  }

  async function muatTokenKlaimLelang(item, bidderSession) {
    const linkEl = document.getElementById("btnKlaimLelangWa_" + item.kode);
    if (!linkEl || !bidderSession || !bidderSession.wa) return;

    const res = await kirimKeGoogleSheets({
      action: "auction_claim_token",
      sheet: CONFIG.AUCTION_SHEET_NAME,
      kode: item.kode,
      wa: bidderSession.wa,
      token: bidderSession.token || "VERIFIED"
    });

    const tokenMenang = (res && res.status === "ok" && res.claimToken) ? res.claimToken : ("CKL-" + item.kode);
    const currentHighest = item.currentBid > 0 ? item.currentBid : 0;
    let pesanKlaimPemenang = "";

    if (USER_LANG === "en") {
      pesanKlaimPemenang = `Hello CUPANG KASEP Admin, I am the official auction winner:\n\n` +
        `🐟 Fish Code: [${item.kode}] ${item.nama}\n` +
        `🏆 Winning Bid: ${formatRupiah(currentHighest)}\n` +
        `👤 Winner: ${item.highestBidder}\n` +
        `📱 WhatsApp: ${bidderSession.wa}\n` +
        `🔐 Auction Verification Token: ${tokenMenang}`;
    } else if (USER_LANG === "zh") {
      pesanKlaimPemenang = `您好 CUPANG KASEP 客服，我是本次拍卖的正式中标者：\n\n` +
        `🐟 斗鱼代码: [${item.kode}] ${item.nama}\n` +
        `🏆 中标价格: ${formatRupiah(currentHighest)}\n` +
        `👤 中标者: ${item.highestBidder}\n` +
        `📱 WhatsApp: ${bidderSession.wa}\n` +
        `🔐 拍卖验证令牌: ${tokenMenang}`;
    } else {
      pesanKlaimPemenang = `Halo Admin CUPANG KASEP, saya pemenang sah lelang:\n\n` +
        `🐟 Kode Ikan: [${item.kode}] ${item.nama}\n` +
        `🏆 Nominal Menang: ${formatRupiah(currentHighest)}\n` +
        `👤 Pemenang: ${item.highestBidder}\n` +
        `📱 No WA: ${bidderSession.wa}\n` +
        `🔐 Token Verifikasi Lelang: ${tokenMenang}`;
    }

    linkEl.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(pesanKlaimPemenang)}`;
    linkEl.innerText = "✦ Klaim Kemenangan Lelang via WhatsApp";
    linkEl.style.pointerEvents = "auto";
    linkEl.style.opacity = "1";
  }

  function renderPanelDetailLelangHtml(item) {
    const isSoldOut = item.stok <= 0 || item.status.toLowerCase() === "habis" || item.status.toLowerCase() === "terjual";
    const infoTimer = formatHitungMundurLelang(item.endTime, item.startTime);
    const isUpcoming = !isSoldOut && infoTimer.upcoming;
    const isEnded = isSoldOut || infoTimer.ended;

    const currentHighest = item.currentBid > 0 ? item.currentBid : 0;
    const minNextBid = currentHighest > 0 ? (currentHighest + item.kb) : item.ob;
    const bidderSession = getVerifiedBidder();
    const kodeAttr = escapeHtml(item.kode);
    const kodeSafe = escapeJsAttr(item.kode);

    let riwayatArr = [];
    try {
      riwayatArr = JSON.parse(item.bidHistoryRaw || "[]");
    } catch (e) {
      riwayatArr = [];
    }

    const isAdminViewer = apakahUserAdmin(bidderSession);
    const riwayatHtml = riwayatArr.length === 0
      ? `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px;">Belum ada penawaran. Jadilah penawar pertama (OB).</div>`
      : riwayatArr.slice().reverse().map((r, idx) => {
          const realIndex = riwayatArr.length - 1 - idx;
          const waFull = normalisasiNomorWA(r.wa || "");
          const tampilanWa = isAdminViewer && waFull ? waFull : (r.waMasked || sensorNomorWA(r.wa));
          const tombolAdminBaris = isAdminViewer ? `
            <span style="display:inline-flex; gap:4px; margin-left:6px;">
              ${waFull ? `<a href="https://wa.me/${encodeURIComponent(waFull)}" target="_blank" rel="noopener noreferrer" class="admin-mini-btn green" style="padding:2px 6px; font-size:9.5px;">WA</a>` : ''}
              <button type="button" class="admin-mini-btn red" style="padding:2px 6px; font-size:9.5px;" data-action="admin-rollback" data-kode="${kodeAttr}" data-index="${realIndex}" title="Batalkan Bid Ini">✕</button>
            </span>
          ` : "";
          return `
            <div class="bid-history-row notranslate" style="align-items:center;">
              <span>${idx === 0 ? '✦' : '•'} <b>${escapeHtml(r.nama)}</b> (${escapeHtml(tampilanWa)}) <small style="color:var(--text-muted); font-size:10px;">${escapeHtml(r.waktu || '')}</small>${tombolAdminBaris}</span>
              <span style="color:var(--gold-light); font-weight:800;">${escapeHtml(formatRupiah(r.nominal))} ${r.tipe === 'BIN' ? '[BIN]' : ''}</span>
            </div>
          `;
        }).join("");

    // Akses login lelang kini sudah berada di pojok kanan atas .vip-header
    const barAkunHtml = "";

    // Pengecekan Hak Klaim Pemenang Lelang (Token CKL diterbitkan resmi oleh server Apps Script)
    const isCurrentUserWinner = currentHighest > 0 && apakahUserPemenangSah(item, bidderSession);
    if (isEnded && isCurrentUserWinner) {
      setTimeout(() => muatTokenKlaimLelang(item, bidderSession), 30);
    }

    return `
      <div class="auction-panel-box" style="width:100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span style="font-size:12px; font-weight:800; letter-spacing:1px; color:var(--gold-light);">PANEL LELANG RESMI</span>
          <span class="auction-timer-badge notranslate ${isEnded ? 'ended' : (isUpcoming ? 'upcoming' : 'active-live')} ${(!isEnded && !isUpcoming && infoTimer.urgent) ? 'urgent' : ''}" style="position:static;" data-auction-timer="${kodeAttr}" data-starttime="${escapeHtml(item.startTime)}" data-endtime="${escapeHtml(item.endTime)}" data-force-ended="${isEnded}" data-phase="${isEnded ? 'ended' : (isUpcoming ? 'upcoming' : 'active')}">
            ${isEnded ? '● LELANG SELESAI' : escapeHtml(infoTimer.text)}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(201,169,110,0.25); border-radius:10px; padding:9px 12px; font-size:11px;">
          <div>
            <span style="color:var(--text-muted); display:block;">Hitung Mundur Mulai:</span>
            <strong class="notranslate" data-auction-subtimer="start" data-targettime="${escapeHtml(item.startTime)}" style="color:var(--gold-light);">${item.startTime ? (isUpcoming ? escapeHtml(formatJadwalTeksLelang(item.startTime)) : 'Sudah Dimulai') : 'Langsung Aktif'}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block;">Sisa Waktu Tutup:</span>
            <strong class="notranslate" data-auction-subtimer="end" data-targettime="${escapeHtml(item.endTime)}" style="color:#f5d0d5;">${item.endTime ? (isEnded ? '00j : 00m : 00d (Selesai)' : escapeHtml(formatJadwalTeksLelang(item.endTime))) : '-'}</strong>
          </div>
        </div>

        ${barAkunHtml}

        <div class="auction-grid-stats notranslate">
          <div class="auction-stat-item">
            <span class="auction-stat-label">Open Bid (OB)</span>
            <span class="auction-stat-val">${escapeHtml(formatRupiah(item.ob))}</span>
          </div>
          <div class="auction-stat-item">
            <span class="auction-stat-label">Kelipatan (KB)</span>
            <span class="auction-stat-val">+${escapeHtml(formatRupiah(item.kb))}</span>
          </div>
          <div class="auction-stat-item">
            <span class="auction-stat-label">Buy It Now (BIN)</span>
            <span class="auction-stat-val" style="color:#4ade80;">${item.bin > 0 ? escapeHtml(formatRupiah(item.bin)) : '-'}</span>
          </div>
        </div>

        <div class="auction-current-box notranslate">
          <div>
            <span style="font-size:11px; color:var(--text-muted); display:block;">Penawaran Tertinggi Saat Ini:</span>
            <strong id="liveHighBid_${kodeAttr}" style="font-size:19px; color:var(--gold-light);">${currentHighest > 0 ? escapeHtml(formatRupiah(currentHighest)) : 'Belum Ada Bid'}</strong>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:var(--text-muted); display:block;">Pemimpin Lelang:</span>
            <strong id="liveHighBidder_${kodeAttr}" style="font-size:12.5px; color:var(--text-light);">${escapeHtml(item.highestBidder || '-')}</strong>
          </div>
        </div>

        ${isEnded ? `
          <div style="text-align:center; padding:12px; background:rgba(168,50,64,0.16); border:1px solid rgba(168,50,64,0.45); border-radius:10px; color:var(--danger-red); font-size:12.5px; font-weight:700;">
            LELANG TUTUP<br>
            ${currentHighest > 0 ? `Pemenang Sah: <b style="color:var(--text-light);">${escapeHtml(item.highestBidder)}</b> (${escapeHtml(formatRupiah(currentHighest))})` : 'Tidak ada penawar'}
          </div>
          ${currentHighest > 0 ? (
            isCurrentUserWinner ? `
              <a id="btnKlaimLelangWa_${kodeAttr}" href="#" target="_blank" rel="noopener noreferrer" class="btn-claim-wa" style="display:flex; pointer-events:none; opacity:0.7;">
                ⏳ Menyiapkan Token Klaim Resmi...
              </a>
            ` : `
              <div style="text-align:center; padding:10px; background:rgba(255,255,255,0.03); border:1px dashed rgba(201,169,110,0.3); border-radius:8px; color:var(--text-muted); font-size:11.5px;">
                Tombol klaim kemenangan hanya aktif untuk akun pemenang sah (${escapeHtml(item.highestBidder)}).
              </div>
            `
          ) : ''}
        ` : isUpcoming ? `
          <div style="text-align:center; padding:14px 12px; background:rgba(140,109,59,0.18); border:1px dashed rgba(201,169,110,0.5); border-radius:10px; color:var(--gold-light); font-size:12.5px; font-weight:700; line-height:1.5;">
            LELANG BELUM DIMULAI<br>
            <span style="font-size:11.5px; color:var(--text-light); font-weight:500;">Lelang akan dibuka dalam <b class="notranslate" style="color:var(--gold-primary);">${escapeHtml(formatJadwalTeksLelang(item.startTime))}</b>.<br>Tombol penawaran akan terbuka otomatis saat waktu mulai tiba.</span>
          </div>
        ` : `
          <div>
            <label class="search-label" id="labelMinNextBid_${kodeAttr}" style="font-size:11.5px;">Nominal Tawaran Anda (Min. Next Bid: ${escapeHtml(formatRupiah(minNextBid))}):</label>
            <div class="search-input-group" style="margin-bottom:8px;">
              <button type="button" class="btn-secondary" style="flex:0.22; font-size:18px; font-weight:800; padding:0;" data-action="bid-step" data-kode="${kodeAttr}" data-delta="-${Number(item.kb) || 20000}" title="Kurangi sesuai kelipatan">−</button>
              <input type="text" id="customBidDisplay_${kodeAttr}" class="search-input bid-input-locked notranslate" style="text-align:center;" value="${escapeHtml(formatRupiah(minNextBid))}" readonly tabindex="-1">
              <input type="hidden" id="customBidInput_${kodeAttr}" value="${Number(minNextBid) || 0}" data-minbid="${Number(minNextBid) || 0}" data-kb="${Number(item.kb) || 20000}">
              <button type="button" class="btn-secondary" style="flex:0.22; font-size:18px; font-weight:800; padding:0;" data-action="bid-step" data-kode="${kodeAttr}" data-delta="${Number(item.kb) || 20000}" title="Tambah sesuai kelipatan">+</button>
            </div>
            <div class="auction-bid-controls">
              <button type="button" class="btn-bid-action" id="btnSubmitBid_${kodeAttr}" data-action="place-bid" data-kode="${kodeAttr}" data-tipe="BID">
                Pasang Penawaran
              </button>
              ${item.bin > 0 ? `
                <button type="button" class="btn-bin-action" id="btnSubmitBin_${kodeAttr}" data-action="place-bid" data-kode="${kodeAttr}" data-tipe="BIN">
                  Buy It Now (${escapeHtml(formatRupiah(item.bin))})
                </button>
              ` : ''}
            </div>
          </div>
        `}

        <div>
          <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:700; color:var(--gold-light); margin-bottom:6px;">
            <span>Riwayat Penawaran Sah:</span>
            <span id="liveBidCount_${kodeAttr}">${riwayatArr.length} Bid Masuk</span>
          </div>
          <div class="bid-history-box" id="liveBidHistoryBox_${kodeAttr}">
            ${riwayatHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Fungsi Tombol (-) dan (+) mengikuti nominal kelipatan tanpa teks angka di tombol (Poin 7)
  function ubahNominalInputBid(kodeProduk, deltaKelipatan) {
    playClickSound();
    const inputEl = document.getElementById("customBidInput_" + kodeProduk);
    const displayEl = document.getElementById("customBidDisplay_" + kodeProduk);
    if (!inputEl) return;

    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    const currentHighest = (item && item.currentBid > 0) ? item.currentBid : 0;
    const minNextBid = item ? (currentHighest > 0 ? (currentHighest + item.kb) : item.ob) : (Number(inputEl.getAttribute("data-minbid")) || 0);

    let nilaiBaru = (Number(inputEl.value) || minNextBid) + Number(deltaKelipatan);

    // Tidak boleh kurang dari minimal Next Bid
    if (nilaiBaru < minNextBid) {
      nilaiBaru = minNextBid;
      tampilkanToast("⚠️ Sudah di batas minimal penawaran (" + formatRupiah(minNextBid) + ")");
    }

    // Tidak boleh melebihi batas BIN jika ada
    if (item && item.bin > 0 && nilaiBaru > item.bin) {
      nilaiBaru = item.bin;
    }

    inputEl.value = nilaiBaru;
    if (displayEl) {
      displayEl.value = formatRupiah(nilaiBaru);
    }
  }

  // Sinkronisasi Real-Time Lelang Adaptif via Endpoint Ringan (?action=auction_live_lite)
  // Normal: 5.5 detik | 2 Menit Terakhir menjelang tutup: otomatis dipercepat menjadi 3 detik
  let isPollingAuctionLive = false;
  let auctionPollTimerId = null;

  async function ambilDataLelangLite() {
    if (!apakahUrlSheetAktif()) return null;
    const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=auction_live_lite&_t=${Date.now()}`);
    const json = await res.json();
    if (json && json.status === "ok" && Array.isArray(json.items)) {
      return json.items;
    }
    return null;
  }

  function hitungIntervalPollingLelang() {
    const now = Date.now();
    const isDetailOpen = document.getElementById("catalogDetailView").style.display === "block";

    if (isDetailOpen && currentOpenDetailCode) {
      const itemAktif = masterCatalogItems.find(
        i => i.kode.toUpperCase() === String(currentOpenDetailCode).toUpperCase()
      );
      if (itemAktif && itemAktif.kategori.toLowerCase() === "lelang" && !apakahItemKatalogHabis(itemAktif)) {
        const sisaMs = parseWaktuLelang(itemAktif.endTime) - now;
        if (sisaMs > 0 && sisaMs <= 2 * 60 * 1000) return 3000;
      }
      return 5500;
    }

    const adaYangKritis = masterCatalogItems.some(item => {
      if (item.kategori.toLowerCase() !== "lelang" || apakahItemKatalogHabis(item)) return false;
      const sisaMs = parseWaktuLelang(item.endTime) - now;
      return sisaMs > 0 && sisaMs <= 2 * 60 * 1000;
    });
    return adaYangKritis ? 3000 : 5500;
  }

  async function jalankanSiklusPollingLelang() {
    clearTimeout(auctionPollTimerId);
    const delayBerikutnya = hitungIntervalPollingLelang();

    if (document.hidden || isPollingAuctionLive) {
      auctionPollTimerId = setTimeout(jalankanSiklusPollingLelang, delayBerikutnya);
      return;
    }

    const isCatalogOpen = document.getElementById("catalogPage").style.display === "block";
    const isDetailOpen = document.getElementById("catalogDetailView").style.display === "block";
    const openItemObj = (isDetailOpen && currentOpenDetailCode)
      ? masterCatalogItems.find(i => i.kode.toUpperCase() === String(currentOpenDetailCode).toUpperCase())
      : null;
    const sedangDiLelang = isCatalogOpen && (
      currentCategoryFilter === "Lelang" ||
      (openItemObj && openItemObj.kategori.toLowerCase() === "lelang")
    );

    if (!sedangDiLelang) {
      auctionPollTimerId = setTimeout(jalankanSiklusPollingLelang, 5500);
      return;
    }

    isPollingAuctionLive = true;
    try {
      const lelangRows = await ambilDataLelangLite().catch(() => null);
      if (lelangRows && Array.isArray(lelangRows)) {
        lelangRows.forEach(fresh => {
          const idx = masterCatalogItems.findIndex(i => i.kode.toUpperCase() === String(fresh.kode).toUpperCase());
          if (idx !== -1) {
            const oldItem = masterCatalogItems[idx];
            const bidBerubah = Number(oldItem.currentBid) !== Number(fresh.currentBid) ||
                               String(oldItem.bidHistoryRaw) !== String(fresh.bidHistoryRaw) ||
                               String(oldItem.status) !== String(fresh.status) ||
                               String(oldItem.endTime) !== String(fresh.endTime);

            oldItem.currentBid = Number(fresh.currentBid) || 0;
            oldItem.highestBidder = String(fresh.highestBidder || "-").trim();
            oldItem.bidHistoryRaw = String(fresh.bidHistoryRaw || "[]").trim();
            oldItem.endTime = String(fresh.endTime || oldItem.endTime).trim();
            oldItem.stok = isNaN(Number(fresh.stok)) ? oldItem.stok : Number(fresh.stok);
            oldItem.status = String(fresh.status || oldItem.status).trim();

            if (bidBerubah) {
              if (isDetailOpen && currentOpenDetailCode && currentOpenDetailCode.toUpperCase() === oldItem.kode.toUpperCase()) {
                perbaruiDomPanelLelangLive(oldItem);
              } else if (!isDetailOpen && currentCategoryFilter === "Lelang") {
                terapkanFilterKatalog();
              }
            }
          }
        });
      }
    } catch (e) {} finally {
      isPollingAuctionLive = false;
      auctionPollTimerId = setTimeout(jalankanSiklusPollingLelang, hitungIntervalPollingLelang());
    }
  }

  auctionPollTimerId = setTimeout(jalankanSiklusPollingLelang, 5500);

  // Memperbarui angka Bid Tertinggi, Pemimpin Lelang, dan Kolom Riwayat secara instan tanpa kedip
  function perbaruiDomPanelLelangLive(item) {
    const isSoldOut = item.stok <= 0 || item.status.toLowerCase() === "habis" || item.status.toLowerCase() === "terjual";
    if (isSoldOut || apakahWaktuLelangHabis(item.endTime)) {
      bukaDetailProduk(item.kode, false);
      return;
    }

    const currentHighest = item.currentBid > 0 ? item.currentBid : 0;
    const minNextBid = currentHighest > 0 ? (currentHighest + item.kb) : item.ob;

    const highBidEl = document.getElementById("liveHighBid_" + item.kode);
    const highBidderEl = document.getElementById("liveHighBidder_" + item.kode);
    const countEl = document.getElementById("liveBidCount_" + item.kode);
    const historyBoxEl = document.getElementById("liveBidHistoryBox_" + item.kode);
    const labelMinEl = document.getElementById("labelMinNextBid_" + item.kode);
    const inputEl = document.getElementById("customBidInput_" + item.kode);
    const displayEl = document.getElementById("customBidDisplay_" + item.kode);

    if (highBidEl) highBidEl.innerText = currentHighest > 0 ? formatRupiah(currentHighest) : "Belum Ada Bid";
    if (highBidderEl) highBidderEl.innerText = item.highestBidder || "-";
    if (labelMinEl) labelMinEl.innerText = `💰 Nominal Tawaran Anda (Min. Next Bid: ${formatRupiah(minNextBid)}):`;

    if (inputEl) {
      inputEl.setAttribute("data-minbid", minNextBid);
      if (Number(inputEl.value) < minNextBid) {
        inputEl.value = minNextBid;
        if (displayEl) displayEl.value = formatRupiah(minNextBid);
      }
    }

    let riwayatArr = [];
    try { riwayatArr = JSON.parse(item.bidHistoryRaw || "[]"); } catch (e) {}
    if (countEl) countEl.innerText = `${riwayatArr.length} Bid Masuk`;

    if (historyBoxEl) {
      historyBoxEl.innerHTML = riwayatArr.length === 0
        ? `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px;">Belum ada penawaran. Jadilah penawar pertama (OB)!</div>`
        : riwayatArr.slice().reverse().map((r, idx) => `
            <div class="bid-history-row notranslate">
              <span>${idx === 0 ? '👑' : '•'} <b>${escapeHtml(r.nama)}</b> (${escapeHtml(r.waMasked || sensorNomorWA(r.wa))}) <small style="color:var(--text-muted); font-size:10px;">${escapeHtml(r.waktu || '')}</small></span>
              <span style="color:var(--gold-light); font-weight:800;">${escapeHtml(formatRupiah(r.nominal))} ${r.tipe === 'BIN' ? '⚡BIN' : ''}</span>
            </div>
          `).join("");
    }
  }

  /* =========================================================
     SISTEM DUAL THEME (DARK LUXURY & LIGHT LUXURY)
     ========================================================= */
  const STORAGE_KEY_THEME = "ck_luxury_theme_mode";

  function terapkanTemaWebsite(mode) {
    const isLight = mode === "light";
    document.body.classList.toggle("light-mode", isLight);
    try { localStorage.setItem(STORAGE_KEY_THEME, isLight ? "light" : "dark"); } catch (e) {}
  }

  function toggleThemeMode() {
    playClickSound();
    const isCurrentlyLight = document.body.classList.contains("light-mode");
    const nextMode = isCurrentlyLight ? "dark" : "light";
    terapkanTemaWebsite(nextMode);
    tampilkanToast(nextMode === "light" ? "✦ Mode Terang (Light Luxury) Aktif" : "✦ Mode Gelap (Dark Luxury) Aktif");
  }

  // Inisialisasi tema tersimpan saat halaman dimuat
  (function initSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === "light") document.body.classList.add("light-mode");
    } catch (e) {}
  })();

  /* =========================================================
     DAFTAR LENGKAP NEGARA PENGGUNA WHATSAPP (URUT A - Z)
     ========================================================= */
  const DAFTAR_NEGARA_WHATSAPP_AZ = [
    { name: "Afghanistan", iso: "AF", code: "93" },
    { name: "Albania", iso: "AL", code: "355" },
    { name: "Algeria", iso: "DZ", code: "213" },
    { name: "Andorra", iso: "AD", code: "376" },
    { name: "Angola", iso: "AO", code: "244" },
    { name: "Argentina", iso: "AR", code: "54" },
    { name: "Armenia", iso: "AM", code: "374" },
    { name: "Australia", iso: "AU", code: "61" },
    { name: "Austria", iso: "AT", code: "43" },
    { name: "Azerbaijan", iso: "AZ", code: "994" },
    { name: "Bahrain", iso: "BH", code: "973" },
    { name: "Bangladesh", iso: "BD", code: "880" },
    { name: "Belarus", iso: "BY", code: "375" },
    { name: "Belgium", iso: "BE", code: "32" },
    { name: "Bolivia", iso: "BO", code: "591" },
    { name: "Bosnia & Herzegovina", iso: "BA", code: "387" },
    { name: "Brazil", iso: "BR", code: "55" },
    { name: "Brunei Darussalam", iso: "BN", code: "673" },
    { name: "Bulgaria", iso: "BG", code: "359" },
    { name: "Cambodia", iso: "KH", code: "855" },
    { name: "Cameroon", iso: "CM", code: "237" },
    { name: "Canada", iso: "CA", code: "1" },
    { name: "Chile", iso: "CL", code: "56" },
    { name: "China", iso: "CN", code: "86" },
    { name: "Colombia", iso: "CO", code: "57" },
    { name: "Costa Rica", iso: "CR", code: "506" },
    { name: "Croatia", iso: "HR", code: "385" },
    { name: "Cyprus", iso: "CY", code: "357" },
    { name: "Czech Republic", iso: "CZ", code: "420" },
    { name: "Denmark", iso: "DK", code: "45" },
    { name: "Dominican Republic", iso: "DO", code: "1" },
    { name: "Ecuador", iso: "EC", code: "593" },
    { name: "Egypt", iso: "EG", code: "20" },
    { name: "El Salvador", iso: "SV", code: "503" },
    { name: "Estonia", iso: "EE", code: "372" },
    { name: "Ethiopia", iso: "ET", code: "251" },
    { name: "Fiji", iso: "FJ", code: "679" },
    { name: "Finland", iso: "FI", code: "358" },
    { name: "France", iso: "FR", code: "33" },
    { name: "Georgia", iso: "GE", code: "995" },
    { name: "Germany", iso: "DE", code: "49" },
    { name: "Ghana", iso: "GH", code: "233" },
    { name: "Greece", iso: "GR", code: "30" },
    { name: "Guatemala", iso: "GT", code: "502" },
    { name: "Honduras", iso: "HN", code: "504" },
    { name: "Hong Kong", iso: "HK", code: "852" },
    { name: "Hungary", iso: "HU", code: "36" },
    { name: "Iceland", iso: "IS", code: "354" },
    { name: "India", iso: "IN", code: "91" },
    { name: "Indonesia", iso: "ID", code: "62" },
    { name: "Iran", iso: "IR", code: "98" },
    { name: "Iraq", iso: "IQ", code: "964" },
    { name: "Ireland", iso: "IE", code: "353" },
    { name: "Israel", iso: "IL", code: "972" },
    { name: "Italy", iso: "IT", code: "39" },
    { name: "Jamaica", iso: "JM", code: "1" },
    { name: "Japan", iso: "JP", code: "81" },
    { name: "Jordan", iso: "JO", code: "962" },
    { name: "Kazakhstan", iso: "KZ", code: "7" },
    { name: "Kenya", iso: "KE", code: "254" },
    { name: "Kuwait", iso: "KW", code: "965" },
    { name: "Kyrgyzstan", iso: "KG", code: "996" },
    { name: "Laos", iso: "LA", code: "856" },
    { name: "Latvia", iso: "LV", code: "371" },
    { name: "Lebanon", iso: "LB", code: "961" },
    { name: "Libya", iso: "LY", code: "218" },
    { name: "Lithuania", iso: "LT", code: "370" },
    { name: "Luxembourg", iso: "LU", code: "352" },
    { name: "Macau", iso: "MO", code: "853" },
    { name: "Madagascar", iso: "MG", code: "261" },
    { name: "Malaysia", iso: "MY", code: "60" },
    { name: "Maldives", iso: "MV", code: "960" },
    { name: "Malta", iso: "MT", code: "356" },
    { name: "Mauritius", iso: "MU", code: "230" },
    { name: "Mexico", iso: "MX", code: "52" },
    { name: "Moldova", iso: "MD", code: "373" },
    { name: "Monaco", iso: "MC", code: "377" },
    { name: "Mongolia", iso: "MN", code: "976" },
    { name: "Montenegro", iso: "ME", code: "382" },
    { name: "Morocco", iso: "MA", code: "212" },
    { name: "Mozambique", iso: "MZ", code: "258" },
    { name: "Myanmar", iso: "MM", code: "95" },
    { name: "Namibia", iso: "NA", code: "264" },
    { name: "Nepal", iso: "NP", code: "977" },
    { name: "Netherlands", iso: "NL", code: "31" },
    { name: "New Zealand", iso: "NZ", code: "64" },
    { name: "Nicaragua", iso: "NI", code: "505" },
    { name: "Nigeria", iso: "NG", code: "234" },
    { name: "North Macedonia", iso: "MK", code: "389" },
    { name: "Norway", iso: "NO", code: "47" },
    { name: "Oman", iso: "OM", code: "968" },
    { name: "Pakistan", iso: "PK", code: "92" },
    { name: "Palestine", iso: "PS", code: "970" },
    { name: "Panama", iso: "PA", code: "507" },
    { name: "Papua New Guinea", iso: "PG", code: "675" },
    { name: "Paraguay", iso: "PY", code: "595" },
    { name: "Peru", iso: "PE", code: "51" },
    { name: "Philippines", iso: "PH", code: "63" },
    { name: "Poland", iso: "PL", code: "48" },
    { name: "Portugal", iso: "PT", code: "351" },
    { name: "Qatar", iso: "QA", code: "974" },
    { name: "Romania", iso: "RO", code: "40" },
    { name: "Russia", iso: "RU", code: "7" },
    { name: "Rwanda", iso: "RW", code: "250" },
    { name: "Saudi Arabia", iso: "SA", code: "966" },
    { name: "Senegal", iso: "SN", code: "221" },
    { name: "Serbia", iso: "RS", code: "381" },
    { name: "Singapore", iso: "SG", code: "65" },
    { name: "Slovakia", iso: "SK", code: "421" },
    { name: "Slovenia", iso: "SI", code: "386" },
    { name: "South Africa", iso: "ZA", code: "27" },
    { name: "South Korea", iso: "KR", code: "82" },
    { name: "Spain", iso: "ES", code: "34" },
    { name: "Sri Lanka", iso: "LK", code: "94" },
    { name: "Sudan", iso: "SD", code: "249" },
    { name: "Sweden", iso: "SE", code: "46" },
    { name: "Switzerland", iso: "CH", code: "41" },
    { name: "Syria", iso: "SY", code: "963" },
    { name: "Taiwan", iso: "TW", code: "886" },
    { name: "Tajikistan", iso: "TJ", code: "992" },
    { name: "Tanzania", iso: "TZ", code: "255" },
    { name: "Thailand", iso: "TH", code: "66" },
    { name: "Timor-Leste", iso: "TL", code: "670" },
    { name: "Tunisia", iso: "TN", code: "216" },
    { name: "Turkey", iso: "TR", code: "90" },
    { name: "Turkmenistan", iso: "TM", code: "993" },
    { name: "Uganda", iso: "UG", code: "256" },
    { name: "Ukraine", iso: "UA", code: "380" },
    { name: "United Arab Emirates", iso: "AE", code: "971" },
    { name: "United Kingdom", iso: "UK", code: "44" },
    { name: "United States", iso: "US", code: "1" },
    { name: "Uruguay", iso: "UY", code: "598" },
    { name: "Uzbekistan", iso: "UZ", code: "998" },
    { name: "Venezuela", iso: "VE", code: "58" },
    { name: "Vietnam", iso: "VN", code: "84" },
    { name: "Yemen", iso: "YE", code: "967" },
    { name: "Zambia", iso: "ZM", code: "260" },
    { name: "Zimbabwe", iso: "ZW", code: "263" }
  ];

  function renderListKodeNegaraGlass() {
    const listEl = document.getElementById("ccGlassDropdownList");
    const hiddenInput = document.getElementById("bidderCountryCode");
    if (!listEl) return;
    const currentVal = hiddenInput ? hiddenInput.value : "62";

    listEl.innerHTML = DAFTAR_NEGARA_WHATSAPP_AZ.map(c => {
      const isSelected = c.code === currentVal && (currentVal !== "1" || c.iso === "US");
      return `
        <div class="cc-glass-option-item ${isSelected ? 'selected' : ''}" data-action="pick-cc" data-code="${escapeHtml(c.code)}" data-iso="${escapeHtml(c.iso)}">
          <span class="cc-opt-country">${escapeHtml(c.name)} (${escapeHtml(c.iso)})</span>
          <span class="cc-opt-dial">+${escapeHtml(c.code)}</span>
        </div>
      `;
    }).join("");
  }

  function pilihKodeNegaraGlass(kode, iso, ev) {
    if (ev) ev.stopPropagation();
    playClickSound();
    const hiddenInput = document.getElementById("bidderCountryCode");
    const labelEl = document.getElementById("ccGlassSelectedText");
    const wrapEl = document.getElementById("ccGlassSelectWrap");

    if (hiddenInput) hiddenInput.value = kode;
    if (labelEl) {
      const found = DAFTAR_NEGARA_WHATSAPP_AZ.find(c => c.code === String(kode) && (!iso || c.iso === iso)) ||
                    DAFTAR_NEGARA_WHATSAPP_AZ.find(c => c.code === String(kode));
      const isoTag = iso || (found ? found.iso : "ID");
      labelEl.innerText = `${isoTag} +${kode}`;
    }
    if (wrapEl) wrapEl.classList.remove("open");

    const allItems = document.querySelectorAll(".cc-glass-option-item");
    allItems.forEach(el => {
      const match = el.getAttribute("data-code") === String(kode) && (!iso || el.getAttribute("data-iso") === iso);
      el.classList.toggle("selected", match);
    });
  }

  function toggleDropdownKodeNegara(ev) {
    if (ev) ev.stopPropagation();
    playClickSound();
    const wrapEl = document.getElementById("ccGlassSelectWrap");
    const listEl = document.getElementById("ccGlassDropdownList");
    if (!wrapEl || !listEl) return;

    if (!listEl.children.length) {
      renderListKodeNegaraGlass();
    }

    const willOpen = !wrapEl.classList.contains("open");
    wrapEl.classList.toggle("open", willOpen);

    if (willOpen) {
      setTimeout(() => {
        const activeItem = listEl.querySelector(".cc-glass-option-item.selected");
        if (activeItem) {
          activeItem.scrollIntoView({ block: "nearest" });
        }
      }, 20);
    }
  }

  document.addEventListener("click", function(e) {
    const wrapEl = document.getElementById("ccGlassSelectWrap");
    if (wrapEl && !wrapEl.contains(e.target)) {
      wrapEl.classList.remove("open");
    }
  });

  let currentAuthMode = "register";
  let waVerifyPollInterval = null;
  let authSlideTimer = null;

  function hentikanPollingVerifikasiWa() {
    if (waVerifyPollInterval) {
      clearInterval(waVerifyPollInterval);
      waVerifyPollInterval = null;
    }
  }

  function tampilkanNotifWaAuth(pesan, tipe = "error") {
    const box = document.getElementById("authWaInlineNotice");
    if (!box) return;
    box.className = `auth-wa-inline-notice show ${tipe}`;
    box.innerHTML = pesan;
  }

  function sembunyikanNotifWaAuth() {
    const box = document.getElementById("authWaInlineNotice");
    if (!box) return;
    box.className = "auth-wa-inline-notice";
    box.innerHTML = "";
  }

  function gantiModeAuthLelang(mode, tanpaAnimasi = false) {
    if (!tanpaAnimasi) playClickSound();
    currentAuthMode = mode === "login" ? "login" : "register";
    sembunyikanNotifWaAuth();

    const stage = document.getElementById("auctionAuthFormContainer");
    const formHeading = document.getElementById("authFormHeading");
    const formInstruction = document.getElementById("authFormInstruction");
    const submitBtn = document.getElementById("btnSubmitAuthLelang");
    const bottomSwitch = document.getElementById("authBottomSwitch");
    const overlayContent = document.getElementById("authOverlayContent");
    const overlayTitle = document.getElementById("authOverlayTitle");
    const overlayDesc = document.getElementById("authOverlayDesc");
    const overlayBtn = document.getElementById("authOverlayBtn");

    if (stage) {
      stage.classList.toggle("mode-login", currentAuthMode === "login");
      stage.classList.toggle("mode-register", currentAuthMode !== "login");
    }

    const terapkanTeksMode = () => {
      if (currentAuthMode === "login") {
        if (formHeading) formHeading.innerText = "Masuk Akun";
        if (formInstruction) {
          formInstruction.innerText = "Masukkan email dan nomor WhatsApp yang sudah Anda daftarkan sebelumnya.";
        }
        if (submitBtn) submitBtn.innerText = "Masuk";
        if (bottomSwitch) {
          bottomSwitch.innerHTML = `Belum punya akun? <a onclick="gantiModeAuthLelang('register')">Daftar</a>`;
        }
        if (overlayTitle) overlayTitle.innerHTML = "HALO,<br>ABANGDA!";
        if (overlayDesc) {
          overlayDesc.innerText = "Belum memiliki akun peserta lelang? Daftar sekarang untuk mulai mengikuti lelang VIP.";
        }
        if (overlayBtn) {
          overlayBtn.innerText = "Daftar Akun →";
          overlayBtn.setAttribute("onclick", "gantiModeAuthLelang('register')");
        }
      } else {
        if (formHeading) formHeading.innerText = "Daftar Akun";
        if (formInstruction) {
          formInstruction.innerText = "Lengkapi nama, email, dan nomor WhatsApp aktif (contoh: 812345678) untuk mendaftar akun peserta lelang baru.";
        }
        if (submitBtn) submitBtn.innerText = "Daftar Sekarang";
        if (bottomSwitch) {
          bottomSwitch.innerHTML = `Sudah punya akun? <a onclick="gantiModeAuthLelang('login')">Masuk</a>`;
        }
        if (overlayTitle) overlayTitle.innerHTML = "SELAMAT<br>DATANG!";
        if (overlayDesc) {
          overlayDesc.innerText = "Sudah terdaftar sebagai peserta lelang? Silakan masuk menggunakan akun Anda.";
        }
        if (overlayBtn) {
          overlayBtn.innerText = "Masuk →";
          overlayBtn.setAttribute("onclick", "gantiModeAuthLelang('login')");
        }
      }
    };

    if (tanpaAnimasi) {
      terapkanTeksMode();
      return;
    }

    if (overlayContent) overlayContent.classList.add("auth-content-fading");
    if (formHeading) formHeading.classList.add("auth-content-fading");

    clearTimeout(authSlideTimer);
    authSlideTimer = setTimeout(() => {
      terapkanTeksMode();
      if (overlayContent) overlayContent.classList.remove("auth-content-fading");
      if (formHeading) formHeading.classList.remove("auth-content-fading");
    }, 220);
  }

  function bukaModalOtpLelang(resetKeForm = false, paksaGantiAkun = false) {
    playClickSound();
    hentikanPollingVerifikasiWa();
    sembunyikanNotifWaAuth();
    renderListKodeNegaraGlass();

    document.getElementById("auctionAuthFormContainer").style.display = "flex";
    document.getElementById("auctionWaitingWaBox").style.display = "none";
    document.getElementById("auctionVerifiedSuccessBox").style.display = "none";

    const existing = getVerifiedBidder();

    if (existing && !paksaGantiAkun) {
      const ccVal = existing.cc || "62";
      pilihKodeNegaraGlass(ccVal, null, null);
      const savedWa = String(existing.wa || "");
      document.getElementById("bidderWaInput").value = savedWa.startsWith(ccVal) ? savedWa.slice(ccVal.length) : savedWa;
      document.getElementById("bidderNameInput").value = existing.nama || "";
      document.getElementById("bidderEmailInput").value = existing.email || "";
      gantiModeAuthLelang("login", true);
    } else {
      if (paksaGantiAkun) {
        pilihKodeNegaraGlass("62", "ID", null);
        document.getElementById("bidderWaInput").value = "";
        document.getElementById("bidderNameInput").value = "";
        document.getElementById("bidderEmailInput").value = "";
      }
      gantiModeAuthLelang("register", true);
    }

    document.body.classList.add("modal-open-lock");
    document.documentElement.classList.add("modal-open-lock");
    document.getElementById("auctionOtpModal").classList.add("open");
  }

  function tutupModalOtpLelang() {
    playClickSound();
    hentikanPollingVerifikasiWa();
    sembunyikanNotifWaAuth();
    document.body.classList.remove("modal-open-lock");
    document.documentElement.classList.remove("modal-open-lock");
    document.getElementById("auctionOtpModal").classList.remove("open");
  }

  function kembaliKeFormAuthLelang() {
    playClickSound();
    hentikanPollingVerifikasiWa();
    sembunyikanNotifWaAuth();
    document.getElementById("auctionWaitingWaBox").style.display = "none";
    document.getElementById("auctionVerifiedSuccessBox").style.display = "none";
    document.getElementById("auctionAuthFormContainer").style.display = "flex";
  }

  function tampilkanModalBlokirBNR(noWa) {
    const linkEl = document.getElementById("btnAppealWaBlock");
    const pesan = `Halo Admin CUPANG KASEP, nomor WhatsApp saya (${noWa}) terdeteksi diblokir pada sistem lelang karena terdeteksi pernah melakukan BNR. Mohon informasinya untuk pengajuan pembukaan blokir. Terima kasih.`;
    if (linkEl) linkEl.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
    document.getElementById("auctionBlockedModal").classList.add("open");
  }

  async function submitFormVerifikasiLelang() {
    playClickSound();
    sembunyikanNotifWaAuth();

    const isRegister = currentAuthMode === "register";
    const namaInput = document.getElementById("bidderNameInput").value.trim();
    const emailInput = document.getElementById("bidderEmailInput").value.trim().toLowerCase();
    const kodeNegara = dapatkanKodeNegaraTerpilih();
    const waRaw = document.getElementById("bidderWaInput").value.trim();
    const digitsOnly = waRaw.replace(/[^0-9]/g, "");
    const waClean = normalisasiNomorWA(waRaw, kodeNegara);

    // 1. Validasi Input Form (Ditampilkan langsung di bawah kolom No WA tanpa pop-up alert)
    if (isRegister && (!namaInput || namaInput.length < 2)) {
      tampilkanNotifWaAuth("⚠️ Mohon isi Nama Lengkap atau Nama Panggilan Anda (minimal 2 karakter).", "warning");
      document.getElementById("bidderNameInput").focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput)) {
      tampilkanNotifWaAuth("⚠️ Mohon masukkan Alamat Email yang valid (contoh: nama@email.com).", "warning");
      document.getElementById("bidderEmailInput").focus();
      return;
    }

    if (!digitsOnly || !/^[1-9][0-9]{7,14}$/.test(waClean)) {
      tampilkanNotifWaAuth("⚠️ Mohon masukkan Nomor WhatsApp aktif yang valid sesuai kode negara.", "warning");
      document.getElementById("bidderWaInput").focus();
      return;
    }

    // KHUSUS OWNER / ADMIN RESMI: Langsung aktifkan sesi Admin tanpa harus menunggu antrean bot WA
    const akunAdminCocok = dapatkanAkunAdmin(emailInput, waClean);
    if (akunAdminCocok) {
      const namaAdmin = akunAdminCocok.nama;
      saveVerifiedBidder({
        nama: namaAdmin,
        email: emailInput,
        wa: waClean,
        cc: kodeNegara,
        isAdmin: true,
        verifiedAt: dapatkanTanggalSekarang()
      });
      tutupModalOtpLelang();
      tampilkanToast(`👑 Selamat Datang, ${namaAdmin}!`);
      if (currentOpenDetailCode) {
        bukaDetailProduk(currentOpenDetailCode, false);
      }
      setTimeout(() => bukaModalAdminHub(), 220);
      return;
    }

    // 2. Kirim inisialisasi verifikasi ke Google Apps Script
    const btn = document.getElementById("btnSubmitAuthLelang");
    const teksAsliBtn = btn.innerText;
    btn.disabled = true;
    btn.innerText = "⏳ Memvalidasi Data...";

    const res = await kirimKeGoogleSheets({
      action: "auction_init_verify",
      mode: currentAuthMode,
      nama: isRegister ? namaInput : "",
      email: emailInput,
      wa: waClean,
      countryCode: kodeNegara
    });

    btn.disabled = false;
    btn.innerText = teksAsliBtn;

    if (!res) {
      tampilkanNotifWaAuth("⚠️ Gagal terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.", "error");
      return;
    }

    if (res.status === "blocked") {
      tutupModalOtpLelang();
      tampilkanModalBlokirBNR(waClean);
      return;
    }

    // 3. Jika berada di menu Daftar Akun tetapi Nomor WA / Email sudah terdaftar
    if (isRegister && (res.status === "already_verified" || res.status === "already_registered" || res.status === "exists" || res.status === "mismatch")) {
      tampilkanNotifWaAuth(
        `⚠️ Nomor WhatsApp atau Email ini sudah terdaftar! Silakan <u style="cursor:pointer; color:#fff;" onclick="gantiModeAuthLelang('login')">klik di sini untuk Masuk</u>.`,
        "warning"
      );
      return;
    }

    // 4. Jika di menu Masuk Akun namun Email atau Nomor WA tidak cocok
    if (res.status === "mismatch") {
      tampilkanNotifWaAuth("❌ " + (res.message || "Email atau Nomor WhatsApp Anda salah / tidak sesuai!"), "error");
      return;
    }

    // 5. Jika di menu Masuk Akun namun Nomor WA & Email belum terdaftar sama sekali
    if (res.status === "not_found") {
      tampilkanNotifWaAuth(
        `⚠️ Nomor WhatsApp dan Email belum terdaftar. Silakan <u style="cursor:pointer; color:#fff;" onclick="gantiModeAuthLelang('register')">daftar akun baru</u>.`,
        "warning"
      );
      return;
    }

    if (res.status === "error") {
      tampilkanNotifWaAuth("⚠️ " + escapeHtml(res.message || "Terjadi kesalahan saat memproses data."), "error");
      return;
    }

    // 2B. JIKA NO WA & EMAIL SERASI (ATAU DATA LAMA TAMBAH EMAIL) -> LANGSUNG LOGIN TANPA KIRIM WA
    if (res.status === "already_verified_email_updated" || res.status === "already_verified") {
      const namaFinalLama = (res.nama && res.nama !== "-") ? res.nama : (namaInput || "Peserta");
      const tokenFinalLama = res.token || "VERIFIED";
      const isEmailBaruDitautkan = res.status === "already_verified_email_updated";

      saveVerifiedBidder({
        nama: namaFinalLama,
        wa: res.wa || waClean,
        email: res.email || emailInput,
        cc: kodeNegara,
        token: tokenFinalLama
      });

      document.getElementById("auctionAuthFormContainer").style.display = "none";
      document.getElementById("auctionWaitingWaBox").style.display = "none";
      const welcomeEl = document.getElementById("waVerifiedWelcomeText");
      if (welcomeEl) {
        welcomeEl.innerText = isEmailBaruDitautkan
          ? `Email berhasil ditautkan! Selamat datang kembali, ${namaFinalLama}.`
          : `Login berhasil! Selamat datang kembali, ${namaFinalLama}.`;
      }
      document.getElementById("auctionVerifiedSuccessBox").style.display = "block";
      tampilkanToast(isEmailBaruDitautkan ? `✅ Email tersimpan! Halo, ${namaFinalLama}` : `✅ Selamat datang kembali, ${namaFinalLama}!`);

      setTimeout(() => {
        tutupModalOtpLelang();
        if (currentOpenDetailCode) bukaDetailProduk(currentOpenDetailCode, false);
        if (pendingBidAction) {
          const act = pendingBidAction;
          pendingBidAction = null;
          prosesPasangBid(act.kode, act.tipe);
        }
      }, 900);
      return;
    }

    // 3. Siapkan Format Pesan Inbound WA ke Nomor Bot Fonnte (6285111761840) & Tampilkan Layar Penantian
    const namaBersih = (isRegister ? namaInput : (res.nama || "Peserta"))
      .replace(/[\r\n\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const kodeUnikPesan = Math.floor(1000 + Math.random() * 9000);
    const formatPesanWa = isRegister
      ? `VERIFY-REGISTER-${namaBersih}-${emailInput}-${waClean}-${kodeUnikPesan}`
      : `VERIFY-LOGIN-${emailInput}-${waClean}-${kodeUnikPesan}`;

    const nomorBotFonnte = String(CONFIG.FONNTE_WA_NUMBER || "6285111761840").replace(/[^0-9]/g, "");
    const linkWa = `https://api.whatsapp.com/send?phone=${nomorBotFonnte}&text=${encodeURIComponent(formatPesanWa)}`;
    const btnWaEl = document.getElementById("btnOpenWaInbound");
    const previewEl = document.getElementById("waVerifyMessagePreview");

    if (btnWaEl) btnWaEl.href = linkWa;
    if (previewEl) previewEl.innerText = formatPesanWa;

    document.getElementById("auctionAuthFormContainer").style.display = "none";
    document.getElementById("auctionVerifiedSuccessBox").style.display = "none";
    document.getElementById("auctionWaitingWaBox").style.display = "block";

    // 4. Mulai Polling setiap 3 detik untuk mengecek apakah pesan WA sudah diterima server
    mulaiPollingStatusVerifikasi(waClean, emailInput, namaBersih, kodeNegara);
  }

  let sedangCekStatusWa = false;
  let listenerVisibilityWa = null;

  function mulaiPollingStatusVerifikasi(waClean, emailInput, fallbackNama, kodeNegara) {
    hentikanPollingVerifikasiWa();
    sedangCekStatusWa = false;

    const cekStatusKeServer = async () => {
      if (sedangCekStatusWa) return;
      const waitingBox = document.getElementById("auctionWaitingWaBox");
      if (!waitingBox || waitingBox.style.display === "none") {
        hentikanPollingVerifikasiWa();
        return;
      }

      sedangCekStatusWa = true;
      try {
        const resPoll = await kirimKeGoogleSheets({
          action: "auction_check_status",
          wa: waClean,
          email: emailInput,
          mode: currentAuthMode
        });

        if (!resPoll) return;

        if (resPoll.status === "blocked") {
          hentikanPollingVerifikasiWa();
          tutupModalOtpLelang();
          tampilkanModalBlokirBNR(waClean);
          return;
        }

        if (resPoll.status === "verified") {
          hentikanPollingVerifikasiWa();
          if (listenerVisibilityWa) {
            document.removeEventListener("visibilitychange", listenerVisibilityWa);
            window.removeEventListener("focus", listenerVisibilityWa);
            listenerVisibilityWa = null;
          }

          const namaFinal = (resPoll.nama && resPoll.nama !== "-") ? resPoll.nama : (fallbackNama || "Peserta");
          const waFinal = resPoll.wa || waClean;
          const emailFinal = (resPoll.email && resPoll.email !== "-") ? resPoll.email : emailInput;
          const tokenFinal = resPoll.token || "VERIFIED";

          saveVerifiedBidder({
            nama: namaFinal,
            wa: waFinal,
            email: emailFinal,
            cc: kodeNegara,
            token: tokenFinal
          });

          // Tampilkan layar sukses centang hijau
          document.getElementById("auctionWaitingWaBox").style.display = "none";
          const welcomeEl = document.getElementById("waVerifiedWelcomeText");
          if (welcomeEl) {
            welcomeEl.innerText = `Selamat datang, ${namaFinal}! Akun Anda telah terverifikasi.`;
          }
          document.getElementById("auctionVerifiedSuccessBox").style.display = "block";
          tampilkanToast(`✅ Verifikasi WA berhasil! Halo, ${namaFinal}`);

          setTimeout(() => {
            tutupModalOtpLelang();
            if (currentOpenDetailCode) bukaDetailProduk(currentOpenDetailCode, false);
            if (pendingBidAction) {
              const act = pendingBidAction;
              pendingBidAction = null;
              prosesPasangBid(act.kode, act.tipe);
            }
          }, 1100);
        }
      } finally {
        sedangCekStatusWa = false;
      }
    };

    // Otomatis cek seketika saat user kembali dari aplikasi WhatsApp ke browser
    if (listenerVisibilityWa) {
      document.removeEventListener("visibilitychange", listenerVisibilityWa);
      window.removeEventListener("focus", listenerVisibilityWa);
    }
    listenerVisibilityWa = () => {
      if (!document.hidden) cekStatusKeServer();
    };
    document.addEventListener("visibilitychange", listenerVisibilityWa);
    window.addEventListener("focus", listenerVisibilityWa);

    cekStatusKeServer();
    waVerifyPollInterval = setInterval(cekStatusKeServer, 3000);
  }

  // Eksekusi Pasang Penawaran / Buy It Now
  async function prosesPasangBid(kodeProduk, tipeBid = "BID") {
    playClickSound();
    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (!item) return;

    if (apakahLelangBelumMulai(item.startTime)) {
      tampilkanDialogModal("Lelang belum dimulai. Silakan tunggu hingga jadwal mulai tiba.", {
        title: "Jadwal Lelang",
        icon: "◈"
      });
      return;
    }

    const bidder = getVerifiedBidder();
    if (!bidder || !bidder.wa) {
      pendingBidAction = { kode: item.kode, tipe: tipeBid };
      bukaModalOtpLelang(true);
      return;
    }

    const currentHighest = item.currentBid > 0 ? item.currentBid : 0;
    const minNextBid = currentHighest > 0 ? (currentHighest + item.kb) : item.ob;
    let nominalTawaran = minNextBid;

    if (tipeBid === "BIN") {
      nominalTawaran = item.bin;
      const konfirmBin = await tampilkanKonfirmasiModal(
        `Anda yakin ingin menebus langsung [${item.kode}] ${item.nama} seharga ${formatRupiah(nominalTawaran)}?\n\nLelang akan langsung ditutup untuk Anda.`,
        { title: "Konfirmasi Buy It Now", icon: "✦", okText: "Ya, Tebus BIN", cancelText: "Batal" }
      );
      if (!konfirmBin) return;
    } else {
      const inputEl = document.getElementById("customBidInput_" + item.kode);
      nominalTawaran = inputEl ? Number(inputEl.value) : minNextBid;

      if (isNaN(nominalTawaran) || nominalTawaran < minNextBid) {
        tampilkanToast(`⚠️ Minimal penawaran berikutnya adalah ${formatRupiah(minNextBid)}`);
        return;
      }
      if (item.bin > 0 && nominalTawaran >= item.bin) {
        tipeBid = "BIN";
        nominalTawaran = item.bin;
      }
    }

    const btnBid = document.getElementById("btnSubmitBid_" + item.kode);
    if (btnBid) {
      btnBid.disabled = true;
      btnBid.innerText = "⏳ Memproses Bid...";
    }

    const res = await kirimKeGoogleSheets({
      action: "auction_place_bid",
      sheet: CONFIG.AUCTION_SHEET_NAME,
      kode: item.kode,
      nama: bidder.nama,
      wa: bidder.wa,
      email: bidder.email || "",
      token: bidder.token,
      nominal: nominalTawaran,
      tipe: tipeBid,
      antiSnipeMinutes: CONFIG.ANTI_SNIPE_MINUTES
    });

    if (btnBid) {
      btnBid.disabled = false;
      btnBid.innerText = "Pasang Penawaran";
    }

    if (!res) {
      tampilkanDialogModal("Gagal mengirim penawaran. Periksa koneksi internet Anda lalu coba lagi.", {
        title: "Koneksi Gagal",
        icon: "✕"
      });
      return;
    }

    if (res.status === "blocked") {
      tampilkanModalBlokirBNR(bidder.wa);
      return;
    }

    if (res.status === "unverified") {
      localStorage.removeItem(STORAGE_KEY_BIDDER);
      pendingBidAction = { kode: item.kode, tipe: tipeBid };
      bukaModalOtpLelang(true);
      return;
    }

    if (res.status === "outbid" || res.status === "ended") {
      await segarkanDataKatalogSenyap();
      bukaDetailProduk(item.kode, false);
      tampilkanDialogModal(res.message || "Harga lelang telah berubah, silakan periksa nominal terbaru.", {
        title: "Pembaruan Lelang",
        icon: "◈"
      });
      return;
    }

    if (res.status === "ok") {
      await segarkanDataKatalogSenyap();
      bukaDetailProduk(item.kode, false);
      tampilkanToast(tipeBid === "BIN" ? "🏆 Selamat! Anda memenangkan BIN lelang ini!" : "✅ Tawaran Anda berhasil masuk memimpin lelang!");
    }
  }

  /* =========================================================
     6. SISTEM AUTO-FORCE REFRESH RINGAN BERBASIS version.json
     ========================================================= */
  let initialWebVersion = null;
  let isCheckingWebUpdate = false;
  let lastWebUpdateCheckAt = 0;

  async function cekUpdateWebOtomatis() {
    // Lewati jika dibuka dari file lokal komputer (file://) atau sedang memutar roda roulette
    if (window.location.protocol === "file:" || isCheckingWebUpdate || isWheelSpinning) return;
    isCheckingWebUpdate = true;
    lastWebUpdateCheckAt = Date.now();

    try {
      const res = await fetch("version.json?_t=" + Date.now(), {
        method: "GET",
        cache: "no-store"
      });

      if (!res.ok) return;
      const dataVer = await res.json();
      const versiTerbaru = dataVer && dataVer.v ? String(dataVer.v).trim() : "";
      if (!versiTerbaru) return;

      if (!initialWebVersion) {
        initialWebVersion = versiTerbaru;
      } else if (versiTerbaru !== initialWebVersion) {
        tampilkanToast("🔄 Update web terbaru terdeteksi, memuat ulang halaman...");
        setTimeout(() => {
          const baseUrl = window.location.pathname + window.location.hash;
          window.location.replace(baseUrl);
          window.location.reload();
        }, 600);
      }
    } catch (e) {
      // Abaikan jika koneksi terputus sementara atau version.json belum tersedia
    } finally {
      isCheckingWebUpdate = false;
    }
  }

  function mulaiPemantauUpdateWeb() {
    cekUpdateWebOtomatis();
    // Cek otomatis setiap 3 menit (180.000 ms) menggunakan file version.json yang sangat ringan
    setInterval(cekUpdateWebOtomatis, 180000);
    // Saat user kembali ke tab setelah minimal 60 detik, cek sekali
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden && (Date.now() - lastWebUpdateCheckAt >= 60000)) {
        cekUpdateWebOtomatis();
      }
    });
  }

  // Sensor Scroll HP: Mengecilkan navbar bawah & membuat keranjang bulat mengikuti gerakan turun-naik navbar
  function inisialisasiScrollNavbarHP() {
    let lastScrollY = window.scrollY || 0;
    const navLinks = document.querySelector(".nav-links");
    const topNavbar = document.querySelector(".ck-navbar");
    const floatCartBtn = document.getElementById("floatingCartBtn");
    if (!navLinks) return;

    window.addEventListener("scroll", function() {
      const currentScrollY = window.scrollY || 0;
      const selisihScroll = currentScrollY - lastScrollY;

      // Ubah keranjang menjadi bulat melayang (hanya logo 🛒) setiap kali user scroll di Koleksi CK
      if (floatCartBtn && floatCartBtn.style.display === "flex" && Math.abs(selisihScroll) > 6) {
        floatCartBtn.classList.add("cart-docked");
      }

      // Jika masih di bagian paling atas halaman, kembalikan posisi ke atas normal
      if (currentScrollY <= 40) {
        navLinks.classList.remove("nav-minimized");
        if (floatCartBtn) floatCartBtn.classList.remove("cart-follow-nav");
        if (topNavbar) topNavbar.classList.remove("nav-top-compact");
        lastScrollY = currentScrollY;
        return;
      }

      // Scroll ke bawah (> 8px) -> Navbar mengecil & keranjang ikut bergerak turun seirama (tanpa mengecil)
      if (selisihScroll > 8) {
        navLinks.classList.add("nav-minimized");
        if (floatCartBtn) floatCartBtn.classList.add("cart-follow-nav");
      }
      // Scroll ke atas (< -8px) -> Navbar membesar kembali & keranjang ikut bergerak naik seirama
      else if (selisihScroll < -8) {
        navLinks.classList.remove("nav-minimized");
        if (floatCartBtn) floatCartBtn.classList.remove("cart-follow-nav");
      }

      lastScrollY = currentScrollY;
    }, { passive: true });

    // Jika user menyentuh kapsul navbar saat sedang mengecil, langsung perbesar & naikkan keranjang seirama
    navLinks.addEventListener("touchstart", function() {
      navLinks.classList.remove("nav-minimized");
      if (floatCartBtn) floatCartBtn.classList.remove("cart-follow-nav");
    }, { passive: true });
  }

  function initApp() {
    document.cookie = "googtrans=/id/id; path=/";
    document.cookie = "googtrans=/id/id; path=/; domain=" + location.hostname;

    jalankanIntroSplashTunggal();
    initEventDelegation();
    terapkanStatusSosmedFooter();
    perbaruiTombolAuthHeaderLelang();
    inisialisasiGestureCarouselLayanan();
    inisialisasiTapInstanModal();
    inisialisasiScrollNavbarHP();

    preloadKatalogDiLatar();
    muatKursRealTime();
    muatTestimoniPublik();
    pilihBahasa("id", false);
    cekDirectLinkUrl();
    mulaiPemantauUpdateWeb();

    // Muat modul admin secara senyap hanya jika sesi tersimpan adalah Admin resmi
    if (apakahUserAdmin()) {
      muatModulAdmin();
    }
  }

  window.addEventListener("DOMContentLoaded", initApp);