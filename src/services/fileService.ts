import FileManager from '../utils/fileManager';
import Logger from '../utils/logger';
import path from 'path';
import fs from 'fs';
import { APISearch } from '../models/APISearch';

class FileService {
  private static instance: FileService;
  private csvFolderPath: string;
  private cursorRulesFolderPath: string;

  private constructor() {
    // Klasör yollarını proje kök dizinine göre ayarla
    this.csvFolderPath = path.join(process.cwd(), 'csv');
    this.cursorRulesFolderPath = path.join(process.cwd(), 'cursorrules');
    this.initializeFolders();
  }

  /**
   * Singleton instance oluşturma
   */
  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  /**
   * Gerekli klasörlerin varlığını kontrol et ve oluştur
   */
  private async initializeFolders(): Promise<void> {
    try {
      if (!await FileManager.exists(this.csvFolderPath)) {
        FileManager.createDirectory(this.csvFolderPath);

        Logger.info('CSV klasörü oluşturuldu');
      }
      
      if (!await FileManager.exists(this.cursorRulesFolderPath)) {
        FileManager.createDirectory(this.cursorRulesFolderPath);
        Logger.info('CursorRules klasörü oluşturuldu');
      }
    } catch (error) {
      Logger.error('Klasör oluşturma hatası:', error);
    }
  }

  /**
   * CSV dosyası yazma
   */
  public async writeCSV(content: APISearch): Promise<boolean> {
    try {
      const fileName = 'database.csv';
      // Dosya var mı kontrol et
      let csvContent = '';
      const filePath = path.join(this.csvFolderPath, fileName);
      
      if (!await FileManager.exists(filePath)) {
        // CSV başlık satırını oluştur
        csvContent = 'NAME,PATH,Owner Name,Repository Name,URL,Size(KB),Timestamp\n';
      }

      // APISearch verilerini CSV formatında ekle
      if (!(content instanceof APISearch)) {
        Logger.error('CSV dosyası yazma hatası - APISearch tipinde veri yok');
        return false;
      }
      csvContent += `${content.name},${content.path},${content.ownerName},${content.repositoryName},${content.htmlUrl},${content.size} KB,${content.timestamp}\n`;
      await FileManager.appendFile(filePath, csvContent);
      Logger.info(`CSV dosyası yazıldı: ${fileName}`);
      return true;
    } catch (error) {
      Logger.error(`CSV dosyası yazma hatası: database.csv`, error);
      return false;
    }
  }

  /**
   * CSV dosyası silme
   */
  public async deleteCSV(): Promise<boolean> {
    try {
      const fileName = 'database.csv';
      const filePath = path.join(this.csvFolderPath, fileName);
      if (await FileManager.exists(filePath)) {
        await FileManager.deleteFile(filePath);
        Logger.info(`CSV dosyası silindi: ${fileName}`);
        return true;
      }
      Logger.warn(`CSV dosyası bulunamadı: ${fileName}`);
      return false;
    } catch (error) {
      Logger.error(`CSV dosyası silme hatası: database.csv`, error);
      return false;
    }
  }

  /**
   * CursorRules dosyası yazma
   */
  public async writeCursorRule(fileName: string, content: string|Buffer): Promise<boolean> {
    try {
      const filePath = path.join(this.cursorRulesFolderPath, fileName);
      await FileManager.writeFile(filePath, content);
      Logger.info(`CursorRule dosyası yazıldı: ${fileName}`);
      return true;
    } catch (error) {
      Logger.error(`CursorRule dosyası yazma hatası: ${fileName}`, error);
      return false;
    }
  }

  /**
   * CursorRules dosyası silme
   */
  public async deleteCursorRule(fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.cursorRulesFolderPath, fileName);
      if (await FileManager.exists(filePath)) {
        await FileManager.deleteFile(filePath);
        Logger.info(`CursorRule dosyası silindi: ${fileName}`);
        return true;
      }
      Logger.warn(`CursorRule dosyası bulunamadı: ${fileName}`);
      return false;
    } catch (error) {
      Logger.error(`CursorRule dosyası silme hatası: ${fileName}`, error);
      return false;
    }
  }
}

export default FileService;