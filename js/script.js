// M12 JS Dasar
// Variabel, Fungsi, Validasi Sederhana

// membuat variabel const (konstanta) untuk layanan (array menyimpsn dafatar kode layanan)

const LAYANAN = ['SKA', 'CAK', 'PDA', 'TNM']

// membuat Fungsi Format Tanggal
// dd-MM-yyyy (dari = 04-06-2026) menjadi --> 04-Juni-2026
// Kita gunakan objek bawaan dari JS

function formatTanggal(dateStr) {
    // Formating
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sept', 'Okt', 'Nov', 'Des']
    const d = new Date(dateStr); //deklarasi new date obj
    //Format (Tanggal Bulan Tahun)
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear()
} 

// Fungsi Validasi Form
function validasiForm() {
    // 1. Get Value setiap inputan (inputan yang wajib diisi)
    const namaLengkap = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const prodi = document.getElementById('prodi').value;
    const layanan = document.getElementById('layanan').value;
    const tanggal = document.getElementById('tanggal').value;
    
    // alert(namaLengkap) // munculkan hasil dengan popup
    // console.log(namaLengkap) // munculkan hasil dari console

    // 2. Validasi --> Cek field yang kosong
    // Jika namalengkap kosong atau nim kosong atau ...dst
    if(namaLengkap === '' || nim === '' || prodi === '' || layanan === '' || tanggal === '') {
        // berikan pesan error
        alert('❌ Semua field wajib diisi!');
        
        // mencegah submit halaman
        return false;
    }

    // 3. Batasi jumlah karakter NIM (harus 8 karakter)
    // jika nim tidak 8 karakter atau kosong (tidak diisi)
    // isNaN
    if(nim.length !== 8 || isNaN(nim)) {
        alert('❌ NIM harus terdiri dari 8 digit!')
        return false;
    }

    // 4. Tampilkan hasil jika berhasil validasi
    
    // a. Di console
    console.log("Data Pengajuan berhasil: ", {
        namaLengkap: namaLengkap,
        nim: nim,
        prodi: prodi,
        layanan: layanan,
        tanggal: formatTanggal(tanggal)
    });


    // b. Di alert
    alert('✅ Data Pengajuan berhasil:\n\n' +
        'Nama Lengkap: ' + namaLengkap + '\n' +
        'NIM: ' + nim + '\n' +
        'Prodi: ' + prodi + '\n' +
        'Layanan: ' + layanan + '\n' +
        'Tanggal: ' + formatTanggal(tanggal)
    );

    return false;

}