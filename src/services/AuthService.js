import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

class AuthService {
  constructor(container) {
    this.logger = container.get('logger');
    this.prisma = container.get('prisma');
    this.logger.info('Auth Service Initialized');
  }

  async signUp(data) {
    this.logger.info('Checking if user already exists');
    const checkUser = await this.getUser(data.username);
    if (checkUser) throw new Error('User already exists');

    this.logger.info('Hashing Password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    this.logger.info('Creating DB record');
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new Error('User cannot be created');
    }

    delete user.password;

    this.logger.info('User created successfully');

    return { user };
  }

  async login({ username, password }) {
    this.logger.info('Checking if user exists');
    const user = await this.getUser(username);
    if (!user) throw new Error('User does not exists');

    this.logger.info('Checking Password');
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      this.logger.info('Password is valid!');
      this.logger.info('Generating JWT');
      const token = this.generateToken(user);
      delete user.password;

      return { user, token };
    }

    throw new Error('Invalid Credentials');
  }

  generateToken({ password, ...otherData }) {
    this.logger.info(`Signing JWT for user: ${otherData.username}`);
    return jwt.sign(
      {
        ...otherData,
      },
      config.jwtSecret,
      {
        expiresIn: '7d',
      }
    );
  }

  async verify(token) {
    return jwt.verify(token, config.jwtSecret);
  }

  async getUser(username) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  }
}

export default AuthService;
