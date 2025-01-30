import DatabaseService from './databaseService';
import FileService from './fileService';
import GithubService from './githubService';
import Logger from '../utils/logger';

class ServiceManager {
  private static instance: ServiceManager;
  private databaseService: DatabaseService;
  private fileService: FileService;
  private githubService: GithubService;

  private constructor() {
    try {
      // Servisleri başlat
      this.databaseService = DatabaseService.getInstance();
      this.fileService = FileService.getInstance();
      this.githubService = GithubService.getInstance();
      
      Logger.info('Tüm servisler başarıyla başlatıldı');
    } catch (error) {
      Logger.error('Servis başlatma hatası:', error);
      throw error;
    }
  }

  /**
   * Singleton instance oluşturma
   */
  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * Database servisine erişim
   */
  public getDatabaseService(): DatabaseService {
    return this.databaseService;
  }

  /**
   * File servisine erişim
   */
  public getFileService(): FileService {
    return this.fileService;
  }

  /**
   * Github servisine erişim
   */
  public getGithubService(): GithubService {
    return this.githubService;
  }

  /**
   * Tüm servislerin durumunu kontrol et
   */
  public async checkServices(): Promise<boolean> {
    try {
      // Burada her servisin sağlık kontrolü yapılabilir
      // Örnek olarak basit bir kontrol ekliyorum
      if (!this.databaseService || !this.fileService || !this.githubService) {
        Logger.error('Bir veya daha fazla servis başlatılamamış');
        return false;
      }

      Logger.info('Tüm servisler çalışır durumda');
      return true;
    } catch (error) {
      Logger.error('Servis kontrol hatası:', error);
      return false;
    }
  }

  /**
   * Servisleri yeniden başlat
   */
  public async restartServices(): Promise<boolean> {
    try {
      // Yeni instance oluştur 
      ServiceManager.instance = new ServiceManager();
      
      Logger.info('Tüm servisler yeniden başlatıldı');
      return true;
    } catch (error) {
      Logger.error('Servis yeniden başlatma hatası:', error);
      return false;
    }
  }
}

export default ServiceManager; 