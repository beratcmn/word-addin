# Kurulum

1. Projeyi İndirmek

   - Git CLI <br>
     git clone https://github.com/beratcmn/word-addin.git

   - Website <br>
     ![](/public/ss1.png)

2. Projeyi Açmak

   - Gerekli kütüphaneleri yüklemek için: <br>
     `npm install`

   - Projeyi Webde çalıştırmak için: <br>
     `npm run web:test1`

<br>

# Add-In Dosyaları

1. Panel
   - Panel HTML ve CSS ile kişiselleştirilebilir. <br>
     `src/taskpane/taskpane.html` <br>
     `src/taskpane/taskpane.css`
   - JS dosyası da Add-In'in tüm fonksiyonlarını içeren dosya. <br>
     `src/taskpane/taskpane.js`

# Git

word-addin root klasörü içinde:

1. Değişiklikleri almak için
   `git pull`

2. Branch değiştirmek için
   `git checkout graph-test`

# Başlık değiştirme

manifest.xml > `<DisplayName DefaultValue="Objects"/>`
