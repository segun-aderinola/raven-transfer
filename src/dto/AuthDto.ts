export class RegisterDto {
    public email: string;
    public password: string;
    public first_name: string;
    public last_name: string;
    public phone?: string;
    public bvn: string;
    public nin: string;
  
    constructor(data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
      bvn: string;
      nin: string;
    }) {
      this.email = data.email;
      this.password = data.password;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.phone = data.phone;
      this.nin = data.nin;
      this.bvn = data.bvn;
    }
  }
  
  export class LoginDto {
    public email: string;
    public password: string;
  
    constructor(data: { email: string; password: string }) {
      this.email = data.email;
      this.password = data.password;
    }
  }