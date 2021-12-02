import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
constructor(private readonly coffeeService: CoffeesService) {
}

    @Public()
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto){
        // const { limit=20, offset=5 } = props
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string){
        return this.coffeeService.findOne(id);
    }

    @Post()
    PostCoffee(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeeService.PostCoffee(createCoffeeDto);
    }

    @Patch(':id')
    UpdateCoffee(@Param('id') id: string, @Body() UpdateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeeService.UpdateCoffee(id, UpdateCoffeeDto)
    }
    
    @Delete(':id')
    RemoveCoffee(@Param('id') id: string) {
        return this.coffeeService.RemoveCoffee(id)
    }
}
