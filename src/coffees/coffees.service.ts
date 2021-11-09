import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entities';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Parth Chauhan',
            brand: 'KronenBourg',
            flavors: ['Chocolate', 'Butterscotch'], 
        }
    ];

    findAll() {
        return this.coffees;
    }

    findOne(id: string) {
        return this.coffees.find(item=>item.id === +id);
    }

    PostCoffee(createCoffeeDto: any) {
        this.coffees.push(createCoffeeDto);
        return createCoffeeDto;
    }

    UpdateCoffee(id: string, UpdateCoffeeDto: any) {
        const exisitingCoffee = this.findOne(id);
        if(exisitingCoffee) {
            // Update the Coffee Entities
        }
    }

    RemoveCoffee(id: string){
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id)
        if(coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}
