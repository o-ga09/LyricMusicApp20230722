import { Box, Button, Heading } from '@chakra-ui/react'
import { useState } from 'react';
import { Player } from "textalive-app-api";
function App() {

  const [ word, setWord ] = useState('');

  // TextAlive Player を作る
  const player = new Player({ app: { token: "3Ov5bbNqfE2O349E" } });
  player.addListener({
    // 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
    onVideoReady: (v) => {
      // 定期的に呼ばれる各単語の "animate" 関数をセットする
      let w = player.video.firstWord;
      while (w) {
        setWord(w.text);
        w = w.next;
      }
    },
  });

  return (
    <Box
      h='100vh'
      flexDirection='column'
      display='flex'
      justifyContent='center'
    >
      <Heading position='fixed' top='0px' w='100%' h='50px' textAlign='center'>Lyric Music App</Heading>

      <Box
        w='700px'
        m='20px auto'
      >
        <Box w='500px' h='500px' bg='green.400' m='0px auto' fontSize='100px' fontWeight='bold'>{word}</Box>
      </Box>
      <Button display='flex' w='100px' m='0px auto'>音楽を再生</Button>
    </Box>
  )
}

export default App
