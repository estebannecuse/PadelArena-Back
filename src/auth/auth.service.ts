import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as Bcrypt from 'bcrypt'
import { CredentialsDto, UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly JWTservice: JwtService
  ) {}

  async signInUser(credentials: CredentialsDto) {
    const userExist = await this.userRepository.findOne({where:{email:credentials.email}})
      if(!userExist){
        throw new BadRequestException('Email o contraseña incorrectos')
      }

    const passwordComparation = Bcrypt.compare(credentials.password, userExist.password)
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

  async signUpUser(UserDto: UserDto) {
    const emailAlreadyExist = await this.userRepository.findOne({where:{email:UserDto.email}})
    if(!emailAlreadyExist){
        const encryptedPassword = await Bcrypt.hash(UserDto.password, 10)
        const newUser = await this.userRepository.save({...UserDto, password: encryptedPassword})
        const {password, passwordConfirm,  ...user} = newUser
        console.log(newUser.id);
        
        return {message: 'Usuario creado con exito', user}
    }else{
      throw new BadRequestException('El email provisto ya está registrado');
    }
  }
}
