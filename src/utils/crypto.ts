/**
 * Kriptografik işlemler için yardımcı sınıf
 */
export class Crypto {
    /**
     * UUID v4 formatında benzersiz tanımlayıcı oluşturur
     * @returns string UUID formatında benzersiz tanımlayıcı
     */
    public static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
} 