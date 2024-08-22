import { match } from "assert";
import { Match } from "src/match/entities/match.entity";
import { Tournament } from "src/tournament/entities/tournament.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Round } from "./round.entity";

@Entity({
    name:"FIXTURES"
})
export class Fixture {
    @PrimaryGeneratedColumn('uuid')
    id:string = uuid();

    @OneToOne(() => Tournament)
    tournament: Tournament

    @OneToMany(() => Round, (round) => round.fixture)
    round: Round[]
}
