import Logger from '../utils/logger';
import { Octokit } from '@octokit/rest';

class GitHubService {
  private static instance: GitHubService;
  private octokit: Octokit;

  private constructor() {
    try {
      // GitHub token'ı environment variable'dan al
      const token = process.env.GITHUB_TOKEN ;
      if (!token) {
        throw new Error('GITHUB_TOKEN environment variable is not set');
      }

      this.octokit = new Octokit({
        auth: token
      });

      Logger.info('GitHub servisi başlatıldı');
    } catch (error) {
      Logger.error('GitHub servisi başlatma hatası:', error);
      throw error;
    }
  }

  /**
   * Singleton instance oluşturma
   */
  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Octokit instance'ına erişim
   */
  public getOctokit(): Octokit {
    return this.octokit;
  }

  /**
   * GitHub API'sini kullanarak kod araması yap
   */
  public async searchCode(query: string): Promise<any> {
    try {
      let allItems:any[] = [];
      let page = 1;
      // GitHub API kalan istek sayısını kontrol et
      const rateLimit = await this.octokit.rateLimit.get();
      const remainingRequests = rateLimit.data.resources.code_search?.remaining||1;
      
      // Her sayfa başına 1 istek kullanıldığı için, kalan istek sayısını geçmeyecek şekilde maxPages belirle
      const maxPages = Math.min(9, remainingRequests-1); // En fazla 10 sayfa olacak şekilde sınırla
      
      Logger.info(`Kalan GitHub API istek sayısı: ${remainingRequests}, Kullanılacak sayfa sayısı: ${maxPages}`);

      while (page <= maxPages) {
        const response = await this.octokit.search.code({
          q: query,
          per_page: 100,
          page: page
        });

        allItems = [...allItems, ...response.data.items];
        if (response.data.incomplete_results || response.data.items.length < 100) {
          break;
        }

        page++;
      }

      Logger.info(`GitHub kod araması tamamlandı: ${query}, Toplam sonuç: ${allItems.length}`);
      return allItems;
    } catch (error) {
      Logger.error(`GitHub kod arama hatası: ${query}`, error);
      throw error;
    }
  }

  /**
   * GitHub bağlantısını test et
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.octokit.rest.users.getAuthenticated();
      Logger.info('GitHub bağlantısı başarılı');
      return true;
    } catch (error) {
      Logger.error('GitHub bağlantı hatası:', error);
      return false;
    }
  }
}

export default GitHubService; 