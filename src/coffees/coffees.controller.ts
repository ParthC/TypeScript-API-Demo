import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
constructor(private readonly coffeeService: CoffeesService) {

}

    @Get()
    findAll(@Query() props){
        // const { limit=20, offset=5 } = props
        return this.coffeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.coffeeService.findOne(id);
    }

    @Post()
    PostCoffee(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeeService.PostCoffee(CreateCoffeeDto);
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
