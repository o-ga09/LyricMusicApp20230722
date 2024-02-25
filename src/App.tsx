import {
  PlayerContext,
  PlayerOverlay,
  PlayerSeekbar,
} from "textalive-react-api";
import { useEffect, useMemo, useState } from "react";
import { IPlayer, Player, PlayerListener } from "textalive-app-api";
function App() {
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [position, setPosition] = useState<number>(0);

  // create objects
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const div = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );

  // initialize a video object with a template
  useEffect(() => {
    if (!mediaElement) {
      return;
    }

    const player = new Player({
      mediaElement,
    });
    const listener: PlayerListener = {
      onThrottledTimeUpdate(position) {
        setPosition(Math.round(position));
      },
    };
    player.addListener(listener);
    player.createFromSongUrl("http://www.youtube.com/watch?v=KdNHFKTKX2s");
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
            dummy content (current playback position:{" "}
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
