/* ================================
   JAVASCRIPT LANJUTAN — SILA
   DOM, Event Handling, CRUD, localStorage
   ================================ */

// ════════════════════════════════
// DATA LAYER (localStorage)
// localStorage adalah penyimpanan data di browser
// Data tidak hilang meskipun: halaman di-refresh, browser ditutup
// yang bertahan meskipun halaman ditutup/refresh.
// Data disimpan sebagai string JSON.
// Alur: Array → JSON → localStorage
// ════════════════════════════════


// 1. Membaca data dari localstorage dan memkonversi dari JSON ke Array
function getData() {
   const raw = localStorage.getItem('sila_data')
   // jika datanya ada. parse JSON --> Array; Jika data tidak ada kembalikan Array kosong
   return raw ? JSON.parse(raw) : [];
   // kalau ada data di localStorage, maka Jalankan JSON.parse
}

// 2. Menyimpan data ke localStorage (Array --> JSON)
function saveData(data) {
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// 3. Format Tanggal (dd-MM-yyy --> 04 Juni 2026)
function formatTanggal(dateStr) {  
   const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 
      'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 
      'November', 'Desember'
   ];

   const d = new Date(dateStr); // Contoh Format : '04 Juni 2026'
   return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' +d.getFullYear();
}

// 4. FORM HANDLING
// Menangani form pengajuan: Mode Tambah (create) dan mode edit (update) berdasarkan parameter URL
// Tugas Form: Mengumpulkan semua input --> validasi --> create data baru --> update data --> Simpan ke localStorage

function initForm() {
   const form = document.getElementById('formPengajuan');
   if (!form) return; // Jika halaman tidak punya form, keluar

   //Deteksi mode edit atau tidak?
   // Jika parameter URL edit ditemukan. maka tata letak lama ditampilkan, jika tidak maka adalah mode tambah(create)

   const urlParams = new URLSearchParams(window.location.search);
   const editId = urlParams.get('edit');
   let editMode = false;

   if (editId) {
      // cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemToEdit = data.find (function(item){ return item.id == editId; });
      if (itemToEdit) {
         editMode = true; // mode edit aktif
         // Isi field form dengan data yang ada (pre-fill)

         document.getElementById('nama').value = itemToEdit.nama || '';
         document.getElementById('nim').value = itemToEdit.nim || '';
         const  prodiEl = document.getElementById('prodi');
         if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi || ''
         const layananEl = document.getElementById('layanan');
         if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan || ''
         document.getElementById('tanggal').value = itemToEdit.tanggal || ''
         document.getElementById('keterangan').value = itemToEdit.keterangan || ''

         // Ubah teks tombol --> "Simpan Perubahan"
         const btnSumbit = form.querySelector('button[type="submit"]');
         if (btnSumbit) btnSumbit.innerHTML = '✏️ Simpan Perubahan'
      }
   }

   // Submit (create)
   // Menggunakan event listener untuk submit form (eventnya 'submit')
   // Sebelum submit, form akan melakukan validasi
   // Saat Tombol Ajukan di klik: 1. Ambil data dari form. 2. Validasi Data, 3. Simpan Data, 4. Redirect ke Halaman Riwayat

   // element.addEventListener('event', function())
   form.addEventListener('submit', function(e){
      e.preventDefault(); // cegah form reload halaman
      // 1. Ambil nilai semua field dengan menggunakan .value
      const nama = document.getElementById('nama').value.trim();
      const nim = document.getElementById('nim').value.trim();
      const prodi = document.getElementById('prodi').value;
      const layanan = document.getElementById('layanan').value;
      const tanggal = document.getElementById('tanggal').value;
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError');
      // trim = menghilangkan karakter-karakter

      errorEl.textContent = ''; // reset pesan error sebelum validasi

      // Validasi Form (semua data wajib diisi)
      if(!nama || !nim || !prodi || !layanan || !tanggal) {
         errorEl.textContent = '❌ Semua field harus diisi'
         return; // hentikan eksekusi jika tidak valid
      }

      //  NIM harus 8 karakter
      if (nim.length !== 8 || isNaN(nim)) {
         errorEl.textContent = '❌ NIM harus terdiri dari 8 digit angka!';
         return;
      }

      // --CRUD-- (Create dan Update)
      const data = getData();
      if (editMode) { // jika mode edit
         // Update / Timpa isian lama dengan isian form barusan
         for (let i=0; i < data.length; i++) {
            //  Jika id sama dengan edit Id maka mode edit (timpa data)
            if (data[i].id == editId) {
               data[i].nama = nama;
               data[i].nim = nim;
               data[i].prodi = prodi;
               data[i].layanan = layanan;
               data[i].tanggal = tanggal;
               data[i].keterangan = keterangan;
               break;
            }
         }
      } else { // Create: buat data objek  baru
         const item = {
            id: Date.now(), // timestap dalam milidetik sebagai ID
            nama: nama,
            nim: nim,
            prodi: prodi,
            layanan: layanan,
            tanggal: tanggal,
            keterangan: keterangan
         };
         data.push(item); // tambah data ke array
      }

      saveData(data); // Simpan ke localstorage

      form.reset();
      errorEl.textContent = ''; // kosongkan pesan error
      alert(editMode ? '✅ Perubahan berhasil disimpan!' : '✅ Pengajuan berhasil disimpan!')
      window.location.href = 'riwayat.html' // pindah halaman ke riwayat
   });
}

// ===================================================
// TABEL RIWAYAT
// Menampilkan semua data pengajuan dalam tabel HTML,
// Serta menangani tombol Edit dan Hapus per baris.
// ===================================================

function initRiwayat() {
   // Ambil elemen-elemen DOM yang dibutuhkan
   const tbody = document.getElementById('tableBody');
   const emptyState = document.getElementById('emptyState');
   const dataCount = document.getElementById('dataCount');
   const btnHapusSemua = document.getElementById('btnHapusSemua');

   if (!tbody) return; // jika bukan halaman riwayat, keluar

   renderTable(); // tampilkan tabel saat halaman pertama dimuat

   // -- Event Listener: Tombol Hapus Semua --
   if (btnHapusSemua) {
      btnHapusSemua.addEventListener('click', function () {
         // confirm() menampilkan dialog konfirmasi, mengembalikan true/false
         if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
            saveData([]); // simpan array kosong -> hapus semua
            renderTable();
         }
      });
   }

   // -- Fungsi Render Tabel --
   // Membuat baris-baris tabel secara dinamis dari data localStorage.
   // Data Array | Baris HTML | Tabel
   function renderTable() {
      const data = getData();

      // Update teks counter jumlah data
      if (dataCount) {
         dataCount.textContent = data.length + ' pengajuan';
      }

      // Jika data kosong: tampilkan empty state, sembunyikan tombol
      if (data.length === 0) {
         tbody.innerHTML = '';
         if (emptyState) emptyState.style.display = 'block';
         if (btnHapusSemua) btnHapusSemua.style.display = 'none';
         return;
      }

      // Sembunyikan empty state, tampilkan tombol hapus semua
      if (emptyState) emptyState.style.display = 'none';
      if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block';

      // Buat baris tabel (tr) untuk setiap item data
      tbody.innerHTML = ''; // bersihkan isi tbody terlebih dulu
      for (let i = 0; i < data.length; i++) {
         const item = data[i];
         const tr = document.createElement('tr'); // buat elemen <tr> baru

         // innerHTML: isi baris dengan data dari objek item
         tr.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + item.nama + '</td>' +
            '<td>' + item.nim + '</td>' +
            '<td>' + item.layanan + '</td>' +
            '<td>' + formatTanggal(item.tanggal) + '</td>' +
            '<td>' +
            // Tombol edit: data-id digunakan untuk mengetahui item mana yang diedit
            '<button class="btn-edit" data-id="' + item.id + '">✏️ Edit</button>' +
            '<button class="btn-hapus" data-id="' + item.id + '">🗑️ Hapus</button>' +
            '</td>';
         tbody.appendChild(tr); // tambahkan baris ke table
      }

      // -- Event Listener: Tombol Edit --
      // querySelectorAll mengembalikan semua elemen dengan kelas .btn-edit
      const btnEdit = document.querySelectorAll('.btn-edit');
      // Mengirim ID data ke halaman form.
      btnEdit.forEach(function (btn) {
         btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id'); // ambil ID dari atribut
            // Redirect ke form dengan parameter edit di URL
            window.location.href = 'layanan.html?edit=' + id;
         });
      });

      // -- Event Listener: Tombol Hapus --
      const btnHapus = document.querySelectorAll('.btn-hapus');
      // Menghapus data berdasarkan ID.
      btnHapus.forEach(function (btn) {
         btn.addEventListener('click', function() {
            const id = Number(this.getAttribute('data-id'));
            if (confirm('Hapus pengajuan ini?')) {
               let data = getData();
               // filter(): buat array baru tanpa item yang dihapus
               data = data.filter(function (item) {
                  return item.id !== id; // pertahankan semua kecuali yang dihapus               
               });
               saveData(data);
               renderTable(); // render ulang tabel setelah penghapusan
            }
         });
      });
   }
}


// ======================================================
// INIT (INSISIALISASI)
// DOMContentLoaded: event yang terjadi ketika
// Seluruh HTML selesai dimuat oleh browser.
// Pastikan JavaScript dijalankan SETELAH HTML tersedia.
// =======================================================

// Menjalankan: 1. initForm() 2. initRiwayat() Setelah HTML selesai dimual.
document.addEventListener('DOMContentLoaded', function (){
   initForm(); // inisialisasi form di halaman layanan.html
   initRiwayat(); // inisialisasi form di halaman riwayat.html
});