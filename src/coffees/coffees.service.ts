import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entities';
import { Flavour } from './entities/flavour.entity';
import { Event } from 'src/events/entities/event.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavour)
        private readonly flavourRepository: Repository<Flavour>,
        private readonly connection: Connection,
        private readonly configService: ConfigService 
    ) {
        const coffeesConfig = this.configService.get('coffees.foo')       
        console.log(coffeesConfig);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        })
        if(!coffee) {
            throw new NotFoundException(`Coffee ${id} not found`)
        }
        return coffee
    }

   async PostCoffee(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavourByName(name))
        )
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeeRepository.save(coffee);
    }

    async UpdateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavourByName(name))))
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        })

        if(!coffee) {
            throw new NotFoundException(`Coffee ${id} not found`)
        }

        return this.coffeeRepository.save(coffee)
    }

    async RemoveCoffee(id: string){
        const coffee = await this.findOne(id)
        this.coffeeRepository.remove(coffee)
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try{
            coffee.recommendation++

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = { coffeeId: coffee.id }
                        
            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(recommendEvent)
            await queryRunner.commitTransaction()        
        }
        catch (error) {
            await queryRunner.rollbackTransaction()
        }
        finally{
            await queryRunner.release()
        }
    }

    private async preloadFlavourByName(name: string): Promise<Flavour> {
        const existingFlavour = await this.flavourRepository.findOne({name})

        if(existingFlavour) {
            return existingFlavour
        }
        return this.flavourRepository.create({name})
    }
}
