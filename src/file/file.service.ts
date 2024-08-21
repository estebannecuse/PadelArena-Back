import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepostory: Repository<Tournament>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileRepository: FileRepository,
  ) {}
  async UpdateTournamentPrincipalImage(id: string, file: Express.Multer.File) {
    const tournament = await this.tournamentRepostory.findOne({
      where: { id },
    });
    if (!tournament) {
      throw new NotFoundException('No fue posible encontrar el torneo');
    } else {
      const tournamentFlyer = (await this.fileRepository.uploadImage(file))
        .secure_url;
      await this.tournamentRepostory.update(id, { tournamentFlyer });
      return { message: 'Imagen actualizada con exito con exito' };
    }
  }

  async UploadTournamentMultimedia(id: string, file: Express.Multer.File) {
    const tournament = await this.tournamentRepostory.findOne({
      where: { id },
    });
    if (!tournament) {
      throw new NotFoundException('No fue posible encontrar el torneo');
    } else {
      const tournamentNewImg = (await this.fileRepository.uploadImage(file))
        .secure_url;
      const imgArray = tournament.imgUrl
      const arrayUpdated = {tournamentNewImg, ...imgArray}
      const tournamentUpdated:Tournament = {
        imgUrl: arrayUpdated,
        ...tournament
      }
      await this.tournamentRepostory.save(tournamentUpdated);
      return { message: 'Imagen subida con exito con exito' };
    }
  }

  async UpdateProfileImage(id:string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('No fue posible encontrar al usuario');
    } else {
      const profilePhoto = (await this.fileRepository.uploadImage(file))
        .secure_url;
      await this.userRepository.update(id, { profileImg: profilePhoto });
      return { message: 'Foto de perfil actualizada con exito con exito' };
    }
  }
}
