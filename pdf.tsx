// backend/src/pdf/pdf.controller.ts

import {
  Body,
  Controller,
  Header,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@/common/decorators/public.decorator';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Public()
  @Post('workshop-one')
  async generateWorkshopOne(
    @Body() body: { accessKey?: string },
    @Res() res: Response,
  ) {
    const pdf = await this.pdfService.generateWorkshopOnePdf(
      body.accessKey ?? '',
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        'attachment; filename="Research-Ustad-Workshop.pdf"',
      'Content-Length': pdf.length.toString(),
      'Cache-Control': 'no-store',
    });

    res.end(pdf);
  }
}

// /backend/src/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}

//backend/src/pdf/pdf.service.ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';


@Injectable()
export class PdfService {
  constructor(private readonly config: ConfigService) {}

    async generateWorkshopOnePdf(accessKey: string): Promise<Buffer> {
    const configuredKey =
      this.config.get<string>('pdf.accessKey') ?? '';

    if (!configuredKey || accessKey !== configuredKey) {
      throw new UnauthorizedException('Invalid access key');
    }

    const frontendUrl =
      this.config.get<string>('pdf.frontendUrl') ??
      'http://localhost:3000';

    const printUrl =
      `${frontendUrl}/presentation/workshop-one/print`;

    let browser;

    try {
      browser = await puppeteer.launch({
        headless: true,
        protocolTimeout: 120000,
              args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });

      await page.emulateMediaType('print');

      await page.goto(printUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const pdf = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true,
        landscape: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });

      await page.goto(printUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
     });

      await writeFile(
        '/tmp/workshop-test.pdf',
        Buffer.from(pdf),
      );

    return Buffer.from(pdf);

    } catch (error) {
      console.error(
        'Workshop PDF generation failed:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to generate PDF',
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

