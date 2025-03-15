import { Role } from "./role";

export class Usuario {
  constructor(
    public dni: String,
    public name: string,
    public lastname: string,
    public birthdate: Date,
    public province: string,
    public city: string,
    public street: string,
    public streetNumber: string,
    public floor: string,
    public flat: string,
    public email: string,
    public password: string,
    public role: Role
  ) {}

}
