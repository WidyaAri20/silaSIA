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
function saveData() {
   localStorage.setItem('sila_data', JSON.stringify(data));
}

// 3. Format Tanggal (dd-MM-yyy --> 04 Juni 2026)
function formatTanggal(dataStr) {  
   const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 
      'Juni', 'July', 'Agustus', 'September', 'Oktober', 
      'November', 'Desember'
   ];

   const d = new Date(dataStr); // Contoh Format : '04 Juni 2026'
   return d.getDate() + '' + bulan[d.getMonth()] + '' +d.getFullYear();
}

// 4. FORM HANDLING
// Menangani form pengajuan: Mode Tambah (create) dan mode edit (update) berdasarkan parameter URL
// Tugas Form: Mengumpulkan semua input --> validasi --> create data baru --> update data --> Simpan ke localStorage

function initForm() {
   const form = document.getElementById('formPangajuan');
   if (!form) return; // Jika halaman tidak punya form, keluar

   //Deteksi mode edit atau tidak?
   // Jika parameter URL edit ditemukan. maka tata letak lama ditampilkan, jika tidak maka adalah mode tambah(creae)

   const editId = urlParms.get('edit');
   let editMode = false;

   if (editID) {
      // cari item yang akan diedit berdasarkan ID
      const data = getData();
      const itemToEdit = data.find (function(item){
         return item.id == editId;
      });

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

   // element.addElementListener('event', function())
   form.addElementListener('submit', function(e){
      e.preventDefault(); // cegah form reload halaman
      // 1. Ambil nilai semua field dengan menggunakan .value
      const nama = document.getElementById('nama').value.trim();
      const nim = document.getElementById('nim').value.trim();
      const prodi = document.getElementById('prodi').value;
      const layanan = document.getElementById('layanan').value;
      const tanggal = document.getElementById('tanggal').value;
      const keterangan = document.getElementById('keterangan').value.trim();
      const errorEl = document.getElementById('formError').value.trim();
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
         for (let i=0; i< data.length; i++) {
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
         console.log(data); // tmapilkan di console log
      }
      saveData(data); // Simpan ke localstorage
      form.reset();
      errorEl.textContent = ''; // kosongkan pesan error
      alert(editId ? '✅ Perubahan berhasil disimpan!' : '✅ Pengajuan berhasil disimpan!')
      window.location.href = 'riwayat.html' // pindah halaman ke riwayat
   });
}

// INIT (INSISIALISASI)
document.addEventListener('DOMContentLoaded', function (){
   initForm();
})