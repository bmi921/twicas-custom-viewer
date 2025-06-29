# 📺 Twicasting custom viewer
過疎配信者を中心に表示するツイキャスのフロントエンドです。   
可愛い声の過疎配信者を優先的に表示したくて作成しましたが、初期サムネが動的に切り替わるっており、必要な情報がAPIとして提供されていないために未実装です。   
その代わり、女子カテゴリーを中心に、視聴者数が25以下の配信を表示するようにしています。
 
## 🚀 Getting Started

```bash
git clone https://github.com/bmi921/twicas-custom-viewer
cd twicas-custom-viewer
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.   
`.env`に`NEXT_PUBLIC_TWICAS_CLIENT_ID=<YOUR_ID>`を追加してください。[開発者API](https://twitcasting.tv/indexapi.php)からIDは取得できます。   

# ✨ Planned Features

- 視聴者数が少ない配信をレコメンドします　←いまここ！
- 可愛い過疎配信者をサムネイルで表示します
- 可愛い過疎配信者を経験的に名前で表示します
