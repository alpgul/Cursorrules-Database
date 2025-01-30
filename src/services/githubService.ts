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
      const response = await this.octokit.search.code({
        q: query,
        per_page:3,
      });
      Logger.info(`GitHub kod araması tamamlandı: ${query}`);
      return response.data.items;
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