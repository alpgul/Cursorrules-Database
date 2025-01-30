export class APISearch {
    name: string;
    downloadUrl: string;
    repositoryId: number;
    path: string;
    ownerName: string;
    repositoryName: string;
    htmlUrl: string;
    size: number;
    timestamp: string;

    constructor(
        name: string,
        downloadUrl: string,
        repositoryId: number,
        path: string,
        ownerName: string,
        repositoryName: string,
        htmlUrl: string,
        size: number,
        timestamp: string
    ) {
        this.name = name;
        this.downloadUrl = downloadUrl;
        this.repositoryId = repositoryId;
        this.path = path;
        this.ownerName = ownerName;
        this.repositoryName = repositoryName;
        this.htmlUrl = htmlUrl;
        this.size = size;
        this.timestamp = timestamp;
    }
}