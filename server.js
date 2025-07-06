const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定
app.use(cors());

// 静的ファイルの配信
app.use(express.static('.'));

// JSONボディパーサー
app.use(express.json());

// Gemini APIエンドポイント（ローカル版）
app.post('/api/gemini', async (req, res) => {
  console.log('=== Local Gemini API Handler Start ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    const { npcId, playerInput, context } = req.body;
    
    // 入力検証
    if (!npcId || !playerInput) {
      console.log('Invalid input - missing required fields');
      return res.status(400).json({ error: 'Invalid input: npcId and playerInput are required' });
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.log('API key not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // NPC設定に基づくプロンプト生成
    const prompt = generatePrompt(npcId, playerInput, context);
    console.log('Generated prompt:', prompt);

    // Gemini API呼び出し
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log('Making request to Gemini API...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40
        }
      })
    });

    console.log('Gemini API response status:', response.status);
    console.log('Gemini API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText);
      console.error('Error response body:', errorText);
      return res.status(500).json({ 
        error: 'External service error',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);
    
    // レスポンス検証
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response format:', data);
      return res.status(500).json({ error: 'Invalid response format' });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log('Generated AI response:', aiResponse);
    console.log('=== Local Gemini API Handler End ===');

    res.status(200).json({ 
      response: aiResponse,
      npcId
    });

  } catch (error) {
    console.error('Handler error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// NPC設定に基づくプロンプト生成
function generatePrompt(npcId, playerInput, context) {
  const npcConfigs = {
    'oldMan': {
      name: '長老',
      personality: '賢者、経験豊富、親切、物語を好む',
      background: '村の長老として50年以上暮らしている。村の歴史や伝説に詳しい。',
      knowledge: ['村の歴史', '伝説のポケモン', '戦闘のコツ', '人生の教訓'],
      conversationStyle: '教訓的、物語を交える、親切で丁寧'
    },
    'villager': {
      name: '村人',
      personality: '親切、好奇心旺盛、村の話題に詳しい',
      background: '村で生まれ育った若い村人。村の日常や噂話に詳しい。',
      knowledge: ['村の噂話', '近隣の情報', '天気の話', '作物の話'],
      conversationStyle: '親しみやすい、噂話を交える、カジュアル'
    }
  };

  const npc = npcConfigs[npcId] || npcConfigs['villager'];
  const gameContext = context ? `ゲーム状況: ${JSON.stringify(context)}` : '';

  return `あなたは${npc.name}として振る舞ってください。

性格: ${npc.personality}
背景: ${npc.background}
知識: ${npc.knowledge.join(', ')}
会話スタイル: ${npc.conversationStyle}

${gameContext}

プレイヤーの発言: "${playerInput}"

上記の設定に基づいて、自然で親しみやすい日本語で応答してください。応答は50文字以内で簡潔にしてください。`;
}

// メインページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Environment variables:');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
}); 