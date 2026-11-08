<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cupang Kasep Official — Koleksi Cupang VIP & Sertifikat</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

  :root {
    --bg-dark: #07090e;
    --card-bg: #0b0d13;
    --card-surface: #171c28;
    --gold-primary: #d4af37;
    --gold-light: #f9e8a2;
    --gold-dark: #996f0a;
    --text-light: #f8fafc;
    --text-muted: #94a3b8;
    --verified-green: #10b981;
    --wa-green: #25D366;
    --danger-red: #ef4444;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-light);
    padding: 0;
    line-height: 1.5;
  }

    /* ==========================================
     CONTAINER UTAMA & MOTIF GEOMETRIS PDF
     ========================================== */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 96px; /* Tambahan jarak agar konten tidak tertutup menu atas */
    background-color: #08090c;
    /* Motif garis geometris diagonal sesuai PDF */
    background-image: 
      repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 28px),
      repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 28px);
    border: 1px solid rgba(212, 175, 55, 0.25);
    overflow-x: hidden; /* Diganti dari overflow: hidden */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);
    position: relative;
    min-height: 100vh;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }

  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  /* ==========================================
     1. NAVBAR ATAS (SELALU MENGIKUTI KE BAWAH)
     ========================================== */
  .ck-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 48px;
    position: fixed; /* Diganti dari sticky ke fixed agar selalu ikut ke bawah */
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px;
    z-index: 1000;
    background: rgba(8, 9, 12, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.75);
  }

  #sectionHome, #sectionGallery, #sectionAbout {
    scroll-margin-top: 96px;
  }

  .nav-brand {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: 18px;
    font-weight: 700;
    font-style: italic;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: 0.5px;
    cursor: pointer;
  }

  .nav-links {
    display: flex;
    gap: 42px;
    align-items: center;
  }

  .nav-item {
    position: relative;
    color: #cbd5e1;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: color 0.2s;
    cursor: pointer;
    padding-top: 8px;
  }

  .nav-item:hover, .nav-item.active {
    color: #ffffff;
    font-weight: 700;
  }

  /* Bintang kuning di atas menu aktif sesuai PDF */
  .nav-item.active::before {
    content: "✴";
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    color: #fde047;
    font-size: 16px;
    text-shadow: 0 0 10px rgba(253, 224, 71, 0.8);
  }

  .nav-logo-right {
    width: 48px;
    height: 48px;
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4));
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .container {
      padding-top: 125px;
    }
    #sectionHome, #sectionGallery, #sectionAbout {
      scroll-margin-top: 125px;
    }
    .ck-navbar {
      padding: 12px 20px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .nav-links {
      order: 3;
      width: 100%;
      justify-content: center;
      gap: 28px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
  }

  /* ==========================================
     2. LANDING PAGE BARU (3 SECTION SESUAI PDF)
     ========================================== */
  .landing-page {
    display: block;
    animation: fadeIn 0.4s ease;
  }

  /* --- SECTION A: HERO --- */
  .hero-section {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    align-items: center;
    padding: 50px 60px 70px;
    gap: 32px;
    min-height: 75vh;
  }

  .hero-text-col {
    text-align: left;
  }

  .hero-title {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(34px, 5vw, 56px);
    font-weight: 700;
    line-height: 1.12;
    color: #ffffff;
    margin-bottom: 22px;
    letter-spacing: -0.5px;
  }

  .hero-desc {
    font-size: 15px;
    color: #cbd5e1;
    max-width: 460px;
    margin-bottom: 34px;
    line-height: 1.7;
  }

  .btn-start-hobby {
    display: inline-block;
    padding: 15px 42px;
    border-radius: 40px;
    background: #2f3e46;
    color: #ffffff;
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 0 #d1d5db, 0 12px 24px rgba(0, 0, 0, 0.6);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
  }

  .btn-start-hobby:hover {
    background: #3b4d57;
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #d1d5db, 0 16px 28px rgba(0, 0, 0, 0.7);
  }

  .btn-start-hobby:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 #d1d5db;
  }

  .hero-img-col {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .hero-betta-img {
    width: 100%;
    max-width: 440px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 15px 35px rgba(56, 189, 248, 0.22));
    animation: floatSlow 5s ease-in-out infinite;
  }

  @media (max-width: 840px) {
    .hero-section {
      grid-template-columns: 1fr;
      padding: 36px 24px 50px;
      text-align: center;
    }
    .hero-text-col {
      text-align: center;
      order: 2;
    }
    .hero-desc {
      margin-left: auto;
      margin-right: auto;
    }
    .hero-img-col {
      order: 1;
    }
    .hero-betta-img {
      max-width: 300px;
    }
  }

  /* --- SECTION B: GALLERY / 3 KARTU FITUR UTAMA --- */
  .features-section {
    padding: 50px 60px 80px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .pdf-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    max-width: 1020px;
    margin: 0 auto;
  }

  .pdf-card {
    background: #141923;
    border-radius: 26px;
    border: 1.5px solid rgba(212, 175, 55, 0.45);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65);
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    position: relative;
  }

  .pdf-card:hover {
    transform: translateY(-8px);
    border-color: var(--gold-light);
    box-shadow: 0 18px 40px rgba(212, 175, 55, 0.25);
  }

  .pdf-card-art {
    width: 100%;
    aspect-ratio: 1 / 0.95;
    background: radial-gradient(circle at 50% 35%, #232d42 0%, #10141d 80%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px;
    position: relative;
  }

  .pdf-card-art img {
    width: 68%;
    height: 68%;
    object-fit: contain;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
    transition: transform 0.3s ease;
  }

  .pdf-card:hover .pdf-card-art img {
    transform: scale(1.06);
  }

  .pdf-card-footer {
    background: #10141d;
    padding: 22px 16px 26px;
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  .pdf-card-title {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
    line-height: 1.25;
    letter-spacing: 0.5px;
  }

  @media (max-width: 840px) {
    .features-section {
      padding: 36px 24px 60px;
    }
    .pdf-cards-grid {
      grid-template-columns: 1fr;
      max-width: 350px;
    }
  }

  /* --- SECTION C: ABOUT US (SESUAI PDF HALAMAN 3) --- */
  .about-section {
    padding: 60px 60px 70px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    position: relative;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 44px;
    align-items: center;
  }

  .about-img-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .about-betta-img {
    width: 100%;
    max-width: 400px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 15px 35px rgba(250, 204, 21, 0.2));
  }

  .about-content-col {
    position: relative;
  }

  .about-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 28px;
  }

  .about-main-title {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(32px, 4.5vw, 52px);
    font-weight: 700;
    color: #ffffff;
    line-height: 1.1;
    margin-bottom: 14px;
  }

  .about-subtitle {
    font-size: 15px;
    color: #e2e8f0;
    line-height: 1.6;
    max-width: 480px;
  }

  .about-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  .about-col-title {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
  }

  .about-col-text {
    font-size: 13.5px;
    color: #cbd5e1;
    line-height: 1.65;
  }

  @media (max-width: 860px) {
    .about-section {
      padding: 40px 24px 50px;
    }
    .about-grid {
      grid-template-columns: 1fr;
    }
    .about-columns {
      grid-template-columns: 1fr;
    }
    .about-badge-award {
      width: 75px;
      height: 75px;
    }
  }

  /* --- SECTION D: FOOTER PUTIH (SESUAI PDF HALAMAN 3) --- */
  .white-footer {
    background: #f4f7f9;
    color: #111827;
    padding: 36px 60px;
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  .wf-brand-col {
    display: flex;
    align-items: center;
  }

  .wf-brand-title {
    font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 800;
    font-style: italic;
    color: #0f172a;
  }

  .wf-links-col h4 {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 10px;
  }

  .wf-link-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .wf-link-list a {
    color: #334155;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    transition: color 0.2s;
  }

  .wf-link-list a:hover {
    color: #000000;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .white-footer {
      grid-template-columns: 1fr;
      padding: 28px 24px;
      text-align: center;
    }
    .wf-brand-col {
      justify-content: center;
    }
  }

  /* ==========================================
     3. HEADER UMUM SUB-HALAMAN (KATALOG, VERIFIKASI, UNDIAN)
     ========================================== */
  #verificationPage, #roulettePage, #catalogPage {
    display: none;
    animation: fadeIn 0.35s ease;
    max-width: 960px;
    margin: 24px auto 40px;
    background: var(--card-bg);
    border: 1px solid rgba(212, 175, 55, 0.35);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 35px rgba(0,0,0,0.8);
  }

  #verificationPage, #roulettePage {
    max-width: 540px;
  }

  .vip-header {
    background: linear-gradient(135deg, #06080c 0%, #1a2130 50%, #06080c 100%);
    border-bottom: 2px solid var(--gold-primary);
    padding: 16px 14px;
    text-align: center;
    position: relative;
  }

  .back-btn {
    position: absolute;
    left: 12px;
    top: 14px;
    background: rgba(212, 175, 55, 0.12);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: var(--gold-light);
    font-size: 11px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 14px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .back-btn:hover {
    background: rgba(212, 175, 55, 0.25);
  }

  .back-btn:active {
    transform: scale(0.95);
  }

  .brand-subtitle {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold-primary);
    font-weight: 700;
    margin-bottom: 4px;
    margin-top: 14px;
  }

  .vip-title {
    font-family: 'Cinzel', serif;
    font-size: 19px;
    font-weight: 800;
    background: linear-gradient(to right, var(--gold-light), var(--gold-primary), var(--gold-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }

  .vip-tagline {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ==========================================
     4. HALAMAN KATALOG IKAN & PRODUK (EXISTING)
     ========================================== */
  .catalog-controls {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .catalog-category-pills {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .cat-pill {
    flex: 1;
    min-width: max-content;
    padding: 9px 14px;
    border-radius: 10px;
    background: #0b0e16;
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
  }

  .cat-pill.active {
    background: linear-gradient(135deg, var(--gold-light), var(--gold-primary));
    color: #05070a;
    border-color: var(--gold-light);
    box-shadow: 0 3px 12px rgba(212, 175, 55, 0.3);
  }

  .catalog-filter-bar {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @media (min-width: 640px) {
    .catalog-filter-bar {
      grid-template-columns: 1.6fr 1fr 1fr;
    }
  }

  .catalog-input, .catalog-select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(212, 175, 55, 0.35);
    background: #080a0f;
    color: #fff;
    font-size: 12.5px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }

  .catalog-input:focus, .catalog-select:focus {
    border-color: var(--gold-light);
  }

  .catalog-meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11.5px;
    color: var(--text-muted);
    padding-top: 4px;
  }

  .catalog-count-highlight {
    color: var(--gold-light);
    font-weight: 700;
  }

  .refresh-catalog-btn {
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: var(--gold-light);
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .catalog-grid-wrapper {
    padding: 16px;
  }

  .catalog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 540px) {
    .catalog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 860px) {
    .catalog-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* --- KARTU PRODUK BARU (SESUAI GAMBAR 1) --- */
  .product-card {
    background: linear-gradient(160deg, #161c2a 0%, #0d111a 100%);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }

  .product-card:hover {
    transform: translateY(-4px);
    border-color: var(--gold-primary);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.15);
  }

  .product-card.out-of-stock {
    border-color: rgba(148, 163, 184, 0.25);
  }

  .product-thumb-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #06080c;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  }

  .product-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .product-card:hover .product-thumb {
    transform: scale(1.05);
  }

  .product-card.out-of-stock .product-thumb {
    filter: grayscale(45%) brightness(0.8);
  }

  .product-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 10px;
  }

  .card-badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .badge-pill-tag {
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-pill-tag.primary {
    background: rgba(212, 175, 55, 0.15);
    color: var(--gold-primary);
    border: 1px solid rgba(212, 175, 55, 0.3);
  }

  .badge-pill-tag.outline {
    background: rgba(7, 9, 14, 0.6);
    color: var(--text-light);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .product-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .product-price {
    font-size: 18px;
    font-weight: 800;
    color: var(--gold-primary);
    margin-bottom: 4px;
  }

  .card-actions-row {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }

  .btn-card-detail {
    flex: 1;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: var(--text-light);
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-card-detail:hover {
    background: rgba(212, 175, 55, 0.15);
    border-color: var(--gold-light);
  }

  .btn-card-cart {
    flex: 1;
    padding: 10px 12px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold-primary));
    color: #05070a;
    font-size: 12.5px;
    font-weight: 800;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    transition: transform 0.15s, opacity 0.2s;
  }

  .btn-card-cart:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  .btn-card-cart.restock-mode {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--danger-red);
    color: #fca5a5;
  }

  /* --- HALAMAN DETAIL PRODUK (SESUAI GAMBAR 2) --- */
  .product-detail-view {
    padding: 24px;
    animation: fadeIn 0.3s ease;
  }

  .detail-layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
  }

  @media (min-width: 768px) {
    .detail-layout-grid {
      grid-template-columns: 0.95fr 1.05fr;
      align-items: start;
    }
  }

  .detail-main-img-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #06080c;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.35);
    position: relative;
    cursor: pointer;
  }

  .detail-main-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .detail-img-counter {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(7, 9, 14, 0.85);
    color: var(--text-light);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail-thumb-list {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
  }

  .detail-thumb-item {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.15);
    opacity: 0.5;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .detail-thumb-item:hover {
    opacity: 0.85;
  }

  .detail-thumb-item.active {
    border-color: var(--gold-primary);
    opacity: 1;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.35);
  }

  .detail-thumb-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-info-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .badge-stock-pill {
    font-size: 10.5px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .badge-stock-pill.in-stock {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.4);
  }

  .badge-stock-pill.out-stock {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
  }

  .detail-title {
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.25;
    text-transform: uppercase;
  }

  .detail-price-wrap {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .detail-price {
    font-size: 24px;
    font-weight: 800;
    color: var(--gold-primary);
  }

  .detail-currency {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
  }

  .detail-stars {
    color: #fde047;
    font-size: 14px;
    letter-spacing: 2px;
  }

  .spec-table-box {
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.015);
    margin-top: 4px;
  }

  .spec-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 12.5px;
    align-items: center;
  }

  .spec-row:last-child {
    border-bottom: none;
  }

  .spec-label {
    color: var(--text-muted);
    font-weight: 500;
  }

  .spec-value {
    color: #ffffff;
    font-weight: 700;
  }

  .detail-note {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .detail-cta-row {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .btn-detail-addcart {
    flex: 1;
    padding: 13px 20px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold-primary));
    color: #05070a;
    font-size: 13.5px;
    font-weight: 800;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s;
  }

  .btn-detail-back {
    padding: 13px 18px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: var(--text-light);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .catalog-loader {
    width: 42px;
    height: 42px;
    border: 3px solid rgba(212, 175, 55, 0.2);
    border-top-color: var(--gold-primary);
    border-radius: 50%;
    margin: 0 auto 14px;
    animation: spinLoader 0.8s linear infinite;
  }

  /* ==========================================
     5. HALAMAN VERIFIKASI & ROULETTE (EXISTING)
     ========================================== */
  .search-section {
    padding: 14px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  }

  .search-label {
    font-size: 12px;
    color: #cbd5e1;
    margin-bottom: 8px;
    display: block;
    font-weight: 600;
  }

  .search-input-group {
    display: flex;
    gap: 8px;
  }

  .search-input {
    flex: 1;
    padding: 11px 12px;
    border-radius: 8px;
    border: 1px solid rgba(212, 175, 55, 0.4);
    background: #080a0f;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    outline: none;
    text-transform: uppercase;
  }

  .search-input::placeholder {
    text-transform: none;
    color: #64748b;
    font-weight: 400;
  }

  .search-btn {
    padding: 11px 18px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark));
    color: #05070a;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.15s;
  }

  .state-box {
    padding: 36px 20px;
    text-align: center;
  }

  .state-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 12px;
    border-radius: 50%;
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .state-icon.error {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
  }

  .state-title {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    color: var(--gold-light);
    margin-bottom: 6px;
  }

  .state-title.error {
    color: #fca5a5;
  }

  .state-desc {
    font-size: 12px;
    color: var(--text-muted);
    max-width: 280px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cert-body {
    padding: 14px;
    display: none;
    flex-direction: column;
    gap: 14px;
    animation: fadeIn 0.3s ease;
  }

  .cert-body.show {
    display: flex;
  }

  .cert-visual-card {
    background: linear-gradient(145deg, #181e2c, #0b0e15);
    border: 2px solid var(--gold-primary);
    border-radius: 12px;
    padding: 14px;
    text-align: center;
    position: relative;
  }

  .cert-seal {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid var(--gold-primary);
    color: var(--gold-light);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .fish-photo-wrapper {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.4);
    margin-bottom: 10px;
    background: #05070a;
    position: relative;
    cursor: pointer;
  }

  .fish-photo-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .zoom-hint {
    position: absolute;
    bottom: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.75);
    color: var(--gold-light);
    font-size: 10px;
    padding: 4px 9px;
    border-radius: 10px;
    border: 1px solid rgba(212, 175, 55, 0.4);
    pointer-events: none;
  }

  .cert-fish-name {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: #fff;
    margin-bottom: 2px;
  }

  .cert-id-sub {
    font-size: 12px;
    color: var(--gold-primary);
    font-family: monospace;
  }

  .details-panel {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 12px;
  }

  .tabs-nav {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    padding-bottom: 8px;
    overflow-x: auto;
  }

  .tab-btn {
    flex: 1;
    min-width: max-content;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
  }

  .tab-btn.active {
    background: rgba(212, 175, 55, 0.2);
    border-color: var(--gold-primary);
    color: var(--gold-light);
  }

  .tab-content {
    display: none;
  }

  .tab-content.active {
    display: block;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--card-surface);
    padding: 8px 10px;
    border-radius: 8px;
    border-left: 3px solid var(--gold-primary);
    font-size: 12px;
  }

  .info-label {
    color: var(--text-muted);
    font-size: 11px;
  }

  .info-value {
    color: #fff;
    font-weight: 600;
  }

  .badge-verified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid var(--verified-green);
    color: #34d399;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
  }

  .guarantee-box {
    background: rgba(212, 175, 55, 0.06);
    border: 1px dashed rgba(212, 175, 55, 0.4);
    padding: 10px;
    border-radius: 8px;
    font-size: 11.5px;
    color: #cbd5e1;
  }

  .hash-code {
    margin-top: 8px;
    padding: 6px;
    background: #06080c;
    border-radius: 6px;
    font-family: monospace;
    font-size: 9.5px;
    color: var(--gold-primary);
    word-break: break-all;
  }

  .action-bar {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  .btn-secondary {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(212, 175, 55, 0.4);
    background: rgba(212, 175, 55, 0.08);
    color: var(--gold-light);
    font-weight: 600;
    font-size: 11.5px;
    text-align: center;
    cursor: pointer;
  }

  .roulette-body {
    padding: 16px 14px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .voucher-panel {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 12px;
    padding: 12px;
  }

  .voucher-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    font-size: 12px;
  }

  .chance-pill {
    background: rgba(212, 175, 55, 0.18);
    border: 1px solid var(--gold-primary);
    color: var(--gold-light);
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
  }

  .wheel-stage {
    position: relative;
    width: 100%;
    max-width: 290px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px auto;
  }

  .wheel-pointer {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 26px solid #ef4444;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.8));
  }

  .wheel-pointer::after {
    content: "";
    position: absolute;
    top: -28px;
    left: -6px;
    width: 12px;
    height: 12px;
    background: var(--gold-light);
    border-radius: 50%;
  }

  #rouletteCanvas {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 6px solid var(--gold-primary);
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.35), inset 0 0 15px rgba(0,0,0,0.8);
    transition: transform 4.6s cubic-bezier(0.12, 0.8, 0.18, 1);
  }

  .wheel-center-cap {
    position: absolute;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-light) 0%, var(--gold-primary) 60%, #5c4004 100%);
    border: 3px solid #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-weight: 800;
    font-size: 12px;
    color: #090c12;
    z-index: 10;
    pointer-events: none;
  }

  .btn-spin-wheel {
    width: 100%;
    max-width: 260px;
    padding: 14px 24px;
    border-radius: 30px;
    border: 1px solid var(--gold-light);
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 50%, var(--gold-dark) 100%);
    color: #05070a;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }

  .btn-spin-wheel:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .history-panel {
    width: 100%;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 12px;
  }

  .history-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--gold-light);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 10px;
    background: var(--card-surface);
    border-radius: 8px;
    border-left: 3px solid var(--gold-primary);
  }

  .history-item.zonk {
    border-left-color: var(--danger-red);
    color: var(--text-muted);
  }

  .btn-claim-wa {
    margin-top: 10px;
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    background: rgba(37, 211, 102, 0.15);
    border: 1px solid var(--wa-green);
    color: #4ade80;
    font-weight: 700;
    font-size: 12px;
    text-align: center;
    text-decoration: none;
    display: none;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .secret-admin-panel {
    display: none;
    width: 100%;
    background: linear-gradient(145deg, #161e2e, #090d14);
    border: 1.5px solid var(--gold-primary);
    border-radius: 12px;
    padding: 14px;
    animation: fadeIn 0.3s ease;
  }

  .secret-admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }

  .secret-admin-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 800;
    color: var(--gold-light);
  }

  .close-admin-btn {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--danger-red);
    color: #fca5a5;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 8px;
    cursor: pointer;
  }

  .admin-result-box {
    margin-top: 10px;
    background: #06080c;
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 8px;
    padding: 10px;
    font-size: 11.5px;
    line-height: 1.5;
  }

  .result-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .result-modal.open {
    display: flex;
    animation: fadeIn 0.25s ease;
  }

  .result-box {
    width: 100%;
    max-width: 310px;
    background: linear-gradient(145deg, #1b2234, #0c1018);
    border: 2px solid var(--gold-primary);
    border-radius: 16px;
    padding: 22px 18px;
    text-align: center;
    box-shadow: 0 10px 35px rgba(0,0,0,0.9);
  }

  .result-icon {
    font-size: 44px;
    margin-bottom: 8px;
  }

  .result-title {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--gold-light);
    margin-bottom: 6px;
  }

  .result-prize {
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.4);
    padding: 8px 12px;
    border-radius: 10px;
    margin: 10px 0;
  }

  .result-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .lightbox.open {
    display: flex;
    animation: fadeIn 0.2s ease;
  }

  .lightbox-close {
    margin-bottom: 12px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(212, 175, 55, 0.2);
    border: 1px solid var(--gold-primary);
    color: var(--gold-light);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .lightbox img {
    max-width: 100%;
    max-height: 75vh;
    border-radius: 10px;
    border: 2px solid var(--gold-primary);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.9);
  }

  .toast-msg {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #10b981;
    color: #042f2e;
    font-weight: 700;
    font-size: 12px;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    opacity: 0;
    pointer-events: none;
    transition: all 0.25s ease;
    z-index: 10000;
  }

  .toast-msg.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* ==========================================
     MODAL PEMILIHAN BAHASA (WELCOME GATE)
     ========================================== */
  .lang-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 7, 11, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  .lang-modal-overlay.hidden {
    display: none;
  }

  .lang-box {
    width: 100%;
    max-width: 380px;
    background: linear-gradient(155deg, #161c2a 0%, #090c12 100%);
    border: 1.5px solid var(--gold-primary);
    border-radius: 22px;
    padding: 30px 22px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(212, 175, 55, 0.2);
  }

  .lang-logo {
    width: 68px;
    height: 68px;
    object-fit: contain;
    margin-bottom: 12px;
    filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.4));
  }

  .lang-title {
    font-family: 'Cinzel', serif;
    font-size: 19px;
    font-weight: 800;
    color: var(--gold-light);
    margin-bottom: 6px;
    letter-spacing: 1px;
  }

  .lang-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 22px;
    line-height: 1.5;
  }

  .lang-btn-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .lang-option-btn {
    width: 100%;
    padding: 13px 16px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .lang-option-btn:hover, .lang-option-btn:active {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(212, 175, 55, 0.06));
    border-color: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(212, 175, 55, 0.2);
  }

  .lang-left {
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
  }

  .lang-flag {
    font-size: 24px;
    line-height: 1;
  }

  .lang-name-main {
    font-size: 14.5px;
    font-weight: 700;
    color: #fff;
    display: block;
  }

  .lang-name-sub {
    font-size: 10.5px;
    color: var(--text-muted);
    display: block;
  }

  .lang-arrow {
    color: var(--gold-primary);
    font-weight: 800;
    font-size: 15px;
  }

  /* Tombol indikator bahasa di pojok kanan Navbar */
  .nav-right-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-lang-switch {
    background: rgba(212, 175, 55, 0.12);
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: var(--gold-light);
    font-size: 11px;
    font-weight: 700;
    padding: 6px 11px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background 0.2s;
  }

  .nav-lang-switch:hover {
    background: rgba(212, 175, 55, 0.25);
  }
</style>
</head>
<body>

<!-- ==========================================
     MODAL PEMILIHAN BAHASA (MUNCUL PERTAMA KALI)
     ========================================== -->
<div class="lang-modal-overlay" id="languageGateModal">
  <div class="lang-box">
    <img src="https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/logo%20ck%20(putih).png" alt="Logo Cupang Kasep" class="lang-logo">
    <div class="lang-title">SELECT LANGUAGE</div>
    <p class="lang-subtitle">Pilih bahasa Anda / Choose your language / 请选择您的语言</p>

    <div class="lang-btn-list">
      <!-- 1. INDONESIA -->
      <button type="button" class="lang-option-btn" onclick="pilihBahasa('id')">
        <div class="lang-left">
          <span class="lang-flag">🇮🇩</span>
          <div>
            <span class="lang-name-main">Indonesia</span>
            <span class="lang-name-sub">Bahasa Indonesia (Domestik)</span>
          </div>
        </div>
        <span class="lang-arrow">→</span>
      </button>

      <!-- 2. ENGLISH -->
      <button type="button" class="lang-option-btn" onclick="pilihBahasa('en')">
        <div class="lang-left">
          <span class="lang-flag">🇬🇧</span>
          <div>
            <span class="lang-name-main">English</span>
            <span class="lang-name-sub">International Visitor</span>
          </div>
        </div>
        <span class="lang-arrow">→</span>
      </button>

      <!-- 3. CHINA (DENGAN TULISAN CHINA) -->
      <button type="button" class="lang-option-btn" onclick="pilihBahasa('zh')">
        <div class="lang-left">
          <span class="lang-flag">🇨🇳</span>
          <div>
            <span class="lang-name-main">中文 (简体)</span>
            <span class="lang-name-sub">Chinese / 国际访客</span>
          </div>
        </div>
        <span class="lang-arrow">→</span>
      </button>
    </div>
  </div>
</div>

<div class="container" id="mainContainer">

  <!-- ==========================================
       NAVBAR ATAS (DENGAN TOMBOL GANTI BAHASA)
       ========================================== -->
  <nav class="ck-navbar">
    <div class="nav-brand" onclick="navigasiMenuAtas('home')">Cupang kasep Official</div>
    <div class="nav-links">
      <a class="nav-item active" id="navHome" onclick="navigasiMenuAtas('home')">Home</a>
      <a class="nav-item" id="navGallery" onclick="navigasiMenuAtas('gallery')">Gallery</a>
      <a class="nav-item" id="navAbout" onclick="navigasiMenuAtas('about')">About Us</a>
    </div>
    <div class="nav-right-group">
      <button type="button" class="nav-lang-switch" id="activeLangBtn" onclick="bukaModalBahasa()" title="Ganti Bahasa">
        🌐 ID
      </button>
      <img src="https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/logo%20ck%20(putih).png" alt="Logo CK" class="nav-logo-right" onclick="navigasiMenuAtas('home')">
    </div>
  </nav>

  <!-- ==========================================
       BAGIAN 1: LANDING PAGE UTAMA (3 SECTION PDF)
       ========================================== -->
  <div class="landing-page" id="landingPage">

    <!-- SECTION 1: HERO (HALAMAN 1 PDF) -->
    <section class="hero-section" id="sectionHome">
      <div class="hero-text-col">
        <h1 class="hero-title">Discover Rare<br>Collections<br>of betta fish</h1>
        <p class="hero-desc">
          Your official gateway to <strong>Cupang Kasep</strong>. Explore our live betta & product catalog, certificate verification, and VIP rewards.
        </p>
        <button type="button" class="btn-start-hobby" onclick="navigasiMenuAtas('gallery')">
          Start Ur Hobby
        </button>
      </div>

      <div class="hero-img-col">
        <img src="https://images.unsplash.com/vector-1794025383485-0a1ee1bc2ffc?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="3D Geometric Betta Fish" class="hero-betta-img">
      </div>
    </section>

    <!-- SECTION 2: MENU KARTU FITUR (HALAMAN 2 PDF) -->
    <section class="features-section" id="sectionGallery">
      <div class="pdf-cards-grid">

        <!-- Kartu 1: Authenticity Certificate -->
        <div class="pdf-card" onclick="bukaHalamanVerifikasi()">
          <div class="pdf-card-art">
            <img src="https://images.unsplash.com/vector-1793885597002-1e18b52f0b36?q=80&w=880&auto=format&fit=crop" alt="Authenticity Certificate">
          </div>
          <div class="pdf-card-footer">
            <div class="pdf-card-title">AUTHENTICITY<br>CERTIFICATE</div>
          </div>
        </div>

        <!-- Kartu 2: Shop / Product Catalog -->
        <div class="pdf-card" onclick="bukaHalamanKatalog()">
          <div class="pdf-card-art">
            <img src="https://images.unsplash.com/vector-1793882916715-421af75659f6?q=80&w=880&auto=format&fit=crop" alt="Product Catalog">
          </div>
          <div class="pdf-card-footer">
            <div class="pdf-card-title">PRODUCT CATALOG</div>
          </div>
        </div>

        <!-- Kartu 3: Gacha / Prize Draw -->
        <div class="pdf-card" onclick="bukaHalamanUndian()">
          <div class="pdf-card-art">
            <img src="https://images.unsplash.com/vector-1793883880838-ab4eab32b1e4?q=80&w=916&auto=format&fit=crop" alt="Prize Draw">
          </div>
          <div class="pdf-card-footer">
            <div class="pdf-card-title" style="text-transform: none; font-size: 21px;">PRIZE DRAW</div>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 3: ABOUT US (HALAMAN 3 PDF) -->
    <section class="about-section" id="sectionAbout">
      <div class="about-grid">
        <div class="about-img-col">
          <img src="https://images.unsplash.com/vector-1794026349193-9a2c98820e11?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="Betta Fish About Us" class="about-betta-img">
        </div>

        <div class="about-content-col">
          <div class="about-header-row">
            <div>
              <h2 class="about-main-title">About Us</h2>
              <p class="about-subtitle">
                Your Premier Destination for Collection Betta Fish. Celebrating quality, beauty, and passion since 2025.
              </p>
            </div>
          </div>

          <div class="about-columns">
            <div>
              <h3 class="about-col-title">Our Story</h3>
              <p class="about-col-text">
                Starting from a small passionate hobby, Cupang Kasep Official has grown into a trusted breeder and provider of high-quality Betta fish. We focus on genetic excellence, vibrant colors, and healthy fish for collectors.
              </p>
            </div>
            <div>
              <h3 class="about-col-title">Our Vision & Mission</h3>
              <p class="about-col-text">
                To elevate the Betta fish hobby globally by providing top-tier genetics and educating the community. We strive to offer outstanding service and premium varieties to enthusiast and collectors alike.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER PUTIH (SESUAI HALAMAN 3 PDF) -->
    <footer class="white-footer">
      <div class="wf-brand-col">
        <span class="wf-brand-title">Cupang kasep Official</span>
      </div>

      <div class="wf-links-col">
        <h4>Cupang kasep Official</h4>
        <ul class="wf-link-list">
          <li><a href="https://wa.me/6282121478149?text=Halo%20Admin%20Cupang%20Kasep,%20saya%20ingin%20bertanya%20mengenai%20koleksi%20dan%20Sertifikat%20VIP." target="_blank" rel="noopener noreferrer">Whats App</a></li>
          <li><a href="#" onclick="tampilkanToast('💬 Line Official Cupang Kasep'); return false;">Line</a></li>
          <li><a href="#" onclick="tampilkanToast('✈️ Telegram Official Cupang Kasep'); return false;">Telegram</a></li>
        </ul>
      </div>

      <div class="wf-links-col">
        <h4>Cupang kasep Official</h4>
        <ul class="wf-link-list">
          <li><a href="#" onclick="tampilkanToast('📸 Instagram @cupangkasep'); return false;">Instagram</a></li>
          <li><a href="#" onclick="tampilkanToast('🎵 TikTok @cupangkasep'); return false;">Tik Tok</a></li>
          <li><a href="#" onclick="tampilkanToast('📘 Facebook Cupang Kasep Official'); return false;">Facebook</a></li>
        </ul>
      </div>
    </footer>

  </div>

  <!-- ==========================================
       BAGIAN 2: HALAMAN KATALOG IKAN & PRODUK
       ========================================== -->
  <div id="catalogPage">
    <div class="vip-header">
      <button type="button" class="back-btn" onclick="kembaliKeLanding()">← Kembali</button>
      <div class="brand-subtitle">OFFICIAL STORE CUPANG KASEP</div>
      <h1 class="vip-title">KATALOG PRODUK</h1>
      <p class="vip-tagline">Koleksi Ikan Cupang Berkualitas & Kebutuhan Perawatan Terbaik</p>
    </div>

    <div class="catalog-controls">
      <div class="catalog-category-pills">
        <button type="button" class="cat-pill active" onclick="pilihKategoriKatalog('Semua', this)">✨ Semua Koleksi</button>
        <button type="button" class="cat-pill" onclick="pilihKategoriKatalog('Ikan Cupang', this)">🐠 Ikan Cupang</button>
        <button type="button" class="cat-pill" onclick="pilihKategoriKatalog('Produk', this)">🧴 Produk</button>
      </div>

      <div class="catalog-filter-bar">
        <input type="text" id="catalogSearchInput" class="catalog-input" placeholder="🔍 Cari nama atau kode (misal: CK-001)..." oninput="terapkanFilterKatalog()">
        
        <select id="catalogTypeSelect" class="catalog-select" onchange="terapkanFilterKatalog()">
          <option value="Semua">Semua Jenis / Varian</option>
        </select>

        <select id="catalogSortSelect" class="catalog-select" onchange="terapkanFilterKatalog()">
          <option value="default">Urutkan: Terbaru / Default</option>
          <option value="price-asc">Harga: Termurah ke Termahal</option>
          <option value="price-desc">Harga: Termahal ke Termurah</option>
        </select>
      </div>

      <div class="catalog-meta-bar">
        <span>Menampilkan <span class="catalog-count-highlight" id="catalogCountText">0</span> koleksi</span>
        <button type="button" class="refresh-catalog-btn" onclick="muatDataKatalog(true)">🔄 Segarkan Data</button>
      </div>
    </div>

    <div class="state-box" id="catalogLoadingState">
      <div class="catalog-loader"></div>
      <div class="state-title">Memuat Katalog Resmi...</div>
      <p class="state-desc">Mengambil data terbaru dari database Cupang Kasep.</p>
    </div>

    <div class="state-box" id="catalogEmptyState" style="display: none;">
      <div class="state-icon">🔎</div>
      <div class="state-title" id="catalogEmptyTitle">Koleksi Tidak Ditemukan</div>
      <p class="state-desc" id="catalogEmptyDesc">Tidak ada ikan atau produk yang sesuai dengan pencarian Anda.</p>
    </div>

    <div class="catalog-grid-wrapper" id="catalogGridWrapper" style="display: none;">
      <div class="catalog-grid" id="catalogGrid"></div>
    </div>

    <!-- TAMPILAN DETAIL PRODUK (GAMBAR 2) -->
    <div class="product-detail-view" id="catalogDetailView" style="display: none;">
      <div id="catalogDetailContent"></div>
    </div>
  </div>

  <!-- ==========================================
       BAGIAN 3: HALAMAN VERIFIKASI SERTIFIKAT
       ========================================== -->
  <div id="verificationPage">
    <div class="vip-header">
      <button type="button" class="back-btn" onclick="kembaliKeLanding()">← Kembali</button>
      <div class="brand-subtitle">CUPANG KASEP</div>
      <h1 class="vip-title">SERTIFIKAT OTENTIKASI VIP</h1>
      <p class="vip-tagline">Verifikasi Keaslian Genetik & Kepemilikan Sah</p>
    </div>

    <div class="search-section">
      <span class="search-label">🔑 Masukkan Nomor Sertifikat Resmi:</span>
      <div class="search-input-group">
        <input type="text" id="certInput" class="search-input" placeholder="Ketik nomor sertifikat..." autocomplete="off" onkeypress="if(event.key === 'Enter') cariSertifikat()">
        <button type="button" class="search-btn" onclick="cariSertifikat()">Cek</button>
      </div>
    </div>

    <div class="state-box" id="initialState">
      <div class="state-icon">🔒</div>
      <div class="state-title">Akses Data Terkunci</div>
      <p class="state-desc">
        Silakan ketik <strong>Nomor Sertifikat</strong> yang tertera pada kartu fisik Anda di kolom atas, lalu tekan tombol <strong>Cek</strong> untuk membuka rincian kepemilikan sah.
      </p>
    </div>

    <div class="state-box" id="errorState" style="display: none;">
      <div class="state-icon error">⚠️</div>
      <div class="state-title error">Sertifikat Tidak Ditemukan</div>
      <p class="state-desc" id="errorText">
        Nomor sertifikat yang Anda masukkan tidak terdaftar di dalam database resmi Cupang Kasep.
      </p>
    </div>

    <div class="cert-body" id="certBody">
      <div class="cert-visual-card">
        <div class="cert-seal">★ Authentic VIP Specimen ★</div>
        <div class="fish-photo-wrapper" onclick="bukaZoom(document.getElementById('fishImg').src)">
          <img id="fishImg" src="" alt="Ikan Cupang VIP">
          <span class="zoom-hint">🔍 Ketuk Foto</span>
        </div>
        <div class="cert-fish-name" id="fishStrainTitle">-</div>
        <div class="cert-id-sub" id="certCodeDisplay">ID: -</div>
      </div>

      <div class="details-panel">
        <div class="tabs-nav">
          <button type="button" class="tab-btn active" onclick="gantiTab('tab-owner', this)">👤 Pemilik</button>
          <button type="button" class="tab-btn" onclick="gantiTab('tab-genetics', this)">🧬 Genetik</button>
          <button type="button" class="tab-btn" onclick="gantiTab('tab-security', this)">🛡️ Segel</button>
        </div>

        <div id="tab-owner" class="tab-content active">
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Nama Pemilik Sah</span>
              <span class="info-value" id="ownerName">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nomor Sertifikat</span>
              <span class="info-value" id="certNumber">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal Akuisisi</span>
              <span class="info-value" id="issueDate">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status Registrasi</span>
              <span class="info-value"><span class="badge-verified">✔ TERVERIFIKASI SAH</span></span>
            </div>
          </div>
        </div>

        <div id="tab-genetics" class="tab-content">
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Jenis & Strain</span>
              <span class="info-value" id="fishGrade">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Usia & Ukuran</span>
              <span class="info-value" id="fishSize">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Karakteristik</span>
              <span class="info-value" id="fishForm">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">Breeder / Origin</span>
              <span class="info-value" id="breederName">-</span>
            </div>
          </div>
        </div>

        <div id="tab-security" class="tab-content">
          <div class="guarantee-box">
            <strong>🔒 Jaminan Keaslian:</strong><br>
            Spesimen ini adalah koleksi VIP asli dari <strong>Cupang Kasep</strong>.
            <div class="hash-code" id="digitalHash">-</div>
          </div>
        </div>

        <div class="action-bar">
          <button type="button" class="btn-secondary" id="copyBtn" onclick="salinKode()">📋 Salin ID</button>
          <button type="button" class="btn-secondary" onclick="bukaZoom(document.getElementById('fishImg').src)">🖼️ Foto HD</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================
       BAGIAN 4: HALAMAN ROULETTE UNDIAN HADIAH
       ========================================== -->
  <div id="roulettePage">
    <div class="vip-header">
      <button type="button" class="back-btn" onclick="kembaliKeLanding()">← Kembali</button>
      <div class="brand-subtitle">CUPANG KASEP LUCKY SPIN</div>
      <h1 class="vip-title">UNDIAN HADIAH VIP</h1>
      <p class="vip-tagline">1 Voucher Berlaku 3x Putaran</p>
    </div>

    <div class="roulette-body">
      <div class="voucher-panel">
        <span class="search-label">🎟️ Masukkan Kode Voucher Resmi:</span>
        <div class="search-input-group">
          <input type="text" id="voucherInput" class="search-input" placeholder="Masukkan Kode Voucher Resmi" autocomplete="off" onkeypress="if(event.key === 'Enter') aktifkanVoucher()">
          <button type="button" class="search-btn" id="btnPakaiVoucher" onclick="aktifkanVoucher()">Pakai</button>
        </div>
        <div class="voucher-status-bar">
          <span id="activeVoucherText" style="color: var(--text-muted);">Belum ada voucher aktif</span>
          <span class="chance-pill" id="spinChanceDisplay">Kesempatan: 0 / 3</span>
        </div>
      </div>

      <!-- PANEL RAHASIA ADMIN -->
      <div class="secret-admin-panel" id="secretAdminPanel">
        <div class="secret-admin-header">
          <span class="secret-admin-title">🕵️ PANEL RAHASIA CEK HADIAH</span>
          <button type="button" class="close-admin-btn" onclick="tutupPanelRahasiaAdmin()">✕ Tutup</button>
        </div>

        <span class="search-label" style="font-size:11px;">1. Verifikasi Kode Klaim WA (Bisa Beda HP):</span>
        <div class="search-input-group" style="margin-bottom: 10px;">
          <input type="text" id="adminClaimTokenInput" class="search-input" placeholder="Tempel Kode Klaim (CKV-...)" autocomplete="off">
          <button type="button" class="search-btn" onclick="verifikasiTokenKlaim()">Cek Klaim</button>
        </div>

        <span class="search-label" style="font-size:11px;">2. Cek Riwayat Voucher di Server / Lokal:</span>
        <div class="search-input-group">
          <input type="text" id="adminVoucherCheckInput" class="search-input" placeholder="Ketik Kode Voucher..." autocomplete="off">
          <button type="button" class="search-btn" onclick="cekRiwayatVoucherLokal()">Cek Voucher</button>
        </div>

        <div class="admin-result-box" id="adminSecretResultBox">
          <span style="color:var(--text-muted)">Silakan masukkan Kode Klaim dari WhatsApp pelanggan atau Kode Voucher untuk memeriksa keabsahan hadiah.</span>
        </div>
      </div>

      <div class="wheel-stage">
        <div class="wheel-pointer"></div>
        <canvas id="rouletteCanvas" width="500" height="500"></canvas>
        <div class="wheel-center-cap">CK</div>
      </div>

      <button type="button" class="btn-spin-wheel" id="spinBtn" onclick="putarRoulette()" disabled>
        🎯 PUTAR SEKARANG (3x)
      </button>

      <div class="history-panel">
        <div class="history-title">
          <span>🎁 Hasil Undian Voucher Ini:</span>
          <span id="spinCountInfo" style="font-size:11px; color:var(--text-muted);">0/3 Selesai</span>
        </div>
        <div class="history-list" id="spinHistoryList">
          <div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px 0;">
            Masukkan kode voucher untuk mulai memutar roda undian.
          </div>
        </div>
        <a id="claimWaBtn" href="#" target="_blank" rel="noopener noreferrer" class="btn-claim-wa">
          📲 Klaim Hadiah via WhatsApp
        </a>
      </div>
    </div>
  </div>

</div>

<!-- MODAL POPUP HASIL SPIN -->
<div class="result-modal" id="resultModal">
  <div class="result-box">
    <div class="result-icon" id="modalIcon">🎉</div>
    <div class="result-title" id="modalTitle">Hasil Putaran</div>
    <div class="result-prize" id="modalPrize">-</div>
    <p class="result-sub" id="modalSub">Sisa kesempatan Anda: 2x lagi</p>
    <button type="button" class="search-btn" style="width:100%;" onclick="tutupModalHasil()">Lanjutkan</button>
  </div>
</div>

<!-- MODAL POPUP KESEMPATAN HABIS (0/3) -->
<div class="result-modal" id="exhaustedModal">
  <div class="result-box">
    <div class="result-icon">🙏</div>
    <div class="result-title">Kesempatan Habis (0/3)</div>
    <p class="result-sub" style="color: #f8fafc; font-size: 13px; line-height: 1.6; margin: 12px 0 18px;">
      Kesempatan memutar roda undian Anda sudah habis.<br><br>
      Terima kasih sudah percaya dan belanja di <strong style="color: var(--gold-light);">Cupang Kasep</strong>!
    </p>
    <button type="button" class="search-btn" style="width:100%;" onclick="tutupModalHabis()">Mengerti</button>
  </div>
</div>

<!-- MODAL POPUP FOTO HD -->
<div class="lightbox" id="lightboxModal" onclick="tutupZoom()">
  <button type="button" class="lightbox-close" onclick="tutupZoom()">✕ Tutup Foto</button>
  <img id="lightboxImg" src="" alt="Zoom Preview Cupang Kasep" onclick="event.stopPropagation()">
</div>

<!-- NOTIFIKASI TOAST -->
<div class="toast-msg" id="toastMsg">✅ Berhasil!</div>

<!-- MODAL POPUP PASSWORD KATALOG -->
<div class="result-modal" id="catalogPasswordModal">
  <div class="result-box">
    <div class="result-icon">🔒</div>
    <div class="result-title">Dalam Tahap Pengembangan</div>
    <p class="result-sub" style="margin-bottom: 12px;">Masukkan password developer.</p>
    <input type="password" id="catalogPassInput" class="search-input" style="width:100%; text-align:center; margin-bottom:12px; text-transform:none;" placeholder="Ketik password..." onkeypress="if(event.key === 'Enter') verifikasiPasswordKatalog()">
    <div style="display:flex; gap:8px;">
      <button type="button" class="btn-secondary" onclick="tutupModalPasswordKatalog()">Batal</button>
      <button type="button" class="search-btn" style="flex:1;" onclick="verifikasiPasswordKatalog()">Masuk</button>
    </div>
  </div>
</div>

<script>
  /* =========================================================
     1. KONFIGURASI UTAMA
     ========================================================= */
  const CONFIG = {
    SHEET_ID: "15WF5-lpN_G7QU_7UFDx51cU3sC8c1FzCZLftF8CLu6s",
    CATALOG_SHEET_NAME: "Katalog",
    WHATSAPP_NUMBER: "6282121478149",
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxSA4qjlDuEd7h8v_g8JcC7Yj1OszV2DIkgaojt4J0Gv8ZgNu2VB-Qvjd2PBgOMbRg/exec",
    PLACEHOLDER_IMAGE: "https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/logo%20ck%20(putih).png",
    START_ON_CATALOG_PAGE: false,
    CATALOG_PASSWORD: "ckvip"
  };

  const GOOGLE_SCRIPT_URL = CONFIG.APPS_SCRIPT_URL;

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

  let masterCatalogItems = [];    
  let currentCategoryFilter = "Semua";
  let catalogLoadedOnce = false;

  /* =========================================================
     SISTEM BAHASA & PEMBEDA INDONESIA VS NON-INDONESIA
     ========================================================= */
  let USER_LANG = "id";        // Bernilai: 'id' | 'en' | 'zh'
  let IS_INDONESIA = true;     // true = Indonesia, false = Non-Indonesia (English / China)

  // Kamus Terjemahan Teks Utama
  const TRANSLATIONS = {
    id: {
      badge: "🌐 ID",
      toastWelcome: "🇮🇩 Bahasa Indonesia dipilih",
      navHome: "Beranda",
      navGallery: "Galeri Menu",
      navAbout: "Tentang Kami",
      heroTitle: "Temukan Koleksi<br>Langka<br>Ikan Cupang",
      heroDesc: "Gerbang resmi menuju <strong>Cupang Kasep</strong>. Jelajahi katalog ikan & produk secara langsung, verifikasi sertifikat, dan hadiah VIP.",
      heroBtn: "Mulai Hobi Anda",
      cardCert: "SERTIFIKAT<br>KEASLIAN",
      cardCatalog: "KATALOG PRODUK",
      cardPrize: "Undian Hadiah",
      aboutTitle: "Tentang Kami",
      aboutSub: "Destinasi Utama Koleksi Ikan Cupang Anda. Merayakan kualitas, keindahan, dan dedikasi sejak 2025.",
      storyTitle: "Cerita Kami",
      storyText: "Berawal dari hobi yang penuh dedikasi, Cupang Kasep Official telah berkembang menjadi breeder dan penyedia ikan cupang berkualitas tinggi yang tepercaya. Kami fokus pada keunggulan genetik, warna cerah, dan ikan sehat untuk para kolektor.",
      visionTitle: "Visi & Misi Kami",
      visionText: "Mengangkat hobi ikan cupang secara global dengan menyediakan genetik kelas atas dan mengedukasi komunitas. Kami berkomitmen memberikan layanan terbaik dan varian premium bagi penghobi maupun kolektor."
    },
    en: {
      badge: "🌐 EN",
      toastWelcome: "🇬🇧 English language selected",
      navHome: "Home",
      navGallery: "Gallery",
      navAbout: "About Us",
      heroTitle: "Discover Rare<br>Collections<br>of betta fish",
      heroDesc: "Your official gateway to <strong>Cupang Kasep</strong>. Explore our live betta & product catalog, certificate verification, and VIP rewards.",
      heroBtn: "Start Ur Hobby",
      cardCert: "AUTHENTICITY<br>CERTIFICATE",
      cardCatalog: "PRODUCT CATALOG",
      cardPrize: "Prize draw",
      aboutTitle: "About Us",
      aboutSub: "Your Premier Destination for Collection Betta Fish. Celebrating quality, beauty, and passion since 2025.",
      storyTitle: "Our Story",
      storyText: "Starting from a small passionate hobby, Cupang Kasep Official has grown into a trusted breeder and provider of high-quality Betta fish. We focus on genetic excellence, vibrant colors, and healthy fish for collectors.",
      visionTitle: "Our Vision & Mission",
      visionText: "To elevate the Betta fish hobby globally by providing top-tier genetics and educating the community. We strive to offer outstanding service and premium varieties to enthusiast and collectors alike."
    },
    zh: {
      badge: "🌐 中文",
      toastWelcome: "🇨🇳 已选择中文 (Chinese Selected)",
      navHome: "首页",
      navGallery: "功能菜单",
      navAbout: "关于我们",
      heroTitle: "探索稀有<br>精品斗鱼<br>专属收藏",
      heroDesc: "欢迎来到 <strong>Cupang Kasep</strong> 官方门户。探索我们的实时斗鱼与产品目录、血统证书验证以及 VIP 专属抽奖福利。",
      heroBtn: "开启您的爱好",
      cardCert: "官方血统<br>防伪证书",
      cardCatalog: "产品与斗鱼目录",
      cardPrize: "VIP 幸运抽奖",
      aboutTitle: "关于我们",
      aboutSub: "您收藏级斗鱼的首选之地。自 2025 年以来，始终专注于品质、美学与热爱。",
      storyTitle: "品牌故事",
      storyText: "Cupang Kasep Official 始于一份纯粹的热爱，如今已成长为值得信赖的高品质斗鱼繁育者与供应商。我们专注于卓越基因、绚丽色彩，为收藏家提供健康的精品斗鱼。",
      visionTitle: "愿景与使命",
      visionText: "通过提供顶级基因与社区科普，推动全球斗鱼爱好发展。我们致力于为全球爱好者和收藏家提供卓越的服务与高端品种。"
    }
  };

  function pilihBahasa(kodeBahasa) {
    playClickSound();
    USER_LANG = kodeBahasa;
    IS_INDONESIA = (kodeBahasa === "id"); // Bernilai TRUE jika Indonesia, FALSE jika English/China

    // Simpan ke memori agar jika dibutuhkan fungsi lain sudah siap
    try { localStorage.setItem("ck_selected_lang", kodeBahasa); } catch (e) {}

    // Tutup popup pemilihan bahasa
    document.getElementById("languageGateModal").classList.add("hidden");

    // Terapkan perubahan teks & perlakuan khusus
    terapkanPerlakuanBahasa();
    tampilkanToast(TRANSLATIONS[kodeBahasa].toastWelcome);
  }

  function bukaModalBahasa() {
    playClickSound();
    document.getElementById("languageGateModal").classList.remove("hidden");
  }

  function terapkanPerlakuanBahasa() {
    const t = TRANSLATIONS[USER_LANG] || TRANSLATIONS.en;

    // 1. Update tombol indikator bahasa di Navbar
    const langBtn = document.getElementById("activeLangBtn");
    if (langBtn) langBtn.innerText = t.badge;

    // 2. Update teks Navbar
    document.getElementById("navHome").innerText = t.navHome;
    document.getElementById("navGallery").innerText = t.navGallery;
    document.getElementById("navAbout").innerText = t.navAbout;

    // 3. Update teks Hero Section
    const heroTitle = document.querySelector(".hero-title");
    const heroDesc = document.querySelector(".hero-desc");
    const heroBtn = document.querySelector(".btn-start-hobby");
    if (heroTitle) heroTitle.innerHTML = t.heroTitle;
    if (heroDesc) heroDesc.innerHTML = t.heroDesc;
    if (heroBtn) heroBtn.innerText = t.heroBtn;

    // 4. Update judul 3 Kartu Fitur
    const cardTitles = document.querySelectorAll(".pdf-card-title");
    if (cardTitles.length >= 3) {
      cardTitles[0].innerHTML = t.cardCert;
      cardTitles[1].innerHTML = t.cardCatalog;
      cardTitles[2].innerHTML = t.cardPrize;
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

    // 6. TEMPAT PERLAKUAN KHUSUS INDONESIA VS NON-INDONESIA KE DEPANNYA
    if (IS_INDONESIA) {
      // Contoh perlakuan untuk pengunjung Indonesia (Domestik)
      document.body.setAttribute("data-region", "domestic");
    } else {
      // Contoh perlakuan untuk pengunjung Luar Negeri (English / China)
      document.body.setAttribute("data-region", "international");
    }

    // Jika katalog sudah pernah dibuka, render ulang agar mata uang/bahasa kartu ikut menyesuaikan
    if (catalogLoadedOnce) {
      terapkanFilterKatalog();
    }
  }

  /* =========================================================
     NAVIGASI MENU NAVBAR ATAS (HOME, GALLERY, ABOUT US)
     ========================================================= */
  function navigasiMenuAtas(target) {
    if (isWheelSpinning) return;
    playClickSound();

    // Pastikan kembali ke tampilan Landing Page utama jika sedang di sub-halaman
    document.getElementById("verificationPage").style.display = "none";
    document.getElementById("roulettePage").style.display = "none";
    document.getElementById("catalogPage").style.display = "none";
    document.getElementById("landingPage").style.display = "block";

    // Update bintang aktif pada navbar
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

    let targetEl = null;
    if (target === 'home') {
      document.getElementById("navHome").classList.add("active");
      targetEl = document.getElementById("sectionHome");
    } else if (target === 'gallery') {
      document.getElementById("navGallery").classList.add("active");
      targetEl = document.getElementById("sectionGallery");
    } else if (target === 'about') {
      document.getElementById("navAbout").classList.add("active");
      targetEl = document.getElementById("sectionAbout");
    }

    if (targetEl) {
      const navbarHeight = document.querySelector(".ck-navbar").offsetHeight || 90;
      const posisiTujuan = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: posisiTujuan, behavior: "smooth" });
    }
  }

  // Otomatis pindahkan bintang (✴) saat layar di-scroll manual ke bawah/atas
  window.addEventListener("scroll", function() {
    const landingPage = document.getElementById("landingPage");
    if (!landingPage || landingPage.style.display === "none") return;

    const scrollPos = window.scrollY + 180;
    const secGallery = document.getElementById("sectionGallery");
    const secAbout = document.getElementById("sectionAbout");

    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

    if (secAbout && scrollPos >= secAbout.offsetTop) {
      document.getElementById("navAbout").classList.add("active");
    } else if (secGallery && scrollPos >= secGallery.offsetTop) {
      document.getElementById("navGallery").classList.add("active");
    } else {
      document.getElementById("navHome").classList.add("active");
    }
  });

  /* =========================================================
     2. LOGIKA PENGAMBILAN & FILTER KATALOG GOOGLE SHEETS
     ========================================================= */
  function formatRupiah(angka) {
    const num = Number(String(angka).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num) || num <= 0) return "Hubungi Admin";
    return "Rp " + num.toLocaleString("id-ID");
  }

  function buatLinkWhatsAppKatalog(item, isHabis) {
    let pesan = "";
    if (isHabis) {
      pesan = `Halo CUPANG KASEP, saya ingin menanyakan kemungkinan restock untuk item berikut:\nKode: ${item.kode}\nNama: ${item.nama}\nApakah ikan atau produk tersebut akan tersedia kembali?`;
    } else {
      pesan = `Halo CUPANG KASEP, saya ingin menanyakan ketersediaan stok berikut:\nKode: ${item.kode}\nNama: ${item.nama}\nApakah ikan atau produk tersebut masih tersedia?`;
    }
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
  }

  async function muatDataKatalog(paksaSegarkan = false) {
    if (paksaSegarkan) playClickSound();

    const loadingEl = document.getElementById("catalogLoadingState");
    const emptyEl = document.getElementById("catalogEmptyState");
    const gridWrapperEl = document.getElementById("catalogGridWrapper");

    loadingEl.style.display = "block";
    emptyEl.style.display = "none";
    gridWrapperEl.style.display = "none";

    try {
      const rows = await ambilDariGoogleVizJSONP(CONFIG.SHEET_ID, CONFIG.CATALOG_SHEET_NAME);
      if (rows && rows.length > 0) {
        prosesBarisKatalog(rows);
        catalogLoadedOnce = true;
        return;
      }
    } catch (errViz) {
      console.warn("Mencoba jalur cadangan Apps Script...", errViz);
    }

    if (apakahUrlSheetAktif()) {
      try {
        const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=catalog`);
        const json = await res.json();
        if (json && json.status === "ok" && Array.isArray(json.items)) {
          prosesBarisKatalog(json.items);
          catalogLoadedOnce = true;
          return;
        }
      } catch (errGas) {
        console.warn("Gagal memuat dari Apps Script:", errGas);
      }
    }

    prosesBarisKatalog(FALLBACK_CATALOG_DATA);
    tampilkanToast("🛒 Semoga ada ikan kesukaan anda");
  }

  function ambilDariGoogleVizJSONP(sheetId, sheetName) {
    return new Promise((resolve, reject) => {
      const callbackName = "ckCatalogCb_" + Math.floor(Math.random() * 1000000);
      const script = document.createElement("script");
      let timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Timeout memuat Google Sheets"));
      }, 10000);

      function cleanup() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = function(response) {
        cleanup();
        if (!response || response.status === "error" || !response.table) {
          reject(new Error("Tabel tidak ditemukan"));
          return;
        }

        const cols = response.table.cols.map(c => (c.label || "").trim().toLowerCase());
        const rawRows = response.table.rows || [];
        const parsedItems = [];

        rawRows.forEach(r => {
          const cells = r.c || [];
          const getVal = (colIndex) => {
            if (colIndex === -1 || !cells[colIndex]) return "";
            const val = (cells[colIndex].v !== null && cells[colIndex].v !== undefined)
              ? cells[colIndex].v
              : cells[colIndex].f;
            return val !== null && val !== undefined ? String(val).trim() : "";
          };

          const idxKode = cols.indexOf("kode") !== -1 ? cols.indexOf("kode") : 0;
          const idxNama = cols.indexOf("nama") !== -1 ? cols.indexOf("nama") : 1;
          const idxKategori = cols.indexOf("kategori") !== -1 ? cols.indexOf("kategori") : 2;
          const idxJenis = cols.indexOf("jenis") !== -1 ? cols.indexOf("jenis") : 3;
          const idxHarga = cols.indexOf("harga") !== -1 ? cols.indexOf("harga") : 4;
          const idxFoto = cols.indexOf("foto") !== -1 ? cols.indexOf("foto") : 5;
          const idxDeskripsi = cols.indexOf("deskripsi") !== -1 ? cols.indexOf("deskripsi") : 6;
          const idxStok = cols.indexOf("stok") !== -1 ? cols.indexOf("stok") : 7;
          const idxStatus = cols.indexOf("status") !== -1 ? cols.indexOf("status") : 8;

          // Kolom tambahan (J sampai O) di Google Sheets
          const idxSpesies = cols.indexOf("spesies") !== -1 ? cols.indexOf("spesies") : 9;
          const idxTailType = cols.indexOf("tail type") !== -1 ? cols.indexOf("tail type") : 10;
          const idxSex = cols.indexOf("sex") !== -1 ? cols.indexOf("sex") : 11;
          const idxSize = cols.indexOf("size") !== -1 ? cols.indexOf("size") : 12;
          const idxOrigin = cols.indexOf("origin") !== -1 ? cols.indexOf("origin") : 13;
          const idxShipping = cols.indexOf("shipping") !== -1 ? cols.indexOf("shipping") : 14;

          const kode = getVal(idxKode);
          const nama = getVal(idxNama);
          if (!kode || kode.toLowerCase() === "kode" || !nama || nama.toLowerCase() === "nama") return;

          const hargaBersih = Number(String(getVal(idxHarga)).replace(/[^0-9]/g, "")) || 0;
          const stokRaw = String(getVal(idxStok)).replace(/[^0-9-]/g, "");

          parsedItems.push({
            kode: kode,
            nama: nama,
            kategori: getVal(idxKategori) || "Ikan Cupang",
            jenis: getVal(idxJenis) || "Umum",
            harga: hargaBersih,
            foto: getVal(idxFoto),
            deskripsi: getVal(idxDeskripsi),
            stok: stokRaw === "" ? 1 : Number(stokRaw),
            status: getVal(idxStatus) || "Tersedia",
            spesies: getVal(idxSpesies),
            tailType: getVal(idxTailType),
            sex: getVal(idxSex),
            size: getVal(idxSize),
            origin: getVal(idxOrigin),
            shipping: getVal(idxShipping)
          });
        });

        resolve(parsedItems);
      };

      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?headers=1&tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}&_t=${Date.now()}`;
      script.src = url;
      script.onerror = () => {
        cleanup();
        reject(new Error("Gagal memuat script Google Sheets"));
      };
      document.body.appendChild(script);
    });
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
        shipping: String(raw.shipping || "").trim()
      });
    });

    masterCatalogItems = validItems;
    perbaruiDropdownJenis();
    terapkanFilterKatalog();
  }

  function pilihKategoriKatalog(kategori, btnEl) {
    playClickSound();
    currentCategoryFilter = kategori;
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

    selectEl.innerHTML = `<option value="Semua">Semua Jenis / Varian</option>`;
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

  function terapkanFilterKatalog() {
    const keyword = document.getElementById("catalogSearchInput").value.trim().toLowerCase();
    const selectedJenis = document.getElementById("catalogTypeSelect").value;
    const sortBy = document.getElementById("catalogSortSelect").value;

    let hasil = masterCatalogItems.filter(item => {
      const cocokKategori = currentCategoryFilter === "Semua" ||
        item.kategori.toLowerCase() === currentCategoryFilter.toLowerCase();

      const cocokJenis = selectedJenis === "Semua" ||
        item.jenis.toLowerCase() === selectedJenis.toLowerCase();

      const cocokKeyword = !keyword ||
        item.nama.toLowerCase().includes(keyword) ||
        item.kode.toLowerCase().includes(keyword) ||
        item.jenis.toLowerCase().includes(keyword);

      return cocokKategori && cocokJenis && cocokKeyword;
    });

    if (sortBy === "price-asc") {
      hasil.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === "price-desc") {
      hasil.sort((a, b) => b.harga - a.harga);
    }

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

    if (items.length === 0) {
      gridWrapperEl.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";
    gridWrapperEl.style.display = "block";

    gridEl.innerHTML = items.map(item => {
      const isHabis = item.stok <= 0 || item.status.toLowerCase() === "habis";
      // Ambil foto pertama saja untuk sampul kartu depan
      const daftarFoto = dapatkanArrayFoto(item.foto);
      const fotoUrl = daftarFoto[0];
      const waLink = buatLinkWhatsAppKatalog(item, isHabis);
      const teksTombolCart = isHabis ? "Restock" : "Cart";
      const kodeSafe = item.kode.replace(/'/g, "\\'");

      return `
        <div class="product-card ${isHabis ? 'out-of-stock' : ''}">
          <div class="product-thumb-wrapper" onclick="bukaDetailProduk('${kodeSafe}')">
            <img src="${fotoUrl}" alt="${item.nama}" class="product-thumb" loading="lazy" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
          </div>
          <div class="product-content">
            <div class="card-badges-row">
              <span class="badge-pill-tag primary">${item.kategori}</span>
              <span class="badge-pill-tag outline">${item.jenis}</span>
            </div>
            <h3 class="product-title">${item.nama} (${item.kode})</h3>
            <div class="product-price">${formatRupiah(item.harga)}</div>
            <div class="card-actions-row">
              <button type="button" class="btn-card-detail" onclick="bukaDetailProduk('${kodeSafe}')">
                👁️ Detail
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-card-cart ${isHabis ? 'restock-mode' : ''}">
                🛒 ${teksTombolCart}
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Fungsi pembantu untuk memecah teks kolom foto menjadi beberapa link
  function dapatkanArrayFoto(teksFoto) {
    if (!teksFoto) return [CONFIG.PLACEHOLDER_IMAGE];
    // Memisahkan berdasarkan koma (,), pipa (|), atau baris baru (Enter)
    const list = String(teksFoto)
      .split(/[,|\n]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
    return list.length > 0 ? list : [CONFIG.PLACEHOLDER_IMAGE];
  }

  // Menyimpan daftar foto produk yang sedang dibuka di halaman detail
  let currentDetailPhotos = [];

  function bukaDetailProduk(kodeProduk) {
    playClickSound();
    const item = masterCatalogItems.find(i => i.kode.toUpperCase() === String(kodeProduk).toUpperCase());
    if (!item) return;

    const isHabis = item.stok <= 0 || item.status.toLowerCase() === "habis";
    currentDetailPhotos = dapatkanArrayFoto(item.foto);
    const fotoUtama = currentDetailPhotos[0];
    const totalFoto = currentDetailPhotos.length;

    const waLink = buatLinkWhatsAppKatalog(item, isHabis);
    const isIkan = item.kategori.toLowerCase().includes("ikan");

    document.getElementById("catalogGridWrapper").style.display = "none";
    document.querySelector(".catalog-controls").style.display = "none";

    const detailViewEl = document.getElementById("catalogDetailView");
    const contentEl = document.getElementById("catalogDetailContent");

    // Membuat deretan thumbnail bawah secara otomatis sesuai jumlah foto
    const thumbnailsHtml = currentDetailPhotos.map((url, idx) => `
      <div class="detail-thumb-item ${idx === 0 ? 'active' : ''}" onclick="gantiFotoDetail(${idx}, this)">
        <img src="${url}" alt="Thumb ${idx + 1}" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
      </div>
    `).join("");

    contentEl.innerHTML = `
      <div class="detail-layout-grid">
        <!-- Kolom Kiri: Foto Utama & Banyak Thumbnail -->
        <div class="detail-media-col">
          <div class="detail-main-img-box" onclick="bukaZoom(document.getElementById('detailMainImg').src)">
            <span class="detail-img-counter" id="detailImgCounter">1/${totalFoto}</span>
            <img id="detailMainImg" src="${fotoUtama}" alt="${item.nama}" onerror="this.onerror=null;this.src='${CONFIG.PLACEHOLDER_IMAGE}';">
          </div>
          <div class="detail-thumb-list">
            ${thumbnailsHtml}
          </div>
        </div>

        <!-- Kolom Kanan: Spesifikasi Lengkap -->
        <div class="detail-info-col">
          <div class="card-badges-row">
            <span class="badge-pill-tag primary">${item.kategori}</span>
            <span class="badge-pill-tag outline">${item.jenis}</span>
            <span class="badge-stock-pill ${isHabis ? 'out-stock' : 'in-stock'}">
              ● ${isHabis ? 'Out of Stock' : 'In Stock (' + item.stok + ')'}
            </span>
          </div>

          <h2 class="detail-title">${item.nama} (${item.kode})</h2>

          <div class="detail-price-wrap">
            <span class="detail-price">${formatRupiah(item.harga)}</span>
            <span class="detail-currency">IDR</span>
          </div>

          <div class="detail-stars">★★★★★</div>

          <div class="spec-table-box">
            <div class="spec-row">
              <span class="spec-label">Species</span>
              <span class="spec-value">${item.spesies || (isIkan ? 'Betta Splendens' : item.kategori)}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Tail Type</span>
              <span class="spec-value">${item.tailType || '-'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Strain</span>
              <span class="spec-value">${item.jenis || '-'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Sex</span>
              <span class="spec-value">${item.sex || '-'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Size</span>
              <span class="spec-value">${item.size || '-'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Origin</span>
              <span class="spec-value">${item.origin || 'Indonesia'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Shipping</span>
              <span class="spec-value">${item.shipping || 'Garansi Hidup Sampai Tujuan (DOA)'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Deskripsi</span>
              <span class="spec-value" style="font-weight: 500; color: #cbd5e1;">${item.deskripsi || '-'}</span>
            </div>
          </div>

          <p class="detail-note">
            ${isIkan ? 'Setiap ikan cupang memiliki corak unik — dijual per ekor sesuai foto.' : 'Produk perawatan resmi berkualitas tinggi dari Cupang Kasep.'}
          </p>

          <div class="detail-cta-row">
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-detail-addcart">
              🛒 ${isHabis ? 'Tanyakan Restock via WA' : 'Add to Cart (Order via WA)'}
            </a>
            <button type="button" class="btn-detail-back" onclick="tutupDetailProduk()">
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>
    `;

    detailViewEl.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Fungsi saat gambar kecil (thumbnail) di bawah foto utama diklik
  function gantiFotoDetail(index, thumbEl) {
    playClickSound();
    if (!currentDetailPhotos[index]) return;

    // Ganti gambar besar
    const mainImg = document.getElementById("detailMainImg");
    if (mainImg) mainImg.src = currentDetailPhotos[index];

    // Perbarui angka indikator (misal 1/2 menjadi 2/2)
    const counterEl = document.getElementById("detailImgCounter");
    if (counterEl) counterEl.innerText = `${index + 1}/${currentDetailPhotos.length}`;

    // Pindahkan bingkai aktif ke thumbnail yang baru diklik
    document.querySelectorAll(".detail-thumb-item").forEach(el => el.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
  }

  function tutupDetailProduk() {
    playClickSound();
    document.getElementById("catalogDetailView").style.display = "none";
    document.querySelector(".catalog-controls").style.display = "flex";
    document.getElementById("catalogGridWrapper").style.display = "block";
  }

  /* =========================================================
     3. DATABASE SERTIFIKAT & LOGIKA ROULETTE (EXISTING)
     ========================================================= */
  const databaseSertifikat = {
    "SECRET OWNER": {
      owner: "Nenda", strain: "SAWO MATANG", grade: "SSS", size: "Size S",
      form: "Kurus dan Agresif", date: "1 November 2026", breeder: "Cupang Kasep",
      hash: "BF-2026-WBM002-AUTHENTIC-VIP", img: "https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/nenda%20dan%20r.jpeg"
    },
    "ARC-CK-IAN-050826-ABI": {
      owner: "Ardian Abi", strain: "Yellow Koi Copper Marble", grade: "Premium Collector",
      size: "Regular - M (4.2 - 4.5 cm)", form: "HMPK - 180°+ Big Tail", date: "3 November 2026",
      breeder: "CUPANG KASEP", hash: "ARC-CK-IAN-050826-ABI", img: "https://6ae9d45287027fb6113bb9e4.imgix.net/sandbox/362a0cbf-ec85-44e3-8414-2b70d49e34e1.jpg"
    },
    "CK-GEPENK-051126-E1": {
      owner: "Gepenk", strain: "Yellow Base - Yellow Koi Marble", grade: "Collector", size: "Medium - M (4.0 - 4.5 cm Body Only)",
      form: "HMPK- 180° Tail Spread, Clean Fan, Strong Anal Fin", date: "5 November 2026", breeder: "CUPANG KASEP",
      hash: "CK-GEPENK-E1-AUTHENTIC-VIP", img: "https://images.unsplash.com/vector-1793871884993-70849f0036db?q=80&w=2112&auto=format&fit=crop"
    }
  };

  const KODE_RAHASIA_CEK_HADIAH = "ADMIN CEK 14";

  const daftarVoucherValid = [
    "CK-ADMIN-VIP",
    "CK-GACHA-01",
    "CK-GACHA-02",
    "CK-GACHA-03",
    "CK-VIP-2026",
    "KASEP-HOKI-01",
    "TEST1",
    "TEST2",
    "TEST3"
  ];

  const segmenRoulette = [
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#1e293b", text: "#94a3b8" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#581c87", text: "#f8fafc" },
    { label: "Ekstrak Ketapang", full: "1x Ekstrak Ketapang", code: "PR2", type: "prize", weight: 13.529412, color: "#065f46", text: "#f8fafc" },
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#1e293b", text: "#94a3b8" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#1e3a8a", text: "#f8fafc" },
    { label: "Diskon 100K", full: "Voucher Diskon 100K", code: "JP1", type: "jackpot", weight: 1.5, color: "#991b1b", text: "#fde047" },
    { label: "ZONK", full: "Zonk (Belum Beruntung)", code: "Z0", type: "zonk", weight: 13.333333, color: "#1e293b", text: "#94a3b8" },
    { label: "Ekstrak Ketapang", full: "1x Ekstrak Ketapang", code: "PR2", type: "prize", weight: 13.529412, color: "#065f46", text: "#f8fafc" },
    { label: "Stick Flaring", full: "1x Stick Flaring", code: "PR1", type: "prize", weight: 10.147059, color: "#581c87", text: "#f8fafc" },
    { label: "Ikan Bebas Pilih", full: "GRAND PRIZE: 1 Ikan Bebas Pilih!", code: "JP2", type: "jackpot", weight: 1.0, color: "#b45309", text: "#fffbeb" }
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
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error("Gagal terhubung ke database:", err);
      return null;
    }
  }

  function buatSignature(voucher, prizeCode) {
    const raw = voucher + "|" + prizeCode + "|CKVIP2026";
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) + hash) + raw.charCodeAt(i);
    }
    return Math.abs(hash % 900 + 100).toString(36).toUpperCase();
  }

  function buatTokenKlaim(voucher, prizeCode) {
    const sig = buatSignature(voucher, prizeCode);
    const payload = `${voucher}|${prizeCode}|${sig}`;
    return "CKV-" + btoa(payload).replace(/=/g, "");
  }

  function verifikasiTokenKlaim() {
    playClickSound();
    const tokenInput = document.getElementById("adminClaimTokenInput").value.trim();
    const box = document.getElementById("adminSecretResultBox");

    if (!tokenInput || !tokenInput.startsWith("CKV-")) {
      box.innerHTML = `<strong style="color:var(--danger-red)">❌ FORMAT KODE KLAIM SALAH</strong><br>Pastikan menyalin kode klaim berawalan <b>CKV-...</b> dari chat WhatsApp pelanggan.`;
      return;
    }

    try {
      const base64Part = tokenInput.slice(4);
      const decoded = atob(base64Part);
      const parts = decoded.split("|");
      if (parts.length !== 3) throw new Error("Invalid");

      const [voucher, prizeCode, sig] = parts;
      const expectedSig = buatSignature(voucher, prizeCode);

      if (sig === expectedSig && kamusKodeHadiah[prizeCode]) {
        box.innerHTML = `
          <strong style="color:var(--verified-green)">✔ KODE KLAIM ASLI & VALID!</strong><br>
          <div style="margin-top:6px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.1);">
            🎟️ <b>Kode Voucher:</b> <span style="color:var(--gold-light)">${voucher}</span><br>
            🏆 <b>Hadiah Sah:</b> <span style="color:#4ade80; font-weight:700;">${kamusKodeHadiah[prizeCode]}</span>
          </div>
        `;
      } else {
        box.innerHTML = `<strong style="color:var(--danger-red)">❌ KODE KLAIM PALSU / DIMODIFIKASI!</strong><br>Tanda tangan digital tidak cocok dengan database hadiah Cupang Kasep.`;
      }
    } catch (e) {
      box.innerHTML = `<strong style="color:var(--danger-red)">❌ KODE KLAIM TIDAK VALID / RUSAK!</strong>`;
    }
  }

  async function cekRiwayatVoucherLokal() {
    playClickSound();
    const kode = document.getElementById("adminVoucherCheckInput").value.trim().toUpperCase();
    const box = document.getElementById("adminSecretResultBox");

    if (!kode) {
      alert("⚠️ Masukkan kode voucher yang ingin dicek!");
      return;
    }

    if (apakahUrlSheetAktif()) {
      box.innerHTML = `<span style="color:var(--gold-light)">⏳ Mengecek data voucher [${kode}]</span>`;
      const resServer = await kirimKeGoogleSheets({
        action: "check",
        kode: kode,
        tanggal: dapatkanTanggalSekarang()
      });

      if (resServer && (resServer.status === "ok" || resServer.status === "used")) {
        const listHtml = (resServer.history || []).map((h, i) => `<li>Putaran #${i + 1}: <b>${h.full}</b></li>`).join("");
        const infoTanggal = resServer.usedDate ? ` | Tanggal Pakai: <b>${resServer.usedDate}</b>` : "";
        box.innerHTML = `
          <strong style="color:var(--verified-green)">✔ DATA BERHASIL DITEMUKAN</strong><br>
          Kode: <b style="color:var(--gold-light)">${kode}</b> | Sisa Spin: <b>${resServer.remaining}/3</b>${infoTanggal}
          <ul style="padding-left:16px; margin-top:6px;">${listHtml || "<li>Belum ada putaran</li>"}</ul>
        `;
        return;
      }
    }

    const store = getVoucherStore();
    const data = store[kode];

    if (!data || !data.history || data.history.length === 0) {
      box.innerHTML = `<strong style="color:var(--danger-red)">ℹ️ BELUM ADA RIWAYAT DI PERANGKAT INI</strong><br>Voucher <b>[${kode}]</b> belum pernah dimainkan.`;
      return;
    }

    const listHtml = data.history.map((h, i) => `<li>Putaran #${i + 1}: <b>${h.full}</b></li>`).join("");
    const infoTanggal = data.usedDate ? ` | Tanggal Pakai: <b>${data.usedDate}</b>` : "";
    box.innerHTML = `
      <strong style="color:var(--verified-green)">✔ RIWAYAT VOUCHER DITEMUKAN</strong><br>
      Kode: <b style="color:var(--gold-light)">${kode}</b> | Sisa Spin: <b>${data.remaining}/3</b>${infoTanggal}
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
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
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
    tampilkanIsiKatalog();
  }

  function verifikasiPasswordKatalog() {
    playClickSound();
    const inputPass = document.getElementById("catalogPassInput").value.trim();
    if (inputPass === CONFIG.CATALOG_PASSWORD) {
      isCatalogUnlocked = true;
      document.getElementById("catalogPasswordModal").classList.remove("open");
      tampilkanToast("🔓 Selamat Datang Admin!");
      tampilkanIsiKatalog();
    } else {
      alert("❌ Password salah! Silakan hubungi Admin Cupang Kasep untuk mendapatkan akses.");
    }
  }

  function tutupModalPasswordKatalog() {
    playClickSound();
    document.getElementById("catalogPasswordModal").classList.remove("open");
  }

  function aktifkanHalaman(idHalaman, hashUrl = "") {
    ["landingPage", "catalogPage", "verificationPage", "roulettePage"].forEach(id => {
      document.getElementById(id).style.display = (id === idHalaman) ? "block" : "none";
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (hashUrl && window.location.hash !== hashUrl) {
      history.pushState({ page: idHalaman }, "", hashUrl);
    }
  }

  function tampilkanIsiKatalog() {
    aktifkanHalaman("catalogPage", "#katalog");
    if (!catalogLoadedOnce) muatDataKatalog(false);
  }

  function bukaHalamanVerifikasi() {
    playClickSound();
    aktifkanHalaman("verificationPage", "#verifikasi");
    setTimeout(() => { document.getElementById("certInput").focus(); }, 200);
  }

  function bukaHalamanUndian() {
    playClickSound();
    aktifkanHalaman("roulettePage", "#undian");
    gambarRodaRoulette();
    perbaruiTampilanVoucher();
  }

  function kembaliKeLanding() {
    if (isWheelSpinning) return;
    playClickSound();
    aktifkanHalaman("landingPage", "#home");
  }

  // Mendukung tombol Back bawaan HP / Browser
  window.addEventListener("popstate", function() {
    if (isWheelSpinning) return;
    const hash = window.location.hash;
    if (hash === "#katalog" && isCatalogUnlocked) aktifkanHalaman("catalogPage");
    else if (hash === "#verifikasi") aktifkanHalaman("verificationPage");
    else if (hash === "#undian") { aktifkanHalaman("roulettePage"); gambarRodaRoulette(); perbaruiTampilanVoucher(); }
    else aktifkanHalaman("landingPage");
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

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#d4af37";
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
      alert("⚠️ Silakan masukkan kode voucher terlebih dahulu!");
      return;
    }

    if (kode === KODE_RAHASIA_CEK_HADIAH) {
      inputEl.value = "";
      bukaMenuRahasiaAdmin();
      return;
    }

    if (kode === "CK-ADMIN-VIP") {
      activeVoucherCode = kode;
      tampilkanToast("👑 Voucher ADMIN Aktif (Unlimited Spin!)");
      perbaruiTampilanVoucher();
      return;
    }

    const store = getVoucherStore();

    if (apakahUrlSheetAktif()) {
      btnPakai.disabled = true;
      btnPakai.innerText = "⏳ Cek...";

      const resServer = await kirimKeGoogleSheets({
        action: "check",
        kode: kode,
        tanggal: dapatkanTanggalSekarang()
      });

      btnPakai.disabled = false;
      btnPakai.innerText = "Pakai";

      if (resServer) {
        if (resServer.status === "invalid") {
          alert("❌ Kode Voucher [" + kode + "] tidak valid atau tidak terdaftar di database.");
          return;
        }

        store[kode] = {
          remaining: Number(resServer.remaining),
          used: resServer.status === "used" || Number(resServer.remaining) <= 0,
          usedDate: resServer.usedDate || dapatkanTanggalSekarang(),
          history: resServer.history || []
        };
        saveVoucherStore(store);

        activeVoucherCode = kode;
        perbaruiTampilanVoucher();

        if (store[kode].used || store[kode].remaining <= 0) {
          alert("voucher sudah digunakan pada tanggal " + store[kode].usedDate);
          return;
        }

        tampilkanToast("🎟️ Voucher " + kode + " aktif! (" + store[kode].remaining + "x Spin)");
        return;
      }
    }

    if (!daftarVoucherValid.includes(kode)) {
      alert("❌ Kode Voucher [" + kode + "] tidak valid atau tidak terdaftar.");
      return;
    }

    if (typeof store[kode] !== "object" || store[kode] === null) {
      store[kode] = {
        remaining: 3,
        used: false,
        usedDate: dapatkanTanggalSekarang(),
        history: []
      };
      saveVoucherStore(store);
    }

    if (Number(store[kode].remaining) <= 0 || store[kode].used === true) {
      store[kode].remaining = 0;
      store[kode].used = true;
      if (!store[kode].usedDate) {
        store[kode].usedDate = dapatkanTanggalSekarang();
      }
      saveVoucherStore(store);

      activeVoucherCode = kode;
      perbaruiTampilanVoucher();
      alert("voucher sudah digunakan pada tanggal " + store[kode].usedDate);
      return;
    }

    activeVoucherCode = kode;
    tampilkanToast("🎟️ Voucher " + kode + " aktif! (" + store[kode].remaining + "x Spin)");
    perbaruiTampilanVoucher();
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

    if (activeVoucherCode === "CK-ADMIN-VIP") {
      statusText.innerHTML = "Voucher: <strong style='color:#fde047'>CK-ADMIN-VIP (Admin Mode)</strong>";
      chancePill.innerText = "Kesempatan: UNLIMITED 👑";
      spinCountInfo.innerText = "Mode Testing Admin";
      spinBtn.disabled = false;
      spinBtn.innerText = "🎯 PUTAR SEKARANG (TESTING ADMIN)";
      
      let store = getVoucherStore();
      let adminData = store["CK-ADMIN-VIP"] || { history: [] };
      
      if (adminData.history.length === 0) {
        historyList.innerHTML = `<div style="font-size:11.5px; color:var(--text-muted); text-align:center; padding:8px 0;">Belum ada putaran admin.</div>`;
        claimWaBtn.style.display = "none";
      } else {
        historyList.innerHTML = adminData.history.map((item, idx) => `
          <div class="history-item ${item.type === 'zonk' ? 'zonk' : ''}">
            <span>Uji #${idx + 1}</span>
            <strong>${item.full}</strong>
          </div>
        `).join("");
        claimWaBtn.style.display = "none";
      }
      return;
    }

    const store = getVoucherStore();
    const dataVoucher = store[activeVoucherCode] || { remaining: 0, history: [] };
    const usedCount = 3 - dataVoucher.remaining;

    statusText.innerHTML = "Voucher: <strong style='color:var(--gold-light)'>" + activeVoucherCode + "</strong>";
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
          <strong>${item.full}</strong>
        </div>
      `).join("");

      const itemMenang = dataVoucher.history.find(h => h.type !== "zonk");
      if (itemMenang) {
        const tokenResmi = buatTokenKlaim(activeVoucherCode, itemMenang.code || "PR1");
        const pesanWA = encodeURIComponent(
          "Halo Admin Cupang Kasep, saya ingin klaim hadiah Undian Roulette.\n\n" +
          "🎟️ Kode Voucher: " + activeVoucherCode + "\n" +
          "🎁 Hadiah: " + itemMenang.full + "\n" +
          "🔐 Kode Verifikasi Klaim: " + tokenResmi
        );
        claimWaBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=` + pesanWA;
        claimWaBtn.style.display = "flex";
      } else {
        claimWaBtn.style.display = "none";
      }
    }
  }

  function sudahPernahMenang(isAdmin) {
    const store = getVoucherStore();
    if (isAdmin) {
      const history = (store["CK-ADMIN-VIP"] && store["CK-ADMIN-VIP"].history) ? store["CK-ADMIN-VIP"].history : [];
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

    if (activeVoucherCode === "CK-ADMIN-VIP") {
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

    setTimeout(async () => {
      stopWheelTickSound();
      const hasil = segmenRoulette[winningIndex];
      
      if (hasil.type === "zonk") {
        playZonkSound();
      } else {
        playPrizeSound(hasil.type === "jackpot");
      }

      let sisaSpinDisplay = 0;
      if (isAdmin) {
        let store = getVoucherStore();
        if (!store["CK-ADMIN-VIP"]) store["CK-ADMIN-VIP"] = { history: [] };
        store["CK-ADMIN-VIP"].history.push(hasil);
        saveVoucherStore(store);
        sisaSpinDisplay = "Unlimited (Admin)";
      } else {
        const store = getVoucherStore();
        const dataVoucher = store[activeVoucherCode];
        dataVoucher.remaining -= 1;
        dataVoucher.history.push(hasil);

        if (!dataVoucher.usedDate) {
          dataVoucher.usedDate = dapatkanTanggalSekarang();
        }

        if (dataVoucher.remaining <= 0) {
          dataVoucher.remaining = 0;
          dataVoucher.used = true;
          dataVoucher.usedDate = dapatkanTanggalSekarang();
        }

        store[activeVoucherCode] = dataVoucher;
        saveVoucherStore(store);
        sisaSpinDisplay = dataVoucher.remaining + "x lagi";

        if (apakahUrlSheetAktif()) {
          const itemMenang = dataVoucher.history.find(h => h.type !== "zonk");
          const tokenResmi = itemMenang ? buatTokenKlaim(activeVoucherCode, itemMenang.code || "PR1") : "-";
          kirimKeGoogleSheets({
            action: "spin",
            kode: activeVoucherCode,
            tanggal: dataVoucher.usedDate,
            hasil: hasil,
            tokenKlaim: tokenResmi
          });
        }
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
      icon.innerText = "😅";
      title.innerText = "Belum Beruntung!";
      prize.innerText = hasil.full;
    } else if (hasil.type === "jackpot") {
      icon.innerText = "🏆";
      title.innerText = "JACKPOT SPESIAL!";
      prize.innerText = hasil.full;
    } else {
      icon.innerText = "🎁";
      title.innerText = "Selamat! Anda Dapat:";
      prize.innerText = hasil.full;
    }

    sub.innerText = "Sisa kesempatan: " + sisaSpin;
    modal.classList.add("open");
  }

  function tutupModalHasil() {
    playClickSound();
    document.getElementById("resultModal").classList.remove("open");

    if (activeVoucherCode && activeVoucherCode !== "CK-ADMIN-VIP") {
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

  function cariSertifikat() {
    playClickSound();
    const inputEl = document.getElementById("certInput");
    const input = inputEl.value.trim().toUpperCase();
    const data = databaseSertifikat[input];

    const initialState = document.getElementById("initialState");
    const errorState = document.getElementById("errorState");
    const certBody = document.getElementById("certBody");

    if (!input) {
      initialState.style.display = "block";
      errorState.style.display = "none";
      certBody.classList.remove("show");
      return;
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
      document.getElementById("fishImg").src = data.img;

      certBody.classList.remove("show");
      void certBody.offsetWidth;
      certBody.classList.add("show");
    } else {
      initialState.style.display = "none";
      certBody.classList.remove("show");
      const pesanError = "Nomor sertifikat [" + input + "] tidak terdaftar di dalam database resmi.";
      document.getElementById("errorText").innerText = pesanError;
      errorState.style.display = "block";
      alert("⚠️ Nomor Salah!\n\n" + pesanError);
    }
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

  // TARUH DI SINI (Di luar kurung kurawal salinKode, tepat sebelum </script>)
  window.addEventListener("DOMContentLoaded", function() {
    try {
      const savedLang = localStorage.getItem("ck_selected_lang");
      if (savedLang && TRANSLATIONS[savedLang]) {
        USER_LANG = savedLang;
        IS_INDONESIA = (savedLang === "id");
        document.getElementById("languageGateModal").classList.add("hidden");
        terapkanPerlakuanBahasa();
      }
    } catch (e) {}
  });
</script>

</body>
</html>