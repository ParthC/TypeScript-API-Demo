import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entities';
import { Flavour } from './entities/flavour.entity';
import { Event } from 'src/events/entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavour, Event]), ConfigModule.forFeature(coffeesConfig)],
    controllers: [CoffeesController],
    providers:[CoffeesService, 
        {   
            provide: ConfigService, 
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService 
        },
    ],
    exports: [CoffeesService]
})
export class CoffeesModule {}
