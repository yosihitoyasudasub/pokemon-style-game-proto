// Vercel Serverless Function for Gemini API integration
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const { npcId, playerInput, context } = req.body;
    
    // 入力検証
    if (!npcId || !playerInput) {
      return res.status(400).json({ error: 'Invalid input: npcId and playerInput are required' });
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'Service unavailable - API key not configured' });
    }

    // NPC設定に基づくプロンプト生成
    const prompt = generatePrompt(npcId, playerInput, context);

    // Gemini API呼び出し
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return res.status(500).json({ error: 'External service error' });
    }

    const data = await response.json();
    
    // レスポンス検証
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response format:', data);
      return res.status(500).json({ error: 'Invalid response format' });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    const executionTime = Date.now() - startTime;

    console.log(`API execution time: ${executionTime}ms for NPC: ${npcId}`);

    res.status(200).json({ 
      response: aiResponse,
      executionTime,
      npcId
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`Error after ${executionTime}ms:`, error.message);
    
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
}

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