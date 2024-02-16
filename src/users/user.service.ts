import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Creacion de un nuevo usuario
   * @param {CreateUserDto} data Data del nuevo usuario
   */
  async create(data: CreateUserDto) {
    const exists = await this.findByEmail(data.email);
    if (exists) {
      throw new ConflictException(
        'Ya existe un usuario con este correo',
      );
    }
    const newModel = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);
    newModel.password = hashPassword;
    const model = await newModel.save();
    const { password, ...rta } = model.toJSON();
    return rta;
  }

  /**
   * Obtener el usuario por el email
   * @param {string} email Correo del usuario
   */
  findByEmail(email: string) {
    return this.userModel.findOne({ email }, { _id: 0 }).exec();
  }
}
