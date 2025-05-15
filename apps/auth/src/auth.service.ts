import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './document/user.document';
import { hash } from 'bcrypt';
import { GrpcAlreadyExistsException } from 'nestjs-grpc-exceptions';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async createUser(dto: { email: string; password: string }): Promise<UserDocument> {
        const existsUser = await this.findUserByEmail(dto.email);
        if (existsUser) {
            throw new GrpcAlreadyExistsException('이미 존재하는 이메일입니다.');
        }

        const user = await this.userModel.create({
            ...dto,
            password: await hash(dto.password, 10),
        });

        return user;
    }

    findUserByEmail(email: string): Promise<UserDocument> {
        const user = this.userModel.findOne({ email });
        return user;
    }
}
