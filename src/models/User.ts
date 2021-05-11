import Crypto from 'crypto-js';
import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';
import {Exclude} from "class-transformer";
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';


interface IUser {
  id?: number
  email: string
  password: string
  name?: string
  accessToken?: string
  refreshToken?: string
}

@Entity({name: 'users'})
export default class User implements IUser {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @Index({unique: true})
  email: string
  @Exclude()
  @Column()
  password: string
  @Column()
  @IsNotEmpty()
  @IsString()
  name?: string
  accessToken?: string
  refreshToken?: string
  @Exclude()
  encrypted = false;


  constructor(props: IUser) {
    this.id = props?.id;
    this.email = props?.email;
    this.password = props?.password;
    this.name = props?.name;
  }

  getPasswordHash(password: string) {
    return Crypto.SHA512(password).toString();
  }

  getPasswordEncrypted(encrypt: boolean) {
    const passwordHash = this.getPasswordHash(this.password);
    let passwordEncrypted = Crypto.AES.encrypt(passwordHash, process.env.ENCRYPTION_KEY).toString()
    if (encrypt) {
      this.password = passwordEncrypted;
    }
    return passwordEncrypted;
  }

  getDecryptedPassword() {
    console.log(this);
    let userPasswordBuffer = Crypto.AES.decrypt(this.password, process.env.ENCRYPTION_KEY)
    console.log(this.password, userPasswordBuffer.toString(Crypto.enc.Utf8))
    return userPasswordBuffer.toString(Crypto.enc.Utf8);
  }

  authenticate(password: string) {
    let passwordDecrypted = this.getDecryptedPassword();
    let passwordHash = this.getPasswordHash(password);
    return passwordDecrypted === passwordHash

  }
}
