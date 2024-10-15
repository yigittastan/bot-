const fs = require('fs');
const path = require('path');

// JSON dosyalarının bulunduğu klasörün yolu
const klasorYolu = 'karsiyaka-data'; // Klasör adını buraya yaz

// Klasördeki dosyaları oku
fs.readdir(klasorYolu, (err, dosyalar) => {
    if (err) {
        console.error('Klasör okunurken hata oluştu:', err);
        return;
    }

    dosyalar.forEach(dosya => {
        if (path.extname(dosya) === '.json') {
            const dosyaYolu = path.join(klasorYolu, dosya);

            fs.readFile(dosyaYolu, 'utf8', (err, veri) => {
                if (err) {
                    console.error(`${dosya} dosyası okunurken hata oluştu:`, err);
                    return;
                }

                let jsonVerisi;
                try {
                    jsonVerisi = JSON.parse(veri);
                } catch (parseHatasi) {
                    console.error(`${dosya} JSON parse hatası:`, parseHatasi);
                    return;
                }

                // "google" alanı varsa hiçbir şey yapma
                if (!jsonVerisi.hasOwnProperty('google')) {
                    // Yeni bir nesne oluştur
                    const yeniJson = {};
                    
                    // Mevcut alanları ekle
                    const anahtarlar = Object.keys(jsonVerisi);
                    if (anahtarlar.length > 0) {
                        yeniJson[anahtarlar[0]] = jsonVerisi[anahtarlar[0]]; // İlk alan
                    }

                    // "google" alanını ikinci sırada ekle
                    yeniJson.google = "";

                    // Kalan alanları ekle
                    for (let i = 1; i < anahtarlar.length; i++) {
                        yeniJson[anahtarlar[i]] = jsonVerisi[anahtarlar[i]];
                    }

                    // Güncellenmiş JSON verisini yaz
                    fs.writeFile(dosyaYolu, JSON.stringify(yeniJson, null, 2), (hata) => {
                        if (hata) {
                            console.error(`${dosya} dosyası yazarken hata oluştu:`, hata);
                        } else {
                            console.log(`${dosya} dosyası başarıyla güncellendi!`);
                        }
                    });
                } else {
                    console.log(`${dosya} dosyasında "google" alanı zaten mevcut, güncelleme yapılmadı.`);
                }
            });
        }
    });
});
