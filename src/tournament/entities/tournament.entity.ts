import { Category } from 'src/category/entities/category.entity';
import { Fixture } from 'src/fixture/entities/fixture.entity';
import { Match } from 'src/match/entities/match.entity';
import { Team } from 'src/team/entities/team.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { InscriptionEnum, StatusEnum } from '../tournament.enum';


 @Entity({
     name: 'TOURNAMENT'
 })
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id:string = uuid()

  @Column({type:"varchar", length: 50})
  name:string

  @Column()
  startDate:Date

  @Column()
  endDate:Date

  @Column()
  startingTime:string

  @Column()
  finishTime:string

  @Column("text", {array: true})
  playingDay:string[]

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.PENDING
  })
  status: StatusEnum

  @Column({
    type: "enum",
    enum: InscriptionEnum,
    default: InscriptionEnum.OPEN,
  })
    inscription: InscriptionEnum

  @Column()
  teamsQuantity: number

  @Column()
  matchDuration: number

  @Column()
  description: string

  @Column("text", { array: true, nullable: true })
  gallery: string[]

  @Column({ type: "text", nullable: false, default: "default-image-url" })
  tournamentFlyer: string

  @Column()
  courtsAvailable: number

  @ManyToOne(() => Category, (category) => category.tournaments, {nullable:false})
  category: Category

  @OneToMany(() => Team, (team) => team.tournament, {nullable:true})
  @JoinColumn({name: "Teams"})
  team: Team[]

  @OneToMany(() => Match, (match) => match.tournament, {nullable:true})
  matches: Match[]

  @OneToOne(() => Fixture, {nullable:true})
  fixture: Fixture
}