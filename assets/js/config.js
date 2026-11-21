/* =========================================================
     1. KONFIGURASI UTAMA (TERMASUK TOKEN FONNTE & LELANG)
     ========================================================= */
  const CONFIG = {
    // Token Fonnte dihapus dari frontend demi keamanan (verifikasi berjalan via Inbound Webhook di Apps Script) 

    CATALOG_SHEET_NAME: "KATALOG",
    AUCTION_SHEET_NAME: "Lelang",
    WHATSAPP_NUMBER: "6282121478149",      // Nomor WA Admin Utama (+62 821-2147-8149) untuk Order & Keranjang
    FONNTE_WA_NUMBER: "6285111761840",     // Nomor WA Bot Fonnte khusus pengecekan Verifikasi Lelang
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyN8YzpfaalSg6jbBhubTmwik3ZLOTakvSLDj343290AVGGyB3XKs3hhFpgvfGUEfc/exec",
    PLACEHOLDER_IMAGE: "https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/logo%20ck%20(putih).png",
    START_ON_CATALOG_PAGE: false,
    ANTI_SNIPE_MINUTES: 5, // Perpanjangan waktu otomatis +5 menit jika ada bid di menit-menit terakhir
    ADMIN_ACCOUNTS: [
      { email: "officialcupangkasep@gmail.com", wa: "6285195327282", nama: "ADMIN R" },
      { email: "officialcupangkasep@gmail.com", wa: "6282121478149", nama: "ADMIN N" }
    ]
  };

  const GOOGLE_SCRIPT_URL = CONFIG.APPS_SCRIPT_URL;

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeJsAttr(str) {
    return escapeHtml(
      String(str == null ? "" : str)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
    );
  }

  function sanitizeUrl(url, fallback = "") {
    const clean = String(url || "").trim();
    if (!clean) return fallback;
    if (/^(https?:\/\/|\/|data:image\/)/i.test(clean)) return clean;
    return fallback;
  }

  let activeCkDialogResolver = null;

  function tutupCkDialogModal(hasil = false) {
    playClickSound();
    const modal = document.getElementById("ckDialogModal");
    if (modal) modal.classList.remove("open");
    if (typeof activeCkDialogResolver === "function") {
      const resolveFn = activeCkDialogResolver;
      activeCkDialogResolver = null;
      resolveFn(Boolean(hasil));
    }
  }

  function tampilkanDialogModal(pesan, opsi = {}) {
    return new Promise(resolve => {
      const modal = document.getElementById("ckDialogModal");
      if (!modal) {
        tampilkanToast(pesan);
        resolve(true);
        return;
      }
      if (typeof activeCkDialogResolver === "function") {
        activeCkDialogResolver(false);
      }
      activeCkDialogResolver = resolve;
      document.getElementById("ckDialogIcon").innerText = opsi.icon || "◈";
      document.getElementById("ckDialogTitle").innerText = opsi.title || "Informasi";
      document.getElementById("ckDialogMessage").innerText = String(pesan || "");
      const btnCancel = document.getElementById("ckDialogCancelBtn");
      const btnOk = document.getElementById("ckDialogOkBtn");
      if (btnCancel) btnCancel.style.display = "none";
      if (btnOk) btnOk.innerText = opsi.okText || "Mengerti";
      modal.classList.add("open");
    });
  }

  function tampilkanKonfirmasiModal(pesan, opsi = {}) {
    return new Promise(resolve => {
      const modal = document.getElementById("ckDialogModal");
      if (!modal) {
        resolve(false);
        return;
      }
      if (typeof activeCkDialogResolver === "function") {
        activeCkDialogResolver(false);
      }
      activeCkDialogResolver = resolve;
      document.getElementById("ckDialogIcon").innerText = opsi.icon || "✦";
      document.getElementById("ckDialogTitle").innerText = opsi.title || "Konfirmasi";
      document.getElementById("ckDialogMessage").innerText = String(pesan || "");
      const btnCancel = document.getElementById("ckDialogCancelBtn");
      const btnOk = document.getElementById("ckDialogOkBtn");
      if (btnCancel) {
        btnCancel.style.display = "inline-flex";
        btnCancel.innerText = opsi.cancelText || "Batal";
      }
      if (btnOk) btnOk.innerText = opsi.okText || "Ya, Lanjutkan";
      modal.classList.add("open");
    });
  }

  let isEventDelegationBound = false;

  function initEventDelegation() {
    if (isEventDelegationBound) return;
    isEventDelegationBound = true;

    document.addEventListener("click", function(e) {
      const el = e.target.closest("[data-action]");
      if (!el) return;

      const action = el.dataset.action;
      const kode = el.dataset.kode || "";

      switch (action) {
        case "cart-qty":
          ubahQtyKeranjang(kode, Number(el.dataset.delta) || 0);
          break;
        case "pick-prov":
          pilihProvinsiOngkirGlass(el.dataset.prov || "");
          break;
        case "pick-city":
          pilihKotaOngkirGlass(el.dataset.label || "", el.dataset.cityId || "", el.dataset.prov || "");
          break;
        case "slide-card":
          geserSlideKartu(e, kode, Number(el.dataset.dir) || 1);
          break;
        case "card-thumb-detail":
          klikKartuBukaDetail(e, kode);
          break;
        case "open-detail":
          bukaDetailProduk(kode);
          break;
        case "add-cart":
          tambahKeKeranjang(kode);
          break;
        case "slide-detail":
          geserMediaDetail(e, Number(el.dataset.dir) || 1);
          break;
        case "zoom-img":
          if (el.dataset.checkDrag === "1" && isDraggingSliderPC) return;
          bukaZoom(el.dataset.url || "");
          break;
        case "pick-thumb":
          gantiFotoDetail(Number(el.dataset.index) || 0, el);
          break;
        case "share-product":
          bagikanLinkProduk(kode);
          break;
        case "bid-step":
          ubahNominalInputBid(kode, Number(el.dataset.delta) || 0);
          break;
        case "place-bid":
          prosesPasangBid(kode, el.dataset.tipe || "BID");
          break;
        case "open-profile-auction":
          bukaLelangDariProfile(kode);
          break;
        case "pick-cc":
          pilihKodeNegaraGlass(el.dataset.code || "62", el.dataset.iso || "ID", e);
          break;
        case "admin-rollback":
          if (typeof adminRollbackBidTertentu === "function") {
            adminRollbackBidTertentu(kode, Number(el.dataset.index));
          }
          break;
        case "admin-toggle-auction":
          if (typeof adminToggleTutupLelang === "function") {
            adminToggleTutupLelang(kode);
          }
          break;
        case "admin-view-auction":
          tutupModalAdminHub();
          bukaLelangDariProfile(kode);
          break;
        case "admin-save-schedule":
          if (typeof adminSimpanJadwalLelang === "function") {
            adminSimpanJadwalLelang(kode);
          }
          break;
        case "admin-unblock-bnr":
          if (typeof adminBukaBlokirBNR === "function") {
            adminBukaBlokirBNR(el.dataset.wa || "");
          }
          break;
        case "admin-stock-delta":
          if (typeof adminUbahStokCepat === "function") {
            adminUbahStokCepat(kode, Number(el.dataset.delta) || 0);
          }
          break;
        case "admin-toggle-stock":
          if (typeof adminToggleStatusKoleksi === "function") {
            adminToggleStatusKoleksi(kode);
          }
          break;
        case "admin-edit-item":
          if (typeof adminIsiFormEditKoleksi === "function") {
            adminIsiFormEditKoleksi(kode);
          }
          break;
        case "admin-copy-voucher":
          if (navigator.clipboard) navigator.clipboard.writeText(kode).catch(() => {});
          tampilkanToast("📋 Kode " + kode + " disalin!");
          break;
        case "admin-view-cert":
          tutupModalAdminHub();
          bukaHalamanVerifikasi();
          document.getElementById("certInput").value = kode;
          cariSertifikat();
          break;
        case "admin-toggle-claim":
          if (typeof toggleStatusKlaimPemenang === "function") {
            toggleStatusKlaimPemenang(kode);
          }
          break;
        case "admin-add-testi-quota":
          if (typeof adminTambahKuotaCepat === "function") {
            adminTambahKuotaCepat(el.dataset.wa || "", el.dataset.nama || "Kolektor");
          }
          break;
        case "admin-toggle-testi":
          if (typeof adminToggleStatusTesti === "function") {
            adminToggleStatusTesti(el.dataset.id || "", el.dataset.status || "HIDDEN");
          }
          break;
        case "admin-delete-testi":
          if (typeof adminHapusTesti === "function") {
            adminHapusTesti(el.dataset.id || "");
          }
          break;
      }
    });

    const catalogGridEl = document.getElementById("catalogGrid");
    if (catalogGridEl) {
      catalogGridEl.addEventListener("scroll", function(e) {
        const track = e.target && e.target.closest ? e.target.closest("[data-slider-kode]") : null;
        if (track) updateDotsKartu(track.dataset.sliderKode);
      }, true);

      catalogGridEl.addEventListener("mousedown", function(e) {
        const track = e.target && e.target.closest ? e.target.closest("[data-slider-kode]") : null;
        if (track) mulaiDragSliderPC(e, track);
      });
    }
  }

  const FALLBACK_CATALOG_DATA = [
    {
      kode: "CK-001",
      nama: "Betta Plakat Yellow Koi Copper",
      kategori: "Ikan Cupang",
      spesies: "Betta Splendens",
      jenis: "Yellow Koi Copper",
      harga: 250000,
      foto: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80, https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80",
      deskripsi: "Size M+, mutasi warna solid, ring copper tebal dan mental agresif.",
      stok: 1,
      status: "Tersedia"
    },
  ];

  // Dynamic Lazy-Loader untuk modul Admin (tidak pernah diunduh pengunjung biasa)
  let adminModulePromise = null;

  function muatModulAdmin() {
    if (typeof apakahUserAdmin !== "function" || !apakahUserAdmin()) {
      return Promise.resolve(false);
    }
    if (window.__CK_ADMIN_LOADED__) {
      return Promise.resolve(true);
    }
    if (adminModulePromise) {
      return adminModulePromise;
    }

    adminModulePromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "assets/js/admin.js";
      script.async = true;
      script.onload = function() {
        window.__CK_ADMIN_LOADED__ = true;
        resolve(true);
      };
      script.onerror = function() {
        adminModulePromise = null;
        if (typeof tampilkanToast === "function") {
          tampilkanToast("⚠️ Gagal memuat modul Admin");
        }
        resolve(false);
      };
      document.body.appendChild(script);
    });

    return adminModulePromise;
  }

  async function bukaModalAdminHub() {
    if (!apakahUserAdmin()) {
      tampilkanToast("⚠️ Akses khusus Admin Resmi");
      return;
    }
    await muatModulAdmin();
    navigasiMenuAtas("admin");
  }

  function tutupModalAdminHub() {
    document.body.classList.remove("modal-open-lock");
    document.documentElement.classList.remove("modal-open-lock");
  }
