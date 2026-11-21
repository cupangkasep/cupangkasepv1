/* =========================================================
     TAMBAHAN: FUNGSI KERANJANG BELANJA & VIEW COUNTER
     ========================================================= */
  const STORAGE_KEY_CART = "ck_shopping_cart_v1";
  const SESSION_KEY_VIEWS = "ck_viewed_items_session";
  const HOT_VIEWS_THRESHOLD = 50;

  function getCartItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CART)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCartItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (e) {}
    perbaruiTombolKeranjangMelayang();
  }

  function perbaruiTombolKeranjangMelayang() {
    const floatBtn = document.getElementById("floatingCartBtn");
    const countEl = document.getElementById("floatingCartCount");
    const labelEl = document.getElementById("floatingCartLabel");
    if (!floatBtn || !countEl) return;

    const cart = getCartItems();
    const totalQty = cart.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);
    countEl.innerText = totalQty;

    if (labelEl) {
      labelEl.innerText = USER_LANG === "en" ? "Cart" : (USER_LANG === "zh" ? "购物车" : "Keranjang");
    }

    // Hanya muncul jika berada di halaman Koleksi CK (bukan Lelang & bukan halaman lain)
    const isCatalogVisible = document.getElementById("catalogPage").style.display === "block";
    const isNotAuction = currentCategoryFilter !== "Lelang";
    floatBtn.style.display = (isCatalogVisible && isNotAuction) ? "flex" : "none";
  }

  function tambahKeKeranjang(kodeProduk) {
    playClickSound();
    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (!item) return;

    const isHabis = item.stok <= 0 || item.status.toLowerCase() === "habis";
    if (isHabis) {
      tampilkanToast("Stok produk ini sedang habis");
      return;
    }

    const cart = getCartItems();
    const existingIdx = cart.findIndex(c => c.kode.toUpperCase() === item.kode.toUpperCase());
    const isIkan = item.kategori.toLowerCase().includes("ikan");
    const maxStok = isIkan ? 1 : Math.max(1, item.stok);

    if (existingIdx !== -1) {
      if (cart[existingIdx].qty >= maxStok) {
        tampilkanToast(isIkan ? "Spesimen koleksi ini hanya 1 ekor & sudah ada di keranjang" : "Jumlah sudah mencapai batas stok");
        bukaModalKeranjang();
        return;
      }
      cart[existingIdx].qty += 1;
    } else {
      const daftarMedia = dapatkanArrayMedia(item.foto);
      const mediaSampul = daftarMedia.find(m => m.type === "image") || daftarMedia[0];
      cart.push({
        kode: item.kode,
        nama: item.nama,
        kategori: item.kategori,
        harga: item.harga,
        stokMax: maxStok,
        thumb: mediaSampul.thumbUrl,
        qty: 1
      });
    }

    saveCartItems(cart);
    const floatBtn = document.getElementById("floatingCartBtn");
    if (floatBtn) floatBtn.classList.remove("cart-docked");
    tampilkanToast(`✦ [${item.kode}] ditambahkan ke keranjang`);
  }

  function ubahQtyKeranjang(kodeProduk, delta) {
    playClickSound();
    let cart = getCartItems();
    const idx = cart.findIndex(c => c.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (idx === -1) return;

    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
      cart.splice(idx, 1);
    } else if (newQty > cart[idx].stokMax) {
      tampilkanToast("⚠️ Maksimal stok: " + cart[idx].stokMax);
      return;
    } else {
      cart[idx].qty = newQty;
    }

    saveCartItems(cart);
    renderIsiModalKeranjang();
  }

  function kosongkanKeranjang() {
    playClickSound();
    saveCartItems([]);
    renderIsiModalKeranjang();
    tampilkanToast("🗑️ Keranjang dikosongkan");
  }

  async function bukaModalKeranjang() {
    playClickSound();
    const floatBtn = document.getElementById("floatingCartBtn");

    // Jika di HP keranjang sedang bersembunyi di kanan (hanya logo), klik pertama memunculkan bentuk aslinya dulu
    if (floatBtn && window.innerWidth <= 1024 && floatBtn.classList.contains("cart-docked")) {
      floatBtn.classList.remove("cart-docked");
      return;
    }

    renderIsiModalKeranjang();
    document.getElementById("cartModal").classList.add("open");

    // Otomatis cek stok terbaru ke Google Sheets setiap kali keranjang dibuka
    const cart = getCartItems();
    if (cart.length > 0) {
      await validasiStokKeranjangOtomatis();
    }
  }

  const STORAGE_KEY_CATALOG_CACHE = "ck_catalog_cache_v1";
  const CATALOG_CACHE_TTL_MS = 30 * 60 * 1000; // 30 menit cache instan di browser
  let catalogFetchPromise = null;

  function simpanCacheKatalogLokal(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY_CATALOG_CACHE, JSON.stringify({
        ts: Date.now(),
        items: items
      }));
    } catch (e) {}
  }

  function muatCacheKatalogLokal() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_CATALOG_CACHE));
      if (!raw || !Array.isArray(raw.items) || raw.items.length === 0) return null;
      if ((Date.now() - (Number(raw.ts) || 0)) > CATALOG_CACHE_TTL_MS) return null;
      return raw.items;
    } catch (e) {
      return null;
    }
  }

  // Ambil data KATALOG + Lelang dengan penggabungan request (mencegah fetch ganda bersamaan)
  function ambilGabunganKatalogDanLelang(paksaBaru = false) {
    if (!apakahUrlSheetAktif()) return Promise.resolve([]);
    if (catalogFetchPromise && !paksaBaru) return catalogFetchPromise;

    const reqPromise = fetch(`${CONFIG.APPS_SCRIPT_URL}?action=catalog&_t=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        if (json && json.status === "ok" && Array.isArray(json.items)) {
          simpanCacheKatalogLokal(json.items);
          return json.items;
        }
        return [];
      })
      .catch(err => {
        console.warn("Gagal memuat katalog dari Apps Script:", err);
        return [];
      })
      .finally(() => {
        if (catalogFetchPromise === reqPromise) {
          catalogFetchPromise = null;
        }
      });

    catalogFetchPromise = reqPromise;
    return reqPromise;
  }

  // Mulai unduh data di latar belakang sejak halaman dibuka (selama splash screen / di Beranda)
  function preloadKatalogDiLatar() {
    const cached = muatCacheKatalogLokal();
    if (cached && masterCatalogItems.length === 0) {
      prosesBarisKatalog(cached);
      catalogLoadedOnce = true;
    }
    segarkanDataKatalogSenyap();
  }

  // Fungsi ambil data terbaru Google Sheets secara senyap (tanpa mereset tampilan layar)
  async function segarkanDataKatalogSenyap() {
    try {
      const gabungan = await ambilGabunganKatalogDanLelang();
      if (gabungan && gabungan.length > 0) {
        prosesBarisKatalog(gabungan);
        catalogLoadedOnce = true;
        return true;
      }
    } catch (e) {}
    return false;
  }

  // Fungsi Pengecekan Stok & Harga Real-Time Keranjang ke Google Sheets
  async function validasiStokKeranjangOtomatis() {
    let cart = getCartItems();
    if (cart.length === 0) return false;

    const loadingEl = document.getElementById("cartSyncLoading");
    const alertEl = document.getElementById("cartStockAlert");

    if (loadingEl) loadingEl.style.display = "block";
    if (alertEl) {
      alertEl.classList.remove("show");
      alertEl.innerHTML = "";
    }

    let adaPerubahan = false;
    let pesanPeringatan = [];

    try {
      await segarkanDataKatalogSenyap();

      let keranjangValid = [];

      cart.forEach(itemKeranjang => {
        const dataTerbaru = masterCatalogItems.find(
          i => i.kode.toUpperCase() === String(itemKeranjang.kode).toUpperCase()
        );

        // 1. Jika item dihapus atau dinonaktifkan dari Google Sheets
        if (!dataTerbaru) {
          pesanPeringatan.push(`Maaf, <b>[${escapeHtml(itemKeranjang.kode)}] ${escapeHtml(itemKeranjang.nama)}</b> sudah tidak tersedia.`);
          adaPerubahan = true;
          return;
        }

        const statusNorm = String(dataTerbaru.status || "").toLowerCase();
        const stokSekarang = Number(dataTerbaru.stok) || 0;
        const isHabis = stokSekarang <= 0 || statusNorm === "habis" || statusNorm === "terjual" || statusNorm === "sold";
        const isIkan = dataTerbaru.kategori.toLowerCase().includes("ikan");
        const maxStokBaru = isIkan ? 1 : Math.max(1, stokSekarang);

        // 2. Jika ikan mendadak terjual atau stok produk habis (0)
        if (isHabis) {
          if (isIkan) {
            pesanPeringatan.push(`Maaf, ikan <b>[${escapeHtml(dataTerbaru.kode)}] ${escapeHtml(dataTerbaru.nama)}</b> di keranjang Anda baru saja terjual!`);
          } else {
            pesanPeringatan.push(`Maaf, stok produk <b>[${escapeHtml(dataTerbaru.kode)}] ${escapeHtml(dataTerbaru.nama)}</b> baru saja habis!`);
          }
          adaPerubahan = true;
        }
        // 3. Jika stok masih ada, tapi jumlah di keranjang melebihi sisa stok di Sheet
        else if (itemKeranjang.qty > maxStokBaru) {
          itemKeranjang.qty = maxStokBaru;
          itemKeranjang.stokMax = maxStokBaru;
          itemKeranjang.harga = dataTerbaru.harga;
          keranjangValid.push(itemKeranjang);
          pesanPeringatan.push(`Stok <b>[${escapeHtml(dataTerbaru.kode)}] ${escapeHtml(dataTerbaru.nama)}</b> tersisa ${maxStokBaru} (jumlah di keranjang disesuaikan).`);
          adaPerubahan = true;
        }
        // 4. Jika harga di Google Sheets berubah, ikut perbarui harga di keranjang
        else {
          if (Number(itemKeranjang.harga) !== Number(dataTerbaru.harga)) {
            itemKeranjang.harga = dataTerbaru.harga;
            pesanPeringatan.push(`Harga <b>[${escapeHtml(dataTerbaru.kode)}] ${escapeHtml(dataTerbaru.nama)}</b> telah diperbarui sesuai katalog terbaru.`);
            adaPerubahan = true;
          }
          itemKeranjang.stokMax = maxStokBaru;
          keranjangValid.push(itemKeranjang);
        }
      });

      if (adaPerubahan) {
        saveCartItems(keranjangValid);
        renderIsiModalKeranjang();

        // Jika pembeli sedang membuka detail produk yang baru saja terjual, ikut perbarui tampilannya
        const detailViewEl = document.getElementById("catalogDetailView");
        if (detailViewEl && detailViewEl.style.display === "block" && currentOpenDetailCode) {
          bukaDetailProduk(currentOpenDetailCode, false);
        }

        if (alertEl && pesanPeringatan.length > 0) {
          alertEl.innerHTML = `⚠️ <b>Pembaruan Stok Otomatis:</b><br>• ` + pesanPeringatan.join("<br>• ");
          alertEl.classList.add("show");
        }
        tampilkanToast("⚠️ Stok keranjang telah diperbarui!");
      }
    } catch (err) {
      console.warn("Gagal mengecek stok otomatis:", err);
    } finally {
      if (loadingEl) loadingEl.style.display = "none";
    }

    return adaPerubahan;
  }

  function tutupModalKeranjang() {
    playClickSound();
    document.getElementById("cartModal").classList.remove("open");
  }

  function renderIsiModalKeranjang() {
    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotalPrice");
    const cart = getCartItems();

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 28px 10px; color: var(--text-muted); font-size: 12.5px;">
          🛒 Keranjang belanja Anda masih kosong.<br>Silakan pilih ikan atau produk di katalog.
        </div>
      `;
      totalEl.innerText = "Rp 0";
      return;
    }

    let totalHarga = 0;
    container.innerHTML = cart.map(c => {
      const subtotal = (Number(c.harga) || 0) * (Number(c.qty) || 1);
      totalHarga += subtotal;
      const kodeAttr = escapeHtml(c.kode);
      const thumbSafe = escapeHtml(sanitizeUrl(c.thumb, CONFIG.PLACEHOLDER_IMAGE));
      return `
        <div class="cart-item-row notranslate">
          <img src="${thumbSafe}" alt="${escapeHtml(c.nama)}" class="cart-item-thumb" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
          <div class="cart-item-info">
            <div class="cart-item-name">[${kodeAttr}] ${escapeHtml(c.nama)}</div>
            <div class="cart-item-price">${escapeHtml(formatRupiah(c.harga))} × ${Number(c.qty) || 1}</div>
          </div>
          <div class="cart-qty-controls">
            <button type="button" class="cart-qty-btn ${c.qty === 1 ? 'del' : ''}" data-action="cart-qty" data-kode="${kodeAttr}" data-delta="-1">
              ${c.qty === 1 ? '✕' : '−'}
            </button>
            <span style="font-size:12px; font-weight:800; min-width:16px; text-align:center;">${Number(c.qty) || 1}</span>
            <button type="button" class="cart-qty-btn" data-action="cart-qty" data-kode="${kodeAttr}" data-delta="1">+</button>
          </div>
        </div>
      `;
    }).join("");

    totalEl.innerText = formatRupiah(totalHarga);
  }

  function checkoutKeranjangWA() {
    playClickSound();
    const cart = getCartItems();
    if (cart.length === 0) {
      tampilkanToast("⚠️ Keranjang masih kosong!");
      return;
    }

    let totalHarga = 0;
    const rincianBaris = cart.map((c, i) => {
      const sub = (Number(c.harga) || 0) * (Number(c.qty) || 1);
      totalHarga += sub;
      return `${i + 1}. [${c.kode}] ${c.nama} (${c.qty}x) — ${formatRupiah(sub)}`;
    }).join("\n");

    let pesan = "";
    if (USER_LANG === "en") {
      pesan =
        `Hello Admin CUPANG KASEP, I would like to order the following items from my cart:\n\n` +
        `${rincianBaris}\n\n` +
        `💰 Estimated Total: ${formatRupiah(totalHarga)}\n` +
        `Please let me know the availability and shipping cost. Thank you!`;
    } else if (USER_LANG === "zh") {
      pesan =
        `您好 CUPANG KASEP 客服，我想订购购物车中的以下商品：\n\n` +
        `${rincianBaris}\n\n` +
        `💰 预计总价：${formatRupiah(totalHarga)}\n` +
        `请告知库存情况及运费，谢谢！`;
    } else {
      pesan =
        `Halo Admin CUPANG KASEP, saya ingin memesan produk dari keranjang belanja berikut:\n\n` +
        `${rincianBaris}\n\n` +
        `💰 Total Harga: ${formatRupiah(totalHarga)}\n` +
        `Mohon info ketersediaan stok dan ongkos kirimnya. Terima kasih!`;
    }

    const nomorAdmin = String(CONFIG.WHATSAPP_NUMBER || "6282121478149").replace(/[^0-9]/g, "");
    const waUrl = `https://api.whatsapp.com/send?phone=${nomorAdmin}&text=${encodeURIComponent(pesan)}`;

    // Buat elemen anchor dinamis agar diizinkan penuh oleh sistem operasi HP & browser in-app (IG/TikTok/Safari)
    const linkTemp = document.createElement("a");
    linkTemp.href = waUrl;
    linkTemp.target = "_blank";
    linkTemp.rel = "noopener noreferrer";
    document.body.appendChild(linkTemp);
    linkTemp.click();
    document.body.removeChild(linkTemp);
  }

  function catatViewProduk(item) {
    if (!item || !item.kode) return;
    let viewedList = [];
    try {
      viewedList = JSON.parse(sessionStorage.getItem(SESSION_KEY_VIEWS)) || [];
    } catch (e) {}

    const kodeUpper = item.kode.toUpperCase();
    if (viewedList.includes(kodeUpper)) return;

    viewedList.push(kodeUpper);
    try {
      sessionStorage.setItem(SESSION_KEY_VIEWS, JSON.stringify(viewedList));
    } catch (e) {}

    item.views = (Number(item.views) || 0) + 1;

    if (apakahUrlSheetAktif()) {
      const targetSheet = item.kategori.toLowerCase() === "lelang" ? CONFIG.AUCTION_SHEET_NAME : CONFIG.CATALOG_SHEET_NAME;
      kirimKeGoogleSheets({
        action: "view",
        sheet: targetSheet,
        kode: kodeUpper
      });
    }
  }

  let masterCatalogItems = [];    
  let currentCategoryFilter = "Semua";
  let catalogLoadedOnce = false;

  /* =========================================================
     SISTEM BAHASA & PEMBEDA INDONESIA VS NON-INDONESIA
     ========================================================= */
  let USER_LANG = "id";        // Bernilai: 'id' | 'en' | 'zh'
  let IS_INDONESIA = true;     // true = Indonesia, false = Non-Indonesia (English / China)

  // Kamus Terjemahan Teks Utama (Nama Brand Cupang Kasep dikunci dengan class notranslate)
  const TRANSLATIONS = {
    id: {
      badge: "ID",
      toastWelcome: "✦ Bahasa Indonesia dipilih",
      navHome: "Beranda",
      navGallery: "Layanan",
      navOngkir: "Cek Ongkir",
      navAbout: "Tentang Kami",
      heroTitle: "Temukan Koleksi<br>Langka<br>Ikan Cupang",
      heroDesc: "Gerbang resmi menuju <strong class='notranslate' translate='no'>Cupang Kasep</strong>. Jelajahi katalog ikan & produk secara langsung, verifikasi sertifikat, dan hadiah VIP.",
      heroBtn: "Mulai Hobi Anda",
      cardCatalog: "KOLEKSI CK",
      cardAuction: "LELANG CK",
      cardCert: "SERTIFIKAT<br>KEASLIAN",
      cardPrize: "UNDIAN HADIAH",
      cardOngkir: "CEK ONGKIR",
      aboutTitle: "Tentang Kami",
      aboutSub: "Destinasi Utama Koleksi Ikan Cupang Anda. Merayakan kualitas, keindahan, dan dedikasi sejak 2025.",
      storyTitle: "Cerita Kami",
      storyText: "Berawal dari hobi yang penuh dedikasi, Cupang Kasep Official telah berkembang menjadi breeder dan penyedia ikan cupang berkualitas tinggi yang tepercaya. Kami fokus pada keunggulan genetik, warna cerah, dan ikan sehat untuk para kolektor.",
      visionTitle: "Visi & Misi Kami",
      visionText: "Mengangkat hobi ikan cupang secara global dengan menyediakan genetik kelas atas dan mengedukasi komunitas. Kami berkomitmen memberikan layanan terbaik dan varian premium bagi penghobi maupun kolektor."
    },
    en: {
      badge: "EN",
      toastWelcome: "✦ English language selected",
      navHome: "Home",
      navGallery: "Services",
      navOngkir: "Shipping Rate",
      navAbout: "About Us",
      heroTitle: "Discover Rare<br>Collections<br>of Betta Fish",
      heroDesc: "Your official gateway to <strong class='notranslate' translate='no'>Cupang Kasep</strong>. Explore our live Betta & product catalog, certificate verification, and VIP rewards.",
      heroBtn: "Start Your Hobby",
      cardCatalog: "PRODUCT CATALOG",
      cardAuction: "VIP AUCTION",
      cardCert: "AUTHENTICITY<br>CERTIFICATE",
      cardPrize: "PRIZE DRAW",
      cardOngkir: "SHIPPING RATE",
      aboutTitle: "About Us",
      aboutSub: "Your Premier Destination for Collector Betta Fish. Celebrating quality, beauty, and passion since 2025.",
      storyTitle: "Our Story",
      storyText: "Starting from a passionate hobby, Cupang Kasep Official has grown into a trusted breeder and provider of high-quality Betta fish. We focus on genetic excellence, vibrant colors, and healthy fish for collectors.",
      visionTitle: "Our Vision & Mission",
      visionText: "To elevate the Betta fish hobby globally by providing top-tier genetics and educating the community. We strive to offer outstanding service and premium varieties to enthusiasts and collectors alike."
    },
    zh: {
      badge: "中文",
      toastWelcome: "✦ 已选择中文 (Chinese Selected)",
      navHome: "首页",
      navGallery: "服务与功能",
      navOngkir: "运费查询",
      navAbout: "关于我们",
      heroTitle: "探索稀有<br>精品斗鱼<br>专属收藏",
      heroDesc: "欢迎来到 <strong class='notranslate' translate='no'>Cupang Kasep</strong> 官方门户。探索我们的实时斗鱼与产品目录、血统证书验证以及 VIP 专属抽奖福利。",
      heroBtn: "开启您的爱好",
      cardCatalog: "产品与斗鱼目录",
      cardAuction: "VIP 专属拍卖",
      cardCert: "官方血统<br>防伪证书",
      cardPrize: "VIP 幸运抽奖",
      cardOngkir: "运费查询",
      aboutTitle: "关于我们",
      aboutSub: "您收藏级斗鱼的首选之地。自 2025 年以来，始终专注于品质、美学与热爱。",
      storyTitle: "品牌故事",
      storyText: "Cupang Kasep Official 始于一份纯粹的热爱，如今已成长为值得信赖的高品质斗鱼繁育者与供应商。我们专注于卓越基因、绚丽色彩，为收藏家提供健康的精品斗鱼。",
      visionTitle: "愿景与使命",
      visionText: "通过提供顶级基因与社区科普，推动全球斗鱼爱好发展。我们致力于为全球爱好者和收藏家提供卓越的服务与高端品种。"
    }
  };

  // Kamus otomatis tanpa emoji agar seragam dengan tema Dark Luxury
  const EXTRA_UI_TEXT = {
    id: {
      searchCatalogPlaceholder: "Cari nama atau kode (misal: CK-001)...",
      certPlaceholder: "Ketik nomor sertifikat...",
      voucherPlaceholder: "Masukkan Kode Voucher Resmi",
      ongkirProvPlaceholder: "Ketik / Pilih Provinsi...",
      ongkirCityPlaceholder: "Ketik Kecamatan / Kota (cth: Priok)...",
      allTypes: "Semua Jenis / Varian",
      sortDefault: "Urutkan: Terbaru / Default",
      sortAsc: "Harga: Termurah ke Termahal",
      sortDesc: "Harga: Termahal ke Termurah",
      cartTitle: "KERANJANG BELANJA",
      cartTotal: "Total Harga:",
      cartClear: "Kosongkan",
      cartCheckout: "Beli via WhatsApp",
      viewsSuffix: "x dilihat"
    },
    en: {
      searchCatalogPlaceholder: "Search name or code (e.g., CK-001)...",
      certPlaceholder: "Enter certificate number...",
      voucherPlaceholder: "Enter Official Voucher Code",
      ongkirProvPlaceholder: "Type / Select Province...",
      ongkirCityPlaceholder: "Type District / City (e.g., Priok)...",
      allTypes: "All Types / Variants",
      sortDefault: "Sort: Latest / Default",
      sortAsc: "Price: Low to High",
      sortDesc: "Price: High to Low",
      cartTitle: "SHOPPING CART",
      cartTotal: "Total Price:",
      cartClear: "Clear",
      cartCheckout: "Order via WhatsApp",
      viewsSuffix: " views"
    },
    zh: {
      searchCatalogPlaceholder: "搜索名称或代码 (例如: CK-001)...",
      certPlaceholder: "输入证书编号...",
      voucherPlaceholder: "输入官方抽奖券代码",
      ongkirProvPlaceholder: "输入 / 选择省份...",
      ongkirCityPlaceholder: "输入区 / 城市 (例如: Priok)...",
      allTypes: "所有类型 / 品种",
      sortDefault: "排序：最新 / 默认",
      sortAsc: "价格：从低到高",
      sortDesc: "价格：从高到低",
      cartTitle: "购物车",
      cartTotal: "总价：",
      cartClear: "清空",
      cartCheckout: "通过 WhatsApp 购买",
      viewsSuffix: " 次浏览"
    }
  };

  // Google Translate On-Demand: tidak dimuat saat initial load (default ID), hanya disuntikkan saat user pilih EN atau 中文
  let isGoogleTranslateLoaded = false;
  let isGoogleTranslateLoading = false;
  let pendingTranslateLang = null;

  function muatGoogleTranslateOnDemand() {
    if (isGoogleTranslateLoaded || isGoogleTranslateLoading) return;
    isGoogleTranslateLoading = true;
    const scriptEl = document.createElement("script");
    scriptEl.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    scriptEl.async = true;
    scriptEl.onerror = function() {
      isGoogleTranslateLoading = false;
    };
    document.body.appendChild(scriptEl);
  }

  function terapkanNilaiComboTranslate(kodeBahasa, sisaCoba = 25) {
    const targetLang = (kodeBahasa === "zh") ? "zh-CN" : kodeBahasa;
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = targetLang;
      combo.dispatchEvent(new Event("change"));
      return;
    }
    if (sisaCoba > 0) {
      setTimeout(() => terapkanNilaiComboTranslate(kodeBahasa, sisaCoba - 1), 150);
    }
  }

  function picuMesinTranslate(kodeBahasa) {
    if (kodeBahasa === "id") {
      pendingTranslateLang = null;
      if (isGoogleTranslateLoaded || document.querySelector(".goog-te-combo")) {
        terapkanNilaiComboTranslate("id", 10);
      }
      return;
    }

    pendingTranslateLang = kodeBahasa;
    if (document.querySelector(".goog-te-combo")) {
      terapkanNilaiComboTranslate(kodeBahasa, 10);
    } else {
      muatGoogleTranslateOnDemand();
    }
  }

  function pilihBahasa(kodeBahasa, tampilkanNotif = true) {
    if (tampilkanNotif) playClickSound();
    USER_LANG = kodeBahasa;
    IS_INDONESIA = (kodeBahasa === "id");

    terapkanPerlakuanBahasa();
    picuMesinTranslate(kodeBahasa);

    if (tampilkanNotif && TRANSLATIONS[kodeBahasa]) {
      tampilkanToast(TRANSLATIONS[kodeBahasa].toastWelcome);
    }
  }

  function terapkanPerlakuanBahasa() {
    const t = TRANSLATIONS[USER_LANG] || TRANSLATIONS.id;
    const ui = EXTRA_UI_TEXT[USER_LANG] || EXTRA_UI_TEXT.id;

    // 1. Sinkronkan posisi pilihan pada dropdown bahasa di Navbar
    const langSelect = document.getElementById("langDropdown");
    if (langSelect) langSelect.value = USER_LANG;

    // 2. Update teks Navbar tanpa menghapus ikon SVG
    const navHomeTxt = document.getElementById("navHomeText");
    const navGalleryTxt = document.getElementById("navGalleryText");
    const navAboutTxt = document.getElementById("navAboutText");
    const navProfileTxt = document.getElementById("navProfileText");
    const isAdminNow = typeof apakahUserAdmin === "function" && apakahUserAdmin();
    if (navHomeTxt) navHomeTxt.innerText = t.navHome;
    if (navGalleryTxt) navGalleryTxt.innerText = t.navGallery;
    if (navAboutTxt) navAboutTxt.innerText = t.navAbout;
    if (navProfileTxt) {
      navProfileTxt.innerText = isAdminNow
        ? "Admin"
        : (USER_LANG === "en" ? "Profile" : (USER_LANG === "zh" ? "个人资料" : "Profil"));
    }

    // 3. Update teks Hero Section
    const heroTitle = document.querySelector(".hero-title");
    const heroDesc = document.querySelector(".hero-desc");
    const heroBtn = document.querySelector(".btn-start-hobby");
    if (heroTitle) heroTitle.innerHTML = t.heroTitle;
    if (heroDesc) heroDesc.innerHTML = t.heroDesc;
    if (heroBtn) heroBtn.innerText = t.heroBtn;

    // 4. Update judul 5 Kartu Fitur (1. Katalog, 2. Lelang, 3. Sertifikat, 4. Undian, 5. Cek Ongkir)
    const cardTitles = document.querySelectorAll(".pdf-card-title");
    if (cardTitles.length >= 4) {
      cardTitles[0].innerHTML = t.cardCatalog;
      cardTitles[1].innerHTML = t.cardAuction;
      cardTitles[2].innerHTML = t.cardCert;
      cardTitles[3].innerHTML = t.cardPrize;
      if (cardTitles[4] && t.cardOngkir) {
        cardTitles[4].innerHTML = t.cardOngkir;
      }
    }

    // 5. Update teks About Us
    const aboutMain = document.querySelector(".about-main-title");
    const aboutSub = document.querySelector(".about-subtitle");
    const aboutColTitles = document.querySelectorAll(".about-col-title");
    const aboutColTexts = document.querySelectorAll(".about-col-text");

    if (aboutMain) aboutMain.innerText = t.aboutTitle;
    if (aboutSub) aboutSub.innerText = t.aboutSub;
    if (aboutColTitles.length >= 2) {
      aboutColTitles[0].innerText = t.storyTitle;
      aboutColTitles[1].innerText = t.visionTitle;
    }
    if (aboutColTexts.length >= 2) {
      aboutColTexts[0].innerText = t.storyText;
      aboutColTexts[1].innerText = t.visionText;
    }

    // 6. Update Placeholder Input, Modal Keranjang & Filter Katalog
    const catSearch = document.getElementById("catalogSearchInput");
    const certInp = document.getElementById("certInput");
    const vouchInp = document.getElementById("voucherInput");
    const provInp = document.getElementById("ongkirProvinceInput");
    const cityInp = document.getElementById("ongkirCityInput");
    if (catSearch) catSearch.placeholder = ui.searchCatalogPlaceholder;
    if (certInp) certInp.placeholder = ui.certPlaceholder;
    if (vouchInp) vouchInp.placeholder = ui.voucherPlaceholder;
    if (provInp) provInp.placeholder = ui.ongkirProvPlaceholder;
    if (cityInp) cityInp.placeholder = ui.ongkirCityPlaceholder;

    const cartModalTitle = document.getElementById("cartModalTitle");
    const cartTotalLabel = document.getElementById("cartTotalLabel");
    const btnClearCart = document.getElementById("btnClearCart");
    const btnCheckoutWA = document.getElementById("btnCheckoutWA");
    if (cartModalTitle) cartModalTitle.innerText = ui.cartTitle;
    if (cartTotalLabel) cartTotalLabel.innerText = ui.cartTotal;
    if (btnClearCart) btnClearCart.innerText = ui.cartClear;
    if (btnCheckoutWA) btnCheckoutWA.innerText = ui.cartCheckout;

    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect && sortSelect.options.length >= 4) {
      sortSelect.options[0].text = ui.sortDefault;
      sortSelect.options[1].text = USER_LANG === "en" ? "Sort: Most Popular" : (USER_LANG === "zh" ? "排序：最受欢迎" : "Urutkan: Paling Populer");
      sortSelect.options[2].text = ui.sortAsc;
      sortSelect.options[3].text = ui.sortDesc;
    }

    if (IS_INDONESIA) {
      document.body.setAttribute("data-region", "domestic");
    } else {
      document.body.setAttribute("data-region", "international");
    }

    // Perbarui teks tombol keranjang melayang & isi keranjang sesuai mata uang bahasa
    perbaruiTombolKeranjangMelayang();
    if (document.getElementById("cartModal") && document.getElementById("cartModal").classList.contains("open")) {
      renderIsiModalKeranjang();
    }

    if (catalogLoadedOnce) {
      perbaruiDropdownJenis();
      const detailViewEl = document.getElementById("catalogDetailView");
      const sedangDiDetail = detailViewEl && detailViewEl.style.display === "block";

      if (sedangDiDetail && currentOpenDetailCode) {
        // Render ulang detail produk di tempat agar harga & label IDR/USD/CNY langsung berubah
        bukaDetailProduk(currentOpenDetailCode, false);
      } else {
        terapkanFilterKatalog();
      }
    }
    if (activeVoucherCode) {
      perbaruiTampilanVoucher();
    }
  }

  /* =========================================================
     NAVIGASI SPA MENU NAVBAR ATAS (HOME, GALLERY, ABOUT US, ADMIN)
     ========================================================= */
  function aturSorotanNavbar(menuAktif) {
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
    if (menuAktif === "gallery" || menuAktif === "ongkir") {
      const el = document.getElementById("navGallery");
      if (el) el.classList.add("active");
    } else if (menuAktif === "about") {
      const el = document.getElementById("navAbout");
      if (el) el.classList.add("active");
    } else if (menuAktif === "admin") {
      const el = document.getElementById("headerAuctionAuthBtn");
      if (el) el.classList.add("active");
    } else {
      const el = document.getElementById("navHome");
      if (el) el.classList.add("active");
    }
  }

  function apakahHalamanDiRefresh() {
    try {
      const navEntries = window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation");
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === "reload";
      }
      if (window.performance && performance.navigation) {
        return performance.navigation.type === 1; // 1 = TYPE_RELOAD
      }
    } catch (e) {}
    return false;
  }

  function simpanRuteTerakhir(hashUrl) {
    if (!hashUrl) return;
    try { localStorage.removeItem("ck_last_route"); } catch (e) {}
    try { sessionStorage.setItem("ck_last_route", hashUrl); } catch (e) {}
  }

  function navigasiMenuAtas(target, simpanHistory = true) {
    if (isWheelSpinning) return;
    playClickSound();
    tutupMenuAuthHeader();

    ["verificationPage", "roulettePage", "catalogPage"].forEach(id => {
      document.getElementById(id).style.display = "none";
    });
    const floatBtn = document.getElementById("floatingCartBtn");
    if (floatBtn) floatBtn.style.display = "none";
    document.getElementById("landingPage").style.display = "flex";

    document.getElementById("sectionHome").style.display = "none";
    document.getElementById("sectionGallery").style.display = "none";
    const secOngkir = document.getElementById("sectionOngkir");
    if (secOngkir) secOngkir.style.display = "none";
    document.getElementById("sectionAbout").style.display = "none";
    const secAdmin = document.getElementById("sectionAdmin");
    if (secAdmin) secAdmin.style.display = "none";

    if (target === "admin" && !apakahUserAdmin()) {
      target = "home";
    }

    if (target === "gallery") {
      aturSorotanNavbar("gallery");
      document.getElementById("sectionGallery").style.display = "flex";
    } else if (target === "ongkir") {
      aturSorotanNavbar("ongkir");
      if (secOngkir) secOngkir.style.display = "block";
      muatDaftarKotaRajaOngkir();
    } else if (target === "about") {
      aturSorotanNavbar("about");
      document.getElementById("sectionAbout").style.display = "flex";
    } else if (target === "admin") {
      aturSorotanNavbar("admin");
      if (secAdmin) secAdmin.style.display = "block";
      const bidder = getVerifiedBidder();
      const namaResmiAdm = dapatkanNamaAdmin(bidder);
      const admNameEl = document.getElementById("adminPageUserName");
      const admMobileNameEl = document.getElementById("adminMobileUserName");
      const admInfoEl = document.getElementById("adminPageUserInfo");
      if (bidder && admNameEl) admNameEl.innerText = namaResmiAdm;
      if (bidder && admMobileNameEl) admMobileNameEl.innerText = namaResmiAdm;
      if (bidder && admInfoEl) admInfoEl.innerText = `${bidder.wa} • ${bidder.email}`;

      muatModulAdmin().then((loaded) => {
        if (!loaded) return;
        if (typeof sinkronPosisiSidebarAdmin === "function") {
          requestAnimationFrame(sinkronPosisiSidebarAdmin);
          setTimeout(sinkronPosisiSidebarAdmin, 150);
          setTimeout(sinkronPosisiSidebarAdmin, 400);
        }
        if (!catalogLoadedOnce || masterCatalogItems.length === 0) {
          muatDataKatalog(false).then(() => {
            if (typeof segarkanSemuaTampilanAdminHub === "function") {
              segarkanSemuaTampilanAdminHub();
            }
          });
        } else if (typeof segarkanSemuaTampilanAdminHub === "function") {
          segarkanSemuaTampilanAdminHub();
        }
      });
    } else {
      aturSorotanNavbar("home");
      document.getElementById("sectionHome").style.display = "grid";
      target = "home";
    }

    const petaJudulMenu = {
      home: "Cupang Kasep Official | Collector & Contest Betta Fish Breeder, Live Auction & Global Store",
      gallery: "Galeri Koleksi, Lelang VIP & Sertifikat Keaslian | Cupang Kasep Official",
      ongkir: "Cek Tarif Ongkos Kirim Ikan Cupang (Seluruh Indonesia) | Cupang Kasep Official",
      about: "Tentang Kami — Breeder & Kurator Ikan Cupang Kontes | Cupang Kasep Official",
      admin: "Command Center Admin | Cupang Kasep Official"
    };
    perbaruiJudulHalamanSEO(petaJudulMenu[target] || petaJudulMenu.home);

    simpanRuteTerakhir("#" + target);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (simpanHistory && window.location.hash !== "#" + target) {
      history.pushState({ tab: target }, "", "#" + target);
    }
  }

  /* =========================================================
     FITUR CEK ONGKIR (MURNI RAJAONGKIR, AUTOCOMPLETE PROVINSI & LOGO RESMI)
     ========================================================= */
  const RAJAONGKIR_ORIGIN_CITY_ID = "23"; // ID 23 = Kota Bandung
  let timerCariKota = null;

  // Daftar 34 Provinsi Resmi Indonesia untuk Autocomplete Provinsi
  const DAFTAR_PROVINSI_INDONESIA = [
    "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta",
    "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur",
    "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara",
    "Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara",
    "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat",
    "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara",
    "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
  ];

  // Logo Resmi Masing-Masing Ekspedisi (Embedded SVG - 100% Tampil Cepat & Anti-Broken)
  const LOGO_RESMI_EKSPEDISI = {
    "TIKI": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><polygon points="16,14 48,14 38,26 10,26" fill="#e11d48"/><polygon points="24,30 52,30 42,42 14,42" fill="#1e3a8a"/><text x="108" y="42" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="38" fill="#1e3a8a" text-anchor="middle" letter-spacing="1">TIKI</text></svg>`),
    "JNE": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><path d="M18 46 Q90 22 164 14" stroke="#e11d48" stroke-width="5" fill="none" stroke-linecap="round"/><text x="90" y="44" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="38" fill="#1d4ed8" text-anchor="middle" letter-spacing="1.5">JNE</text></svg>`),
    "JNT": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#e11d48"/><text x="90" y="38" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="32" fill="#ffffff" text-anchor="middle">J&amp;T</text><text x="90" y="52" font-family="Arial, sans-serif" font-weight="800" font-size="10.5" fill="#ffffff" text-anchor="middle" letter-spacing="3.5">EXPRESS</text></svg>`),
    "J&T": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#e11d48"/><text x="90" y="38" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="32" fill="#ffffff" text-anchor="middle">J&amp;T</text><text x="90" y="52" font-family="Arial, sans-serif" font-weight="800" font-size="10.5" fill="#ffffff" text-anchor="middle" letter-spacing="3.5">EXPRESS</text></svg>`),
    "POS": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><rect x="10" y="10" width="44" height="40" rx="6" fill="#ea580c"/><text x="32" y="36" font-family="Arial Black, sans-serif" font-weight="900" font-size="17" fill="#ffffff" text-anchor="middle">POS</text><text x="115" y="31" font-family="Arial Black, sans-serif" font-weight="900" font-size="19" fill="#0f172a" text-anchor="middle">POS IND</text><text x="115" y="46" font-family="Arial, sans-serif" font-weight="700" font-size="9.5" fill="#ea580c" text-anchor="middle" letter-spacing="1.5">LOGISTIK INDONESIA</text></svg>`),
    "SICEPAT": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#dc2626"/><text x="90" y="36" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="25" fill="#ffffff" text-anchor="middle">SiCepat</text><text x="90" y="50" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#fde047" text-anchor="middle" letter-spacing="2.5">EKSPRES</text></svg>`),
    "ANTERAJA": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><text x="90" y="38" font-family="Arial Black, sans-serif" font-weight="900" font-size="23" fill="#7e22ce" text-anchor="middle">Anter<tspan fill="#ec4899">aja</tspan></text></svg>`),
    "NINJA": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#b91c1c"/><text x="90" y="36" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-style="italic" font-size="25" fill="#ffffff" text-anchor="middle">ninja</text><text x="90" y="50" font-family="Arial, sans-serif" font-weight="800" font-size="10" fill="#fca5a5" text-anchor="middle" letter-spacing="3">XPRESS</text></svg>`),
    "WAHANA": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><text x="90" y="38" font-family="Arial Black, sans-serif" font-weight="900" font-size="24" fill="#1e40af" text-anchor="middle">WAHANA</text><rect x="30" y="44" width="120" height="4" rx="2" fill="#f59e0b"/></svg>`),
    "LION": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#dc2626"/><text x="90" y="35" font-family="Arial Black, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">LION</text><text x="90" y="50" font-family="Arial, sans-serif" font-weight="800" font-size="10.5" fill="#fde047" text-anchor="middle" letter-spacing="3">PARCEL</text></svg>`),
    "IDE": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><text x="90" y="36" font-family="Arial Black, sans-serif" font-weight="900" font-size="26" fill="#dc2626" text-anchor="middle">ID<tspan fill="#1f2937">express</tspan></text></svg>`),
    "SAP": "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60"><rect width="180" height="60" rx="8" fill="#ffffff"/><text x="90" y="36" font-family="Arial Black, sans-serif" font-weight="900" font-size="27" fill="#ea580c" text-anchor="middle">SAP</text><text x="90" y="50" font-family="Arial, sans-serif" font-weight="800" font-size="9.5" fill="#1e3a8a" text-anchor="middle" letter-spacing="2.5">EXPRESS</text></svg>`)
  };

  function dapatkanHtmlLogoKurir(kodeKurir, layananKurir = "") {
    const gabung = `${kodeKurir || ""} ${layananKurir || ""}`.toUpperCase();
    let key = String(kodeKurir || "").trim().toUpperCase().replace(/[^A-Z&]/g, "");

    if (gabung.includes("TIKI")) key = "TIKI";
    else if (gabung.includes("J&T") || gabung.includes("JNT")) key = "J&T";
    else if (gabung.includes("JNE")) key = "JNE";
    else if (gabung.includes("POS")) key = "POS";
    else if (gabung.includes("SICEPAT")) key = "SICEPAT";
    else if (gabung.includes("ANTERAJA")) key = "ANTERAJA";
    else if (gabung.includes("NINJA")) key = "NINJA";
    else if (gabung.includes("WAHANA")) key = "WAHANA";
    else if (gabung.includes("LION")) key = "LION";
    else if (gabung.includes("ID EXPRESS") || key === "IDE" || key === "IDEXPRESS") key = "IDE";
    else if (gabung.includes("SAP")) key = "SAP";

    const logoUrl = LOGO_RESMI_EKSPEDISI[key] || "";
    if (logoUrl) {
      return `<img src="${logoUrl}" alt="${key}" class="ongkir-courier-logo-img">`;
    }
    return `<span style="font-weight:900;font-size:12px;color:#0f172a;">${key || "KURIR"}</span>`;
  }

  function dapatkanProvinsiTerpilih() {
    const hiddenProv = document.getElementById("ongkirSelectedProvince");
    const inputProv = document.getElementById("ongkirProvinceInput");
    if (hiddenProv && hiddenProv.value.trim()) return hiddenProv.value.trim();
    if (inputProv && inputProv.value.trim()) return inputProv.value.trim();
    return "";
  }

  // Mekanisme Autocomplete Provinsi (Persis Seperti Alamat Pembeli)
  function renderDropdownProvinsiGlass(keyword = "") {
    const box = document.getElementById("ongkirProvGlassDropdown");
    if (!box) return;

    const q = String(keyword || "").trim().toLowerCase();
    const hasil = DAFTAR_PROVINSI_INDONESIA.filter(p => !q || p.toLowerCase().includes(q));

    if (hasil.length === 0) {
      box.innerHTML = `
        <div class="ongkir-glass-badge-item" style="justify-content:center; color:var(--text-muted); cursor:default;">
          🔎 Provinsi "<strong style="color:#fff;">${escapeHtml(keyword)}</strong>" tidak ditemukan
        </div>
      `;
      box.classList.add("show");
      return;
    }

    box.innerHTML = hasil.map(prov => `
      <div class="ongkir-glass-badge-item" data-action="pick-prov" data-prov="${escapeHtml(prov)}">
        <div class="ongkir-badge-main-text">
          <span>${sorotKataKunci(prov, keyword.trim())}</span>
        </div>
      </div>
    `).join("");

    box.classList.add("show");
  }

  function bukaDropdownProvinsiGlass() {
    const inp = document.getElementById("ongkirProvinceInput");
    const q = inp ? inp.value.trim() : "";
    renderDropdownProvinsiGlass(q);
  }

  function cariProvinsiOngkirLive(teks) {
    const hiddenProv = document.getElementById("ongkirSelectedProvince");
    const clearBtn = document.getElementById("ongkirProvClearBtn");
    const q = String(teks || "").trim();

    if (hiddenProv) hiddenProv.value = q;
    if (clearBtn) {
      if (q.length > 0) clearBtn.classList.add("show");
      else clearBtn.classList.remove("show");
    }

    renderDropdownProvinsiGlass(q);
  }

  function pilihProvinsiOngkirGlass(namaProvinsi) {
    playClickSound();
    const inp = document.getElementById("ongkirProvinceInput");
    const hiddenProv = document.getElementById("ongkirSelectedProvince");
    const clearBtn = document.getElementById("ongkirProvClearBtn");
    const box = document.getElementById("ongkirProvGlassDropdown");
    const cityInp = document.getElementById("ongkirCityInput");
    const hiddenCityId = document.getElementById("ongkirSelectedCityId");

    if (inp) {
      inp.value = namaProvinsi;
      inp.blur();
    }
    if (hiddenProv) hiddenProv.value = namaProvinsi;
    if (clearBtn) clearBtn.classList.add("show");
    if (box) box.classList.remove("show");

    if (hiddenCityId) hiddenCityId.value = "";
    if (cityInp) {
      cityInp.placeholder = `🔍 Ketik Kecamatan / Kota di ${namaProvinsi}...`;
      const teksKota = cityInp.value.trim();
      if (teksKota.length >= 2) {
        cariKotaRajaOngkirLive(teksKota);
      }
    }
  }

  function hapusInputProvinsiOngkir() {
    playClickSound();
    const inp = document.getElementById("ongkirProvinceInput");
    const hiddenProv = document.getElementById("ongkirSelectedProvince");
    const clearBtn = document.getElementById("ongkirProvClearBtn");
    const box = document.getElementById("ongkirProvGlassDropdown");
    const cityInp = document.getElementById("ongkirCityInput");

    if (inp) {
      inp.value = "";
      inp.focus();
    }
    if (hiddenProv) hiddenProv.value = "";
    if (clearBtn) clearBtn.classList.remove("show");
    if (cityInp) cityInp.placeholder = "🔍 Ketik Kecamatan / Kota (cth: Priok)...";
    renderDropdownProvinsiGlass("");
  }

  function ubahJumlahIkanOngkir(delta) {
    playClickSound();
    const inputEl = document.getElementById("ongkirFishQty");
    if (!inputEl) return;
    let val = (parseInt(inputEl.value, 10) || 1) + delta;
    if (val < 1) val = 1;
    inputEl.value = val;
    hitungBeratIkanOtomatis();

    const hiddenId = document.getElementById("ongkirSelectedCityId");
    if (hiddenId && hiddenId.value) {
      prosesCekOngkirRajaOngkir();
    }
  }

  function hitungBeratIkanOtomatis() {
    const inputEl = document.getElementById("ongkirFishQty");
    if (!inputEl) return 1;

    let jumlahIkan = parseInt(inputEl.value, 10);
    if (isNaN(jumlahIkan) || jumlahIkan < 1) jumlahIkan = 1;

    const beratKg = Math.ceil(jumlahIkan / 5);
    const infoEl = document.getElementById("ongkirWeightInfo");
    if (infoEl) {
      infoEl.innerHTML = `📦 Estimasi Berat: <strong>${beratKg} Kg</strong> (${jumlahIkan} ekor ikan)`;
    }
    return beratKg;
  }

  function sorotKataKunci(teks, keyword) {
    const safeText = escapeHtml(teks);
    if (!keyword) return safeText;
    const safeKey = escapeHtml(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safeText.replace(new RegExp(`(${safeKey})`, "gi"), `<span class="ongkir-badge-highlight">$1</span>`);
  }

  function renderDropdownKotaGlass(list, keyword = "") {
    const box = document.getElementById("ongkirGlassDropdown");
    if (!box) return;

    const q = String(keyword || "").trim();
    const provTerpilih = dapatkanProvinsiTerpilih();

    if (q.length < 2) {
      box.classList.remove("show");
      return;
    }

    const hasilFilter = (list || []).filter(c => {
      if (!provTerpilih) return true;
      return String(c.province || "").toLowerCase().includes(provTerpilih.toLowerCase());
    });

    if (hasilFilter.length === 0) {
      box.innerHTML = `
        <div class="ongkir-glass-badge-item" style="justify-content:center; color:var(--text-muted); cursor:default;">
          🔎 Alamat "<strong style="color:#fff;">${escapeHtml(q)}</strong>"${provTerpilih ? ` di Provinsi <strong style="color:var(--gold-light);">${escapeHtml(provTerpilih)}</strong>` : ''} tidak ditemukan di RajaOngkir
        </div>
      `;
      box.classList.add("show");
      return;
    }

    box.innerHTML = hasilFilter.slice(0, 30).map(c => {
      const namaUtama = `${c.type ? c.type + ' ' : ''}${c.city_name}`.trim();
      const labelLengkap = `${namaUtama}${c.province ? ' (' + c.province + ')' : ''}`.trim();

      return `
        <div class="ongkir-glass-badge-item" data-action="pick-city" data-label="${escapeHtml(labelLengkap)}" data-city-id="${escapeHtml(c.city_id || '')}" data-prov="${escapeHtml(c.province || '')}">
          <div class="ongkir-badge-main-text">
            <span style="color:var(--gold-primary);">◈</span>
            <span>${sorotKataKunci(namaUtama, q)}</span>
          </div>
          ${c.province ? `<span class="ongkir-badge-prov-tag">${sorotKataKunci(c.province, q)}</span>` : ''}
        </div>
      `;
    }).join("");

    box.classList.add("show");
  }

  function bukaDropdownKotaGlass() {
    const inp = document.getElementById("ongkirCityInput");
    const q = inp ? inp.value.trim() : "";
    if (q.length >= 2) {
      cariKotaRajaOngkirLive(q);
    }
  }

  function hapusInputKotaOngkir() {
    playClickSound();
    const inp = document.getElementById("ongkirCityInput");
    const hiddenId = document.getElementById("ongkirSelectedCityId");
    const clearBtn = document.getElementById("ongkirClearBtn");
    const box = document.getElementById("ongkirGlassDropdown");

    if (inp) {
      inp.value = "";
      inp.focus();
    }
    if (hiddenId) hiddenId.value = "";
    if (clearBtn) clearBtn.classList.remove("show");
    if (box) box.classList.remove("show");
  }

  function pilihKotaOngkirGlass(label, cityId, namaProvinsi = "") {
    playClickSound();
    const inp = document.getElementById("ongkirCityInput");
    const hiddenId = document.getElementById("ongkirSelectedCityId");
    const box = document.getElementById("ongkirGlassDropdown");
    const clearBtn = document.getElementById("ongkirClearBtn");
    const provInp = document.getElementById("ongkirProvinceInput");
    const hiddenProv = document.getElementById("ongkirSelectedProvince");
    const provClearBtn = document.getElementById("ongkirProvClearBtn");

    if (inp) {
      inp.value = label;
      inp.blur();
    }
    if (hiddenId) hiddenId.value = cityId;
    if (clearBtn) clearBtn.classList.add("show");
    if (box) box.classList.remove("show");

    // Otomatis isi kolom Provinsi jika pembeli langsung memilih kota
    if (namaProvinsi && provInp && !provInp.value.trim()) {
      provInp.value = namaProvinsi;
      if (hiddenProv) hiddenProv.value = namaProvinsi;
      if (provClearBtn) provClearBtn.classList.add("show");
    }

    prosesCekOngkirRajaOngkir();
  }

  async function muatDaftarKotaRajaOngkir(keyword = "") {
    const q = String(keyword || "").trim();
    if (!q || !apakahUrlSheetAktif()) return;

    const provTerpilih = dapatkanProvinsiTerpilih();
    try {
      const res = await kirimKeGoogleSheets({
        action: "rajaongkir_cities",
        keyword: q,
        province: provTerpilih
      });
      if (res && res.status === "ok" && Array.isArray(res.cities)) {
        renderDropdownKotaGlass(res.cities, q);
      }
    } catch (e) {}
  }

  function cariKotaRajaOngkirLive(teks) {
    const hiddenId = document.getElementById("ongkirSelectedCityId");
    const clearBtn = document.getElementById("ongkirClearBtn");
    const box = document.getElementById("ongkirGlassDropdown");
    const q = String(teks || "").trim();
    const provTerpilih = dapatkanProvinsiTerpilih();

    if (hiddenId) hiddenId.value = "";
    if (clearBtn) {
      if (q.length > 0) clearBtn.classList.add("show");
      else clearBtn.classList.remove("show");
    }

    if (q.length < 2) {
      if (box) box.classList.remove("show");
      return;
    }

    if (box) {
      box.innerHTML = `
        <div class="ongkir-glass-badge-item" style="justify-content:center; color:var(--gold-light);">
          ⏳ Mencari "<strong style="color:#fff;">${escapeHtml(q)}</strong>"${provTerpilih ? ` di <strong>${escapeHtml(provTerpilih)}</strong>` : ''}
        </div>
      `;
      box.classList.add("show");
    }

    clearTimeout(timerCariKota);
    timerCariKota = setTimeout(() => {
      muatDaftarKotaRajaOngkir(q);
    }, 300);
  }

  document.addEventListener("click", function(e) {
    const wrapCity = document.getElementById("ongkirAutocompleteWrap");
    const boxCity = document.getElementById("ongkirGlassDropdown");
    if (wrapCity && boxCity && !wrapCity.contains(e.target)) {
      boxCity.classList.remove("show");
    }

    const wrapProv = document.getElementById("ongkirProvAutocompleteWrap");
    const boxProv = document.getElementById("ongkirProvGlassDropdown");
    if (wrapProv && boxProv && !wrapProv.contains(e.target)) {
      boxProv.classList.remove("show");
    }
  });

  async function prosesCekOngkirRajaOngkir() {
    playClickSound();
    const cityInputEl = document.getElementById("ongkirCityInput");
    const hiddenIdEl = document.getElementById("ongkirSelectedCityId");
    const cityInput = cityInputEl ? cityInputEl.value.trim() : "";
    const destinationId = hiddenIdEl ? hiddenIdEl.value.trim() : "";

    if (!cityInput || !destinationId) {
      tampilkanToast("⚠️ Silakan pilih alamat tujuan dari daftar terlebih dahulu");
      if (cityInputEl) cityInputEl.focus();
      return;
    }

    const box = document.getElementById("ongkirGlassDropdown");
    if (box) box.classList.remove("show");

    const beratKg = hitungBeratIkanOtomatis();
    const beratGram = beratKg * 1000;
    const btn = document.getElementById("btnSubmitCekOngkir");
    const container = document.getElementById("ongkirResultContainer");

    btn.disabled = true;
    btn.innerText = "⏳ mengecek ekspedisi";
    container.innerHTML = Array(4).fill(`
      <div class="ongkir-courier-row" style="pointer-events:none;">
        <div class="skeleton-shimmer" style="height:44px; border-radius:8px;"></div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="skeleton-line w-40 skeleton-shimmer"></div>
          <div class="skeleton-line w-85 skeleton-shimmer"></div>
        </div>
        <div class="skeleton-line w-60 skeleton-shimmer"></div>
        <div class="skeleton-line w-85 skeleton-shimmer" style="margin-left:auto;"></div>
      </div>
    `).join("");

    const resServer = await kirimKeGoogleSheets({
      action: "rajaongkir_cost",
      origin: RAJAONGKIR_ORIGIN_CITY_ID,
      destination: destinationId,
      weight: beratGram,
      courier: "tiki:jne:pos:jnt:sicepat:anteraja"
    });

    btn.disabled = false;
    btn.innerText = "cek ongkir";

    if (resServer && resServer.status === "ok" && Array.isArray(resServer.results) && resServer.results.length > 0) {
      renderBarisEkspedisiOngkir(resServer.results, beratKg);
    } else {
      container.innerHTML = `
        <div style="text-align:center; padding: 24px 16px; color: #fca5a5; font-size: 13px; border: 1px dashed rgba(239,68,68,0.4); border-radius: 12px;">
          ⚠️ Data tarif dari RajaOngkir belum ditemukan untuk rute ini atau koneksi sedang sibuk. Silakan coba pilih ulang kecamatan/kota tujuan.
        </div>
      `;
    }
  }

  function renderBarisEkspedisiOngkir(list, beratKg) {
    const container = document.getElementById("ongkirResultContainer");
    if (!container) return;

    container.innerHTML = list.map(item => `
      <div class="ongkir-courier-row">
        <div class="ongkir-logo-box notranslate" title="${escapeHtml(item.kode)}">
          ${dapatkanHtmlLogoKurir(item.kode, item.layanan)}
        </div>
        <div class="ongkir-layanan-col">
          <span class="ongkir-cell-title">Layanan</span>
          <span class="ongkir-cell-val notranslate">${escapeHtml(item.layanan)}</span>
        </div>
        <div class="ongkir-estimasi-col">
          <span class="ongkir-cell-title">Estimasi</span>
          <span class="ongkir-cell-val">${escapeHtml(item.estimasi)}</span>
        </div>
        <div class="ongkir-tarif-col">
          <span class="ongkir-cell-title">Tarif (${Number(beratKg) || 1} Kg)</span>
          <span class="ongkir-price-now notranslate">${escapeHtml(formatRupiah(item.tarif))}</span>
        </div>
      </div>
    `).join("");
  }

  /* =========================================================
     2. LOGIKA PENGAMBILAN & FILTER KATALOG GOOGLE SHEETS
     ========================================================= */
  // Nilai kurs cadangan jika koneksi internet pengunjung lambat, akan otomatis di-update real-time oleh API
  let EXCHANGE_RATES = {
    USD: 0.000063, // Estimasi awal 1 IDR ke USD
    CNY: 0.00045   // Estimasi awal 1 IDR ke CNY
  };

  let currentOpenDetailCode = null; // Menyimpan kode produk yang sedang dibuka di Detail View

  async function muatKursRealTime() {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/IDR");
      const data = await res.json();
      if (data && data.rates) {
        if (data.rates.USD) EXCHANGE_RATES.USD = data.rates.USD;
        if (data.rates.CNY) EXCHANGE_RATES.CNY = data.rates.CNY;
      }
    } catch (e) {
      console.warn("Menggunakan kurs cadangan:", e);
    }
  }

  function dapatkanKodeMataUang() {
    if (USER_LANG === "en") return "USD";
    if (USER_LANG === "zh") return "CNY";
    return "IDR";
  }

  function formatRupiah(angka) {
    const num = Number(String(angka).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num) || num <= 0) {
      if (USER_LANG === "en") return "Contact Admin";
      if (USER_LANG === "zh") return "联系客服";
      return "Hubungi Admin";
    }

    if (USER_LANG === "en") {
      const usdVal = num * EXCHANGE_RATES.USD;
      return "$" + usdVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (USER_LANG === "zh") {
      const cnyVal = num * EXCHANGE_RATES.CNY;
      return "¥" + cnyVal.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return "Rp " + num.toLocaleString("id-ID");
  }

  // =========================================================
  // SAKLAR ON/OFF & LINK SOSIAL MEDIA FOOTER
  // Ubah "aktif: true" (bisa diklik) atau "aktif: false" (tidak bisa diklik)
  // =========================================================
  const PENGATURAN_SOSMED = {
    wa:       { aktif: true,  url: "AUTO_WA" },
    line:     { aktif: false, url: "https://line.me/ti/p/~cupangkasep" },
    telegram: { aktif: false, url: "https://t.me/cupangkasep" },
    ig:       { aktif: false,  url: "https://instagram.com/cupangkasep" },
    tiktok:   { aktif: true,  url: "https://www.tiktok.com/@cupang_kasep14" },
    fb:       { aktif: false, url: "https://facebook.com/cupangkasep" }
  };

  function terapkanStatusSosmedFooter() {
    document.querySelectorAll('.wf-link-list a[onclick*="bukaSosmedFooter"]').forEach(el => {
      const match = el.getAttribute('onclick').match(/bukaSosmedFooter\(['"]([^'"]+)['"]\)/);
      if (match && match[1]) {
        const kode = match[1];
        const data = PENGATURAN_SOSMED[kode];
        if (!data || !data.aktif) {
          el.classList.add('sosmed-off');
          el.removeAttribute('title');
        } else {
          el.classList.remove('sosmed-off');
        }
      }
    });
  }

  // Fungsi Sosmed & WA di Footer mengikuti bahasa (ID / EN / ZH)
  function bukaSosmedFooter(platform) {
    const info = PENGATURAN_SOSMED[platform];
    if (!info || !info.aktif) return; // Mengunci total jika status aktif: false

    playClickSound();
    if (platform === "wa") {
      let pesan = "";
      if (USER_LANG === "en") {
        pesan = "Hello Cupang Kasep Admin, I would like to inquire about your Betta fish collection.";
      } else if (USER_LANG === "zh") {
        pesan = "您好 Cupang Kasep 客服，我想咨询关于精品斗鱼收藏的信息。";
      } else {
        pesan = "Halo Admin Cupang Kasep, saya ingin bertanya mengenai koleksi ikan cupang.";
      }
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");
      return;
    }

    if (info.url && info.url !== "...") {
      window.open(info.url, "_blank");
    }
  }

  // Fungsi Pesan WhatsApp Koleksi CK mengikuti bahasa (ID / EN / ZH)
  function buatLinkWhatsAppKatalog(item, isHabis) {
    let pesan = "";
    if (USER_LANG === "en") {
      if (isHabis) {
        pesan = `Hello CUPANG KASEP, I would like to ask about a possible restock for this item:\nCode: ${item.kode}\nName: ${item.nama}\nWill this fish or product be available again?`;
      } else {
        pesan = `Hello CUPANG KASEP, I would like to order / check the availability of this item:\nCode: ${item.kode}\nName: ${item.nama}\nPrice: ${formatRupiah(item.harga)}\nIs this item still available?`;
      }
    } else if (USER_LANG === "zh") {
      if (isHabis) {
        pesan = `您好 CUPANG KASEP，我想咨询以下商品的补货情况：\n代码：${item.kode}\n名称：${item.nama}\n请问该斗鱼或商品还会补货吗？`;
      } else {
        pesan = `您好 CUPANG KASEP，我想订购/咨询以下商品的库存：\n代码：${item.kode}\n名称：${item.nama}\n价格：${formatRupiah(item.harga)}\n请问还有现货吗？`;
      }
    } else {
      if (isHabis) {
        pesan = `Halo CUPANG KASEP, saya ingin menanyakan kemungkinan restock untuk item berikut:\nKode: ${item.kode}\nNama: ${item.nama}\nApakah ikan atau produk tersebut akan tersedia kembali?`;
      } else {
        pesan = `Halo CUPANG KASEP, saya ingin menanyakan ketersediaan stok berikut:\nKode: ${item.kode}\nNama: ${item.nama}\nApakah ikan atau produk tersebut masih tersedia?`;
      }
    }
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
  }

  async function muatDataKatalog(paksaSegarkan = false) {
    if (paksaSegarkan) playClickSound();

    // Tampilkan cache lokal secara instan (0 detik) lalu segarkan senyap di latar belakang
    if (!paksaSegarkan) {
      const cached = muatCacheKatalogLokal();
      if (cached && cached.length > 0) {
        prosesBarisKatalog(cached);
        catalogLoadedOnce = true;
        segarkanDataKatalogSenyap();
        return;
      }
    }

    const loadingEl = document.getElementById("catalogLoadingState");
    const emptyEl = document.getElementById("catalogEmptyState");
    const gridWrapperEl = document.getElementById("catalogGridWrapper");

    loadingEl.style.display = "block";
    emptyEl.style.display = "none";
    gridWrapperEl.style.display = "none";

    const gabungan = await ambilGabunganKatalogDanLelang(paksaSegarkan);
    if (gabungan && gabungan.length > 0) {
      prosesBarisKatalog(gabungan);
      catalogLoadedOnce = true;
      return;
    }

    if (masterCatalogItems.length > 0) {
      terapkanFilterKatalog();
      return;
    }

    prosesBarisKatalog(FALLBACK_CATALOG_DATA);
    tampilkanToast("🛒 Menampilkan data cadangan, coba segarkan kembali");
  }

  function prosesBarisKatalog(items) {
    const seenCodes = new Set();
    const validItems = [];

    items.forEach(raw => {
      const kode = String(raw.kode || "").trim().toUpperCase();
      const statusNorm = String(raw.status || "Tersedia").trim().toLowerCase();

      if (!kode || seenCodes.has(kode)) return;
      if (statusNorm === "tidak aktif" || statusNorm === "nonaktif") return;

      seenCodes.add(kode);
      validItems.push({
        kode: kode,
        nama: String(raw.nama || "-").trim(),
        kategori: String(raw.kategori || "Ikan Cupang").trim(),
        jenis: String(raw.jenis || "Koleksi").trim(),
        harga: Number(raw.harga) || 0,
        foto: String(raw.foto || "").trim(),
        deskripsi: String(raw.deskripsi || "Koleksi resmi berkualitas dari Cupang Kasep.").trim(),
        stok: isNaN(Number(raw.stok)) ? 0 : Number(raw.stok),
        status: String(raw.status || "Tersedia").trim(),
        spesies: String(raw.spesies || "").trim(),
        tailType: String(raw.tailType || "").trim(),
        sex: String(raw.sex || "").trim(),
        size: String(raw.size || "").trim(),
        origin: String(raw.origin || "").trim(),
        shipping: String(raw.shipping || "").trim(),
        views: Number(raw.views) || 0,
        ob: Number(raw.ob) || Number(raw.harga) || 0,
        kb: Number(raw.kb) || 20000,
        bin: Number(raw.bin) || 0,
        postDate: String(raw.postDate || "").trim(),
        startTime: String(raw.startTime || "").trim(),
        endTime: String(raw.endTime || "").trim(),
        currentBid: Number(raw.currentBid) || 0,
        highestBidder: String(raw.highestBidder || "-").trim(),
        bidHistoryRaw: String(raw.bidHistoryRaw || "[]").trim()
      });
    });

    masterCatalogItems = validItems;
    perbaruiSchemaKatalogSEO(validItems);
    perbaruiDropdownJenis();

    const catalogPageEl = document.getElementById("catalogPage");
    const detailViewEl = document.getElementById("catalogDetailView");
    const sedangDiGridKatalog = catalogPageEl && catalogPageEl.style.display === "block" &&
      (!detailViewEl || detailViewEl.style.display !== "block");

    if (sedangDiGridKatalog) {
      terapkanFilterKatalog();
    }
  }

  // Otomatis menyuntikkan daftar ikan & produk dari Google Sheets ke dalam Schema.org Google Search
  function perbaruiSchemaKatalogSEO(items) {
    const schemaEl = document.getElementById("dynamicCatalogSchema");
    if (!schemaEl || !Array.isArray(items) || items.length === 0) return;

    const itemListElements = items.slice(0, 60).map((item, idx) => {
      const daftarMedia = dapatkanArrayMedia(item.foto);
      const mediaSampul = daftarMedia.find(m => m.type === "image") || daftarMedia[0];
      const isHabis = item.stok <= 0 || item.status.toLowerCase() === "habis" || item.status.toLowerCase() === "terjual";
      const hargaProduk = item.kategori.toLowerCase() === "lelang"
        ? (item.currentBid > 0 ? item.currentBid : item.ob)
        : item.harga;

      return {
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": `${item.nama} (${item.kode})`,
          "sku": item.kode,
          "mpn": item.kode,
          "category": item.kategori,
          "image": mediaSampul ? mediaSampul.url : CONFIG.PLACEHOLDER_IMAGE,
          "description": `${item.nama} - ${item.jenis}. ${item.deskripsi || 'Koleksi resmi Cupang Kasep Official.'}`,
          "brand": {
            "@type": "Brand",
            "name": "Cupang Kasep Official"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://www.cupangkasep.com/?produk=${encodeURIComponent(item.kode)}#produk-${encodeURIComponent(item.kode)}`,
            "priceCurrency": "IDR",
            "price": hargaProduk > 0 ? hargaProduk : 100000,
            "availability": isHabis ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Cupang Kasep Official"
            }
          }
        }
      };
    });

    const schemaPayload = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Katalog Ikan Cupang Kolektor & Lelang VIP Cupang Kasep Official",
      "numberOfItems": itemListElements.length,
      "itemListElement": itemListElements
    };

    schemaEl.textContent = JSON.stringify(schemaPayload);
  }

  // Mengubah Judul Tab Browser & Meta Description secara dinamis sesuai halaman/ikan yang dibuka
  function perbaruiJudulHalamanSEO(judulHalaman, deskripsiHalaman = "") {
    if (judulHalaman) {
      document.title = judulHalaman;
    }
    if (deskripsiHalaman) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", deskripsiHalaman);
    }
  }

  function pilihKategoriKatalog(kategori, btnEl) {
    playClickSound();
    currentCategoryFilter = kategori;
    sessionStorage.setItem("ck_last_cat_pill", kategori);
    document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    perbaruiDropdownJenis();
    terapkanFilterKatalog();
  }

  function perbaruiDropdownJenis() {
    const selectEl = document.getElementById("catalogTypeSelect");
    const nilaiSebelumnya = selectEl.value;

    const jenisSet = new Set();
    masterCatalogItems.forEach(item => {
      const cocokKategori = currentCategoryFilter === "Semua" ||
        item.kategori.toLowerCase() === currentCategoryFilter.toLowerCase();
      if (cocokKategori && item.jenis) {
        jenisSet.add(item.jenis);
      }
    });

    const ui = EXTRA_UI_TEXT[USER_LANG] || EXTRA_UI_TEXT.id;
    selectEl.innerHTML = `<option value="Semua">${ui.allTypes}</option>`;
    Array.from(jenisSet).sort().forEach(j => {
      const opt = document.createElement("option");
      opt.value = j;
      opt.textContent = j;
      selectEl.appendChild(opt);
    });

    if (Array.from(jenisSet).includes(nilaiSebelumnya)) {
      selectEl.value = nilaiSebelumnya;
    } else {
      selectEl.value = "Semua";
    }
  }

  // Mengecek apakah item katalog/lelang sudah habis atau terjual
  function apakahItemKatalogHabis(item) {
    if (!item) return true;
    const statusNorm = String(item.status || "").trim().toLowerCase();
    return item.stok <= 0 || statusNorm === "habis" || statusNorm === "terjual" || statusNorm === "sold";
  }

  // Mendapatkan informasi Batch Tanggal Lelang (WIB / UTC+7) dari Tanggal Post, Waktu Mulai, atau Waktu Tutup
  function dapatkanInfoBatchLelang(item) {
    const rawStr = (item && (item.postDate || item.startTime || item.endTime || "")).trim();
    if (!rawStr) {
      const fallbackTxt = USER_LANG === "en" ? "GENERAL AUCTION BATCH" : (USER_LANG === "zh" ? "常规拍卖批次" : "BATCH LELANG UMUM");
      return { key: "BATCH-UMUM", label: fallbackTxt, isToday: false, daySortValue: 0 };
    }

    let ts = parseWaktuLelang(rawStr);

    // Dukungan tambahan jika tanggal ditulis dengan nama bulan (contoh: 16 November 2026 / 15 Nov 2026)
    if (!ts) {
      const petaBulan = {
        jan: 0, januari: 0, january: 0,
        feb: 1, februari: 1, february: 1,
        mar: 2, maret: 2, march: 2,
        apr: 3, april: 3,
        mei: 4, may: 4,
        jun: 5, juni: 5, june: 5,
        jul: 6, juli: 6, july: 6,
        agu: 7, agustus: 7, aug: 7, august: 7,
        sep: 8, september: 8,
        okt: 9, oktober: 9, oct: 9, october: 9,
        nov: 10, november: 10,
        des: 11, desember: 11, dec: 11, december: 11
      };
      const mTeks = rawStr.match(/(\d{1,2})[\s\/\-]+([a-zA-Z]+)[\s\/\-]+(\d{4})/);
      if (mTeks) {
        const d = Number(mTeks[1]);
        const namaBln = mTeks[2].toLowerCase();
        const y = Number(mTeks[3]);
        if (petaBulan[namaBln] !== undefined) {
          ts = Date.UTC(y, petaBulan[namaBln], d, 0, 0, 0) - (7 * 60 * 60 * 1000);
        }
      }
    }

    if (!ts) {
      return { key: rawStr.toUpperCase(), label: `BATCH • ${rawStr.toUpperCase()}`, isToday: false, daySortValue: 1 };
    }

    // Konversi ke kalender WIB (UTC+7)
    const offsetWIB = 7 * 60 * 60 * 1000;
    const itemWIB = new Date(ts + offsetWIB);
    const nowWIB = new Date(Date.now() + offsetWIB);
    const yesterdayWIB = new Date(Date.now() + offsetWIB - (24 * 60 * 60 * 1000));

    const formatKey = (dObj) => {
      const y = dObj.getUTCFullYear();
      const m = String(dObj.getUTCMonth() + 1).padStart(2, "0");
      const d = String(dObj.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const itemKey = formatKey(itemWIB);
    const todayKey = formatKey(nowWIB);
    const yesterdayKey = formatKey(yesterdayWIB);

    const namaBulanID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const namaBulanEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const tgl = itemWIB.getUTCDate();
    const blnIdx = itemWIB.getUTCMonth();
    const thn = itemWIB.getUTCFullYear();

    let tanggalCantik = `${tgl} ${namaBulanID[blnIdx]} ${thn}`;
    if (USER_LANG === "en") tanggalCantik = `${namaBulanEN[blnIdx]} ${tgl}, ${thn}`;
    else if (USER_LANG === "zh") tanggalCantik = `${thn}年${blnIdx + 1}月${tgl}日`;

    const daySortValue = Date.UTC(thn, blnIdx, tgl);

    if (itemKey === todayKey) {
      const prefix = USER_LANG === "en" ? "TODAY'S BATCH" : (USER_LANG === "zh" ? "今日拍卖批次" : "BATCH HARI INI");
      return { key: itemKey, label: `${prefix} — ${tanggalCantik}`, isToday: true, daySortValue: daySortValue };
    } else if (itemKey === yesterdayKey) {
      const prefix = USER_LANG === "en" ? "YESTERDAY'S BATCH" : (USER_LANG === "zh" ? "昨日拍卖批次" : "BATCH KEMARIN");
      return { key: itemKey, label: `${prefix} — ${tanggalCantik}`, isToday: false, daySortValue: daySortValue };
    } else {
      const prefix = USER_LANG === "en" ? "AUCTION BATCH" : (USER_LANG === "zh" ? "拍卖批次" : "BATCH LELANG");
      return { key: itemKey, label: `${prefix} — ${tanggalCantik}`, isToday: false, daySortValue: daySortValue };
    }
  }

  function terapkanFilterKatalog() {
    const keyword = document.getElementById("catalogSearchInput").value.trim().toLowerCase();
    const selectedJenis = document.getElementById("catalogTypeSelect").value;
    const sortBy = document.getElementById("catalogSortSelect").value;

    let hasil = masterCatalogItems.filter(item => {
      const katNorm = item.kategori.toLowerCase();
      const cocokKategori = currentCategoryFilter === "Lelang"
        ? katNorm === "lelang"
        : (katNorm !== "lelang" && (currentCategoryFilter === "Semua" || katNorm === currentCategoryFilter.toLowerCase()));

      const cocokJenis = selectedJenis === "Semua" ||
        item.jenis.toLowerCase() === selectedJenis.toLowerCase();

      const cocokKeyword = !keyword ||
        item.nama.toLowerCase().includes(keyword) ||
        item.kode.toLowerCase().includes(keyword) ||
        item.jenis.toLowerCase().includes(keyword);

      return cocokKategori && cocokJenis && cocokKeyword;
    });

    hasil.sort((a, b) => {
      if (currentCategoryFilter === "Lelang") {
        // 1. Kelompokkan berdasarkan Batch Tanggal (Hari Ini di atas Kemarin & tanggal sebelumnya)
        const batchA = dapatkanInfoBatchLelang(a);
        const batchB = dapatkanInfoBatchLelang(b);
        if (batchB.daySortValue !== batchA.daySortValue) {
          return batchB.daySortValue - batchA.daySortValue;
        }
        // 2. Di dalam batch tanggal yang sama, utamakan lelang yang masih aktif/upcoming di atas yang sudah selesai
        const aSelesai = (apakahItemKatalogHabis(a) || apakahWaktuLelangHabis(a.endTime)) ? 1 : 0;
        const bSelesai = (apakahItemKatalogHabis(b) || apakahWaktuLelangHabis(b.endTime)) ? 1 : 0;
        if (aSelesai !== bSelesai) return aSelesai - bSelesai;
      } else {
        // Untuk Koleksi CK: item Tersedia otomatis selalu berada di paling atas, yang Habis/Terjual di bawah
        const aHabis = apakahItemKatalogHabis(a) ? 1 : 0;
        const bHabis = apakahItemKatalogHabis(b) ? 1 : 0;
        if (aHabis !== bHabis) return aHabis - bHabis;
      }

      // 3. Terapkan urutan pilihan user (Populer / Harga) di dalam kelompoknya
      if (sortBy === "popular") {
        return (Number(b.views) || 0) - (Number(a.views) || 0);
      } else if (sortBy === "price-asc") {
        const hargaA = currentCategoryFilter === "Lelang" ? (a.currentBid > 0 ? a.currentBid : a.ob) : a.harga;
        const hargaB = currentCategoryFilter === "Lelang" ? (b.currentBid > 0 ? b.currentBid : b.ob) : b.harga;
        return hargaA - hargaB;
      } else if (sortBy === "price-desc") {
        const hargaA = currentCategoryFilter === "Lelang" ? (a.currentBid > 0 ? a.currentBid : a.ob) : a.harga;
        const hargaB = currentCategoryFilter === "Lelang" ? (b.currentBid > 0 ? b.currentBid : b.ob) : b.harga;
        return hargaB - hargaA;
      }
      return 0;
    });

    renderKartuKatalog(hasil);
  }

  function renderKartuKatalog(items) {
    const loadingEl = document.getElementById("catalogLoadingState");
    const emptyEl = document.getElementById("catalogEmptyState");
    const gridWrapperEl = document.getElementById("catalogGridWrapper");
    const detailViewEl = document.getElementById("catalogDetailView");
    const controlsEl = document.querySelector(".catalog-controls");
    const gridEl = document.getElementById("catalogGrid");
    const countTextEl = document.getElementById("catalogCountText");

    loadingEl.style.display = "none";
    if (detailViewEl) detailViewEl.style.display = "none";
    if (controlsEl) controlsEl.style.display = "flex";
    countTextEl.textContent = items.length;
    perbaruiTombolKeranjangMelayang();

    if (items.length === 0) {
      gridWrapperEl.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";
    gridWrapperEl.style.display = "block";

    // Hitung jumlah ikan per Batch Tanggal untuk ditampilkan pada badge pemisah Lelang CK
    const sedangModeLelang = currentCategoryFilter === "Lelang";
    const hitungPerBatch = {};
    if (sedangModeLelang) {
      items.forEach(it => {
        const bInfo = dapatkanInfoBatchLelang(it);
        hitungPerBatch[bInfo.key] = (hitungPerBatch[bInfo.key] || 0) + 1;
      });
    }

    let lastBatchKey = null;

    gridEl.innerHTML = items.map(item => {
      let dividerBatchHtml = "";
      if (sedangModeLelang) {
        const batchInfo = dapatkanInfoBatchLelang(item);
        if (batchInfo.key !== lastBatchKey) {
          lastBatchKey = batchInfo.key;
          const totalDiBatchIni = hitungPerBatch[batchInfo.key] || 1;
          const satuanIkan = USER_LANG === "en" ? "Fish" : (USER_LANG === "zh" ? "条" : "Ikan");
          dividerBatchHtml = `
            <div class="auction-batch-divider notranslate">
              <div class="auction-batch-pill ${batchInfo.isToday ? 'today-batch' : ''}">
                <span>${batchInfo.isToday ? '✦' : '◈'}</span>
                <span>${batchInfo.label}</span>
                <span class="auction-batch-count">${totalDiBatchIni} ${satuanIkan}</span>
              </div>
            </div>
          `;
        }
      }

      const isHabis = apakahItemKatalogHabis(item);
      const daftarMedia = dapatkanArrayMedia(item.foto);
      const mediaSampul = daftarMedia.find(m => m.type === "image") || daftarMedia[0];
      const punyaVideo = daftarMedia.some(m => m.type !== "image");
      const waLinkRestock = buatLinkWhatsAppKatalog(item, true);
      const kodeAttr = escapeHtml(item.kode);
      const kodeSafe = escapeJsAttr(item.kode);
      const jumlahViews = Number(item.views) || 0;
      const isIkan = item.kategori.toLowerCase().includes("ikan");
      const isLelang = item.kategori.toLowerCase() === "lelang";

      // Hanya tampilkan HOT jika berada di menu Koleksi CK (bukan item Lelang & bukan menu Lelang)
      const isHot = !isLelang && currentCategoryFilter !== "Lelang" && !isHabis && jumlahViews >= HOT_VIEWS_THRESHOLD;
      const belumMulaiLelang = isLelang && apakahLelangBelumMulai(item.startTime);
      const sudahSelesaiLelang = isLelang && (isHabis || apakahWaktuLelangHabis(item.endTime));
      const infoTimerAwal = isLelang ? formatHitungMundurLelang(item.endTime, item.startTime) : null;
      const hargaTampil = isLelang ? (item.currentBid > 0 ? item.currentBid : item.ob) : item.harga;

      const tombolAksiKanan = isLelang
        ? `<button type="button" class="btn-card-cart ${sudahSelesaiLelang ? 'restock-mode' : ''}" data-auction-card-btn="${kodeAttr}" data-action="open-detail" data-kode="${kodeAttr}">
             ${sudahSelesaiLelang ? 'Hasil Lelang' : (belumMulaiLelang ? 'Detail Jadwal' : 'Ikut Bid')}
           </button>`
        : (isHabis
            ? (isIkan
                ? `<button type="button" class="btn-card-cart restock-mode" disabled style="cursor: not-allowed; opacity: 0.65;">Terjual</button>`
                : `<a href="${escapeHtml(waLinkRestock)}" target="_blank" rel="noopener noreferrer" class="btn-card-cart restock-mode">Tanya Restock</a>`)
            : `<button type="button" class="btn-card-cart" data-action="add-cart" data-kode="${kodeAttr}">Beli</button>`);

      const daftarGambarKartu = daftarMedia.filter(m => m.type === "image");
      const slidesList = daftarGambarKartu.length > 0 ? daftarGambarKartu : [mediaSampul];
      const multiSlide = slidesList.length > 1;

      const slidesHtml = slidesList.map((m, sIdx) => `
        <div class="card-slide-item">
          <img src="${escapeHtml(sanitizeUrl(m.thumbUrl, CONFIG.PLACEHOLDER_IMAGE))}" alt="${escapeHtml(item.nama)} ${sIdx + 1}" class="product-thumb" loading="lazy" decoding="async" draggable="false" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
        </div>
      `).join("");

      const dotsHtml = multiSlide ? `
        <div class="card-slider-dots" id="dots_${kodeAttr}" style="${isLelang ? 'bottom: 34px;' : ''}">
          ${slidesList.map((_, dIdx) => `<span class="card-dot ${dIdx === 0 ? 'active' : ''}"></span>`).join("")}
        </div>
      ` : "";

      const navArrowsHtml = multiSlide ? `
        <button type="button" class="card-slider-nav prev" data-action="slide-card" data-kode="${kodeAttr}" data-dir="-1" title="Sebelumnya">‹</button>
        <button type="button" class="card-slider-nav next" data-action="slide-card" data-kode="${kodeAttr}" data-dir="1" title="Berikutnya">›</button>
      ` : "";

      return `
        ${dividerBatchHtml}
        <div class="product-card ${(isHabis || sudahSelesaiLelang) ? 'out-of-stock' : ''}">
          <div class="product-thumb-wrapper" data-action="card-thumb-detail" data-kode="${kodeAttr}">
            <div class="card-slider-track" id="track_${kodeAttr}" data-slider-kode="${kodeAttr}">
              ${slidesHtml}
            </div>
            ${navArrowsHtml}
            ${dotsHtml}
            <span class="views-badge-overlay notranslate">◈ ${jumlahViews}</span>
            ${isHot ? '<span class="hot-badge-overlay notranslate">✦ POPULAR</span>' : ''}
            ${punyaVideo ? '<span class="video-badge-overlay">▶ VIDEO</span>' : ''}
            ${isLelang ? `<span class="auction-timer-badge notranslate ${sudahSelesaiLelang ? 'ended' : (belumMulaiLelang ? 'upcoming' : 'active-live')}" data-auction-timer="${kodeAttr}" data-starttime="${escapeHtml(item.startTime)}" data-endtime="${escapeHtml(item.endTime)}" data-force-ended="${sudahSelesaiLelang}" data-phase="${sudahSelesaiLelang ? 'ended' : (belumMulaiLelang ? 'upcoming' : 'active')}">${sudahSelesaiLelang ? '● LELANG SELESAI' : escapeHtml(infoTimerAwal.text)}</span>` : ''}
          </div>
          <div class="product-content">
            <div class="card-badges-row">
              <span class="badge-pill-tag primary">${isLelang ? 'LELANG VIP' : escapeHtml(item.kategori)}</span>
              <span class="badge-pill-tag outline notranslate">${escapeHtml(item.jenis)}</span>
            </div>
            <h3 class="product-title notranslate">${escapeHtml(item.nama)} (${kodeAttr})</h3>
            <div class="product-price notranslate">
              ${isLelang ? `<span style="font-size:10px; color:var(--text-muted); font-weight:600;">${item.currentBid > 0 ? 'Bid Saat Ini:' : 'Open Bid:'}</span><br>` : ''}
              ${escapeHtml(formatRupiah(hargaTampil))}
            </div>
            <div class="card-actions-row">
              ${tombolAksiKanan}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function parseMediaItem(rawUrl) {
    if (!rawUrl) return null;
    let cleanUrl = String(rawUrl).trim();
    if (!cleanUrl) return null;

    const lower = cleanUrl.toLowerCase();
    const isMarkedVideo =
      lower.includes("#video") ||
      lower.includes("?video") ||
      lower.includes("&video") ||
      lower.includes("/preview") ||
      lower.startsWith("video:") ||
      /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(lower);

    cleanUrl = cleanUrl
      .replace(/^video:/i, "")
      .replace(/#video/ig, "")
      .replace(/([?&])video(=1)?/ig, "")
      .trim();

    const matchGDrive = cleanUrl.match(/(?:\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/);
    if (matchGDrive && matchGDrive[1]) {
      const fileId = matchGDrive[1];
      const thumbUrl = `https://lh3.googleusercontent.com/d/${fileId}=w600`;
      const hdUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1200`;

      if (isMarkedVideo) {
        return {
          type: "gdrive-video",
          url: `https://drive.google.com/file/d/${fileId}/preview`,
          thumbUrl: thumbUrl
        };
      }
      return {
        type: "image",
        url: hdUrl,
        thumbUrl: thumbUrl
      };
    }

    if (isMarkedVideo) {
      return {
        type: "video",
        url: cleanUrl,
        thumbUrl: CONFIG.PLACEHOLDER_IMAGE
      };
    }

    return {
      type: "image",
      url: cleanUrl,
      thumbUrl: cleanUrl
    };
  }

  function dapatkanArrayMedia(teksMedia) {
    if (!teksMedia) {
      return [{ type: "image", url: CONFIG.PLACEHOLDER_IMAGE, thumbUrl: CONFIG.PLACEHOLDER_IMAGE }];
    }
    const list = String(teksMedia)
      .split(/[,|\n]+/)
      .map(u => parseMediaItem(u))
      .filter(Boolean);
    return list.length > 0
      ? list
      : [{ type: "image", url: CONFIG.PLACEHOLDER_IMAGE, thumbUrl: CONFIG.PLACEHOLDER_IMAGE }];
  }

  let currentDetailMedia = [];
  let currentDetailIndex = 0;
  let isDraggingSliderPC = false;

  // Fungsi Geser & Drag Slider pada Kartu Katalog / Lelang (HP & PC)
  function geserSlideKartu(e, kode, arah) {
    e.stopPropagation();
    playClickSound();
    const track = document.getElementById("track_" + kode);
    if (!track) return;
    const lebar = track.clientWidth;
    const maxScroll = track.scrollWidth - lebar;
    let target = track.scrollLeft + (arah * lebar);
    if (target > maxScroll + 10) target = 0;
    if (target < -10) target = maxScroll;
    track.scrollTo({ left: target, behavior: "smooth" });
  }

  function updateDotsKartu(kode) {
    const track = document.getElementById("track_" + kode);
    const dotsBox = document.getElementById("dots_" + kode);
    if (!track || !dotsBox) return;
    const idx = Math.round(track.scrollLeft / (track.clientWidth || 1));
    const dots = dotsBox.querySelectorAll(".card-dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  function mulaiDragSliderPC(e, trackEl) {
    if (e.button !== 0) return;
    isDraggingSliderPC = false;
    const startX = e.pageX;
    const scrollStart = trackEl.scrollLeft;
    trackEl.style.scrollBehavior = "auto";
    trackEl.style.scrollSnapType = "none";

    const onMove = (ev) => {
      const walk = ev.pageX - startX;
      if (Math.abs(walk) > 6) {
        isDraggingSliderPC = true;
        trackEl.scrollLeft = scrollStart - walk;
      }
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      trackEl.style.scrollBehavior = "smooth";
      trackEl.style.scrollSnapType = "x mandatory";
      const idx = Math.round(trackEl.scrollLeft / (trackEl.clientWidth || 1));
      trackEl.scrollTo({ left: idx * trackEl.clientWidth, behavior: "smooth" });
      setTimeout(() => { isDraggingSliderPC = false; }, 60);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function klikKartuBukaDetail(e, kode) {
    if (isDraggingSliderPC) {
      e.stopPropagation();
      return;
    }
    bukaDetailProduk(kode);
  }

  // Fungsi Geser / Swipe Media di Halaman Detail Produk (HP & PC)
  function geserMediaDetail(e, arah) {
    if (e) e.stopPropagation();
    if (!currentDetailMedia || currentDetailMedia.length <= 1) return;
    let nextIdx = currentDetailIndex + arah;
    if (nextIdx >= currentDetailMedia.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = currentDetailMedia.length - 1;
    const thumbs = document.querySelectorAll(".detail-thumb-item");
    gantiFotoDetail(nextIdx, thumbs[nextIdx] || null);
  }

  function pasangGestureSwipeDetail(boxEl) {
    if (!boxEl || boxEl.dataset.swipeBound) return;
    boxEl.dataset.swipeBound = "1";
    let startX = 0;
    let startY = 0;

    // Touch Swipe untuk HP / Tablet
    boxEl.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    boxEl.addEventListener("touchend", (e) => {
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        geserMediaDetail(null, dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    // Mouse Drag untuk PC
    let mouseDownX = 0;
    let isMouseSwiping = false;
    boxEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      mouseDownX = e.clientX;
      isMouseSwiping = true;
      isDraggingSliderPC = false;
    });
    boxEl.addEventListener("mousemove", (e) => {
      if (!isMouseSwiping) return;
      if (Math.abs(e.clientX - mouseDownX) > 10) isDraggingSliderPC = true;
    });
    boxEl.addEventListener("mouseup", (e) => {
      if (!isMouseSwiping) return;
      isMouseSwiping = false;
      const dx = e.clientX - mouseDownX;
      if (Math.abs(dx) > 45) {
        geserMediaDetail(null, dx < 0 ? 1 : -1);
      }
      setTimeout(() => { isDraggingSliderPC = false; }, 80);
    });
  }

  function renderMediaUtamaHtml(mediaObj, index, total, namaProduk) {
    currentDetailIndex = index;
    const counterHtml = `<span class="detail-img-counter" id="detailImgCounter">${index + 1}/${total}</span>`;
    const navButtonsHtml = total > 1 ? `
      <button type="button" class="card-slider-nav prev" data-action="slide-detail" data-dir="-1" title="Sebelumnya">‹</button>
      <button type="button" class="card-slider-nav next" data-action="slide-detail" data-dir="1" title="Berikutnya">›</button>
    ` : "";

    setTimeout(() => {
      const box = document.getElementById("detailMainMediaBox");
      if (box) pasangGestureSwipeDetail(box);
    }, 20);

    const cleanMediaUrl = sanitizeUrl(mediaObj.url, CONFIG.PLACEHOLDER_IMAGE);
    if (mediaObj.type === "gdrive-video") {
      return `
        ${counterHtml}
        ${navButtonsHtml}
        <iframe src="${escapeHtml(cleanMediaUrl)}" allow="autoplay; fullscreen" allowfullscreen style="animation: fadeIn 0.28s ease;"></iframe>
      `;
    } else if (mediaObj.type === "video") {
      return `
        ${counterHtml}
        ${navButtonsHtml}
        <video src="${escapeHtml(cleanMediaUrl)}" controls playsinline webkit-playsinline x5-playsinline preload="metadata" style="animation: fadeIn 0.28s ease;" onloadedmetadata="pasangListenerFullscreenVideo(this)"></video>
      `;
    } else {
      return `
        ${counterHtml}
        ${navButtonsHtml}
        <img id="detailMainImg" src="${escapeHtml(cleanMediaUrl)}" alt="${escapeHtml(namaProduk || 'Produk')}" draggable="false" referrerpolicy="no-referrer" style="animation: fadeIn 0.28s ease;" data-action="zoom-img" data-url="${escapeHtml(cleanMediaUrl)}" data-check-drag="1" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
      `;
    }
  }

  function pasangListenerFullscreenVideo(videoEl) {
    if (!videoEl || videoEl.dataset.fsBound) return;
    videoEl.dataset.fsBound = "1";

    const updateModeFullscreen = () => {
      const isFs = document.fullscreenElement === videoEl ||
                   document.webkitFullscreenElement === videoEl ||
                   videoEl.webkitDisplayingFullscreen;

      if (isFs) {
        videoEl.classList.add("is-fullscreen-mode");
        videoEl.style.objectFit = "contain";

        // Deteksi otomatis rasio asli video: Portrait vs Landscape
        if (screen.orientation && screen.orientation.lock && videoEl.videoWidth && videoEl.videoHeight) {
          const modeRasio = videoEl.videoHeight > videoEl.videoWidth ? "portrait" : "landscape";
          screen.orientation.lock(modeRasio).catch(() => {});
        }
      } else {
        videoEl.classList.remove("is-fullscreen-mode");
        videoEl.style.objectFit = "cover"; // Kembali ke 1:1 penuh di kotak detail produk
        if (screen.orientation && screen.orientation.unlock) {
          try { screen.orientation.unlock(); } catch (e) {}
        }
      }
    };

    videoEl.addEventListener("fullscreenchange", updateModeFullscreen);
    videoEl.addEventListener("webkitfullscreenchange", updateModeFullscreen);
    videoEl.addEventListener("webkitbeginfullscreen", updateModeFullscreen);
    videoEl.addEventListener("webkitendfullscreen", updateModeFullscreen);
  }

  let lastCatalogScrollPos = 0;

  function bukaDetailProduk(kodeProduk, simpanHistory = true) {
    playClickSound();
    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (!item) return;

    currentOpenDetailCode = item.kode;

    // Catat +1 View (Anti-Spam) & kirim ke Google Sheets
    catatViewProduk(item);

    lastCatalogScrollPos = window.scrollY || 0;

    const isHabis = item.stok <= 0 || item.status.toLowerCase() === "habis";
    currentDetailMedia = dapatkanArrayMedia(item.foto);
    const mediaUtama = currentDetailMedia[0];
    const totalMedia = currentDetailMedia.length;

    const waLink = buatLinkWhatsAppKatalog(item, isHabis);
    const isIkan = item.kategori.toLowerCase().includes("ikan");
    const kodeAttr = escapeHtml(item.kode);
    const jumlahViews = Number(item.views) || 0;

    document.getElementById("catalogGridWrapper").style.display = "none";
    document.querySelector(".catalog-controls").style.display = "none";

    const detailViewEl = document.getElementById("catalogDetailView");
    const contentEl = document.getElementById("catalogDetailContent");

    const thumbnailsHtml = currentDetailMedia.map((media, idx) => `
      <div class="detail-thumb-item ${idx === 0 ? 'active' : ''}" data-action="pick-thumb" data-index="${idx}">
        <img src="${escapeHtml(sanitizeUrl(media.thumbUrl, CONFIG.PLACEHOLDER_IMAGE))}" alt="Thumb ${idx + 1}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
        ${media.type !== 'image' ? '<div class="thumb-play-badge">▶</div>' : ''}
      </div>
    `).join("");

    const isLelang = item.kategori.toLowerCase() === "lelang";
    const ctaButtonsHtml = isLelang
      ? renderPanelDetailLelangHtml(item)
      : (isHabis
          ? (isIkan
              ? `<button type="button" class="btn-detail-addcart" disabled style="background: rgba(168, 50, 64, 0.2); border: 1px solid var(--danger-red); color: #f5d0d5; cursor: not-allowed; opacity: 0.7;">Terjual (Sold Out)</button>`
              : `<a href="${escapeHtml(waLink)}" target="_blank" rel="noopener noreferrer" class="btn-detail-addcart" style="background: rgba(168, 50, 64, 0.2); border: 1px solid var(--danger-red); color: #f5d0d5;">Tanya Restock via WA</a>`)
          : `
            <button type="button" class="btn-detail-addcart" style="border:none; cursor:pointer;" data-action="add-cart" data-kode="${kodeAttr}">
              Masukkan Keranjang
            </button>
            <a href="${escapeHtml(waLink)}" target="_blank" rel="noopener noreferrer" class="btn-detail-back" style="text-decoration:none; display:flex; align-items:center; justify-content:center;">
              Beli Langsung
            </a>
          `);

    contentEl.innerHTML = `
      <div class="detail-layout-grid">
        <div class="detail-media-col">
          <div class="detail-main-img-box" id="detailMainMediaBox">
            ${renderMediaUtamaHtml(mediaUtama, 0, totalMedia, item.nama)}
          </div>
          <div class="detail-thumb-list">
            ${thumbnailsHtml}
          </div>
        </div>

        <div class="detail-info-col">
          <div class="card-badges-row">
            <span class="badge-pill-tag primary">${escapeHtml(item.kategori)}</span>
            <span class="badge-pill-tag outline notranslate">${escapeHtml(item.jenis)}</span>
            <span class="badge-pill-tag outline notranslate">◈ ${jumlahViews}${(EXTRA_UI_TEXT[USER_LANG] || EXTRA_UI_TEXT.id).viewsSuffix}</span>
            <span class="badge-stock-pill ${isHabis ? 'out-stock' : 'in-stock'}">
              ● ${isHabis ? 'Stok Habis' : 'Tersedia (' + (Number(item.stok) || 0) + ')'}
            </span>
          </div>

          <h2 class="detail-title notranslate">${escapeHtml(item.nama)} (${escapeHtml(item.kode)})</h2>

          <div class="detail-price-wrap notranslate">
            <span class="detail-price">${escapeHtml(formatRupiah(item.harga))}</span>
            <span class="detail-currency">${escapeHtml(dapatkanKodeMataUang())}</span>
          </div>

          <div class="detail-stars">★★★★★</div>

          <div class="spec-table-box">
            <div class="spec-row">
              <span class="spec-label notranslate">Species</span>
              <span class="spec-value notranslate">${escapeHtml(item.spesies || (isIkan ? 'Betta Splendens' : item.kategori))}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Tail Type</span>
              <span class="spec-value notranslate">${escapeHtml(item.tailType || '-')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Strain</span>
              <span class="spec-value notranslate">${escapeHtml(item.jenis || '-')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Sex</span>
              <span class="spec-value notranslate">${escapeHtml(item.sex || '-')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Size</span>
              <span class="spec-value notranslate">${escapeHtml(item.size || '-')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Origin</span>
              <span class="spec-value notranslate">${escapeHtml(item.origin || 'Indonesia')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label notranslate">Shipping</span>
              <span class="spec-value">${escapeHtml(item.shipping || 'Garansi Hidup Sampai Tujuan (DOA)')}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Deskripsi</span>
              <span class="spec-value" style="font-weight: 500; color: var(--text-light);">${escapeHtml(item.deskripsi || '-')}</span>
            </div>
          </div>

          <p class="detail-note">
            ${isIkan ? 'Setiap ikan cupang memiliki corak unik — dijual per ekor sesuai foto/video.' : 'Ikan rawatan resmi berkualitas tinggi dari Cupang Kasep.'}
          </p>

          <div class="detail-cta-row" style="flex-wrap: wrap;">
            ${ctaButtonsHtml}
            <button type="button" class="btn-detail-back" data-action="share-product" data-kode="${kodeAttr}" title="Salin Link Produk">
              Bagikan
            </button>
          </div>
        </div>
      </div>
    `;

    const topBackBtn = document.getElementById("catalogBackBtn");
    if (topBackBtn) {
      topBackBtn.innerHTML = "← Kembali";
      topBackBtn.setAttribute("onclick", "tutupDetailProduk()");
    }

    detailViewEl.style.display = "block";
    if (simpanHistory) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    perbaruiJudulHalamanSEO(
      `${item.nama} (${item.kode}) — ${item.jenis} | Cupang Kasep Official`,
      `Beli / Ikut Lelang ${item.nama} (${item.kode}) Strain ${item.jenis}. ${item.deskripsi} Garansi hidup sampai tujuan (DOA) di Cupang Kasep Official.`
    );

    aturSorotanNavbar("gallery");
    const targetHash = "#produk-" + encodeURIComponent(item.kode);
    simpanRuteTerakhir(targetHash);
    try { localStorage.setItem("ck_last_mode_lelang", isLelang ? "1" : "0"); } catch (e) {}
    try { sessionStorage.setItem("ck_last_mode_lelang", isLelang ? "1" : "0"); } catch (e) {}
    if (simpanHistory && window.location.hash !== targetHash) {
      history.pushState({ page: "catalogDetail", kode: item.kode }, "", targetHash);
    }
  }

  // ✅ GANTI FUNGSI bagikanLinkProduk DENGAN INI (Bisa berjalan walau masih Offline / file://)
  function bagikanLinkProduk(kodeProduk) {
    playClickSound();
    const baseUrl = window.location.href.split("#")[0].split("?")[0];
    const isLocalFile = window.location.protocol === "file:";
    
    // Jika masih offline (file://), gunakan #produk- saja agar tidak error di komputer
    const shareUrl = isLocalFile
      ? `${baseUrl}#produk-${encodeURIComponent(kodeProduk)}`
      : `${baseUrl}?produk=${encodeURIComponent(kodeProduk)}#produk-${encodeURIComponent(kodeProduk)}`;

    // Salin otomatis (mendukung mode Online maupun Offline file://)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl);
    } else {
      const tempInput = document.createElement("textarea");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }

    tampilkanToast("🔗 Link produk " + kodeProduk + " berhasil disalin!");
  }

  function gantiFotoDetail(index, thumbEl) {
    playClickSound();
    const mediaObj = currentDetailMedia[index];
    if (!mediaObj) return;

    const mainBox = document.getElementById("detailMainMediaBox");
    if (mainBox) {
      mainBox.innerHTML = renderMediaUtamaHtml(mediaObj, index, currentDetailMedia.length, "Media Produk");
    }

    document.querySelectorAll(".detail-thumb-item").forEach(el => el.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
  }

  function tutupDetailProduk(simpanHistory = true) {
    playClickSound();
    document.getElementById("catalogDetailView").style.display = "none";
    document.querySelector(".catalog-controls").style.display = "flex";
    document.getElementById("catalogGridWrapper").style.display = "block";

    // Render ulang kartu agar angka views terbaru langsung tampil di katalog
    terapkanFilterKatalog();

    const topBackBtn = document.getElementById("catalogBackBtn");
    if (topBackBtn) {
      topBackBtn.innerHTML = "← Kembali";
      topBackBtn.setAttribute("onclick", "kembaliKeLanding()");
    }

    currentOpenDetailCode = null;
    aturSorotanNavbar("gallery");
    const targetHashKembali = currentCategoryFilter === "Lelang" ? "#lelang" : "#katalog";
    simpanRuteTerakhir(targetHashKembali);
    if (simpanHistory && window.location.hash.startsWith("#produk-")) {
      // Ganti ke replaceState untuk mencegah penumpukan riwayat yang menyebabkan user "terpental"
      history.replaceState({ page: "catalogPage" }, "", targetHashKembali);
    }

    setTimeout(() => {
      window.scrollTo({ top: lastCatalogScrollPos, behavior: "instant" });
    }, 30);
  }

  /* =========================================================
     3. LOGIKA SERTIFIKAT & ROULETTE (VALIDASI FULL BACKEND)
     ========================================================= */
  // Data sertifikat & voucher tidak lagi disimpan di frontend (diambil aman dari Google Apps Script)
  let adminCertsCache = {};
  let adminVouchersCache = [];
  let isAdminSpinMode = false;

  // Digunakan hanya untuk checksum lokal non-rahasia (deteksi update halaman & display hash)
  function hitungHashRahasia(teks) {
    let h = 2166136261;
    for (let i = 0; i < teks.length; i++) {
      h ^= teks.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).toUpperCase();
  }

  // Label & Palet Warna Roda Roulette Dark Luxury (Monte Carlo VIP Style)
  const segmenRoulette = [
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#0b0d12", text: "#8a8479" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#171a22", text: "#e8d5b5" },
    { label: "Ketapang", full: "1x Ekstrak Ketapang", code: "PR2", type: "prize", weight: 13.529412, color: "#11261f", text: "#e8d5b5" },
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#0b0d12", text: "#8a8479" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#1d1814", text: "#e8d5b5" },
    { label: "Diskon 100K", full: "Voucher Diskon 100K", code: "JP1", type: "jackpot", weight: 1.5, color: "#42121b", text: "#e8d5b5" },
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#0b0d12", text: "#8a8479" },
    { label: "Ketapang", full: "1x Ekstrak Ketapang", code: "PR2", type: "prize", weight: 13.529412, color: "#11261f", text: "#e8d5b5" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#171a22", text: "#e8d5b5" },
    { label: "★ FREE IKAN", full: "GRAND PRIZE: 1 Ikan Bebas Pilih!", code: "JP2", type: "jackpot", weight: 1.0, color: "#785a2c", text: "#ffffff" }
  ];

  const kamusKodeHadiah = {
    "PR1": "1x Stick Flaring",
    "PR2": "1x Ekstrak Ketapang",
    "JP1": "Voucher Diskon 100K",
    "JP2": "GRAND PRIZE: 1 Ikan Bebas Pilih!"
  };

  const STORAGE_KEY_VOUCHER = "ck_voucher_usage_v3";
  let activeVoucherCode = null;
  let currentRotationDeg = 0;
  let isWheelSpinning = false;
  let audioCtx = null;
  let tickTimeouts = [];

  function dapatkanTanggalSekarang() {
    const sekarang = new Date();
    return sekarang.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function apakahUrlSheetAktif() {
    return GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/");
  }

  async function kirimKeGoogleSheets(payload) {
    if (!apakahUrlSheetAktif()) return null;
    try {
      const bodyPayload = { ...(payload || {}) };
      if (bodyPayload.action && String(bodyPayload.action).startsWith("admin_")) {
        const sesiAdmin = typeof getVerifiedBidder === "function" ? getVerifiedBidder() : null;
        if (sesiAdmin) {
          bodyPayload.adminEmail = sesiAdmin.email || "";
          bodyPayload.adminWa = sesiAdmin.wa || "";
          bodyPayload.adminToken = sesiAdmin.token || "";
        }
      }
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(bodyPayload)
      });
      return await res.json();
    } catch (err) {
      console.error("Gagal terhubung ke database:", err);
      return null;
    }
  }

  async function verifikasiTokenKlaim() {
    playClickSound();
    const tokenInput = document.getElementById("adminClaimTokenInput").value.trim();
    const box = document.getElementById("adminSecretResultBox");

    if (!tokenInput || !tokenInput.startsWith("CKV-")) {
      box.innerHTML = `<strong style="color:var(--danger-red)">❌ FORMAT KODE KLAIM SALAH</strong><br>Pastikan menyalin kode klaim berawalan <b>CKV-...</b> dari chat WhatsApp pelanggan.`;
      return;
    }

    box.innerHTML = `<span style="color:var(--gold-light)">⏳ Memverifikasi tanda tangan digital ke server...</span>`;
    const resServer = await kirimKeGoogleSheets({
      action: "verify_claim_token",
      claimToken: tokenInput
    });

    if (resServer && resServer.status === "ok") {
      box.innerHTML = `
        <strong style="color:var(--verified-green)">✔ KODE KLAIM ASLI & VALID!</strong><br>
        <div style="margin-top:6px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.1);">
          🎟️ <b>Kode Voucher:</b> <span style="color:var(--gold-light)">${escapeHtml(resServer.voucher)}</span><br>
          🏆 <b>Hadiah Sah:</b> <span style="color:#4ade80; font-weight:700;">${escapeHtml(resServer.prizeName)}</span>
        </div>
      `;
    } else {
      const pesanErr = (resServer && resServer.message) ? resServer.message : "Tanda tangan digital tidak cocok dengan database hadiah Cupang Kasep.";
      box.innerHTML = `<strong style="color:var(--danger-red)">❌ KODE KLAIM PALSU / TIDAK VALID!</strong><br>${escapeHtml(pesanErr)}`;
    }
  }

  async function cekRiwayatVoucherLokal() {
    playClickSound();
    const kode = document.getElementById("adminVoucherCheckInput").value.trim().toUpperCase();
    const box = document.getElementById("adminSecretResultBox");

    if (!kode) {
      tampilkanToast("⚠️ Masukkan kode voucher yang ingin dicek");
      return;
    }

    if (apakahUrlSheetAktif()) {
      box.innerHTML = `<span style="color:var(--gold-light)">⏳ Mengecek data voucher [${escapeHtml(kode)}]</span>`;
      const resServer = await kirimKeGoogleSheets({
        action: "check",
        kode: kode,
        tanggal: dapatkanTanggalSekarang()
      });

      if (resServer && (resServer.status === "ok" || resServer.status === "used")) {
        const listHtml = (resServer.history || []).map((h, i) => `<li>Putaran #${i + 1}: <b>${escapeHtml(h.full)}</b></li>`).join("");
        const infoTanggal = resServer.usedDate ? ` | Tanggal Pakai: <b>${escapeHtml(resServer.usedDate)}</b>` : "";
        box.innerHTML = `
          <strong style="color:var(--verified-green)">✔ DATA BERHASIL DITEMUKAN</strong><br>
          Kode: <b style="color:var(--gold-light)">${escapeHtml(kode)}</b> | Sisa Spin: <b>${Number(resServer.remaining) || 0}/3</b>${infoTanggal}
          <ul style="padding-left:16px; margin-top:6px;">${listHtml || "<li>Belum ada putaran</li>"}</ul>
        `;
        return;
      }
    }

    const store = getVoucherStore();
    const data = store[kode];

    if (!data || !data.history || data.history.length === 0) {
      box.innerHTML = `<strong style="color:var(--danger-red)">ℹ️ BELUM ADA RIWAYAT DI PERANGKAT INI</strong><br>Voucher <b>[${escapeHtml(kode)}]</b> belum pernah dimainkan.`;
      return;
    }

    const listHtml = data.history.map((h, i) => `<li>Putaran #${i + 1}: <b>${escapeHtml(h.full)}</b></li>`).join("");
    const infoTanggal = data.usedDate ? ` | Tanggal Pakai: <b>${escapeHtml(data.usedDate)}</b>` : "";
    box.innerHTML = `
      <strong style="color:var(--verified-green)">✔ RIWAYAT VOUCHER DITEMUKAN</strong><br>
      Kode: <b style="color:var(--gold-light)">${escapeHtml(kode)}</b> | Sisa Spin: <b>${Number(data.remaining) || 0}/3</b>${infoTanggal}
      <ul style="padding-left:16px; margin-top:6px;">${listHtml}</ul>
    `;
  }

  function bukaMenuRahasiaAdmin() {
    playClickSound();
    document.getElementById("secretAdminPanel").style.display = "block";
    tampilkanToast("🕵️ Panel Rahasia Admin Dibuka!");
  }

  function tutupPanelRahasiaAdmin() {
    playClickSound();
    document.getElementById("secretAdminPanel").style.display = "none";
  }

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playClickSound() {
    // Suara klik tombol dinonaktifkan, hanya menyiapkan AudioContext untuk suara Spin Roulette
    initAudio();
  }

  function playSingleTick() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  function startWheelTickSound(durationMs = 4600) {
    stopWheelTickSound();
    let elapsed = 0;
    let interval = 55;

    function scheduleNext() {
      if (elapsed >= durationMs || !isWheelSpinning) return;
      playSingleTick();
      const progress = elapsed / durationMs;
      interval = 55 + Math.pow(progress, 2.6) * 380;
      elapsed += interval;
      const tId = setTimeout(scheduleNext, interval);
      tickTimeouts.push(tId);
    }
    scheduleNext();
  }

  function stopWheelTickSound() {
    tickTimeouts.forEach(id => clearTimeout(id));
    tickTimeouts = [];
  }

  function playPrizeSound(isJackpot) {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = isJackpot
      ? [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
      : [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      const startTime = now + idx * 0.11;
      const duration = idx === notes.length - 1 ? 0.45 : 0.12;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.008, startTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  function playZonkSound() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [320, 280, 230];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      const startTime = now + idx * 0.18;
      const duration = idx === notes.length - 1 ? 0.4 : 0.16;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.linearRampToValueAtTime(freq - 25, startTime + duration);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.008, startTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  function getVoucherStore() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_VOUCHER)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveVoucherStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY_VOUCHER, JSON.stringify(store));
    } catch (e) {}
  }

  /* =========================================================
     4. NAVIGASI ANTAR SUB-HALAMAN
     ========================================================= */
  let isCatalogUnlocked = false;

  function bukaHalamanKatalog() {
    playClickSound();
    isCatalogUnlocked = true;
    tampilkanIsiKatalog(false);
  }

  function bukaHalamanLelang() {
    playClickSound();
    isCatalogUnlocked = true;
    tampilkanIsiKatalog(true);
  }

  function aktifkanHalaman(idHalaman, hashUrl = "") {
    ["landingPage", "catalogPage", "verificationPage", "roulettePage"].forEach(id => {
      if (id === "landingPage") {
        document.getElementById(id).style.display = (id === idHalaman) ? "flex" : "none";
      } else {
        document.getElementById(id).style.display = (id === idHalaman) ? "block" : "none";
      }
    });

    // Khusus Katalog, Lelang, Sertifikat, dan Undian -> fokuskan shadow navbar di Galeri
    if (idHalaman !== "landingPage") {
      aturSorotanNavbar("gallery");
    }

    perbaruiTombolKeranjangMelayang();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (hashUrl) {
      simpanRuteTerakhir(hashUrl);
      if (window.location.hash !== hashUrl) {
        history.pushState({ page: idHalaman }, "", hashUrl);
      }
    }
  }

  function renderDaftarLelangProfile() {
    const container = document.getElementById("profileAuctionStatusContainer");
    if (!container) return;

    const bidder = getVerifiedBidder();
    if (!bidder || !bidder.wa) {
      container.innerHTML = "";
      return;
    }

    const semuaLelang = (masterCatalogItems || []).filter(
      item => String(item.kategori || "").toLowerCase() === "lelang"
    );

    if (semuaLelang.length === 0 && !catalogLoadedOnce) {
      container.innerHTML = `
        <div class="profile-empty-note" style="color:var(--gold-light);">
          ⏳ Memuat data lelang Anda...
        </div>
      `;
      return;
    }

    const masihMenang = [];
    const sudahMenang = [];

    semuaLelang.forEach(item => {
      if ((Number(item.currentBid) || 0) <= 0) return;
      if (!apakahUserPemenangSah(item, bidder)) return;

      const sudahSelesai = apakahItemKatalogHabis(item) || apakahWaktuLelangHabis(item.endTime);
      if (sudahSelesai) {
        sudahMenang.push(item);
      } else {
        masihMenang.push(item);
      }
    });

    const htmlMasihMenang = masihMenang.length === 0
      ? `<div class="profile-empty-note">Belum ada lelang aktif yang sedang Anda pimpin.</div>`
      : `<div class="profile-auction-list">
          ${masihMenang.map(it => {
            const kodeAttr = escapeHtml(it.kode);
            return `
              <div class="profile-auction-card leading" data-action="open-profile-auction" data-kode="${kodeAttr}">
                <div class="profile-auction-meta">
                  <div class="profile-auction-name">[${kodeAttr}] ${escapeHtml(it.nama)}</div>
                  <div class="profile-auction-price">${escapeHtml(formatRupiah(it.currentBid))}</div>
                </div>
                <span class="profile-auction-badge leading">✦ Masih Menang</span>
              </div>
            `;
          }).join("")}
        </div>`;

    const htmlSudahMenang = sudahMenang.length === 0
      ? `<div class="profile-empty-note">Belum ada lelang yang selesai Anda menangkan.</div>`
      : `<div class="profile-auction-list">
          ${sudahMenang.map(it => {
            const kodeAttr = escapeHtml(it.kode);
            return `
              <div class="profile-auction-card won" data-action="open-profile-auction" data-kode="${kodeAttr}">
                <div class="profile-auction-meta">
                  <div class="profile-auction-name">[${kodeAttr}] ${escapeHtml(it.nama)}</div>
                  <div class="profile-auction-price">${escapeHtml(formatRupiah(it.currentBid))}</div>
                </div>
                <span class="profile-auction-badge won">🏆 Menang</span>
              </div>
            `;
          }).join("")}
        </div>`;

    container.innerHTML = `
      <div class="profile-auction-section">
        <div class="profile-auction-sec-title">
          <span>Posisi Masih Menang</span>
          <span>${masihMenang.length} Ikan</span>
        </div>
        ${htmlMasihMenang}
      </div>
      <div class="profile-auction-section">
        <div class="profile-auction-sec-title" style="color:#6ee7b7;">
          <span>Sudah Dimenangkan</span>
          <span>${sudahMenang.length} Ikan</span>
        </div>
        ${htmlSudahMenang}
      </div>
    `;
  }

  function bukaLelangDariProfile(kodeProduk) {
    tutupMenuAuthHeader();
    isCatalogUnlocked = true;
    tampilkanIsiKatalog(true);
    setTimeout(() => {
      bukaDetailProduk(kodeProduk);
    }, 40);
  }

  function dapatkanAkunAdmin(email, wa) {
    const emailClean = String(email || "").trim().toLowerCase();
    const waClean = normalisasiNomorWA(wa || "");
    const listAdmin = CONFIG.ADMIN_ACCOUNTS || [];
    return listAdmin.find(acc =>
      acc.email.toLowerCase() === emailClean &&
      normalisasiNomorWA(acc.wa) === waClean
    ) || null;
  }

  function dapatkanNamaAdmin(bidder = null) {
    const b = bidder || getVerifiedBidder();
    if (!b) return "Admin";
    const acc = dapatkanAkunAdmin(b.email, b.wa);
    return (acc && acc.nama) ? acc.nama : (b.nama || "Admin");
  }

  function apakahKredensialAdmin(email, wa) {
    return Boolean(dapatkanAkunAdmin(email, wa));
  }

  function apakahUserAdmin(bidder = null) {
    const b = bidder || getVerifiedBidder();
    if (!b || !b.wa || !b.email) return false;
    return Boolean(b.isAdmin) || apakahKredensialAdmin(b.email, b.wa);
  }

  function perbaruiTombolAuthHeaderLelang() {
    const wrapEl = document.getElementById("headerAuctionAuthWrap");
    const btnEl = document.getElementById("headerAuctionAuthBtn");
    const nameEl = document.getElementById("headerAuthUserName");
    const waEl = document.getElementById("headerAuthUserWa");
    const profileTxtEl = document.getElementById("navProfileText");
    if (!wrapEl || !btnEl) return;

    wrapEl.style.display = "inline-flex";

    const bidder = getVerifiedBidder();
    const isAdmin = apakahUserAdmin(bidder);
    const namaAdminAktif = isAdmin ? dapatkanNamaAdmin(bidder) : "";

    const labelProfilDefault = USER_LANG === "en" ? "Profile" : (USER_LANG === "zh" ? "个人资料" : "Profil");
    if (bidder && bidder.wa) {
      btnEl.classList.add("profile-logged-in");
      if (profileTxtEl) {
        profileTxtEl.innerText = isAdmin ? namaAdminAktif : labelProfilDefault;
      }
      if (nameEl) {
        nameEl.innerHTML = isAdmin
          ? `<span class="admin-crown-pill">👑 Admin Resmi</span><br>${escapeHtml(namaAdminAktif)}`
          : escapeHtml(bidder.nama);
      }
      if (waEl) {
        waEl.innerText = isAdmin
          ? `${bidder.wa} • ${bidder.email}`
          : `${sensorNomorWA(bidder.wa)}${bidder.email ? ' • ' + bidder.email : ''}`;
      }
      renderDaftarLelangProfile();

      // Tambahkan tombol Halaman Admin di atas daftar lelang dalam dropdown Profil jika Admin
      const container = document.getElementById("profileAuctionStatusContainer");
      if (container && isAdmin && !document.getElementById("btnOpenAdminHubProfile")) {
        const adminBtnWrap = document.createElement("div");
        adminBtnWrap.innerHTML = `
          <button type="button" class="btn-open-admin-hub" id="btnOpenAdminHubProfile" onclick="bukaModalAdminHub()">
            👑 Buka Halaman Admin (5 Fitur)
          </button>
        `;
        container.prepend(adminBtnWrap.firstElementChild);
      }
    } else {
      btnEl.classList.remove("profile-logged-in");
      if (profileTxtEl) profileTxtEl.innerText = labelProfilDefault;
      tutupMenuAuthHeader();
    }
  }

  /* =========================================================
     FITUR TESTIMONI KOLEKTOR (KUOTA WA + UPLOAD FOTO + ADMIN)
     ========================================================= */
  let testiRatingDipilih = 5;
  let testiFotoBase64 = "";

  async function muatTestimoniPublik() {
    if (!apakahUrlSheetAktif()) return;
    try {
      const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=testimonials&_t=${Date.now()}`);
      const json = await res.json();
      if (json && json.status === "ok" && Array.isArray(json.items)) {
        renderTestimoniPublik(json.items);
      }
    } catch (e) {}
  }

  function renderTestimoniPublik(items) {
    const container = document.getElementById("publicTestiContainer");
    if (!container) return;
    if (!items || items.length === 0) {
      container.innerHTML = `<div class="testi-item"><p class="testi-quote" style="text-align:center;">Belum ada testimoni yang ditampilkan.</p></div>`;
      return;
    }

    container.innerHTML = items.map(t => {
      const stars = "★".repeat(Math.min(5, Math.max(1, Number(t.rating) || 5)));
      const lokasi = t.kota ? `, ${escapeHtml(t.kota)}` : "";
      const cleanFoto = sanitizeUrl(t.foto, "");
      const fotoHtml = cleanFoto
        ? `<img src="${escapeHtml(cleanFoto)}" alt="Foto Testimoni" class="testi-photo-thumb" loading="lazy" referrerpolicy="no-referrer" data-action="zoom-img" data-url="${escapeHtml(cleanFoto)}">`
        : "";
      return `
        <div class="testi-item">
          <div class="testi-item-row">
            ${fotoHtml}
            <div style="flex:1; min-width:0;">
              <div class="testi-stars">${stars}</div>
              <p class="testi-quote">"${escapeHtml(t.isi)}"</p>
              <span class="testi-author notranslate">— ${escapeHtml(t.nama)}${lokasi}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function bukaModalTestimoni() {
    playClickSound();
    const bidder = typeof getVerifiedBidder === "function" ? getVerifiedBidder() : null;

    // Wajib login terlebih dahulu sebelum bisa menulis testimoni
    if (!bidder || !bidder.wa) {
      tampilkanToast("◈ Silakan login terlebih dahulu untuk menulis testimoni");
      if (typeof bukaModalOtpLelang === "function") {
        bukaModalOtpLelang(true);
      }
      return;
    }

    const modal = document.getElementById("testiModal");
    if (!modal) return;

    testiFotoBase64 = "";
    const prev = document.getElementById("testiFotoPreview");
    const fileInp = document.getElementById("testiFotoFile");
    const namaInp = document.getElementById("testiNamaInput");
    if (prev) { prev.style.display = "none"; prev.src = ""; }
    if (fileInp) fileInp.value = "";
    if (namaInp) namaInp.value = bidder.nama || "";
    pilihRatingTesti(5);

    modal.classList.add("open");
    cekKuotaTestimoniUser(bidder.wa);
  }

  function tutupModalTestimoni() {
    const modal = document.getElementById("testiModal");
    if (modal) modal.classList.remove("open");
  }

  function pilihRatingTesti(nilai) {
    testiRatingDipilih = nilai;
    document.querySelectorAll("#testiRatingPicker .testi-star-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx < nilai);
    });
  }

  function prosesPilihFotoTesti(inputEl) {
    const file = inputEl && inputEl.files && inputEl.files[0];
    const prev = document.getElementById("testiFotoPreview");
    if (!file) {
      testiFotoBase64 = "";
      if (prev) prev.style.display = "none";
      return;
    }

    // Kompresi foto otomatis di browser (maksimal lebar 800px, JPEG 78%) agar upload ngebut di HP
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        testiFotoBase64 = canvas.toDataURL("image/jpeg", 0.78);
        if (prev) {
          prev.src = testiFotoBase64;
          prev.style.display = "block";
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  let adminVerifiedMembersList = [];

  async function cekKuotaTestimoniUser(waOtomatis) {
    const bidder = typeof getVerifiedBidder === "function" ? getVerifiedBidder() : null;
    const waVal = waOtomatis || (bidder ? bidder.wa : "");
    const statusBox = document.getElementById("testiQuotaStatusBox");
    const formFields = document.getElementById("testiFormFields");

    if (!waVal) return;

    formFields.style.display = "none";
    statusBox.style.display = "block";
    statusBox.style.background = "rgba(255, 255, 255, 0.05)";
    statusBox.style.border = "1px solid rgba(232, 213, 181, 0.3)";
    statusBox.style.color = "var(--gold-light)";
    statusBox.innerHTML = `⏳ Memeriksa kuota testimoni akun Anda...`;

    const res = await kirimKeGoogleSheets({ action: "testimonial_check_quota", wa: waVal });

    if (res && res.status === "ok" && Number(res.quota) > 0) {
      statusBox.style.background = "rgba(16, 185, 129, 0.16)";
      statusBox.style.border = "1px solid rgba(52, 211, 153, 0.5)";
      statusBox.style.color = "#6ee7b7";
      statusBox.innerHTML = `✔ Kuota tersedia: <strong>${res.quota}x testimoni</strong>`;
      if (res.nama && !document.getElementById("testiNamaInput").value) {
        document.getElementById("testiNamaInput").value = res.nama;
      }
      formFields.style.display = "flex";
    } else {
      statusBox.style.background = "rgba(201, 169, 110, 0.14)";
      statusBox.style.border = "1px solid rgba(232, 213, 181, 0.45)";
      statusBox.style.color = "var(--gold-light)";
      statusBox.innerHTML = `◈ Akun Anda saat ini belum memiliki kuota testimoni (0). Jika Anda sudah melakukan pembelian, kuota testimoni akan ditambahkan maksimal <strong>1×24 jam</strong> setelah transaksi selesai.`;
      formFields.style.display = "none";
    }
  }

  async function kirimTestimoniUser() {
    const bidder = typeof getVerifiedBidder === "function" ? getVerifiedBidder() : null;
    if (!bidder || !bidder.wa) {
      tampilkanToast("⚠️ Sesi login berakhir, silakan login ulang");
      tutupModalTestimoni();
      return;
    }

    const wa = bidder.wa;
    const nama = (document.getElementById("testiNamaInput").value || bidder.nama || "").trim();
    const kota = (document.getElementById("testiKotaInput").value || "").trim();
    const isi = (document.getElementById("testiIsiInput").value || "").trim();
    const btn = document.getElementById("btnKirimTesti");

    if (!nama || isi.length < 5) {
      tampilkanToast("⚠️ Lengkapi nama dan ulasan testimoni Anda");
      return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Mengunggah testimoni...";
    const res = await kirimKeGoogleSheets({
      action: "testimonial_submit",
      wa: wa,
      nama: nama,
      kota: kota,
      rating: testiRatingDipilih,
      isi: isi,
      photoBase64: testiFotoBase64
    });
    btn.disabled = false;
    btn.innerText = "✦ Kirim Testimoni Sekarang";

    if (res && res.status === "ok") {
      tampilkanToast("✦ Terima kasih! Testimoni Anda langsung tampil.");
      document.getElementById("testiIsiInput").value = "";
      tutupModalTestimoni();
      muatTestimoniPublik();
    } else {
      tampilkanDialogModal((res && res.message) || "Gagal mengirim testimoni. Silakan coba lagi.", {
        title: "Gagal Mengirim",
        icon: "✕"
      });
    }
  }

  // Pengendali tunggal Intro Logo CK (dipanggil dari initApp)
  function jalankanIntroSplashTunggal() {
    const splash = document.getElementById("ckIntroSplash");
    if (!splash) return;

    if (sessionStorage.getItem("ck_intro_played") === "1") {
      splash.remove();
      return;
    }

    sessionStorage.setItem("ck_intro_played", "1");
    const tutupSplash = () => {
      if (!splash.classList.contains("hide-intro")) {
        splash.classList.add("hide-intro");
        setTimeout(() => {
          if (splash.parentNode) splash.remove();
        }, 700);
      }
    };
    setTimeout(tutupSplash, 2000);
    setTimeout(tutupSplash, 3500);
  }

  /* =========================================================
     LOGIKA 3D CARD CAROUSEL MENU LAYANAN (LOOPING & SWIPE HP/PC)
     ========================================================= */
  let layananCarouselIdx = 0;
  let layananSedangDrag = false;

  function renderLayananCarousel3D() {
    const track = document.getElementById("layananCarouselTrack");
    if (!track) return;
    const cards = track.querySelectorAll(".pdf-card");
    const dots = document.querySelectorAll("#layananCarouselDots .carousel-dot");
    const total = cards.length;
    if (total === 0) return;

    cards.forEach((card, i) => {
      card.classList.remove("pos-center", "pos-left-1", "pos-right-1", "pos-left-2", "pos-right-2");
      let diff = (i - layananCarouselIdx + total) % total;
      if (diff > Math.floor(total / 2)) diff -= total;

      if (diff === 0) card.classList.add("pos-center");
      else if (diff === -1) card.classList.add("pos-left-1");
      else if (diff === 1) card.classList.add("pos-right-1");
      else if (diff === -2) card.classList.add("pos-left-2");
      else card.classList.add("pos-right-2");
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === layananCarouselIdx));
  }

  function geserLayananCarousel(arah) {
    playClickSound();
    const total = document.querySelectorAll("#layananCarouselTrack .pdf-card").length || 5;
    layananCarouselIdx = (layananCarouselIdx + arah + total) % total;
    renderLayananCarousel3D();
  }

  function pilihSlideLayananCarousel(index) {
    playClickSound();
    layananCarouselIdx = index;
    renderLayananCarousel3D();
  }

  function klikKartuLayananCarousel(index, aksiBuka) {
    if (layananSedangDrag) return;
    if (index !== layananCarouselIdx) {
      pilihSlideLayananCarousel(index);
      return;
    }
    if (typeof aksiBuka === "function") aksiBuka();
  }

  function inisialisasiGestureCarouselLayanan() {
    renderLayananCarousel3D();
    const track = document.getElementById("layananCarouselTrack");
    if (!track) return;

    let startX = 0;
    let isPointerDown = false;

    track.addEventListener("touchstart", function(e) {
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      layananSedangDrag = false;
    }, { passive: true });

    track.addEventListener("touchend", function(e) {
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        layananSedangDrag = true;
        geserLayananCarousel(dx < 0 ? 1 : -1);
        setTimeout(() => { layananSedangDrag = false; }, 120);
      }
    }, { passive: true });

    track.addEventListener("mousedown", function(e) {
      if (e.button !== 0) return;
      isPointerDown = true;
      startX = e.clientX;
      layananSedangDrag = false;
    });

    window.addEventListener("mouseup", function(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 45) {
        layananSedangDrag = true;
        geserLayananCarousel(dx < 0 ? 1 : -1);
        setTimeout(() => { layananSedangDrag = false; }, 120);
      }
    });
  }

  

  async function klikTombolAuthHeaderLelang(ev) {
    if (ev) ev.stopPropagation();
    const bidder = getVerifiedBidder();
    if (!bidder || !bidder.wa) {
      bukaModalOtpLelang(true);
      return;
    }

    // Jika akun adalah Admin Resmi -> langsung buka Halaman Admin tersendiri
    if (apakahUserAdmin(bidder)) {
      tutupMenuAuthHeader();
      navigasiMenuAtas("admin");
      return;
    }

    // Jika peserta lelang biasa -> buka dropdown Profile (Masih Menang / Sudah Menang)
    const menuEl = document.getElementById("headerAuctionAuthMenu");
    if (!menuEl) return;

    const akanDibuka = !menuEl.classList.contains("open");
    menuEl.classList.toggle("open", akanDibuka);

    if (akanDibuka) {
      renderDaftarLelangProfile();
      await segarkanDataKatalogSenyap();
      renderDaftarLelangProfile();
    }
  }

  function tutupMenuAuthHeader() {
    const menuEl = document.getElementById("headerAuctionAuthMenu");
    if (menuEl) menuEl.classList.remove("open");
  }

  document.addEventListener("click", function(e) {
    const wrapEl = document.getElementById("headerAuctionAuthWrap");
    if (wrapEl && !wrapEl.contains(e.target)) {
      tutupMenuAuthHeader();
    }
  });

  function tampilkanIsiKatalog(modeLelang = false, kategoriPilihan = null) {
    // RESET TAMPILAN: Pastikan selalu membuka Grid Katalog, mencegah user terjebak di halaman detail
    document.getElementById("catalogDetailView").style.display = "none";
    document.querySelector(".catalog-controls").style.display = "flex";
    document.getElementById("catalogGridWrapper").style.display = "block";
    currentOpenDetailCode = null;

    const titleEl = document.getElementById("catalogHeaderTitle");
    const subEl = document.getElementById("catalogHeaderSubtitle");
    const tagEl = document.getElementById("catalogHeaderTagline");
    const pillsEl = document.getElementById("catalogCategoryPills");

    aturSorotanNavbar("gallery");

    if (modeLelang) {
      currentCategoryFilter = "Lelang";
      try { localStorage.setItem("ck_last_mode_lelang", "1"); } catch (e) {}
      if (subEl) subEl.innerText = "CUPANG KASEP LIVE AUCTION";
      if (titleEl) titleEl.innerText = "LELANG RESMI";
      if (tagEl) tagEl.innerText = "Penawaran Real-Time Koleksi Ikan Cupang Spesimen Kontes & Kolektor";
      if (pillsEl) pillsEl.style.display = "none";
      aktifkanHalaman("catalogPage", "#lelang");
    } else {
      try { localStorage.setItem("ck_last_mode_lelang", "0"); } catch (e) {}
      const savedCat = kategoriPilihan || localStorage.getItem("ck_last_cat_pill") || sessionStorage.getItem("ck_last_cat_pill") || "Semua";
      currentCategoryFilter = savedCat === "Lelang" ? "Semua" : savedCat;
      if (subEl) subEl.innerText = "OFFICIAL STORE CUPANG KASEP";
      if (titleEl) titleEl.innerText = "KOLEKSI CK";
      if (tagEl) tagEl.innerText = "Koleksi Ikan Cupang Berkualitas & Kebutuhan Perawatan Terbaik";
      if (pillsEl) {
        pillsEl.style.display = "flex";
        const allBtns = pillsEl.querySelectorAll(".cat-pill");
        allBtns.forEach(b => {
          const isMatch = (currentCategoryFilter === "Semua" && b.innerText.includes("Semua")) ||
                          (currentCategoryFilter === "Ikan Cupang" && b.innerText.includes("Ikan")) ||
                          (currentCategoryFilter === "Produk" && b.innerText === "Produk");
          b.classList.toggle("active", isMatch);
        });
      }
      aktifkanHalaman("catalogPage", "#katalog");
    }

    perbaruiTombolAuthHeaderLelang();

    if (!catalogLoadedOnce) {
      muatDataKatalog(false);
    } else {
      perbaruiDropdownJenis();
      terapkanFilterKatalog();
    }
  }

  function bukaHalamanVerifikasi() {
    playClickSound();
    aturSorotanNavbar("gallery");
    aktifkanHalaman("verificationPage", "#verifikasi");
    setTimeout(() => { document.getElementById("certInput").focus(); }, 200);
  }

  function bukaHalamanUndian() {
    playClickSound();
    aturSorotanNavbar("gallery");
    aktifkanHalaman("roulettePage", "#undian");
    gambarRodaRoulette();
    perbaruiTampilanVoucher();
  }

  function kembaliKeLanding() {
    if (isWheelSpinning) return;
    const hash = window.location.hash;
    // Bersihkan jejak URL jika user menekan tombol 'Kembali' agar tombol Back HP tetap sinkron
    if (hash === "#verifikasi" || hash === "#undian" || hash === "#katalog" || hash === "#lelang") {
       history.replaceState({ tab: "gallery" }, "", "#gallery");
    }
    navigasiMenuAtas("gallery", false);
  }

  // Mendukung tombol Back/Forward bawaan HP & Browser termasuk kembali dari Detail Produk ke Katalog
  window.addEventListener("popstate", function() {
    if (isWheelSpinning) return;
    const hash = window.location.hash;
    if (hash.startsWith("#produk-")) {
      const kodeProd = decodeURIComponent(hash.replace("#produk-", ""));
      aturSorotanNavbar("gallery");
      aktifkanHalaman("catalogPage", "");
      simpanRuteTerakhir(hash);
      bukaDetailProduk(kodeProd, false);
    } else if (hash === "#katalog") {
      currentCategoryFilter = "Semua";
      aturSorotanNavbar("gallery");
      aktifkanHalaman("catalogPage", "");
      simpanRuteTerakhir("#katalog");
      if (document.getElementById("catalogDetailView").style.display === "block") {
        tutupDetailProduk(false);
      }
    } else if (hash === "#lelang") {
      currentCategoryFilter = "Lelang";
      aturSorotanNavbar("gallery");
      aktifkanHalaman("catalogPage", "");
      simpanRuteTerakhir("#lelang");
      if (document.getElementById("catalogDetailView").style.display === "block") {
        tutupDetailProduk(false);
      }
    } else if (hash === "#verifikasi") {
      aturSorotanNavbar("gallery");
      aktifkanHalaman("verificationPage", "");
      simpanRuteTerakhir("#verifikasi");
    } else if (hash === "#undian") {
      aturSorotanNavbar("gallery");
      aktifkanHalaman("roulettePage", "");
      simpanRuteTerakhir("#undian");
      gambarRodaRoulette();
      perbaruiTampilanVoucher();
    } else if (hash === "#gallery") {
      navigasiMenuAtas("gallery", false);
    } else if (hash === "#ongkir") {
      navigasiMenuAtas("ongkir", false);
    } else if (hash === "#about") {
      navigasiMenuAtas("about", false);
    } else if (hash === "#admin" && apakahUserAdmin()) {
      navigasiMenuAtas("admin", false);
    } else {
      navigasiMenuAtas("home", false);
    }
  });

  function gambarRodaRoulette() {
    const canvas = document.getElementById("rouletteCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 8;
    const totalSlice = segmenRoulette.length;
    const arcDeg = 360 / totalSlice;
    const arcRad = (arcDeg * Math.PI) / 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < totalSlice; i++) {
      const startAngle = (i * arcDeg - 90) * (Math.PI / 180);
      const endAngle = startAngle + arcRad;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segmenRoulette[i].color;
      ctx.fill();

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "#c9a96e";
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arcRad / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = segmenRoulette[i].text;
      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(segmenRoulette[i].label, radius - 22, 5);
      ctx.restore();
    }
  }

  async function aktifkanVoucher() {
    playClickSound();
    if (isWheelSpinning) return;
    const inputEl = document.getElementById("voucherInput");
    const btnPakai = document.getElementById("btnPakaiVoucher");
    const kode = inputEl.value.trim().toUpperCase();

    if (!kode) {
      tampilkanToast("⚠️ Silakan masukkan kode voucher terlebih dahulu");
      return;
    }

    if (!apakahUrlSheetAktif()) {
      tampilkanDialogModal("Server verifikasi belum terhubung.", { title: "Koneksi Server", icon: "✕" });
      return;
    }

    btnPakai.disabled = true;
    btnPakai.innerText = "⏳ Cek...";

    const resServer = await kirimKeGoogleSheets({
      action: "check",
      kode: kode,
      tanggal: dapatkanTanggalSekarang()
    });

    btnPakai.disabled = false;
    btnPakai.innerText = "Pakai";

    if (!resServer) {
      tampilkanDialogModal("Gagal terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.", { title: "Koneksi Terputus", icon: "✕" });
      return;
    }

    if (resServer.status === "admin_panel") {
      inputEl.value = "";
      bukaMenuRahasiaAdmin();
      return;
    }

    if (resServer.status === "admin_vip") {
      inputEl.value = "";
      isAdminSpinMode = true;
      activeVoucherCode = "ADMIN-TEST";
      tampilkanToast("👑 Mode Testing Admin Aktif (Unlimited Spin!)");
      perbaruiTampilanVoucher();
      return;
    }

    if (resServer.status === "invalid" || resServer.status === "error") {
      tampilkanDialogModal(`Kode Voucher [${kode}] tidak valid atau tidak terdaftar di database resmi.`, { title: "Voucher Tidak Valid", icon: "✕" });
      return;
    }

    isAdminSpinMode = false;
    const store = getVoucherStore();
    store[kode] = {
      remaining: Number(resServer.remaining),
      used: resServer.status === "used" || Number(resServer.remaining) <= 0,
      usedDate: resServer.usedDate || dapatkanTanggalSekarang(),
      history: resServer.history || [],
      claimToken: resServer.claimToken || ""
    };
    saveVoucherStore(store);

    activeVoucherCode = kode;
    perbaruiTampilanVoucher();

    if (store[kode].used || store[kode].remaining <= 0) {
      tampilkanDialogModal(`Voucher [${kode}] sudah digunakan pada tanggal ${store[kode].usedDate}.`, { title: "Voucher Sudah Terpakai", icon: "◈" });
      return;
    }

    tampilkanToast("🎟️ Voucher " + kode + " aktif! (" + store[kode].remaining + "x Spin)");
  }

  function perbaruiTampilanVoucher() {
    const statusText = document.getElementById("activeVoucherText");
    const chancePill = document.getElementById("spinChanceDisplay");
    const spinBtn = document.getElementById("spinBtn");
    const historyList = document.getElementById("spinHistoryList");
    const spinCountInfo = document.getElementById("spinCountInfo");
    const claimWaBtn = document.getElementById("claimWaBtn");

    if (!activeVoucherCode) {
      statusText.innerText = "Belum ada voucher aktif";
      chancePill.innerText = "Kesempatan: 0 / 3";
      spinBtn.disabled = true;
      spinBtn.innerText = "🎯 MASUKKAN VOUCHER DULU";
      return;
    }

    if (isAdminSpinMode) {
      statusText.innerHTML = "Voucher: <strong style='color:#fde047'>Admin Mode</strong>";
      chancePill.innerText = "Kesempatan: UNLIMITED 👑";
      spinCountInfo.innerText = "Mode Testing Admin";
      spinBtn.disabled = false;
      spinBtn.innerText = "🎯 PUTAR SEKARANG (TESTING ADMIN)";

      let store = getVoucherStore();
      let adminData = store["ADMIN_TEST_MODE"] || { history: [] };

      if (adminData.history.length === 0) {
        historyList.innerHTML = `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px 0;">Belum ada putaran admin.</div>`;
        claimWaBtn.style.display = "none";
      } else {
        historyList.innerHTML = adminData.history.map((item, idx) => `
          <div class="history-item ${item.type === 'zonk' ? 'zonk' : ''}">
            <span>Uji #${idx + 1}</span>
            <strong>${escapeHtml(item.full)}</strong>
          </div>
        `).join("");
        claimWaBtn.style.display = "none";
      }
      return;
    }

    const store = getVoucherStore();
    const dataVoucher = store[activeVoucherCode] || { remaining: 0, history: [], claimToken: "" };
    const usedCount = 3 - dataVoucher.remaining;

    statusText.innerHTML = "Voucher: <strong style='color:var(--gold-light)'>" + escapeHtml(activeVoucherCode) + "</strong>";
    chancePill.innerText = "Kesempatan: " + dataVoucher.remaining + " / 3";
    spinCountInfo.innerText = usedCount + "/3 Selesai";

    spinBtn.disabled = false;
    if (dataVoucher.remaining > 0) {
      spinBtn.innerText = "🎯 PUTAR SEKARANG (" + dataVoucher.remaining + "x Lagi)";
    } else {
      spinBtn.innerText = "🔒 KESEMPATAN HABIS (0/3)";
    }

    if (!dataVoucher.history || dataVoucher.history.length === 0) {
      historyList.innerHTML = `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px 0;">Belum ada putaran pada voucher ini.</div>`;
      claimWaBtn.style.display = "none";
    } else {
      historyList.innerHTML = dataVoucher.history.map((item, idx) => `
        <div class="history-item ${item.type === 'zonk' ? 'zonk' : ''}">
          <span>Putaran #${idx + 1}</span>
          <strong>${escapeHtml(item.full)}</strong>
        </div>
      `).join("");

      const itemMenang = dataVoucher.history.find(h => h.type !== "zonk");
      if (itemMenang && dataVoucher.claimToken) {
        const tokenResmi = dataVoucher.claimToken;
        let teksKlaim = "";

        if (USER_LANG === "en") {
          teksKlaim =
            "Hello Cupang Kasep Admin, I would like to claim my Lucky Spin Roulette prize.\n\n" +
            "🎟️ Voucher Code: " + activeVoucherCode + "\n" +
            "🎁 Prize: " + itemMenang.full + "\n" +
            "🔐 Claim Verification Token: " + tokenResmi;
        } else if (USER_LANG === "zh") {
          teksKlaim =
            "您好 Cupang Kasep 客服，我想领取幸运转盘抽奖奖品。\n\n" +
            "🎟️ 抽奖券代码: " + activeVoucherCode + "\n" +
            "🎁 奖品: " + itemMenang.full + "\n" +
            "🔐 领奖验证码: " + tokenResmi;
        } else {
          teksKlaim =
            "Halo Admin Cupang Kasep, saya ingin klaim hadiah Undian Roulette.\n\n" +
            "🎟️ Kode Voucher: " + activeVoucherCode + "\n" +
            "🎁 Hadiah: " + itemMenang.full + "\n" +
            "🔐 Kode Verifikasi Klaim: " + tokenResmi;
        }

        claimWaBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=` + encodeURIComponent(teksKlaim);
        claimWaBtn.style.display = "flex";
      } else {
        claimWaBtn.style.display = "none";
      }
    }
  }

  function sudahPernahMenang(isAdmin) {
    const store = getVoucherStore();
    if (isAdmin) {
      const history = (store["ADMIN_TEST_MODE"] && store["ADMIN_TEST_MODE"].history) ? store["ADMIN_TEST_MODE"].history : [];
      const putaranDalamSiklusIni = history.length % 3;
      if (putaranDalamSiklusIni === 0) return false;
      const riwayatSiklusIni = history.slice(-putaranDalamSiklusIni);
      return riwayatSiklusIni.some(item => item.type !== "zonk");
    } else {
      const dataVoucher = store[activeVoucherCode];
      if (!dataVoucher || !dataVoucher.history) return false;
      return dataVoucher.history.some(item => item.type !== "zonk");
    }
  }

  function pilihSegmenBerbobot(paksaZonk = false) {
    if (paksaZonk) {
      const indeksZonk = [];
      segmenRoulette.forEach((seg, idx) => {
        if (seg.type === "zonk") indeksZonk.push(idx);
      });
      const acakIndex = Math.floor(Math.random() * indeksZonk.length);
      return indeksZonk[acakIndex];
    }

    const totalWeight = segmenRoulette.reduce((acc, s) => acc + s.weight, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < segmenRoulette.length; i++) {
      if (rand < segmenRoulette[i].weight) {
        return i;
      }
      rand -= segmenRoulette[i].weight;
    }
    return 0;
  }

  function putarRoulette() {
    if (isWheelSpinning || !activeVoucherCode) return;

    if (isAdminSpinMode) {
      eksekusiPutaranRoda(true);
      return;
    }

    const store = getVoucherStore();
    const dataVoucher = store[activeVoucherCode];

    if (!dataVoucher || dataVoucher.remaining <= 0 || dataVoucher.used === true) {
      document.getElementById("exhaustedModal").classList.add("open");
      return;
    }

    eksekusiPutaranRoda(false);
  }

  function eksekusiPutaranRoda(isAdmin) {
    isWheelSpinning = true;
    document.getElementById("spinBtn").disabled = true;
    document.getElementById("btnPakaiVoucher").disabled = true;

    playClickSound();
    startWheelTickSound(4600);

    const wajibZonk = sudahPernahMenang(isAdmin);
    const winningIndex = pilihSegmenBerbobot(wajibZonk);
    const hasil = segmenRoulette[winningIndex];
    const kodeSaatPutar = activeVoucherCode;

    // KUNCI JATAH PUTARAN DI AWAL SEBELUM RODA BERHENTI (Mencegah kecurangan refresh halaman)
    let sisaSpinDisplay = 0;
    if (isAdmin) {
      let store = getVoucherStore();
      if (!store["ADMIN_TEST_MODE"]) store["ADMIN_TEST_MODE"] = { history: [] };
      store["ADMIN_TEST_MODE"].history.push(hasil);
      saveVoucherStore(store);
      sisaSpinDisplay = "Unlimited (Admin)";
    } else {
      const store = getVoucherStore();
      const dataVoucher = store[kodeSaatPutar];
      dataVoucher.remaining = Math.max(0, dataVoucher.remaining - 1);
      dataVoucher.history.push(hasil);

      if (!dataVoucher.usedDate) {
        dataVoucher.usedDate = dapatkanTanggalSekarang();
      }
      if (dataVoucher.remaining <= 0) {
        dataVoucher.used = true;
        dataVoucher.usedDate = dapatkanTanggalSekarang();
      }

      store[kodeSaatPutar] = dataVoucher;
      saveVoucherStore(store);
      sisaSpinDisplay = dataVoucher.remaining + "x lagi";

      if (apakahUrlSheetAktif()) {
        kirimKeGoogleSheets({
          action: "spin",
          kode: kodeSaatPutar,
          tanggal: dataVoucher.usedDate,
          hasil: hasil
        }).then(resSpin => {
          if (resSpin && resSpin.claimToken) {
            const latestStore = getVoucherStore();
            if (latestStore[kodeSaatPutar]) {
              latestStore[kodeSaatPutar].claimToken = resSpin.claimToken;
              saveVoucherStore(latestStore);
              if (!isWheelSpinning && activeVoucherCode === kodeSaatPutar) {
                perbaruiTampilanVoucher();
              }
            }
          }
        });
      }
    }

    const sliceDeg = 360 / segmenRoulette.length;
    const segmenCenterDeg = winningIndex * sliceDeg + (sliceDeg / 2);
    const randomOffset = (Math.random() - 0.5) * (sliceDeg * 0.65);
    const targetNormalizedDeg = (360 - segmenCenterDeg + randomOffset) % 360;

    const currentMod = currentRotationDeg % 360;
    let deltaDeg = targetNormalizedDeg - currentMod;
    if (deltaDeg < 0) deltaDeg += 360;

    const extraSpins = (6 + Math.floor(Math.random() * 3)) * 360;
    currentRotationDeg += extraSpins + deltaDeg;

    const canvas = document.getElementById("rouletteCanvas");
    canvas.style.transform = `rotate(${currentRotationDeg}deg)`;

    setTimeout(() => {
      stopWheelTickSound();
      if (hasil.type === "zonk") {
        playZonkSound();
      } else {
        playPrizeSound(hasil.type === "jackpot");
      }

      isWheelSpinning = false;
      document.getElementById("btnPakaiVoucher").disabled = false;
      perbaruiTampilanVoucher();
      tampilkanModalHasil(hasil, sisaSpinDisplay);
    }, 4700);
  }

  function tampilkanModalHasil(hasil, sisaSpin) {
    const modal = document.getElementById("resultModal");
    const icon = document.getElementById("modalIcon");
    const title = document.getElementById("modalTitle");
    const prize = document.getElementById("modalPrize");
    const sub = document.getElementById("modalSub");

    if (hasil.type === "zonk") {
      icon.innerText = "◇";
      title.innerText = "Belum Beruntung";
      prize.innerText = hasil.full;
    } else if (hasil.type === "jackpot") {
      icon.innerText = "✦";
      title.innerText = "JACKPOT SPESIAL";
      prize.innerText = hasil.full;
    } else {
      icon.innerText = "◈";
      title.innerText = "Selamat, Anda Mendapatkan:";
      prize.innerText = hasil.full;
    }

    sub.innerText = "Sisa kesempatan: " + sisaSpin;
    modal.classList.add("open");
  }

  function tutupModalHasil() {
    playClickSound();
    document.getElementById("resultModal").classList.remove("open");

    if (activeVoucherCode && !isAdminSpinMode) {
      const store = getVoucherStore();
      const dataVoucher = store[activeVoucherCode];
      const teksKesempatan = document.getElementById("spinChanceDisplay").innerText;
      const sudahHabis = (dataVoucher && Number(dataVoucher.remaining) <= 0) || teksKesempatan.includes("0 / 3");

      if (sudahHabis) {
        document.getElementById("exhaustedModal").classList.add("open");
      }
    }
  }

  function tutupModalHabis() {
    playClickSound();
    document.getElementById("exhaustedModal").classList.remove("open");
  }

  async function cariSertifikat() {
    playClickSound();
    const inputEl = document.getElementById("certInput");
    const input = inputEl.value.trim().toUpperCase();
    let data = null;

    const initialState = document.getElementById("initialState");
    const errorState = document.getElementById("errorState");
    const certBody = document.getElementById("certBody");

    if (!input) {
      initialState.style.display = "block";
      errorState.style.display = "none";
      certBody.classList.remove("show");
      return;
    }

    if (apakahUrlSheetAktif()) {
      try {
        const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=cert&id=${encodeURIComponent(input)}&_t=${Date.now()}`);
        const json = await res.json();
        if (json && json.status === "ok" && json.cert) {
          data = json.cert;
        }
      } catch (e) {
        console.warn("Gagal mengecek sertifikat ke server:", e);
      }
    }

    if (data) {
      initialState.style.display = "none";
      errorState.style.display = "none";

      document.getElementById("ownerName").innerText = data.owner;
      document.getElementById("certNumber").innerText = input;
      document.getElementById("certCodeDisplay").innerText = "ID: " + input;
      document.getElementById("fishStrainTitle").innerText = data.strain;
      document.getElementById("fishGrade").innerText = data.grade;
      document.getElementById("fishSize").innerText = data.size;
      document.getElementById("fishForm").innerText = data.form;
      document.getElementById("issueDate").innerText = data.date;
      document.getElementById("breederName").innerText = data.breeder;
      document.getElementById("digitalHash").innerText = data.hash;
      document.getElementById("fishImg").src = sanitizeUrl(data.img, CONFIG.PLACEHOLDER_IMAGE);

      certBody.classList.remove("show");
      void certBody.offsetWidth;
      certBody.classList.add("show");
    } else {
      initialState.style.display = "none";
      certBody.classList.remove("show");
      const pesanError = "Nomor sertifikat [" + input + "] tidak terdaftar di dalam database resmi.";
      document.getElementById("errorText").innerText = pesanError;
      errorState.style.display = "block";
      tampilkanDialogModal(pesanError, { title: "Sertifikat Tidak Ditemukan", icon: "✕" });
    }
  }

  function bagikanLinkSertifikat() {
    playClickSound();
    const kode = document.getElementById("certNumber").innerText;
    if (!kode || kode === "-") return;
    const baseUrl = window.location.href.split("#")[0].split("?")[0];
    const shareUrl = `${baseUrl}?cert=${encodeURIComponent(kode)}#verifikasi`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    tampilkanToast("🔗 Link Sertifikat " + kode + " berhasil disalin!");
  }

  function gantiTab(tabId, btnElement) {
    playClickSound();
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    btnElement.classList.add("active");
  }

  function bukaZoom(srcUrl) {
    playClickSound();
    if (!srcUrl) return;
    document.getElementById("lightboxImg").src = srcUrl;
    document.getElementById("lightboxModal").classList.add("open");
  }

  function tutupZoom() {
    playClickSound();
    document.getElementById("lightboxModal").classList.remove("open");
  }

  function tampilkanToast(pesan) {
    const toast = document.getElementById("toastMsg");
    toast.innerText = pesan;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 2400);
  }

  function salinKode() {
    playClickSound();
    const kode = document.getElementById("certNumber").innerText;
    if (!kode || kode === "-") return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(kode);
    }

    const copyBtn = document.getElementById("copyBtn");
    copyBtn.innerText = "✅ Tersalin!";
    tampilkanToast("✅ ID " + kode + " berhasil disalin!");
    setTimeout(() => { copyBtn.innerText = "📋 Salin ID"; }, 2200);
  }

  // Fungsi pembuka otomatis: Beranda untuk Tab Baru/Timpa URL, dan Menu Terakhir khusus saat Refresh
  async function cekDirectLinkUrl(dariHashChange = false) {
    const params = new URLSearchParams(window.location.search);
    const certParam = params.get("cert");
    const produkParam = params.get("produk");
    const isReload = apakahHalamanDiRefresh();

    // Jika BUKAN di-refresh (misal: buka tab baru atau menimpa web lain lalu masuk kembali ke cupangkasep.com)
    if (!isReload && !dariHashChange) {
      try {
        localStorage.removeItem("ck_last_route");
        localStorage.removeItem("ck_last_mode_lelang");
        localStorage.removeItem("ck_last_cat_pill");
        sessionStorage.removeItem("ck_last_route");
        sessionStorage.removeItem("ck_last_mode_lelang");
        sessionStorage.removeItem("ck_last_cat_pill");
      } catch (e) {}

      // Jika bukan membuka link bagikan produk/sertifikat (?produk= / ?cert=), wajib mulai dari Beranda
      if (!certParam && !produkParam) {
        if (window.location.hash && window.location.hash !== "#home") {
          history.replaceState({ tab: "home" }, "", "#home");
        }
        navigasiMenuAtas("home", false);
        return;
      }
    }

    const hash = dariHashChange
      ? (window.location.hash || "#home")
      : (sessionStorage.getItem("ck_last_route") || window.location.hash || "#home");

    // 1. Jika Link Share Sertifikat
    if (certParam || hash.startsWith("#cert-")) {
      const kodeCert = certParam || decodeURIComponent(hash.replace("#cert-", ""));
      bukaHalamanVerifikasi();
      document.getElementById("certInput").value = kodeCert;
      cariSertifikat();
      return;
    }

    // 2. Jika sedang di Detail Produk / Lelang saat refresh atau buka link share produk
    if (produkParam || hash.startsWith("#produk-")) {
      const targetKode = (produkParam || decodeURIComponent(hash.replace("#produk-", ""))).trim();
      if (!targetKode) return;

      isCatalogUnlocked = true;
      aturSorotanNavbar("gallery");
      const wasLelang = sessionStorage.getItem("ck_last_mode_lelang") === "1";
      tampilkanIsiKatalog(wasLelang);

      if (!catalogLoadedOnce || masterCatalogItems.length === 0) {
        await muatDataKatalog(false);
      }

      const itemTarget = masterCatalogItems.find(i => i.kode.toUpperCase() === targetKode.toUpperCase());
      if (itemTarget && itemTarget.kategori.toLowerCase() === "lelang") {
        tampilkanIsiKatalog(true);
      }

      setTimeout(() => {
        bukaDetailProduk(targetKode, false);
      }, 50);
      return;
    }

    // 3. Pertahankan posisi menu terakhir khusus saat halaman di-refresh
    if (hash === "#katalog") {
      tampilkanIsiKatalog(false);
    } else if (hash === "#lelang") {
      tampilkanIsiKatalog(true);
    } else if (hash === "#verifikasi") {
      bukaHalamanVerifikasi();
    } else if (hash === "#undian") {
      bukaHalamanUndian();
    } else if (hash === "#gallery") {
      navigasiMenuAtas("gallery", false);
    } else if (hash === "#ongkir") {
      navigasiMenuAtas("ongkir", false);
    } else if (hash === "#about") {
      navigasiMenuAtas("about", false);
    } else if (hash === "#admin" && apakahUserAdmin()) {
      navigasiMenuAtas("admin", false);
    } else {
      navigasiMenuAtas("home", false);
    }
  }

  // Deteksi otomatis jika link ditempel/diubah di tab browser yang sama
  window.addEventListener("hashchange", function() {
    if (window.location.hash.startsWith("#produk-") || window.location.hash.startsWith("#cert-")) {
      cekDirectLinkUrl(true);
    }
  });

  // Kunci bahasa awal ke Bahasa Indonesia (hapus cookie auto-translate jika ada)
  (function kunciBahasaAwalIndonesia() {
    try {
      document.cookie = "googtrans=/id/id; path=/";
      document.cookie = "googtrans=/id/id; domain=" + window.location.hostname + "; path=/";
    } catch (e) {}
    USER_LANG = "id";
    IS_INDONESIA = true;
    const langSelect = document.getElementById("langDropdown");
    if (langSelect) langSelect.value = "id";
  })();

  function googleTranslateElementInit() {
    isGoogleTranslateLoaded = true;
    isGoogleTranslateLoading = false;
    new google.translate.TranslateElement({
      pageLanguage: 'id',
      includedLanguages: 'id,en,zh-CN',
      autoDisplay: false
    }, 'google_translate_element');

    if (pendingTranslateLang && pendingTranslateLang !== "id") {
      terapkanNilaiComboTranslate(pendingTranslateLang, 25);
    }
  }