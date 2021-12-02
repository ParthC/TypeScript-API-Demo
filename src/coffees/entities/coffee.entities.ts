import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavour } from "./flavour.entity";

@Entity('coffee')
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column({ default: 0 })
    recommendation: number;
    
    @JoinTable()
    @ManyToMany(
        type => Flavour, 
        flavour => flavour.coffees,
        {
           cascade: true,
        },
    )
    flavors: Flavour[]
}