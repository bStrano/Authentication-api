import Crypto from 'crypto-js';
import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';
import {Exclude} from "class-transformer";
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

@Entity({name: 'users'})
export default  class User {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  @IsNotEmpty()
  @IsEmail()
  @Index({ unique: true })
  email: string
  @Exclude()
  @Column()
  password: string
  @Column()
  @IsNotEmpty()
  @IsString()
  name?: string
  accessToken?: string
  @Exclude()
  encrypted: boolean;


  constructor(email: string, password: string, name: string, id?: number) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.encrypted = false;
  }

  getPasswordHash(password: string){
    return Crypto.SHA512(password).toString();
  }

  getPasswordEncrypted(encrypt: boolean){
    const passwordHash = this.getPasswordHash(this.password);
    let passwordEncrypted = Crypto.AES.encrypt(passwordHash, process.env.ENCRYPTION_KEY).toString()
    if(encrypt){
      this.password = passwordEncrypted;
    }
    return passwordEncrypted;
  }

  getDecryptedPassword(){
    console.log(this);
    let userPasswordBuffer = Crypto.AES.decrypt(this.password, process.env.ENCRYPTION_KEY)
    console.log(this.password,userPasswordBuffer.toString(Crypto.enc.Utf8))
    return userPasswordBuffer.toString(Crypto.enc.Utf8);
  }

  authenticate(password: string){
    let passwordDecrypted = this.getDecryptedPassword();
    let passwordHash = this.getPasswordHash(password);
    return passwordDecrypted === passwordHash

  }
}
