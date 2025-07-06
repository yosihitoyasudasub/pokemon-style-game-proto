// LLM会話管理クラス
class ConversationManager {
  constructor() {
    this.apiEndpoint = '/api/gemini';
    this.isEnabled = false;
    this.currentNPC = null;
    this.conversationHistory = [];
    this.isWaitingForResponse = false;
  }

  // 会話開始
  async startConversation(npcId, playerInput, context = {}) {
    if (!this.isEnabled) {
      return this.getFallbackResponse(npcId);
    }

    // APIキーを取得
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      return 'APIキーが設定されていません。設定画面でAPIキーを入力してください。';
    }

    if (this.isWaitingForResponse) {
      return '応答を待っています...';
    }

    this.isWaitingForResponse = true;
    this.currentNPC = npcId;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          npcId,
          playerInput,
          apiKey, // APIキーを送信
          context: {
            ...context,
            timestamp: Date.now(),
            conversationHistory: this.conversationHistory.slice(-5) // 最新5件
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // 会話履歴に追加
      this.conversationHistory.push({
        npcId,
        playerInput,
        aiResponse: data.response,
        timestamp: Date.now()
      });

      // 履歴を最新10件に制限
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return data.response;

    } catch (error) {
      console.error('Conversation error:', error);
      return this.getFallbackResponse(npcId);
    } finally {
      this.isWaitingForResponse = false;
    }
  }

  // フォールバック応答
  getFallbackResponse(npcId) {
    const fallbackResponses = {
      'oldMan': [
        'My bones hurt.',
        'The weather is nice today.',
        'Have you seen my grandson?',
        'In my day, we had to walk uphill both ways.',
        'The village has changed so much over the years.'
      ],
      'villager': [
        'Hey mister, have you seen my Doggochu?',
        'Welcome to our village!',
        'The crops are growing well this year.',
        'Did you hear about the new trainer in town?',
        'The weather has been strange lately.'
      ]
    };

    const responses = fallbackResponses[npcId] || fallbackResponses['villager'];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // LLM機能の有効/無効切り替え
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.conversationHistory = [];
      this.currentNPC = null;
    }
  }

  // 会話履歴の取得
  getConversationHistory() {
    return [...this.conversationHistory];
  }

  // 会話履歴のクリア
  clearConversationHistory() {
    this.conversationHistory = [];
  }

  // 現在の状態取得
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      currentNPC: this.currentNPC,
      isWaitingForResponse: this.isWaitingForResponse,
      historyCount: this.conversationHistory.length
    };
  }
}

// グローバルインスタンス
window.conversationManager = new ConversationManager(); 