const { firefox } = require('playwright');
const fs = require('fs');
const path = require('path');
const keypress = require('keypress');

// function parseAddress(address) {
//     const filters = [
//         ["No", "Numara", "Nr.", "Numarası", "No."],
//         ["Bulvar", "Blv.", "Bul.", "Boulevard", "Blvr."],
//         ["Sokak", "Sk.", "Sok.", "Street"],
//         ["Mahalle", "Mah.", "Neighborhood"],
//         ["Cadde", "Cd.", "Cad.", "Avenue", "Av."]
//     ];

//     let parts = address.split(/\s+/);
//     console.log("Ayrıştırılan kelimeler:", parts);

//     // İstenmeyen kelimeleri filtrele
//     parts = parts.filter(part =>
//         !filters.some(filterGroup => filterGroup.includes(part))
//     );

//     console.log("Temizlenmiş adres parçaları:", parts);


// }


async function isBotDetected(page) {
    const botMessageSelector = '.bot-detection-message, .robot-detected-message, #bot-warning';

    return await page.evaluate(selector => {
        const messageElement = document.querySelector(selector);
        return messageElement && (messageElement.innerText.includes('Robot değilim algılandı') || messageElement.innerText.includes('Başka bir işlem yapın'));
    }, botMessageSelector);
}

function compareAddresses(addressText, dataText) {
    const addressParts = addressText.split(/\s+/).map(part => part.toLowerCase());
    const dataParts = dataText.split(/\s+/).map(part => part.toLowerCase());
    console.log(addressText + dataText);
    // Ortak kelimeleri bul
    const commonWords = addressParts.filter(word => dataParts.includes(word));

    console.log("Ortak kelimeler:", commonWords);

    if (commonWords.length >= 2) {
        console.log("İki veya daha fazla benzerlik bulundu!");
    } else {
        console.log("Yeterli benzerlik yok.");
    }
}
async function findAndProcess(page) {
    try {
        const bilgiButton = await page.waitForSelector('.main-info__title', { timeout: 60000 });
        await bilgiButton.click();
        console.log("Butona Tıklandı, Açılıyor...");

        await page.waitForTimeout(5000);

        const titleElement = await page.waitForSelector('span.bds-c-modal__header__title--truncate', { timeout: 60000 });
        const titleText = titleElement ? await titleElement.innerText() : null;
        console.log(`Restoran adı: ${titleText}`);
        
        const addressElement = await page.waitForSelector('.box-flex.fd-row.my-sm h1', { timeout: 60000 });
        const addressText = addressElement ? await addressElement.innerText() : null;
        console.log(`Adres: ${addressText}`);
        
        if (addressText) {
            // Çıkarılacak kelimeleri tanımla
            const filters = [
                ["No", "Numara", "Nr.", "Numarası", "No."],
                ["Bulvar", "Blv.", "Bul.", "Boulevard", "Blvr."],
                ["Sokak", "Sk.", "Sok.", "Street"],
                ["Mahalle", "Mah.", "Neighborhood"],
                ["Cadde", "Cd.", "Cad.", "Avenue", "Av."]
            ];
        
            // Tüm filtreleri tek bir diziye dönüştür ve küçük harfe çevir
            const unwantedWords = filters.flat().map(word => word.toLowerCase());
        
            // Adresi boşluklara göre parçala ve istenmeyen kelimeleri filtrele
            const addressParts = addressText.split(/\s+/)
                .map(part => part.trim().toLowerCase()) // Küçük harfe çevir
                .filter(part => part.length > 0 && !unwantedWords.includes(part)); // İstenmeyen kelimeleri filtrele
        
            console.log(`Parçalanmış Adres:`, addressParts);
        } else {
            console.log("Adres bulunamadı.");
        }
        
        
        

        if (await isBotDetected(page)) {
            console.log("Bot tespit edildi! Sayfa kapatılıyor...");
            process.exit();
        }

        // Burada addressText ve dataText'i karşılaştır
        const dataDiv = page.locator('div.Io6YTe.fontBodyMedium.kR99db.fdkmkc').nth(0); // İlk div'i al
        if (await dataDiv.count() > 0) {
            const dataText = await dataDiv.innerText(); // Direkt metni al
            console.log(`Data: ${dataText}`);

            // Benzerlik kontrolü
            compareAddresses(addressText, dataText);
        } else {
            console.log(`Data div bulunamadı: ${dataDiv}`);
        }

        return { titleText, addressText };
    } catch (error) {
        console.error(`Hata: ${error.message}`);
        return false;
    }
}

// ... Diğer kodlarınız ...

async function afterGoogleMapsOpen(page) {
    console.log("Google Maps açıldı, burada işlemler yapılacak.");
    await page.waitForTimeout(10000);
    
    let totalDivs = 0;

for (let i = 5; ; i += 2) {
    const xpath = `//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]/div[${i}]`;
    const newDiv = page.locator(`xpath=${xpath}`);
    
    if (await newDiv.count() > 0) {
        totalDivs++;
    } else {
        const dataDivs = page.locator('div.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
        if (await dataDivs.count() === 0) {
            // Eğer dataDivs bulunamazsa döngüyü durdur
            break;
        }
        // Eğer dataDivs bulunursa burada istediğin işlemleri yapabilirsin
    }
}


    console.log(`Toplam ${totalDivs} div bulundu.`);

    const filters = [
        ["No", "Numara", "Nr.", "Numarası", "No."],
        ["Bulvar", "Blv.", "Bul.", "Boulevard", "Blvr."],
        ["Sokak", "Sk.", "Sok.", "Street"],
        ["Mahalle", "Mah.", "Neighborhood"],
        ["Cadde", "Cd.", "Cad.", "Avenue", "Av."]
    ];
    
    // Tüm filtreleri tek bir diziye dönüştür ve küçük harfe çevir
    const unwantedWords = filters.flat().map(word => word.toLowerCase());

    for (let i = 1; i <= totalDivs; i++) {
        const xpath = `//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]/div[${i * 2 - 1}]`;
        const newDiv = page.locator(`xpath=${xpath}`);
        if (await newDiv.count() > 0) {
            await newDiv.click();
            console.log(`Yeni div'e geçildi: ${xpath}`);

            const innerDiv = newDiv.locator('div[jsaction]').first();
            if (await innerDiv.count() > 0) {
                await innerDiv.click();
            } else {
                console.log(`Inner div bulunamadı: ${innerDiv}`);
            }

            await page.waitForTimeout(5000);

            // Data div kontrolü
            const dataDivs = page.locator('div.Io6YTe.fontBodyMedium.kR99db.fdkmkc');
            const divCount = await dataDivs.count();
            let foundMatch = false;

            for (let j = 0; j < divCount; j++) {
                const dataText = await dataDivs.nth(j).innerText();
                console.log(`Adres ${j + 1}: ${dataText}`);

                const isMatch = addressControl(dataText); // addressControl fonksiyonu çağrılıyor

                if (isMatch) {
                    console.log(`Uyumlu adres bulundu: ${dataText}`);

                    // Adresi parçala
                    const parts = dataText.split(/\s+/)
                        .map(part => part.trim().toLowerCase()) // Küçük harfe çevir
                        .filter(part => part.length > 0 && !unwantedWords.includes(part)); // İstenmeyen kelimeleri filtrele

                    console.log(`Parçalanmış Adres: ${parts.join(', ')}`);
                    
                    foundMatch = true;
                    break;
                } else {
                    console.log(`Uyumsuz adres: ${dataText}`);
                }
            }

            if (!foundMatch) {
                console.log(`Hiçbir uyumlu adres bulunamadı.`);
            }
        }
    }
    
    console.log("Google Maps işlemleri tamamlandı.");
}


async function addressControl(addressParts,dataText) {

}



async function onSearch(url) {
    const browser = await firefox.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log(`${url} adresine gidiliyor...`);
        const start = Date.now();

        await page.goto(url, { timeout: 7800000 });
        const duration = Date.now() - start;

        if (duration < 2000) {
            console.log("Bot davranışı tespit edildi!");
            return false;
        }

        console.log("Sayfa açıldı, işlemler başlıyor...");

        const titleText = await findAndProcess(page);
        if (titleText) {
            const headlineText = titleText.titleText || "Bilinmeyen Restoran";
            console.log(`Restoran İsmi: ${headlineText}`);

            let searchAddress = "İzmir Karşıyaka";
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${headlineText} ${searchAddress}`)}`;
            console.log(`Google Maps URL: ${googleMapsUrl}`);

            await page.goto(googleMapsUrl, { timeout: 7800000 });
            console.log("Google Maps sayfasına gidildi.");

            await afterGoogleMapsOpen(page);

            if (await isBotDetected(page)) {
                console.log("Bot tespit edildi! Program durduruluyor...");
                process.exit();
            }

            return true;
        } else {
            console.log("Restoran bulunamadı.");
            return false;
        }
    } catch (error) {
        console.error(`Hata: ${error.message}`);
        return false;
    } finally {
        console.log("Tarayıcıyı kapatmak için manuel olarak kapatın.");
    }
}

async function openUrls(urls) {
    for (const url of urls) {
        console.log(`URL'ler Açılıyor: ${url}`);
        const success = await onSearch(url);

        if (success) {
            console.log("URL başarıyla açıldı.");
            // İşlemler bittiğinde 5 dakika (300.000 ms) bekle
            await new Promise(resolve => setTimeout(resolve, 300000));
        } else {
            console.log("URL açılamadı, bir sonraki URL'ye geçiliyor.");
        }
    }
    console.log("Tüm URL'ler açıldı!");
}


async function readUrlsFromFolder(folderPath) {
    const urls = [];
    const files = fs.readdirSync(folderPath);

    for (const filename of files) {
        if (filename.endsWith('.json')) {
            console.log(`${filename} dosyası işleniyor...`);
            const filePath = path.join(folderPath, filename);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            if (data.url) {
                urls.push(data.url);
                console.log(`URL eklendi: ${data.url}`);
            } else {
                console.log(`Hata: ${filePath} dosyasında 'url' anahtarı bulunamadı.`);
            }
        }
    }
    console.log(`Toplam ${urls.length} URL bulundu.`);
    return urls;
}

keypress(process.stdin);

process.stdin.on('keypress', async (ch, key) => {
    if (key && key.name === 'insert') {
        console.log("Insert tuşuna basıldı, URL'ler açılacak...");
        const folderPath = './test';
        const urls = await readUrlsFromFolder(folderPath);
        await openUrls(urls);
    } else if (key && key.ctrl && key.name === 'i') {
        console.log("Açılacak URL'yi göster...");
    } else if (key && key.name === 'escape') {
        console.log("Programdan çıkılıyor...");
        process.exit();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume(); 
