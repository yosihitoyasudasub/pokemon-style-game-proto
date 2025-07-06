// APIキー管理クラス
class APIKeyManager {
  constructor() {
    this.modalId = 'apiKeyModal';
    this.createModal();
    this.loadSettings();
  }

  // モーダル作成
  createModal() {
    const modalHTML = `
      <div id="${this.modalId}" class="api-key-modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Gemini API設定</h2>
            <button class="close-btn" onclick="apiKeyManager.hideModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="security-warning">
              <h3>⚠️ セキュリティ警告</h3>
              <p>APIキーはサーバーサイドで安全に管理されますが、以下の点にご注意ください：</p>
              <ul>
                <li>信頼できる環境でのみ使用してください</li>
                <li>専用のAPIキーを使用してください</li>
                <li>定期的にキーを更新してください</li>
              </ul>
            </div>
            <div class="form-group">
              <label for="apiKeyInput">Gemini APIキー:</label>
              <input type="password" id="apiKeyInput" placeholder="AIzaSy..." />
              <small>Google AI Studioから取得できます</small>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="enableLLM" />
                LLM会話機能を有効にする
              </label>
            </div>
            <div class="form-group">
              <button id="saveApiKey" class="save-btn">設定を保存</button>
              <button id="testApiKey" class="test-btn">接続テスト</button>
            </div>
            <div id="statusMessage" class="status-message"></div>
          </div>
        </div>
      </div>
    `;

    // スタイル追加
    const styleHTML = `
      <style>
        .api-key-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
        }

        .security-warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .security-warning h3 {
          margin: 0 0 10px 0;
          color: #856404;
          font-size: 16px;
        }

        .security-warning ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .security-warning li {
          margin: 5px 0;
          color: #856404;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group input[type="password"],
        .form-group input[type="text"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }

        .save-btn, .test-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
          font-size: 14px;
        }

        .save-btn:hover, .test-btn:hover {
          background-color: #0056b3;
        }

        .test-btn {
          background-color: #28a745;
        }

        .test-btn:hover {
          background-color: #1e7e34;
        }

        .status-message {
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
          display: none;
        }

        .status-message.success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .status-message.error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .status-message.info {
          background-color: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
        }

        .llm-toggle {
          position: fixed;
          top: 10px;
          right: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          z-index: 100;
        }

        .llm-toggle:hover {
          background-color: #0056b3;
        }

        .llm-toggle.disabled {
          background-color: #6c757d;
        }
      </style>
    `;

    // HTMLとスタイルを追加
    document.head.insertAdjacentHTML('beforeend', styleHTML);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // イベントリスナー設定
    this.setupEventListeners();
  }

  // イベントリスナー設定
  setupEventListeners() {
    document.getElementById('saveApiKey').addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('testApiKey').addEventListener('click', () => {
      this.testConnection();
    });

    // Enterキーで保存
    document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveSettings();
      }
    });
  }

  // モーダル表示
  showModal() {
    document.getElementById(this.modalId).style.display = 'flex';
    document.getElementById('apiKeyInput').focus();
  }

  // モーダル非表示
  hideModal() {
    document.getElementById(this.modalId).style.display = 'none';
  }

  // 設定保存
  saveSettings() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const enableLLM = document.getElementById('enableLLM').checked;

    if (!apiKey) {
      this.showStatus('APIキーを入力してください', 'error');
      return;
    }

    // 設定をローカルストレージに保存
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('llm_enabled', enableLLM.toString());

    // 会話マネージャーの設定を更新
    if (window.conversationManager) {
      window.conversationManager.setEnabled(enableLLM);
    }

    this.showStatus('設定を保存しました', 'success');
    
    // トグルボタンの更新
    this.updateToggleButton();

    // 3秒後にモーダルを閉じる
    setTimeout(() => {
      this.hideModal();
    }, 2000);
  }

  // 接続テスト
  async testConnection() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    
    if (!apiKey) {
      this.showStatus('APIキーを入力してください', 'error');
      return;
    }

    this.showStatus('接続をテスト中...', 'info');

    try {
      // 簡単なテストリクエスト
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          npcId: 'villager',
          playerInput: 'こんにちは',
          context: { test: true }
        })
      });

      if (response.ok) {
        this.showStatus('接続テスト成功！', 'success');
      } else {
        const errorData = await response.json();
        this.showStatus(`接続エラー: ${errorData.error}`, 'error');
      }
    } catch (error) {
      this.showStatus(`接続エラー: ${error.message}`, 'error');
    }
  }

  // 設定読み込み
  loadSettings() {
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const enableLLM = localStorage.getItem('llm_enabled') === 'true';

    document.getElementById('apiKeyInput').value = apiKey;
    document.getElementById('enableLLM').checked = enableLLM;

    // 会話マネージャーの設定を更新
    if (window.conversationManager) {
      window.conversationManager.setEnabled(enableLLM);
    }

    // トグルボタン作成
    this.createToggleButton();
  }

  // トグルボタン作成
  createToggleButton() {
    const buttonHTML = `
      <button id="llmToggle" class="llm-toggle">
        LLM: 無効
      </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', buttonHTML);
    
    document.getElementById('llmToggle').addEventListener('click', () => {
      this.showModal();
    });

    this.updateToggleButton();
  }

  // トグルボタン更新
  updateToggleButton() {
    const button = document.getElementById('llmToggle');
    const isEnabled = localStorage.getItem('llm_enabled') === 'true';
    
    if (button) {
      button.textContent = `LLM: ${isEnabled ? '有効' : '無効'}`;
      button.className = `llm-toggle ${isEnabled ? '' : 'disabled'}`;
    }
  }

  // ステータスメッセージ表示
  showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';

    // 3秒後に非表示
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

// グローバルインスタンス
window.apiKeyManager = new APIKeyManager(); 