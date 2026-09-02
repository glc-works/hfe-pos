const { chromium } = require('playwright');

(async () => {
  const port = process.env.PORT || '3000';
  console.log(`\n🚀 Membuka browser visual (Headed Mode) di port ${port}...`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 600,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  const mockStaff = {
    employeeId: 'EMP-001',
    staffName: 'Budi (Kasir Flagship)',
    role: 'cashier',
    branchId: 'BRANCH-HQ-01'
  };

  const ownerStaff = {
    employeeId: 'OWNER-001',
    staffName: 'Alexander (Owner)',
    role: 'owner',
    branchId: 'BRANCH-HQ-01'
  };

  try {
    // --- STEP 1: PILAR BOARD (Landing Page) ---
    console.log('\n📍 [1/5] Pilar BOARD (Landing Page Toko)...');
    await page.goto(`http://localhost:${port}/?app=board`);
    await page.waitForTimeout(3000);

    // --- STEP 2: PILAR ORDER (Menu Tamu Day Mode) ---
    console.log('\n📍 [2/5] Pilar ORDER (Menu Pelanggan QR Dine-In / Delivery)...');
    await page.goto(`http://localhost:${port}/?app=customer`);
    await page.waitForTimeout(2500);

    console.log('   👉 Menambahkan menu ke keranjang...');
    const addBtn = page.getByTitle(/Tambah/i).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const confirmAdd = page.getByRole('button', { name: /Masukkan ke Keranjang|Tambah ke Pesanan/i }).first();
      if (await confirmAdd.isVisible()) {
        await confirmAdd.click();
        await page.waitForTimeout(1000);
      }
    }

    console.log('   👉 Membuka Ringkasan & Express Checkout...');
    const cartDock = page.locator('.min-h-\\[64px\\]').first();
    if (await cartDock.isVisible()) {
      await cartDock.click();
      await page.waitForTimeout(4000);
    }

    // --- STEP 3: PILAR POS (Workstation Kasir) ---
    console.log('\n📍 [3/5] Pilar POS (Workstation Kasir & Denah Meja)...');
    await page.addInitScript((staff) => {
      localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
      localStorage.setItem('hfe_pos_auth_user', JSON.stringify(staff));
      localStorage.setItem('hfe_theme_mode', 'light');
    }, mockStaff);
    await page.goto(`http://localhost:${port}/?app=cafe&surface=barista-pos`);
    await page.waitForTimeout(3000);

    console.log('   👉 Mengganti Tema (Day Mode ➔ Dark Mode ➔ Day Mode)...');
    const themeBtn = page.getByRole('button', { name: /Malam|Siang/i }).first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(2000);
      await themeBtn.click();
      await page.waitForTimeout(2000);
    }

    // --- STEP 4: PILAR KDS (Dapur & Barista) ---
    console.log('\n📍 [4/5] Pilar KDS (Kitchen Display System)...');
    await page.goto(`http://localhost:${port}/?app=cafe&surface=kds-screen`);
    await page.waitForTimeout(3500);

    // --- STEP 5: PILAR HUB (Executive Insights & Admin) ---
    console.log('\n📍 [5/5] Pilar HUB (Executive Insights & Admin Platform)...');
    await page.addInitScript((owner) => {
      localStorage.setItem('hfe_pos_auth_token', 'demo-token-12345');
      localStorage.setItem('hfe_pos_auth_user', JSON.stringify(owner));
      localStorage.setItem('hfe_theme_mode', 'light');
    }, ownerStaff);
    await page.goto(`http://localhost:${port}/?app=cafe&surface=admin-hub`);
    await page.waitForTimeout(5000);

    console.log('\n✨ Seluruh pilar berhasil diperagakan di browser visual!');
  } catch (err) {
    console.error('Walkthrough info:', err.message);
  } finally {
    await browser.close();
  }
})();
