import axios from 'axios';
import type { AxiosResponse } from 'axios';
import Logger from './logger';

interface DownloadResult {
  buffer: Buffer;
  size: number; // Kilobytes cinsinden
}

class Network {
  /**
   * URL'den dosya indirir
   */
  public static async download(url: string): Promise<DownloadResult> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      const buffer = response.data;
      const bytes = buffer.byteLength;
      const size = Number((bytes / 1024).toFixed(2));

      Logger.info(`Dosya indirildi: ${url}, Boyut: ${size}KB`);
      return { buffer, size };

    } catch (error) {
      Logger.error('Dosya indirme hatası:', error);
      throw error;
    }
  }

  /**
   * HTTP GET isteği
   * @param url İstek yapılacak URL
   * @returns Promise<AxiosResponse | null> Yanıt veya hata durumunda null
   */
  public static async get<T = any>(url: string): Promise<AxiosResponse<T> | null> {
    try {
      Logger.info(`GET isteği başladı: ${url}`);
      
      const response = await axios.get<T>(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      Logger.info(`GET isteği başarılı: ${url}`);
      return response;
      
    } catch (error) {
      Logger.error(`GET isteği hatası: ${url}`, error);
      return null;
    }
  }
}

export default Network;
export type { DownloadResult }; 