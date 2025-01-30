import path from 'path';
import FileManager from './fileManager';

enum LogLevel {
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4
}

class Logger {
  private static readonly LOG_DIR = 'logs';
  private static readonly ERROR_LOG = path.join(Logger.LOG_DIR, 'error.log');
  private static readonly WARN_LOG = path.join(Logger.LOG_DIR, 'warn.log');
  private static readonly DEFAULT_LEVEL = LogLevel.WARN;

  private static get logLevel(): number {
    const level = process.env.LOGGER_LEVEL;
    if (!level) return this.DEFAULT_LEVEL;

    const parsedLevel = parseInt(level);
    if (isNaN(parsedLevel) || parsedLevel < LogLevel.ERROR || parsedLevel > LogLevel.DEBUG) {
      return this.DEFAULT_LEVEL;
    }

    return parsedLevel;
  }

  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static async log(level: LogLevel, message: string, ...args: any[]): Promise<void> {
    const currentLevel = this.logLevel;

    // Log seviyesi kontrolü
    if (level > currentLevel) {
      return;
    }

    const timestamp = this.getTimestamp();
    const formattedMessage = `[${timestamp}] [${LogLevel[level]}] ${message}`;
    const fullMessage = args.length > 0 ? `${formattedMessage} ${args.join(' ')}` : formattedMessage;
    
    switch(level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        await FileManager.writeToLogFile(Logger.ERROR_LOG, fullMessage);
        break;
      case LogLevel.WARN:
        if (currentLevel >= LogLevel.WARN) {
          console.warn(formattedMessage, ...args);
          await FileManager.writeToLogFile(Logger.WARN_LOG, fullMessage);
        }
        break;
      case LogLevel.INFO:
        if (currentLevel >= LogLevel.INFO) {
          console.info(formattedMessage, ...args);
        }
        break;
      case LogLevel.DEBUG:
        if (currentLevel >= LogLevel.DEBUG) {
          console.debug(formattedMessage, ...args);
        }
        break;
    }
  }

  public static async debug(message: string, ...args: any[]): Promise<void> {
    await this.log(LogLevel.DEBUG, message, ...args);
  }

  public static async info(message: string, ...args: any[]): Promise<void> {
    await this.log(LogLevel.INFO, message, ...args);
  }

  public static async warn(message: string, ...args: any[]): Promise<void> {
    await this.log(LogLevel.WARN, message, ...args);
  }

  public static async error(message: string, ...args: any[]): Promise<void> {
    await this.log(LogLevel.ERROR, message, ...args);
  }
}

export default Logger; 