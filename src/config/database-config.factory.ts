import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { join } from "path";

@Injectable()
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.db_host'),
      port: this.configService.get<number>('database.db_port'),
      username: this.configService.get<string>('database.db_user'),
      password: this.configService.get<string>('database.db_pass'),
      database: this.configService.get<string>('database.db_name'),
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true
    }
  }
}