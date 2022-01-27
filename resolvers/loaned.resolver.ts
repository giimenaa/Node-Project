import { BookIdInput } from '../dto/book.dto'
import { BookLoaned } from '../entity/books.loaned.entity'
import { Mutation, Resolver, Arg,Query, UseMiddleware, Ctx } from 'type-graphql';
import { getRepository, Repository } from "typeorm";
import { Book } from '../entity/book.entity';
import { IContext,isAuth } from '../middlewares/auth.middleware';
import { User } from '../entity/user.entity';

@Resolver()
export class LoanedResolver {
    bookRepository: Repository<Book>;
    booksLoanedRepository : Repository<BookLoaned>
    userRepository : Repository<User>

    constructor() {
        this.bookRepository = getRepository(Book);
        this.booksLoanedRepository = getRepository(BookLoaned)
        this.userRepository = getRepository(User)
        
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async createOrderLoan(
        @Arg('bookId', () => BookIdInput) bookId: BookIdInput,@Ctx() context: IContext
    ): Promise<Boolean> {
        try {
        
            const bookFind  = await this.bookRepository.findOne(bookId.id)

            const user = await this.userRepository.findOne(context.payload.id);
            
            if (!bookFind) throw new Error('Book does not exist')

            if (bookFind?.isOnLoan) throw new Error('Book is on loan')

            const book = await this.booksLoanedRepository.insert({
                book:bookFind,
                user:user,
                operation:'loan',
            })
            
            const bookRemove = await this.bookRepository.update(bookId.id,{isOnLoan:true});
            return true

        } catch (e:any) {
            throw new Error(e)
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async returnBookById(
        @Arg('bookId', () => BookIdInput) bookId: BookIdInput,@Ctx() context: IContext
    ): Promise<Boolean> {
        try {
            const bookFind = await this.bookRepository.findOne(bookId.id)

            const user = await this.userRepository.findOne(context.payload.id);

            if (!bookFind?.isOnLoan) throw new Error('Book is available')

            const bookReturn = await this.bookRepository.update(bookId.id,{isOnLoan:false});

            if (bookReturn.affected === 0) throw new Error('Book does not exist');

            const book = await this.booksLoanedRepository.insert({
                book:bookFind,
                user:user,
                operation:'return'
            })
            return true
            
        } catch (e:any) {
            throw new Error(e)
        }
    }
}