const errorMessages = {
    // Genel Hata Mesajları
    UPDATED_FAILED:'Güncelleme işlemi sırasında bir hat ameydan geldi. Lütfen Daha sonra tekrar deneyin.',
    UNAUTHORIZED_ACCESS: "Bu işlemi yapma yetkiniz yok.",
    INVALID_CREDENTIALS: "Geçersiz kullanıcı adı veya şifre.",
    USER_NOT_FOUND: "Kullanıcı bulunamadı.",
    EMAIL_ALREADY_EXISTS: "Bu e-posta adresi zaten kullanımda.",
    PASSWORD_TOO_WEAK: "Şifreniz yeterince güçlü değil.",
    INVALID_REQUEST: "Geçersiz istek.",
    SERVER_ERROR: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    RATE_LIMIT_EXCEEDED: "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.",
    ACCESS_DENIED: "Bu kaynağa erişim izniniz yok.",
    FILE_TOO_LARGE: "Yüklemeye çalıştığınız dosya boyutu çok büyük.",
    INVALID_FILE_TYPE: "Geçersiz dosya türü.",
    FIELD_REQUIRED: "Bu alan zorunludur.",
    MISSING_FIELDS: "Eksik veya hatalı alanlar var. Lütfen tüm gerekli alanları doldurun.",
    INVALID_TOKEN: "Geçersiz veya süresi dolmuş token.",
    TOKEN_EXPIRED: "Oturum süresi dolmuş, lütfen tekrar giriş yapın.",
    ACTION_FAILED: "İşlem sırasında bir hata oluştu.",
    DATABASE_ERROR: "Veritabanı hatası oluştu. Lütfen tekrar deneyin.",
    CATEGORY_NOT_FOUND:"Kategori bulunamadı.",
    SUB_CATEGORY_NOT_FOUND:"Alt Kategori bulunamadı.",
    SSS_NOT_FOUND:"SSS bulunamadı.",
    IMAGE_DELETED_ERROR:"Resim silinirken bir hata oluştu. Lütfen tekrar deneyin.",
    // İlan İlgili Hata Mesajları
    POST_NOT_FOUND: "İlan bulunamadı.",
    POST_CREATION_FAILED: "İlan oluşturulamadı.",
    POST_UPDATE_FAILED: "İlan güncellenemedi.",
    POST_DELETE_FAILED: "İlan silinemedi.",
    POST_LISTING_FAILED: "İlan listeleme işlemi başarısız.",
    
    // Favoriler İlgili Hata Mesajları
    FAVORITE_ADD_FAILED: "Favorilere eklenemedi.",
    FAVORITE_REMOVE_FAILED: "Favorilerden kaldırılamadı.",
     
    
    // E-posta İlgili Hata Mesajları
    EMAIL_SEND_FAILED: "E-posta gönderilemedi.",
    EMAIL_ALREADY_VERIFIED: "E-posta adresiniz zaten doğrulandı.",
    EMAIL_VERIFICATION_FAILED: "E-posta doğrulama başarısız oldu.",
    EMAIL_UPDATE_FAILED:'E-posta güncellenmedi',
    
    // Hesap İlgili Hata Mesajları
    ACCOUNT_DELETION_FAILED: "Hesap silinemedi.",
    ACCOUNT_DEACTIVATION_FAILED: "Hesap devre dışı bırakılamadı.",
    ACCOUNT_REACTIVATION_FAILED: "Hesap yeniden etkinleştirilemedi.",
    
    // Şifre İlgili Hata Mesajları
    PASSWORD_RESET_FAILED: "Şifre sıfırlama işlemi başarısız oldu.",
    PASSWORD_MISMATCH: "Girilen şifreler eşleşmiyor.",
    
    // Kayıt ve Giriş İlgili Hata Mesajları
    REGISTRATION_FAILED: "Kayıt işlemi sırasında bir hata oluştu.",
    LOGIN_FAILED: "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.",
    
    // Diğer Hata Mesajları
    MAINTENANCE_MODE: "Site şu anda bakımda. Lütfen daha sonra tekrar deneyin.",
    UNDER_REVIEW: "İlanınız şu an inceleme aşamasında, lütfen bekleyin.",
    INVALID_OPERATION: "Geçersiz işlem. Lütfen tekrar deneyin.",
  };

module.exports={
    errorMessages
}