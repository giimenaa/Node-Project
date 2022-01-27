import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne } from 'typeorm'
import { Book } from './book.entity'
import { User } from './user.entity'
import { Field,ObjectType   } from 'type-graphql'


@Entity()
@ObjectType()
export class BookLoaned {

    @Field()
    @PrimaryGeneratedColumn()
    idLoan!: number

    @Field(()=> User , { nullable: true } )
    @ManyToOne(() => User,user => user, { onDelete: 'CASCADE' })
    user!: User;

    @Field(()=>Book , { nullable: true } )
    @ManyToOne(()=> Book,book => book.id)
    book!: Book

    @Field()
    @Column()
    operation!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}
