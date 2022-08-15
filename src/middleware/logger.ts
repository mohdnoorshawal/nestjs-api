import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, response, Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, path: url } = req;
    const userAgent = req.get('user-agent') || '';
    const requestLog = `${method} ${url} ${JSON.stringify(req.body)} - ${userAgent} ${ip}`;
    const now = new Date();
    const nowMonth = now.getMonth() + 1;
    const logFolder = './log/';
    const dateFolder =
      now.getFullYear() + '/' + nowMonth + '/' + now.getDate() + '/' + now.getHours() + '/';
    const path = logFolder + dateFolder;

    this.logger.log(requestLog);

    fs.mkdirSync(path, { recursive: true });
    fs.appendFile(path + 'log.txt', requestLog + '\n', function (err) {
      if (err) return console.log(err);
      console.log('Request log recorded successfully into log file');
    });

    res.on('close', () => {
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('content-length');
      const statusLog = `${method} ${url} ${statusCode} ${statusMessage} ${contentLength} - ${userAgent} ${ip}`;

      this.logger.log(statusLog);
      fs.mkdirSync(path, { recursive: true });
      fs.appendFile(path + 'log.txt', statusLog + '\n', function (err) {
        if (err) return console.log(err);
        console.log('Status log recorded successfully into log file');
      });
    });

    next();
  }
}
