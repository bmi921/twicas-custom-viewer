import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { Loader2, User, Video, Clock } from "lucide-react";
import "./App.css";

// TwitCasting API設定
const TWITCASTING_BASE_URL = "https://apiv2.twitcasting.tv";
const API_VERSION = "2.0";

// OAuth設定（実際の使用時にはクライアントIDを設定してください）
// const CLIENT_ID = "Your-client-id"; // 実際のクライアントIDに置き換えてください
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [currentLive, setCurrentLive] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchUserId, setSearchUserId] = useState("");

  // URLフラグメントからアクセストークンを取得
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        setAccessToken(token);
        // URLからフラグメントを削除
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  // OAuth認証開始
  const startOAuth = () => {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = `${TWITCASTING_BASE_URL}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=${state}`;
    window.location.href = authUrl;
  };

  // API呼び出し用のヘルパー関数
  const apiCall = async (endpoint, requireAuth = true) => {
    const headers = {
      "X-Api-Version": API_VERSION,
      "Content-Type": "application/json",
    };

    if (requireAuth && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${TWITCASTING_BASE_URL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // 認証ユーザー情報取得
  const fetchUserInfo = async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/verify_credentials");
      setUserInfo(data.user);
    } catch (err) {
      setError(`ユーザー情報の取得に失敗しました: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 特定ユーザーの現在のライブ情報取得
  const fetchCurrentLive = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/users/${userId}/current_live`);
      setCurrentLive(data.movie);
    } catch (err) {
      setError(`ライブ情報の取得に失敗しました: ${err.message}`);
      setCurrentLive(null);
    } finally {
      setLoading(false);
    }
  };

  // 特定ユーザーの録画一覧取得
  const fetchMovies = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/users/${userId}/movies`);
      setMovies(data.movies || []);
    } catch (err) {
      setError(`録画一覧の取得に失敗しました: ${err.message}`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // ユーザー検索実行
  const handleUserSearch = () => {
    if (!searchUserId.trim()) return;

    fetchCurrentLive(searchUserId);
    fetchMovies(searchUserId);
  };

  // アクセストークンが取得されたら自動的にユーザー情報を取得
  useEffect(() => {
    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              TwitCasting Viewer
            </CardTitle>
            <CardDescription>
              TwitCastingのユーザー情報、ライブ、録画を閲覧できるアプリです
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 認証セクション */}
        {!accessToken ? (
          <Card>
            <CardHeader>
              <CardTitle>認証が必要です</CardTitle>
              <CardDescription>
                TwitCastingのAPIを使用するには認証が必要です
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertDescription>
                  注意: このデモでは実際のクライアントIDが設定されていません。
                  実際に使用する場合は、TwitCastingでアプリを登録してクライアントIDを取得してください。
                </AlertDescription>
              </Alert>
              <Button
                onClick={startOAuth}
                disabled={CLIENT_ID === "YOUR_CLIENT_ID"}
              >
                TwitCastingで認証
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ユーザー情報表示 */}
            {userInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    認証ユーザー情報
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {userInfo.image && (
                      <img
                        src={userInfo.image}
                        alt={userInfo.name}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{userInfo.name}</h3>
                      <p className="text-gray-600">@{userInfo.screen_id}</p>
                      <p className="text-sm text-gray-500">
                        {userInfo.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ユーザー検索 */}
            <Card>
              <CardHeader>
                <CardTitle>ユーザー検索</CardTitle>
                <CardDescription>
                  ユーザーIDまたはスクリーンIDを入力してライブ・録画情報を取得
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="userId">ユーザーID / スクリーンID</Label>
                    <Input
                      id="userId"
                      value={searchUserId}
                      onChange={(e) => setSearchUserId(e.target.value)}
                      placeholder="例: twitcasting_jp"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUserSearch()
                      }
                    />
                  </div>
                  <Button
                    onClick={handleUserSearch}
                    disabled={loading || !searchUserId.trim()}
                    className="mt-6"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    検索
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* エラー表示 */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 現在のライブ情報 */}
            {currentLive && (
              <a
                href={currentLive.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" />
                      現在配信中
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{currentLive.title}</h3>
                      <p className="text-sm text-gray-600">
                        {currentLive.subtitle}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>視聴者数: {currentLive.current_view_count}</span>
                        <span>総視聴者数: {currentLive.total_view_count}</span>
                        <span>コメント数: {currentLive.comment_count}</span>
                      </div>
                      {currentLive.large_thumbnail && (
                        <img
                          src={currentLive.large_thumbnail}
                          alt="ライブサムネイル"
                          className="w-full max-w-md rounded-lg"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            )}

            {/* 録画一覧 */}
            {movies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    過去の録画 ({movies.length}件)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                      <Card key={movie.id} className="overflow-hidden">
                        {movie.large_thumbnail && (
                          <img
                            src={movie.large_thumbnail}
                            alt={movie.title}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                            {movie.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                            {movie.subtitle}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>視聴: {movie.view_count}</div>
                            <div>コメント: {movie.comment_count}</div>
                            <div>時間: {Math.floor(movie.duration / 60)}分</div>
                            <div>
                              配信日:{" "}
                              {new Date(
                                movie.created * 1000
                              ).toLocaleDateString("ja-JP")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 検索結果が空の場合 */}
            {searchUserId &&
              !loading &&
              !currentLive &&
              movies.length === 0 &&
              !error && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">
                      ユーザー「{searchUserId}」の配信情報が見つかりませんでした
                    </p>
                  </CardContent>
                </Card>
              )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
