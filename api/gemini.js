// Vercel Serverless Function for Gemini API integration
export default async function handler(req, res) {
  console.log('=== Gemini API Handler Start ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    const { npcId, playerInput, context, apiKey } = req.body;
    console.log('Request body:', { npcId, playerInput, context });
    
    // 入力検証
    if (!npcId || !playerInput) {
      console.log('Invalid input - missing required fields');
      return res.status(400).json({ error: 'Invalid input: npcId and playerInput are required' });
    }

    // APIキーの取得（フロントエンドから送信されたもの）
    const userApiKey = apiKey;
    console.log('API Key provided:', !!userApiKey);
    console.log('API Key length:', userApiKey ? userApiKey.length : 0);
    // セキュリティ: APIキーの内容は一切ログに出力しない
    
    if (!userApiKey) {
      console.error('No API key provided');
      return res.status(400).json({ error: 'API key is required. Please set your Gemini API key in the settings.' });
    }

    // NPC設定に基づくプロンプト生成
    const prompt = generatePrompt(npcId, playerInput, context);
    console.log('Generated prompt:', prompt);

    // Gemini API呼び出し（ユーザーのAPIキーを使用）
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${userApiKey}`;
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
    const executionTime = Date.now() - startTime;

    console.log(`API execution time: ${executionTime}ms for NPC: ${npcId}`);
    console.log('Generated AI response:', aiResponse);
    console.log('=== Gemini API Handler End ===');

    res.status(200).json({ 
      response: aiResponse,
      executionTime,
      npcId
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`Error after ${executionTime}ms:`, error.message);
    // セキュリティ: スタックトレースや詳細情報は出力しない
    
    res.status(500).json({ 
      error: 'Service temporarily unavailable'
      // セキュリティ: 詳細なエラー情報は含めない
    });
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

上記の設定に基づいて自然で親しみやすい応答してください。英語でチャットが開始されたら英語で応答してください。日本語でチャットが開始されたら日本語で応答してください。応答は50文字以内で簡潔にしてください。`;
} 