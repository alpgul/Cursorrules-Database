import FileManager from '../utils/fileManager';
import Logger from '../utils/logger';
import { Database } from '../models/Database';
import { Crypto } from '../utils/crypto';
import { APISearch } from '../models/APISearch';
import path from 'path';

class DatabaseService {
  has(key: string) {
    try {
      return this.database.apisearch.has(key);
    } catch (error) {
      Logger.error(`"${key}" anahtarı kontrolünde hata:`, error);
      return false;
    }
  }
  private static instance: DatabaseService;
  private database: Database;

  private constructor() {
    this.database = new Database(Crypto.generateUUID());
  }

  /**
   * Singleton instance oluşturma
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * APISearch verisini key ile getir
   */
  public async read(key: string): Promise<APISearch | null> {
    const result = this.database.get<APISearch>(key);
    if (!result) {
      Logger.warn(`"${key}" anahtarı ile kayıtlı APISearch bulunamadı`);
    }
    return result;
  }

  /**
   * APISearch verisini kaydet
   */
  public write(data: any, size:number,downloadUrl:string): APISearch|null {
    let key;
    try {
      if (!data || !size || !downloadUrl || !data.name || !data.path || !data.url || !data.html_url || !data.repository || !data.repository.id || !data.repository.full_name || !data.repository.owner?.login || !data.repository.name) {
        Logger.error('Kaydetme hatası - Gerekli alanlar eksik veya hatalı');
        return null;
      }
      key=data.repository.full_name+"/"+data.path;
      const timestamp=new Date().toISOString();
      const item=new APISearch(data.name,downloadUrl,data.repository.id,key,data.repository.owner.login,data.repository.name,data.html_url,size,timestamp);
      if (!this.database.get(key)) {
        this.database.set(key, item);
        Logger.info(`"${key}" anahtarı ile yeni APISearch oluşturuldu`);
        return item;
      } else {
        Logger.warn(`"${key}" anahtarı ile kayıtlı APISearch zaten mevcut`);
        return null;
      }
    } catch (error) {
      Logger.error(`APISearch kaydetme hatası - Key: "${key}"`, error);
      return null;
    }
  }
  /**
   * APISearch verisini güncelle veya oluştur
   */
  public async update(key: string, data: APISearch): Promise<boolean> {
    try {
      if (!key || !data || !(data instanceof APISearch)) {
        Logger.error('Güncelleme hatası - Key ve data boş olamaz ve data APISearch tipinde olmalıdır');
        return false;
      }

      this.database.set(key, data);
      Logger.info(`"${key}" anahtarı ile APISearch güncellendi/oluşturuldu`);
      return true;

    } catch (error) {
      Logger.error(`APISearch güncelleme hatası - Key: "${key}"`, error);
      return false;
    }
  }

  /**
   * APISearch verisini sil
   */
  public async delete(key: string): Promise<boolean> {
    try {
      const deleted = this.database.delete(key);
      if (deleted) {
        Logger.info(`"${key}" anahtarlı APISearch silindi`);
      } else {
        Logger.warn(`"${key}" anahtarı ile kayıtlı APISearch bulunamadı`);
      }
      return deleted;
    } catch (error) {
      Logger.error(`APISearch silme hatası - Key: "${key}"`, error);
      return false;
    }
  }

  /**
   * Tüm APISearch verilerini getir
   */
  public async getAll(): Promise<Map<string, APISearch> | null> {
    const allData = this.database.getAll();
    Logger.info(`Toplam ${allData.size} APISearch kaydı getirildi`);
    return allData;
  }
  /**
   * Tüm APISearch verilerini JSON dosyasına yaz
   */
  public async writeToJson(): Promise<boolean> {
    try {
      const allData = await this.getAll();
      if (!allData) {
        Logger.error('JSON dosyası yazma hatası - Veri alınamadı');
        return false;
      }

      const jsonData = JSON.stringify({
        id: this.database.id,
        size: this.database.size,
        apisearch: Array.from(allData.entries())
      }, null, 2);

      const filePath = path.join(process.cwd(), 'db.json');
      await FileManager.writeFile(filePath, jsonData);
      
      Logger.info('Veriler db.json dosyasına yazıldı');
      return true;

    } catch (error) {
      Logger.error('JSON dosyası yazma hatası:', error);
      return false;
    }
  }
  /**
   * JSON dosyasından APISearch verilerini oku
   */
  public async readFromJson(): Promise<boolean> {
    try {
      const filePath = path.join(process.cwd(), 'db.json');
      
      if (!await FileManager.exists(filePath)) {
        Logger.warn('db.json dosyası bulunamadı');
        return false;
      }

      const jsonContent = await FileManager.readFile(filePath);
      const data = JSON.parse(jsonContent);

      if (!data.id || !Array.isArray(data.apisearch)) {
        Logger.error('JSON dosyası geçersiz format içeriyor');
        return false;
      }

      // Mevcut verileri temizle
      this.database = new Database(data.id);

      // JSON'dan okunan verileri Map'e dönüştür
      for (const [key, value] of data.apisearch) {
        const apiSearch = new APISearch(
          value.name,
          value.downloadUrl,
          value.repositoryId,
          value.path, 
          value.ownerName,
          value.repositoryName,
          value.htmlUrl,
          value.size,
          value.timestamp
        );
        this.database.set(key, apiSearch);
      }

      Logger.info(`${data.apisearch.length} APISearch kaydı JSON dosyasından yüklendi`);
      return true;

    } catch (error) {
      Logger.error('JSON dosyası okuma hatası:', error);
      return false;
    }
  }
}

export default DatabaseService; 