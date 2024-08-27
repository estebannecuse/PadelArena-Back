import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Category } from 'src/category/entities/category.entity';
import { CredentialsDto, UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
 
  constructor (
    @InjectRepository(User)private userRepository: Repository<User>,
    @InjectRepository(Category) private categoryRepository:Repository<Category>,
    private readonly JWTservice: JwtService
  ) {}

  async signUpUser(userDto: UserDto) {
    const emailAlreadyExist = await this.userRepository.findOne({where:{email:userDto.email}})
    const category = await this.categoryRepository.findOne({where: {name:userDto.category}});

    if(emailAlreadyExist){
      throw new BadRequestException('El email provisto ya está registrado')
    } else if(!category){
          throw new BadRequestException("Debes inscribirte dentro de una de las categorias definidas")
      }

      const encryptedPassword = await bcrypt.hash(userDto.password, 10)
      
      const newUser = {
        ...userDto,
        category: category
      }

      const user = await this.userRepository.save({...newUser, password: encryptedPassword})
      const {password, passwordConfirm, role, ...desestructuredUser} = user
        
      return {message: 'Usuario creado con exito', desestructuredUser}
  }
  
  async signInUser(credentials: CredentialsDto) {
    const userExist = await this.userRepository.findOne({where:{email:credentials.email}})
      if(!userExist){
        throw new BadRequestException('Email o contraseña incorrectos')
      }
      
    const passwordComparation = await bcrypt.compare(credentials.password, userExist.password)

    
      if(!passwordComparation){
        throw new BadRequestException('Email o contraseña incorrectos')
      }
      
      const userPayload = {
        sub: userExist.id,
        id: userExist.id,
        email: userExist.email,
        role: userExist.role 
      }

        const token = this.JWTservice.sign(userPayload);
        const {password, ...userClean} = userExist

      return {message: 'Inicio de sesion realizado con exito', token, userClean}
  }

  async authGoogleSign(googleUser: any) {
    const {email, image, name} = googleUser;

    const userFromDb = await this.userRepository.findOne({where:{email:email}})
    if(userFromDb){

      const userPayload = {
        sub: userFromDb.id,
        id: userFromDb.id,
        email: userFromDb.email,
        role: userFromDb.role 
      }

        const token = this.JWTservice.sign(userPayload);
        const {password, ...userClean} = userFromDb

      return {message: 'Inicio de sesion realizado con exito', token, userClean}
    } else if(!userFromDb){
      return {
        googleUser,
        message: "Usuario no registrado. Se necesitan mas datos para completar el proceso"
      }
    }
  }
}
