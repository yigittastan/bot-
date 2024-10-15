 let searchAddress = "İzmir Karşıyaka"; 
  bu codu buluyoruz ve aramak istediğimiz işletmenin nerede olduğuınu yazıyoruz örneğin benim izmir karşıyaka yazdığım bigi izmir konak veya ankara çamkaya yazılabilir


async function clickButtonAfterDelay(page, className) {
    try {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        const button = await page.waitForSelector(`button.${className}`, { timeout: 60000 });
        await button.click();

        console.log("Butona tıklandı.");
    } catch (error) {
        console.error(`Hata: ${error.message}`);
    }
}
bu koda bak


const className = 'main-info__title'; buna bak



        if (duration < 2000) {
            console.log("Bot davranışı tespit edildi!");
            await browser.close();
            return false;
        }
botun bilgilerini al ve buraya ekle eğer botuy görürsen kapatsın 



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
                console.log(`Url eklendi: ${data.url}`);
            } else {
            
                console.log(`Hata: ${filePath} dosyasında 'url' anahtarı bulunamadı.`);

            }
        }
    }
    console.log(`Toplam ${urls.length} URL bulundu.`);
    return urls;
}
buraya şunu ekle eğer url işletmeye gitmez ise izmnir online sayfasına gidince ne yapıcağını söyle onları farklı sayfaya lasın


 else if (key && key.ctrl && key.name === 'i') {
        console.log("Açılacak URL'yi göster...");
        }


        async function isBotDetected(page) {
    const botMessageSelector = 'selector-of-bot-detection-message';
    return await page.evaluate(selector => {
        const messageElement = document.querySelector(selector);
        return messageElement !== null &&
            messageElement.innerText.includes('Robot değilim algılandı');
    }, botMessageSelector);
}
buna bak





xpath ebak firtle ve sobnnuçlar bazen olmuyo ro yüzden hata çıkıyor if lukkanb vew çöz


try cacht kulan divleri sorgulama için bvöylecek opd bozulmıycak
