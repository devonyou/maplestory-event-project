import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './document/user.document';
import { compare, hash } from 'bcrypt';
import {
    GrpcAlreadyExistsException,
    GrpcNotFoundException,
    GrpcUnauthenticatedException,
} from 'nestjs-grpc-exceptions';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AuthMicroService } from '@app/repo';

@Injectable()
export class AuthService {
    private ACCESS_SECRET: string;
    private REFRESH_SECRET: string;
    private ACCESS_EXPIRE_IN: number;
    private REFRESH_EXPIRE_IN: number;

    constructor(
        @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.ACCESS_SECRET = this.configService.get('JWT_ACCESS_SECRET');
        this.REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET');
        this.ACCESS_EXPIRE_IN = this.configService.get<number>('JWT_ACCESS_EXPIRATION_TIME');
        this.REFRESH_EXPIRE_IN = this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME');
    }

    /**
     * 새로운 유저를 생성합니다.
     * @param dto 유저 생성에 필요한 정보 (이메일, 비밀번호)
     * @returns 생성된 유저 도큐먼트
     * @throws GrpcAlreadyExistsException 이메일이 이미 존재하는 경우
     */
    async createUser(dto: AuthMicroService.CreateUserRequest): Promise<UserDocument> {
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

    /**
     * 이메일로 유저 조회
     * @param email 유저 이메일
     * @returns 조회된 유저 도큐먼트
     */
    findUserByEmail(email: string): Promise<UserDocument> {
        const user = this.userModel.findOne({ email });
        return user;
    }

    /**
     * 로그인
     * @param dto 로그인에 필요한 정보 (이메일, 비밀번호)
     * @returns 액세스 토큰, 리프레시 토큰
     * @throws GrpcNotFoundException 존재하지 않는 이메일인 경우
     * @throws GrpcNotFoundException 비밀번호가 일치하지 않는 경우
     */
    async signinUser(dto: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.findUserByEmail(dto.email);
        if (!user) {
            throw new GrpcNotFoundException('존재하지 않는 이메일입니다.');
        }

        const isPasswordValid = await compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new GrpcNotFoundException('비밀번호가 일치하지 않습니다.');
        }

        return {
            accessToken: await this.issueTokenByUser(user, false),
            refreshToken: await this.issueTokenByUser(user, true),
        };
    }

    /**
     * 유저 정보를 기반으로 토큰을 발행합니다.
     * @param user 유저 정보
     * @param isRefresh 리프레시 토큰 여부
     * @returns 발행된 토큰
     */
    async issueTokenByUser(user: UserDocument, isRefresh: boolean): Promise<string> {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            type: isRefresh ? 'refresh' : 'access',
            tokenVersion: user.tokenVersion,
        };

        return this.jwtService.signAsync(payload, {
            secret: isRefresh ? this.REFRESH_SECRET : this.ACCESS_SECRET,
            expiresIn: isRefresh ? this.REFRESH_EXPIRE_IN : this.ACCESS_EXPIRE_IN,
        });
    }

    /**
     * 유저 목록 조회
     * @param dto 유저 목록 조회에 필요한 정보 (검색 조건)
     * @returns 조회된 유저 목록
     */
    async findUsers(dto: AuthMicroService.FindUsersRequest): Promise<UserDocument[]> {
        const users = await this.userModel.find(dto).sort({ role: 1 });
        return users;
    }

    /**
     * 토큰 검증
     * @param dto 토큰 검증에 필요한 정보 (토큰, 리프레시 토큰 여부)
     * @returns 검증된 토큰 정보
     * @throws GrpcUnauthenticatedException 토큰이 유효하지 않은 경우
     * @throws GrpcUnauthenticatedException 존재하지 않는 유저인 경우
     * @throws GrpcUnauthenticatedException 토큰버전이 만료된 경우
     */
    async verifyToken(dto: { jwtToken: string; isRefresh: boolean }): Promise<AuthMicroService.VerifyTokenResponse> {
        const { jwtToken, isRefresh } = dto;
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(jwtToken, {
                secret: isRefresh ? this.REFRESH_SECRET : this.ACCESS_SECRET,
                ignoreExpiration: false,
            });
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new GrpcUnauthenticatedException('토큰이 유효하지 않습니다.');
            }
        }

        if (!isRefresh) {
            const user = await this.userModel.findOne({ _id: payload.sub });
            if (!user) throw new GrpcUnauthenticatedException('존재하지 않는 유저입니다.');

            if (user.tokenVersion !== payload.tokenVersion) {
                throw new GrpcUnauthenticatedException('토큰버전이 만료되었습니다.');
            }
        }
        return {
            verify: true,
            payload: payload,
        };
    }

    /**
     * 유저 정보 수정
     * @param request 유저 권한 수정에 필요한 정보 (이메일, 권한)
     * @returns 수정된 유저 정보
     * @throws GrpcNotFoundException 존재하지 않는 이메일인 경우
     */
    async updateUser(request: AuthMicroService.UpdateUserRequest) {
        const { email, role } = request;

        const user = await this.findUserByEmail(email);
        if (!user) throw new GrpcNotFoundException('존재하지 않는 이메일입니다.');

        user.role = role;
        user.tokenVersion += 1;
        await user.save();

        return user;
    }

    async refreshToken(request: AuthMicroService.RefreshTokenRequest) {
        const { userId } = request;

        const user = await this.userModel.findOne({ _id: userId });
        if (!user) throw new GrpcNotFoundException('존재하지 않는 유저입니다.');

        return {
            accessToken: await this.issueTokenByUser(user, false),
            refreshToken: await this.issueTokenByUser(user, true),
        };
    }
}
