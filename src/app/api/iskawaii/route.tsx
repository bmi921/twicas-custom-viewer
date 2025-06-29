// import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not defined in environment variables.");
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  const inputData = await req.json();

  if (!Array.isArray(inputData)) {
    return NextResponse.json(
      { message: "Request body must be an array." },
      { status: 400 }
    );
  }

  // 1. movie.current_view_countが25以下でフィルタリング
  const filteredByViewCount = inputData.filter((item: any) => {
    return item.movie && item.movie.current_view_count <= 25;
  });

  // 2. broadcaster.idが 'c:' から始まるものにフィルタリング
  // const filteredByBroadcasterId = filteredByViewCount.filter((item: any) => {
  //   return (
  //     item.broadcaster &&
  //     item.broadcaster.id &&
  //     item.broadcaster.id.startsWith("c:")
  //   );
  // });

  // 最終結果を格納する配列と、重複を防ぐためのセット
  // const finalResultData: any[] = [];
  // const addedMovieIds = new Set<string>(); // すでに追加されたmovie.idを追跡

  // 特定の初期サムネイルを持つアイテムを優先的に追加 (未実装)
  // というのもツイキャスでは動的に初期サムネも切り替わるため実装不可能
  // const initialThumbnailUrl =""

  // for (const item of filteredByBroadcasterId) {
  //   if (item.movie && item.movie.large_thumbnail === initialThumbnailUrl) {
  //     // まだ追加されていないアイテムのみ追加し、IDを記録
  //     if (!addedMovieIds.has(item.movie.id)) {
  //       finalResultData.push(item);
  //       addedMovieIds.add(item.movie.id);
  //     }
  //   }
  // }

  // Gemini LLMを用いて配信者名を判定し、条件に合うものを追加
  //   for (const item of filteredByBroadcasterId) {
  //     // 既に初期サムネイル条件で追加されている場合はスキップ
  //     if (addedMovieIds.has(item.movie.id)) {
  //       continue;
  //     }

  //     const broadcasterName = item.broadcaster.name;

  //     // Geminiに判定させるプロンプト
  //     const prompt = `以下の配信者名について、いかが一つでも当てはまるかどうかを判定してください。
  // - 短い名前（例: 「A」「あ」「♪」「♡」）
  // - 意味不明な英単語や記号の羅列（例: 「pbz」「AngelNeverDie」）
  // - 一文字のひらがなやカタカナ、アルファベット(例: 「あ」「a」「ン」)

  // 判定結果をJSON形式で出力してください。JSONの形式は以下の通りです。
  // {
  //   "is_kawaii_name": true/false // 一つでも当てはまればtrue、そうでなければfalse
  // }
  // 他のテキストは一切含めず、JSONオブジェクトのみを出力してください。
  // 配信者名: "${broadcasterName}"`;

  //     try {
  //       const result = await model.generateContent(prompt);
  //       const response = await result.response;
  //       let text = response.text();

  //       // Geminiの応答からMarkdownコードブロックを削除し、前後の空白をトリム
  //       text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  //       text = text.trim();

  //       let geminiParsedResult: { is_kawaii_name: boolean } | null = null;
  //       try {
  //         // パースを試みる
  //         geminiParsedResult = JSON.parse(text);
  //       } catch (parseError) {
  //         // JSONパースに失敗した場合のエラーログ
  //         console.error(
  //           `Failed to parse Gemini response as JSON for "${broadcasterName}":`,
  //           `Original text: "${text}"`, // パースに失敗した生のテキストも出力
  //           parseError
  //         );
  //         continue; // パースに失敗したアイテムはスキップ
  //       }

  //       // Geminiが「可愛い名前」と判定した場合のみ最終結果に追加
  //       // ただし、既に初期サムネイルで追加されていない場合のみ
  //       if (geminiParsedResult && geminiParsedResult.is_kawaii_name === true) {
  //         if (!addedMovieIds.has(item.movie.id)) {
  //           // 重複チェック
  //           finalResultData.push(item);
  //           addedMovieIds.add(item.movie.id);
  //         }
  //       }
  //     } catch (error) {
  //       // Gemini API呼び出し中にエラーが発生した場合のエラーログ
  //       console.error(
  //         `Error judging broadcaster name "${broadcasterName}":`,
  //         error
  //       );
  //       // エラーが発生したアイテムもスキップされる
  //     }
  //   }

  // 最終結果をJSONレスポンスとして返す
  return NextResponse.json(filteredByViewCount);
}
