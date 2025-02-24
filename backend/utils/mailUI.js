const getEmailTemplate = (privateCode) => {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama</title>
  <style>
    /* Modern Tasarım için CSS */
    :root {
      --primary: #4F46E5;
      --primary-dark: #4338CA;
      --secondary: #0EA5E9;
      --text: #1F2937;
      --text-light: #6B7280;
      --background: #F9FAFB;
      --white: #FFFFFF;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      background-color: var(--background);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .email-wrapper {
      width: 100%;
      background-color: var(--background);
      padding: 40px 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--white);
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .email-header {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      padding: 40px 20px;
      text-align: center;
    }

    .email-header img {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .email-header h1 {
      color: var(--white);
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .email-content {
      padding: 40px 32px;
      background-color: var(--white);
    }

    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 24px;
      color: var(--text);
    }

    .message {
      color: var(--text-light);
      margin-bottom: 32px;
      font-size: 16px;
    }

    .verification-code {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: var(--white);
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 4px;
      padding: 16px 32px;
      border-radius: 12px;
      text-align: center;
      margin: 32px 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .verification-button {
      display: block;
      width: 100%;
      max-width: 300px;
      margin: 32px auto;
      padding: 16px 24px;
      background: var(--primary);
      color: var(--white);
      text-decoration: none;
      text-align: center;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .verification-button:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    .email-footer {
      padding: 32px;
      background-color: var(--background);
      text-align: center;
      color: var(--text-light);
      font-size: 14px;
    }

    .footer-links {
      margin-top: 16px;
    }

    .footer-links a {
      color: var(--primary);
      text-decoration: none;
      margin: 0 8px;
    }

    .security-notice {
      margin-top: 24px;
      padding: 16px;
      background-color: #FEF3C7;
      border-radius: 8px;
      font-size: 14px;
      color: #92400E;
    }

    @media (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }

      .email-content {
        padding: 32px 20px;
      }

      .verification-code {
        font-size: 24px;
        padding: 12px 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <img src="https://your-logo-url.com/logo.png" alt="Logo" />
        <h1>E-posta Doğrulama</h1>
      </div>

      <div class="email-content">
        <p class="greeting">Merhaba 👋</p>
        
        <p class="message">
          Hesabınızı doğrulamak için aşağıdaki kodu kullanın. Bu kod 3 dakika süreyle geçerlidir.
        </p>

        <div class="verification-code">
          ${privateCode}
        </div>

        <p class="message">
          Doğrulama kodunu girmek için aşağıdaki butona tıklayabilir veya doğrudan uygulamamıza gidebilirsiniz.
        </p>

        <a href="http://localhost:5173/emailverify" class="verification-button">
          Hesabımı Doğrula
        </a>

        <div class="security-notice">
          <strong>Güvenlik Uyarısı:</strong> Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın ve hesabınızın güvenliği için şifrenizi değiştirin.
        </div>
      </div>

      <div class="email-footer">
        <p>Bu otomatik bir e-postadır, lütfen yanıtlamayın.</p>
        <div class="footer-links">
          <a href="#">Gizlilik Politikası</a>
          <a href="#">Yardım Merkezi</a>
          <a href="#">İletişim</a>
        </div>
        <p style="margin-top: 16px;">
          © ${new Date().getFullYear()} Your Company. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getEmailTemplate;
