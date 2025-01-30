import Logger from './logger';

interface SearchItem {
  name: string;
  path: string;
  url: string;
  html_url: string;
  repository: {
    id: number;
    full_name: string;
  };
}

export default class ValidationUtils {
  /**
   * Verinin dizi olup olmadığını kontrol eder
   */
  public static validateArray(data: any): boolean {
    const errors: string[] = [];
    if (!Array.isArray(data)) {
        Logger.error('Dizi yapısı doğrulaması hatası');
        return false;
    }
    Logger.info('Dizi yapısı doğrulaması tamamlandı');
    return true;
  }

  /**
   * URL formatının geçerli olup olmadığını kontrol eder
   */
  private static isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Tekil bir arama sonucu öğesinin geçerli olup olmadığını kontrol eder
   */
  public static validateSearchItem(item: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      if (!item || typeof item !== 'object') {
        errors.push('Geçersiz item formatı');
        return { isValid: false, errors };
      }

      // String alanların kontrolü
      const stringFields = {
        name: 'string',
        path: 'string'
      };

      for (const [field, type] of Object.entries(stringFields)) {
        if (!item[field] || typeof item[field] !== type) {
          errors.push(`${field} ${type} tipinde olmalıdır`);
        }
      }

      // URL alanlarının kontrolü
      if (!item.url || !this.isValidUrl(item.url)) {
        errors.push('url geçerli bir URL olmalıdır');
      }

      if (!item.html_url || !this.isValidUrl(item.html_url)) {
        errors.push('html_url geçerli bir URL olmalıdır');
      }

      // Repository kontrolü
      if (!item.repository || typeof item.repository !== 'object') {
        errors.push('repository bir nesne olmalıdır');
      } else {
        if (typeof item.repository.id !== 'number') {
          errors.push('repository.id sayı tipinde olmalıdır');
        }
        if (!item.repository.full_name || typeof item.repository.full_name !== 'string') {
          errors.push('repository.full_name string tipinde olmalıdır');
        }
      }

      return { isValid: errors.length === 0, errors };

    } catch (error) {
      Logger.error('Item doğrulama hatası:', error);
      errors.push('Item doğrulama işlemi sırasında beklenmeyen bir hata oluştu');
      return { isValid: false, errors };
    }
  }
}

export { ValidationUtils };
export type { SearchItem }; 