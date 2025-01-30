import fs from 'fs';
import path from 'path';
import Logger from './logger';

class FileManager {
  public static async appendFile(filePath: string, csvContent: string) {
    try {
      // Klasör yoksa oluştur
      await this.createDirectoryIfNotExists(path.dirname(filePath));
      
      await fs.promises.appendFile(filePath, csvContent, 'utf-8');
      
      Logger.info(`Dosyaya başarıyla ekleme yapıldı: ${filePath}`);
    } catch (error) {
      Logger.error(`Dosyaya ekleme hatası: ${filePath}`, error);
      throw error;
    }
  }
  private static readonly LOG_DIR = 'logs';
  private static readonly ERROR_LOG = path.join(FileManager.LOG_DIR, 'error.log');
  private static readonly WARN_LOG = path.join(FileManager.LOG_DIR, 'warn.log');

  /**
   * Dosya okuma işlemi
   * @param filePath Dosya yolu
   * @returns Promise<string> Dosya içeriği
   */
  public static async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      Logger.info(`Dosya başarıyla okundu: ${filePath}`);
      return content;
    } catch (error) {
      Logger.error(`Dosya okuma hatası: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Dosya yazma işlemi
   * @param filePath Dosya yolu
   * @param content Yazılacak içerik (string veya Buffer)
   */
  public static async writeFile(filePath: string, content: string | Buffer): Promise<void> {
    try {
      // Klasör yoksa oluştur
      await this.createDirectoryIfNotExists(path.dirname(filePath));
      
      await fs.promises.writeFile(filePath, content, content instanceof Buffer ? undefined : 'utf-8');
      
      Logger.info(`Dosya başarıyla yazıldı: ${filePath}`);
    } catch (error) {
      Logger.error(`Dosya yazma hatası: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Dosya silme işlemi
   * @param filePath Dosya yolu
   */
  public static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      Logger.info(`Dosya başarıyla silindi: ${filePath}`);
    } catch (error) {
      Logger.error(`Dosya silme hatası: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Klasör oluşturma işlemi
   * @param dirPath Klasör yolu
   */
  public static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
      Logger.info(`Klasör başarıyla oluşturuldu: ${dirPath}`);
    } catch (error) {
      Logger.error(`Klasör oluşturma hatası: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Klasör içeriğini listeleme
   * @param dirPath Klasör yolu
   * @returns Promise<string[]> Dosya ve klasör listesi
   */
  public static async listDirectory(dirPath: string): Promise<string[]> {
    try {
      const items = await fs.promises.readdir(dirPath);
      Logger.info(`Klasör içeriği listelendi: ${dirPath}`);
      return items;
    } catch (error) {
      Logger.error(`Klasör listeleme hatası: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * Dosya veya klasör var mı kontrol et
   * @param path Dosya veya klasör yolu
   * @returns Promise<boolean>
   */
  public static async exists(path: string): Promise<boolean> {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Klasör yoksa oluştur
   * @param dirPath Klasör yolu
   */
  private static async createDirectoryIfNotExists(dirPath: string): Promise<void> {
    if (!(await this.exists(dirPath))) {
      await this.createDirectory(dirPath);
    }
  }

  /**
   * Log dosyasına yazma işlemi
   * @param filePath Log dosyası yolu
   * @param message Log mesajı
   */
  public static async writeToLogFile(filePath: string, message: string): Promise<void> {
    try {
      // Klasör yoksa oluştur
      const logDir = path.dirname(filePath);
      if (!fs.existsSync(logDir)) {
        await fs.promises.mkdir(logDir, { recursive: true });
      }
      
      // Dosyaya ekleme yap
      await fs.promises.appendFile(filePath, message + '\n', 'utf-8');
    } catch (error) {
      console.error(`Log dosyasına yazma hatası (${filePath}):`, error);
    }
  }
}

export default FileManager; 