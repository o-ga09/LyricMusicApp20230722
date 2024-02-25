import {
  PlayerContext,
  PlayerOverlay,
  PlayerSeekbar,
} from "textalive-react-api";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { IPlayer, Player, PlayerListener } from "textalive-app-api";
function App() {
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [text, setText] = useState("");

  // 動画用変数
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const div = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );

  // 歌詞表示用
  const animateWord = function (
    now: any,
    unit: { contains: (arg0: any) => any; text: SetStateAction<string> }
  ) {
    if (unit.contains(now)) {
      setText(unit.text);
    }
  };

  // useEffectによる初期化処理
  useEffect(() => {
    if (!mediaElement) {
      return;
    }

    // Playerインスタンス生成
    const player = new Player({
      mediaElement,
    });

    // Listenerを生成
    const listener: PlayerListener = {
      // 再生/一時停止のための設定
      onThrottledTimeUpdate(position) {
        setPosition(Math.round(position));
      },
      // 動画オブジェクトが準備できた時の設定
      onVideoReady(v) {
        // 定期的に呼ばれる各単語の "animate" 関数をセットする
        // Set "animate" function
        let w = player.video.firstWord;
        while (w) {
          w.animate = animateWord;
          w = w.next;
        }
      },
    };

    // ListenerをPlayerに登録
    player.addListener(listener);
    player.createFromSongUrl("https://www.youtube.com/watch?v=ZRtdQ81jPUQ");
    setPlayer(player);
    return () => {
      player.removeListener(listener);
    };
  }, [mediaElement]);

  return (
    <>
      <PlayerContext.Provider value={player as any}>
        <div
          style={{ position: "relative", background: "#bce", color: "#fff" }}
        >
          <PlayerOverlay />
          <p style={{ margin: 0, padding: "7em 1em", textAlign: "center" }}>
            dummy content (current playback position: <strong>{text}</strong>{" "}
            [ms]
            <strong>{position}</strong> [ms])
          </p>
        </div>
        <div style={{ marginTop: "8px" }}>
          <PlayerSeekbar />
          {div}
        </div>
      </PlayerContext.Provider>
    </>
  );
}

export default App;
