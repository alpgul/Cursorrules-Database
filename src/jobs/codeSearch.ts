import { APISearch } from "../models/APISearch";
import ServiceManager from "../services/serviceManager";
import Logger from "../utils/logger";
import Network from "../utils/network";
import Validation from "../utils/validation";

export default async function codeSearch() {
  try {
    const serviceManager = ServiceManager.getInstance();
    const githubService = serviceManager.getGithubService();
    const fileService = serviceManager.getFileService();
    const databaseService = serviceManager.getDatabaseService();
    await databaseService.readFromJson();
    if (await githubService.testConnection()) {
      const searchResult = await githubService.searchCode(
        "filename:.cursorrules"
      );
      if (Validation.validateArray(searchResult)) {
        for (let i = 0; i < searchResult.length; i++) {
          if ( !databaseService.has(searchResult[i].repository.full_name+"/"+searchResult[i].path) && Validation.validateSearchItem(searchResult[i]).isValid ) {
            const downloadUrl = `https://raw.githubusercontent.com/${
              searchResult[i].repository.full_name
            }/${new URL(searchResult[i].url).searchParams.get("ref")}/${
              searchResult[i].path
            }`;
            const downloadResult = await Network.download(downloadUrl);
            if (
              downloadResult.size > 1 &&
              downloadResult.buffer instanceof Buffer
            ) {
              const item = databaseService.write(
                searchResult[i],
                downloadResult.size,
                downloadUrl
              );
              if (item instanceof APISearch) {
                await fileService.writeCursorRule(
                  item.path,
                  downloadResult.buffer
                );
                fileService.writeCSV(item);
              }
            }
          }
        }
        await databaseService.writeToJson();
      }
    }
  } catch (error) {
    Logger.error('Kod arama hatası:', error);
  }
}
codeSearch();
